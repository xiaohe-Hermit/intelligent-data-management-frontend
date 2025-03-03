// src/pages/Role.js
import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import RoleForm from "../components/Form/RoleForm/RoleForm";
import DataTable from "../components/DataTable/DataTable";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";
import useDataManage from "../hooks/useDataManage";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
  }, []);
  useEffect(() => {}, [form]);

  const fetchRoles = () => {
    getRoles()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setRoles([]);
          message.error("获取角色数据格式不正确");
        }
      })
      .catch((error) => {
        console.error("获取角色失败:", error);
        message.error("获取角色失败，请重试");
      });
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteRole,
    fetchFunction: fetchRoles,
    successMessage: "删除角色成功！",
    errorMessage: "删除角色失败，请重试",
    idField: "role_id",
  });

  const {
    isModalOpen,
    isAddingData: isAddingRole,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createRole,
    updateFunction: updateRole,
    fetchFunction: fetchRoles,
    hasCheckFunction: false,
    dataName: "角色",
    dataIdKey: "role_id",
  });

  const columns = [
    {
      title: "RoleName",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        dataText="角色"
        dataSource={roles}
        columns={columns}
        row_key="role_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingRole ? "添加角色" : "更新角色"}
        open={isModalOpen}
        onCancel={handleCancel}
        form={form}
        submitButtonText={isAddingRole ? "添加角色" : "更新角色"}
        cancelButtonText="取消"
      >
        <RoleForm
          form={form}
          isAddingRole={isAddingRole}
          onFinish={handleFinish}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除角色"
        description={`确定要删除该角色吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default Roles;
