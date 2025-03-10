import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getSoftwareCopyrights,
  createSoftwareCopyright,
  updateSoftwareCopyright,
  deleteSoftwareCopyright,
} from "../../../services/softwareCopyrightApi";
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
import SoftwareCopyrightForm from "../../../components/Form/SoftwareCopyrightForm/SoftwareCopyrightForm";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../../../hooks/useDeleteHandler";
import useDataManage from "../../../hooks/useDataManage";
const SoftwareCopyrightsPage = () => {
  const [softwareCopyrights, setSoftwareCopyrights] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [allProjectIdAndProjectName, setAllProjectIdAndProjectName] = useState(
    []
  );
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSoftwareCopyrights();
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

  // 修改后的 fetchSoftwareCopyrights 函数
  const fetchSoftwareCopyrights = async () => {
    try {
      const response = await getSoftwareCopyrights();
      if (Array.isArray(response)) {
        const updatedSoftwareCopyrights = await Promise.all(
          response.map(async (softwareCopyright) => {
            if (softwareCopyright.user_id) {
              const userName = await getUserNameByUserId(softwareCopyright.user_id);
              const projectName = await getProjectNameByProjectId(
                softwareCopyright.project_id
              );
              return {
                ...softwareCopyright,
                user_name: userName,
                project_name: projectName,
              };
            } else {
              return {
                ...softwareCopyright,
                user_name: "无",
                project_name: "无",
              };
            }
          })
        );
        setSoftwareCopyrights(updatedSoftwareCopyrights);
      } else {
        setSoftwareCopyrights([]);
        message.error("获取软著数据格式不正确");
      }
    } catch (error) {
      console.error("获取软著失败:", error);
      message.error("获取软著失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteSoftwareCopyright,
    fetchFunction: fetchSoftwareCopyrights,
    successMessage: "删除软著成功！",
    errorMessage: "删除软著失败，请重试",
    idField: "copyright_id",
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
      registration_date: dayjs(record.registration_date),
    };    
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingSoftwareCopyright,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createSoftwareCopyright,
    updateFunction: updateSoftwareCopyright,
    fetchFunction: fetchSoftwareCopyrights,
    dataName: "软著",
    dataIdKey: "copyright_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
    {
      title: "软著名称",
      dataIndex: "software_name",
      key: "software_name",
    },

    {
      title: "版权号",
      dataIndex: "copyright_number",
      key: "copyright_number",
    },
    {
      title: "注册时间",
      dataIndex: "registration_date",
      key: "registration_date",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "拥有者",
      dataIndex: "user_name",
      key: "user_name",
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
        dataText="软著"
        dataSource={softwareCopyrights}
        columns={columns}
        row_key="copyright_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingSoftwareCopyright ? "添加软著" : "更新软著"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingSoftwareCopyright ? "添加软著" : "更新软著"}
      >
        <SoftwareCopyrightForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
          allProjectIdAndProjectName={allProjectIdAndProjectName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除软著"
        description={`确定要删除该软著吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default SoftwareCopyrightsPage;
