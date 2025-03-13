import React, { useEffect, useState } from "react";
import { Form, Button, message, Upload, Input } from "antd";
import {
  getPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "../../../services/photoApi";
import {
  getUserNameByUserId,
  getAllUserIdAndUserName,
} from "../../../services/userApi";
import {
  getAllProjectIdAndProjectName,
  getProjectNameByProjectId,
} from "../../../services/projectApi";
import CustomModal from "../../../components/Modal/CustomModal/CustomModal";
import DataTable from "../../../components/DataTable/DataTable";
import PhotoForm from "../../../components/Form/PhotoForm/PhotoForm";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../../../hooks/useDeleteHandler";
import useDataManage from "../../../hooks/useDataManage";
import { InboxOutlined } from "@ant-design/icons";
import { uploadImg, getImg } from "../../../services/imgUploadApi";

const { Dragger } = Upload;

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [allProjectIdAndProjectName, setAllProjectIdAndProjectName] = useState(
    []
  );
  const [form] = Form.useForm();
  // 状态管理
  const [imageUrl, setImageUrl] = useState("");
  const [imageInfo, setImageInfo] = useState(null);

  useEffect(() => {
    fetchPhotos();
    fetchAllUserIdAndUserName();
    fetchAllProjectIdAndProjectName();
  }, []);
  useEffect(() => {}, [form]);

  // 获取所有用户id和用户名
  const fetchAllUserIdAndUserName = async () => {
    try {
      const allUserIdAndUserName = await getAllUserIdAndUserName();
      if (Array.isArray(allUserIdAndUserName)) {
        setAllUserIdAndUserName(allUserIdAndUserName);
      } else {
        setAllUserIdAndUserName([]);
        message.error("获取用户数据格式不正确");
      }
    } catch (error) {
      console.error("获取用户失败:", error);
    }
  };

  // 获取所有项目id和项目名
  const fetchAllProjectIdAndProjectName = async () => {
    try {
      const allProjectIdAndProjectName = await getAllProjectIdAndProjectName();
      if (Array.isArray(allProjectIdAndProjectName)) {
        setAllProjectIdAndProjectName(allProjectIdAndProjectName);
      } else {
        setAllProjectIdAndProjectName([]);
        message.error("获取项目数据格式不正确");
      }
    } catch (error) {
      console.error("获取项目失败:", error);
      message.error("获取项目失败，请重试");
    }
  };
  // 修改后的 fetchPhotos 函数
  const fetchPhotos = async () => {
    try {
      const response = await getPhotos();
      if (Array.isArray(response)) {
        const updatedPhotos = await Promise.all(
          response.map(async (photo) => {
            if (photo.user_id) {
              const userName = await getUserNameByUserId(photo.user_id);
              const projectName = await getProjectNameByProjectId(
                photo.project_id
              );
              return {
                ...photo,
                user_name: userName,
                project_name: projectName,
              };
            } else {
              return {
                ...photo,
                user_name: "无",
                project_name: "无",
              };
            }
          })
        );
        setPhotos(updatedPhotos);
      } else {
        setPhotos([]);
        message.error("获取照片数据格式不正确");
      }
    } catch (error) {
      console.error("获取照片失败:", error);
      message.error("获取照片失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deletePhoto,
    fetchFunction: fetchPhotos,
    successMessage: "删除照片成功！",
    errorMessage: "删除照片失败，请重试",
    idField: "photo_id",
  });

  const dataFormatFunction = async (data) => {
    let userId = data.user_id || null;
    let projectId = data.project_id || null;
    if (!data.user_id) {
      for (const user of allUserIdAndUserName) {
        if (data.user_name === user.userName) {
          userId = user.userId;
          break;
        }
      }
    }
    if (!data.project_id) {
      for (const project of allProjectIdAndProjectName) {
        if (data.project_name === project.projectName) {
          projectId = project.projectId;
          break;
        }
      }
    }
    const formattedData = {
      ...data,
      user_id: userId,
      project_id: projectId,
    };
    const { ...finalData } = formattedData;
    return finalData;
  };

  const {
    isModalOpen,
    isAddingData: isAddingPhoto,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createPhoto,
    updateFunction: updatePhoto,
    fetchFunction: fetchPhotos,
    dataName: "照片",
    dataIdKey: "photo_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
  });

  const columns = [
    {
      title: "照片名称",
      dataIndex: "photo_name",
      key: "photo_name",
    },

    {
      title: "照片路径",
      dataIndex: "photo_url",
      key: "photo_url",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "获得者",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "项目名称",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  // 文件上传成功的回调函数
  const handleUploadSuccess = (info) => {
    message.success(`${info.file.name} 文件上传成功`);
  };

  // 文件上传失败的回调函数
  const handleUploadError = (info) => {
    message.error(`${info.file.name} 文件上传失败`);
  };

  // 自定义上传请求
  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadImg(formData);
      onSuccess("OK");
    } catch (error) {
      onError(error);
    }
  };

  // 上传属性配置
  const props = {
    name: "file",
    multiple: true,
    customRequest: customRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        handleUploadSuccess(info);
      } else if (status === "error") {
        handleUploadError(info);
      }
    },
  };

  // 处理表单提交
  const handleFormSubmit = async (values) => {
    const { imageUrl } = values;
    try {
      const response = await getImg(imageUrl);
      setImageInfo(response);
      setImageUrl(response.imageUrl);
    } catch (error) {
      message.error("获取图片信息失败");
    }
  };

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">支持单个或批量上传</p>
      </Dragger>

      <div style={{ marginTop: 24 }}>
        <Form onFinish={handleFormSubmit}>
          <Form.Item
            name="imageUrl"
            label="图片URL"
            rules={[{ required: true, message: "请输入图片URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              获取图片信息
            </Button>
          </Form.Item>
        </Form>
      </div>

      {imageInfo && (
        <div style={{ marginTop: 24 }}>
          <h3>图片信息</h3>
          <pre>{JSON.stringify(imageInfo, null, 2)}</pre>
          <pre>{imageUrl}</pre>
          <img
            alt="Uploaded"
            src="https://intellect-data-management.tos-cn-guangzhou.volces.com/avatar/default_avatar.jpeg"
          ></img>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", marginTop: 16 }}
          />
        </div>
      )}
      <DataTable
        dataText="照片"
        dataSource={photos}
        columns={columns}
        row_key="photo_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingPhoto ? "添加照片" : "更新照片"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingPhoto ? "添加照片" : "更新照片"}
      >
        <PhotoForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
          allProjectIdAndProjectName={allProjectIdAndProjectName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除照片"
        description={`确定要删除该照片吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default PhotosPage;
