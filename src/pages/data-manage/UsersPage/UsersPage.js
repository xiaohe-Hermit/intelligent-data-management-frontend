// src/pages/Users.js
import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/userApi";
import { checkUsernameAndPhoneAvailability } from "../../../services/registerApi";
import CustomModal from "../../../components/Modal/CustomModal/CustomModal";
import UserForm from "../../../components/Form/UserForm/UserForm";
import DataTable from "../../../components/DataTable/DataTable";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../../../hooks/useDeleteHandler";
import useDataManage from "../../../hooks/useDataManage";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {}, [form]);

  const fetchUsers = () => {
    getUsers().then((response) => {
      setUsers(response.data);
    });
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteUser,
    fetchFunction: fetchUsers,
    successMessage: "删除用户",
    errorMessage: "删除用户失败，请重试",
    idField: "user_id",
  });

  const checkUsernameAndPhone = async (values) => {
    // 检查用户名和手机号的可用性
    if (!values.name || !values.phone) {
      message.error("检查不到用户名和手机号");
      return false;
    }
    const { available, message: msg } = await checkUsernameAndPhoneAvailability(
      values.name,
      values.phone
    );
    if (!available) {
      message.error(msg);
      return false;
    }
    return true;
  };

  const {
    isModalOpen,
    isAddingData: isAddingUser,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createUser,
    updateFunction: updateUser,
    fetchFunction: fetchUsers,
    hasCheckFunction: true,
    dataCheckFunction: checkUsernameAndPhone,
    dataName: "用户",
    dataIdKey: "user_id",
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
        dataText="用户"
        dataSource={users}
        columns={columns}
        row_key="user_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingUser ? "添加用户" : "更新用户"}
        open={isModalOpen}
        onCancel={handleCancel}
        form={form}
        submitButtonText={isAddingUser ? "添加用户" : "更新用户"}
      >
        <UserForm
          form={form}
          isAddingUser={isAddingUser}
          onFinish={handleFinish}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除用户"
        description={`确定要删除该用户吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default UsersPage;
