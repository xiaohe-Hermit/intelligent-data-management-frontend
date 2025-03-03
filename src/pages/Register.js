// src/pages/Register.js
import React, { useState , useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link 组件
import {
  register,
  checkUsernameAndPhoneAvailability,
} from "../services/registerApi"; // 假设有一个注册 API 和唯一性检查 API

/**
 * 注册组件
 * 该组件用于用户注册，包含一个表单，用户可以在表单中输入用户名、手机号、密码和确认密码进行注册
 * 使用了React的useState和useNavigate Hook来进行状态管理和导航
 */
const Register = () => {
  // 定义loading状态，用于表示是否正在加载
  const [loading, setLoading] = useState(false);
  // 使用useNavigate Hook获取导航函数
  const navigate = useNavigate();
  // 使用useRef获取Form实例
  const formRef = useRef();

  /**
   * 注册表单提交时的处理函数
   * @param {Object} values 表单提交的值，包含用户名、手机号、密码和确认密码
   * 该函数会在表单提交时被调用，负责将表单数据提交给后端进行注册
   */
  const onFinish = async (values) => {
    // 提交表单时设置loading状态为true
    setLoading(true);
    try {
      // 检查用户名和手机号是否可用
      const availabilityResponse = await checkUsernameAndPhoneAvailability(
        values.username,
        values.phone
      );
      if (!availabilityResponse.available) {
        // 根据不同的错误信息设置不同的错误提示
        const errors = [];
        if (availabilityResponse.message === "用户名已存在") {
          errors.push({
            name: "username",
            errors: ["用户名已存在"],
          });
        }
        if (availabilityResponse.message === "手机号已存在") {
          errors.push({
            name: "phone",
            errors: ["手机号已存在"],
          });
        }
        if (availabilityResponse.message === "用户名和手机号都已存在") {
          errors.push({
            name: "username",
            errors: ["用户名已存在"],
          });
          errors.push({
            name: "phone",
            errors: ["手机号已存在"],
          });
        }
        formRef.current.setFields(errors);
        return;
      }

      // 调用后端接口进行注册
      const response = await register(
        values.username,
        values.phone,
        values.password
      );

      // 根据后端返回的响应码进行处理
      if (response.code === 200) {
        // 注册成功，显示成功消息并跳转到登录页面
        message.success("注册成功！");
        navigate("/login");
      } else {
        // 注册失败，显示错误消息
        message.error(response.message || "注册失败，请重试");
      }
    } catch (error) {
      // 捕获异常，显示错误消息
      message.error(error.message || "注册失败，请检查网络或稍后重试");
    } finally {
      // 无论成功或失败，都将loading状态设置为false
      setLoading(false);
    }
  };

  // 渲染注册页面
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: 300 }}>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>注册</h1>
        <Form
          ref={formRef}
          name="register-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6位" },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>
        {/* 添加跳转至登录页面的按钮 */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/login">
            <Button type="link">已有账号？去登录</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
