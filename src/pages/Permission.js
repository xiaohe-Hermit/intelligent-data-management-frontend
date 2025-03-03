// src/pages/Permission.js
import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../services/permissionApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import DataTable from "../components/DataTable/DataTable";
import PermissionForm from "../components/Form/PermissionForm/PermissionForm";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";
import useDataManage from "../hooks/useDataManage";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPermissions();
  }, []);
  useEffect(() => {}, [form]);

  const fetchPermissions = () => {
    getPermissions()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPermissions(response.data);
        } else {
          setPermissions([]);
          message.error("获取权限数据格式不正确");
        }
      })
      .catch((error) => {
        console.error("获取权限失败:", error);
        message.error("获取权限失败，请重试");
      });
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deletePermission,
    fetchFunction: fetchPermissions,
    successMessage: "删除权限成功！",
    errorMessage: "删除权限失败，请重试",
    idField: "permission_id",
  });

  const {
    isModalOpen,
    isAddingData: isAddingPermission,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createPermission,
    updateFunction: updatePermission,
    fetchFunction: fetchPermissions,
    hasCheckFunction: false,
    dataName: "权限",
    dataIdKey: "permission_id",
  });

  // const handleCreate = async (values) => {
  //   try {
  //     await createPermission(values);
  //     message.success("权限创建成功！");
  //     fetchPermissions();
  //     form.resetFields();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     message.error(error.message || "权限创建失败，请重试");
  //   }
  // };

  // const handleUpdate = async (values) => {
  //   try {
  //     await updatePermission(editingPermissionId, values);
  //     message.success("权限更新成功！");
  //     fetchPermissions();
  //     form.resetFields();
  //     setEditingPermissionId(null);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     message.error(error.message || "权限更新失败，请重试");
  //   }
  // };

  // // 关闭模态框
  // const handleCancel = () => {
  //   form.resetFields();
  //   setEditingPermissionId(null);
  //   setIsModalOpen(false);
  //   setIsAddingPermission(false);
  // };

  // const handleEdit = (record) => {
  //   form.setFieldsValue(record);
  //   setEditingPermissionId(record.permission_id);
  //   setIsModalOpen(true);
  //   setIsAddingPermission(false);
  // };

  // const handleAdd = () => {
  //   form.resetFields();
  //   setEditingPermissionId(null);
  //   setIsModalOpen(true);
  //   setIsAddingPermission(true);
  // };

  // const handleFinish = async (values) => {
  //   // 如果是添加权限，则调用 handleCreate
  //   // 如果是编辑权限，则调用 handleUpdate
  //   if (editingPermissionId) {
  //     handleUpdate(values);
  //   } else {
  //     handleCreate(values);
  //   }
  // };

  const columns = [
    {
      title: "Permission Name",
      dataIndex: "permission_name",
      key: "permission_name",
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
        dataText="权限"
        dataSource={permissions}
        columns={columns}
        row_key="permission_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingPermission ? "添加权限" : "更新权限"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingPermission ? "添加权限" : "更新权限"}
        cancelButtonText="取消"
      >
        <PermissionForm form={form} onFinish={handleFinish} />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除权限"
        description={`确定要删除该权限吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default Permissions;
