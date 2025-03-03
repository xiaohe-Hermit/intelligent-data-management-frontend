// src/components/MemberForm/MemberForm.jsx
import React from "react";
import { Form, Select, DatePicker } from "antd";

const MemberForm = ({
    form,
    onFinish,
    handleUserIdChange,
    allUserIdAndUserName,
    handleNameChange,
    allRoleName,
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="user_id"
                label="用户ID"
                rules={[{ required: true, message: "请选择用户ID" }]}
            >
                <Select onChange={handleUserIdChange}>
                    {allUserIdAndUserName.map((user) => (
                        <Select.Option key={user.userId} value={user.userId}>
                            {user.userId}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="user_name"
                label="姓名"
                rules={[{ required: true, message: "请选择用户姓名" }]}
            >
                <Select onChange={handleNameChange}>
                    {allUserIdAndUserName.map((user) => (
                        <Select.Option key={user.userId} value={user.userName}>
                            {user.userName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: "请选择角色" }]}
            >
                <Select>
                    {allRoleName.map((role) => (
                        <Select.Option key={role.roleId} value={role.roleName}>
                            {role.roleName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="join_date"
                label="加入时间"
                rules={[{ required: true, message: "请选择加入时间" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="leave_date"
                label="离开时间"
                rules={[{ required: true, message: "请选择离开时间" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: "请选择成员状态" }]}
            >
                <Select>
                    <Select.Option value="active">active</Select.Option>
                    <Select.Option value="inactive">inactive</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default MemberForm;