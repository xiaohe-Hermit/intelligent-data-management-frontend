import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../services/projectApi";
import {
  getUserNameByUserId,
  getAllUserIdAndUserName,
} from "../../../services/userApi";
import CustomModal from "../../../components/Modal/CustomModal/CustomModal";
import DataTable from "../../../components/DataTable/DataTable";
import ProjectForm from "../../../components/Form/ProjectForm/ProjectForm";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../../../hooks/useDeleteHandler";
import useDataManage from "../../../hooks/useDataManage";
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
    fetchAllUserIdAndUserName();
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

  // 修改后的 fetchProjects 函数
  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      if (Array.isArray(response.data)) {
        const updatedProjects = await Promise.all(
          response.data.map(async (project) => {
            if (project.manager_id) {
              const userName = await getUserNameByUserId(project.manager_id);
              return {
                ...project,
                manager_name: userName,
              };
            } else {
              return {
                ...project,
                manager_name: "无",
              };
            }
          })
        );
        setProjects(updatedProjects);
      } else {
        setProjects([]);
        message.error("获取项目数据格式不正确");
      }
    } catch (error) {
      console.error("获取项目失败:", error);
      message.error("获取项目失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteProject,
    fetchFunction: fetchProjects,
    successMessage: "删除项目成功！",
    errorMessage: "删除项目失败，请重试",
    idField: "project_id",
  });

  const dataFormatFunction = async (data) => {
    let userId = null;
    for (const user of allUserIdAndUserName) {
      if (data.manager_name === user.userName) {
        userId = user.userId;
      }
    }
    const formattedData = {
      ...data,
      manager_id: userId,
    };
    const { manager_name, ...finalData } = formattedData;
    return finalData;
  };
  const dateTypeFormatFunction = (record) => {
    const formattedRecord = {
      ...record,
      start_date: dayjs(record.start_date),
      end_date: dayjs(record.end_date),
    };
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingProject,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createProject,
    updateFunction: updateProject,
    fetchFunction: fetchProjects,
    dataName: "项目",
    dataIdKey: "project_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
    {
      title: "项目名称",
      dataIndex: "project_name",
      key: "project_name",
    },

    {
      title: "开始时间",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "结束时间",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "项目描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "项目负责人",
      dataIndex: "manager_name",
      key: "manager_name",
    },
    {
      title: "项目状态",
      dataIndex: "status",
      key: "status",
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
        dataText="项目"
        dataSource={projects}
        columns={columns}
        row_key="project_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingProject ? "添加项目" : "更新项目"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingProject ? "添加项目" : "更新项目"}
      >
        <ProjectForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除项目"
        description={`确定要删除该项目吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectsPage;
