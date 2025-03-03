// src/components/UserForm/UserForm.jsx
import React from "react";
import { Form, Input } from "antd";

const PermissionForm = ({ form, onFinish }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="permission_name"
                label="权限名"
                rules={[
                    { required: true, message: "请输入权限名" },
                    { max: 15, message: "权限名不能超过15个字符" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="描述"
                rules={[
                    { required: true, message: "请输入描述" },
                    { max: 20, message: "描述不能超过20个字符" },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
};

export default PermissionForm;