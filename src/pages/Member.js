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
import useDataManage from "../hooks/useDataManage";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [allRoleName, setAllRoleName] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMembers();
    fetchAllUserIdAndUserName();
    fetchAllRoleName();
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

  const dateTypeFormatFunction = (record) => {
    const formattedRecord = {
      ...record,
      join_date: dayjs(record.join_date),
      leave_date: dayjs(record.leave_date),
    };
    return formattedRecord;
  };

  const checkUserAndUserIdMatch = async (values) => {
    for (const user of allUserIdAndUserName) {
      if (user.userId === values.user_id && user.userName === values.user_name) {
        return true;
      }
    }
    return false;
  };

  const {
    isModalOpen,
    isAddingData: isAddingMember,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createMember,
    updateFunction: updateMember,
    fetchFunction: fetchMembers,
    dataName: "成员",
    dataIdKey: "member_id",
    hasCheckFunction: true,
    dataCheckFunction: checkUserAndUserIdMatch,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  // 处理用户ID变化
  const handleUserIdChange = (userId) => {
    const user = allUserIdAndUserName.find((u) => u.userId === userId);
    if (user) {
      form.setFieldsValue({ user_name: user.userName });
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
