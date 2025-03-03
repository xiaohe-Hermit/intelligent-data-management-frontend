// src/pages/Member.js
import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getUserNameByUserId,
  getAllUserIdAndUserName,
  getAllRoleName,
} from "../services/memberApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import DataTable from "../components/DataTable/DataTable";
import MemberForm from "../components/Form/MemberForm/MemberForm";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [allRoleName, setAllRoleName] = useState([]);
  const [form] = Form.useForm();
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchAllUserIdAndUserName();
    fetchAllRoleName();
  }, []);

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

  // 获取所有角色名
  const fetchAllRoleName = async () => {
    try {
      const allRoleName = await getAllRoleName();
      if (Array.isArray(allRoleName)) {
        setAllRoleName(allRoleName);
      } else {
        setAllRoleName([]);
        message.error("获取角色数据格式不正确");
      }
    } catch (error) {
      console.error("获取角色失败:", error);
    }
  };

  // 修改后的 fetchMembers 函数
  const fetchMembers = async () => {
    try {
      const response = await getMembers();
      if (Array.isArray(response.data)) {
        const updatedMembers = await Promise.all(
          response.data.map(async (member) => {
            const userName = await getUserNameByUserId(member.user_id);
            return {
              ...member,
              user_name: userName,
            };
          })
        );
        setMembers(updatedMembers);
      } else {
        setMembers([]);
        message.error("获取成员数据格式不正确");
      }
    } catch (error) {
      console.error("获取成员失败:", error);
      message.error("获取成员失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteMember,
    fetchFunction: fetchMembers,
    successMessage: "删除成员成功！",
    errorMessage: "删除成员失败，请重试",
    idField: "member_id",
  });

  const handleCreate = async (values) => {
    try {
      await createMember(values);
      message.success("成员创建成功！");
      fetchMembers();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || "成员创建失败，请重试");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateMember(editingMemberId, values);
      message.success("成员更新成功！");
      fetchMembers();
      form.resetFields();
      setEditingMemberId(null);
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || "成员更新失败，请重试");
    }
  };

  // 关闭模态框
  const handleCancel = () => {
    form.resetFields();
    setEditingMemberId(null);
    setIsModalOpen(false);
    setIsAddingMember(false);
  };

  const handleEdit = (record) => {
    // 将 join_date 和 leave_date 转换为 dayjs 对象
    const formattedRecord = {
      ...record,
      join_date: dayjs(record.join_date),
      leave_date: dayjs(record.leave_date),
    };
    form.setFieldsValue(formattedRecord);
    setEditingMemberId(record.member_id);
    setIsModalOpen(true);
    setIsAddingMember(false);
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingMemberId(null);
    setIsModalOpen(true);
    setIsAddingMember(true);
  };

  const handleFinish = async (values) => {
    // 如果是添加成员，则调用 handleCreate
    // 如果是编辑成员，则调用 handleUpdate
    if (editingMemberId) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  // 处理用户ID变化
  const handleUserIdChange = (userId) => {
    const user = allUserIdAndUserName.find((u) => u.userId === userId);
    if (user) {
      form.setFieldsValue({ name: user.userName });
    }
  };

  // 处理用户姓名变化
  const handleNameChange = (name) => {
    const user = allUserIdAndUserName.find((u) => u.userName === name);
    if (user) {
      form.setFieldsValue({ user_id: user.userId });
    }
  };

  const columns = [
    {
      title: "UserId",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "UserName",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "JoinDate",
      dataIndex: "join_date",
      key: "join_date",
    },
    {
      title: "LeaveDate",
      dataIndex: "leave_date",
      key: "leave_date",
    },
    {
      title: "Status",
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
        dataText="成员"
        dataSource={members}
        columns={columns}
        row_key="member_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingMember ? "添加成员" : "更新成员"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingMember ? "添加成员" : "更新成员"}
      >
        <MemberForm
          form={form}
          onFinish={handleFinish}
          handleNameChange={handleNameChange}
          allRoleName={allRoleName}
          allUserIdAndUserName={allUserIdAndUserName}
          handleUserIdChange={handleUserIdChange}
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

export default Members;
