// src/components/UserForm/UserForm.jsx
import React from "react";
import { Form, Input, Select } from "antd";

const UserForm = ({ form, isAddingUser ,onFinish}) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="用户名"
        rules={[
          { required: true, message: "请输入用户名" },
          { max: 15, message: "用户名不能超过15个字符" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="年龄"
        rules={[
          { required: true, message: "请输入年龄" },
          { pattern: /^[1-9]\d*$/, message: "年龄必须是正整数" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: isAddingUser, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: "请选择性别" }]}
      >
        <Select placeholder="请选择性别">
          <Select.Option value="男">男</Select.Option>
          <Select.Option value="女">女</Select.Option>
          <Select.Option value="无">无</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: "请输入手机号" },
          { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default UserForm;