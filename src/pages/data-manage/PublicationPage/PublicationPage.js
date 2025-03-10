import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from "../../../services/publicationApi";
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
import PublicationForm from "../../../components/Form/PublicationForm/PublicationForm";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../../../hooks/useDeleteHandler";
import useDataManage from "../../../hooks/useDataManage";
const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [allProjectIdAndProjectName, setAllProjectIdAndProjectName] = useState(
    []
  );

  const [form] = Form.useForm();

  useEffect(() => {
    fetchPublications();
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

  // 修改后的 fetchPublications 函数
  const fetchPublications = async () => {
    try {
      const response = await getPublications();
      if (Array.isArray(response)) {
        const updatedPublications = await Promise.all(
          response.map(async (publication) => {
            if (publication.user_id) {
              const userName = await getUserNameByUserId(publication.user_id);
              const projectName = await getProjectNameByProjectId(
                publication.project_id
              );
              return {
                ...publication,
                user_name: userName,
                project_name: projectName,
              };
            } else {
              return {
                ...publication,
                user_name: "无",
                project_name: "无",
              };
            }
          })
        );
        setPublications(updatedPublications);
      } else {
        setPublications([]);
        message.error("获取出版物数据格式不正确");
      }
    } catch (error) {
      console.error("获取出版物失败:", error);
      message.error("获取出版物失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deletePublication,
    fetchFunction: fetchPublications,
    successMessage: "删除出版物成功！",
    errorMessage: "删除出版物失败，请重试",
    idField: "publication_id",
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
    const {...finalData } = formattedData;
    return finalData;
  };
  const dateTypeFormatFunction = (record) => {
    const formattedRecord = {
      ...record,
      publish_date: dayjs(record.publish_date),
    };
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingPublication,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createPublication,
    updateFunction: updatePublication,
    fetchFunction: fetchPublications,
    dataName: "出版物",
    dataIdKey: "publication_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
    {
      title: "出版物标题",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "作者",
      dataIndex: "authors",
      key: "authors",
    },
    {
      title: "出版日期",
      dataIndex: "publish_date",
      key: "publish_date",
    },
    {
      title: "出版社",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "用户ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "项目名称",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Action",
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

  return (
    <div>
      <DataTable
        dataText="出版物"
        dataSource={publications}
        columns={columns}
        row_key="publication_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingPublication ? "添加出版物" : "更新出版物"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingPublication ? "添加出版物" : "更新出版物"}
      >
        <PublicationForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
          allProjectIdAndProjectName={allProjectIdAndProjectName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除出版物"
        description={`确定要删除该出版物吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default PublicationsPage;
