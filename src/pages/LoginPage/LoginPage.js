import React, { useState, useEffect } from "react";
import { Form, Input, Button, message,Tabs } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/loginApi"; // 导入登录 API
import "./LoginPage.css"; // 需要创建对应的样式文件

const LoginPage = ({ onLogin }) => {
  const [activeKey, setActiveKey] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [accountForm] = Form.useForm();
  const [mobileForm] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "登录页";
  }, []);

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onFinishAccount = async (values) => {
    setLoading(true);
    try {
      const response = await login(values.username, values.password);

      if (response.code === 200) {
        message.success("登录成功！");
        localStorage.setItem("dm-token", response.data.token); // 保存 token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // 保存用户信息
        onLogin(response.data.user); // 更新登录状态
        navigate("/"); // 跳转到仪表盘页面
      } else {
        message.error(response.message || "登录失败，请重试");
      }
    } catch (error) {
      message.error(error.message || "登录失败，请检查网络或稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const onFinishMobile = async (values) => {
    console.log(values);
  };

  // 添加跳转到注册页面的函数
  const navigateToRegister = () => {
    navigate("/register");
  };

  // 使用 items 的新式 Tabs 配置
  const tabItems = [
    {
      key: "mobile",
      label: "手机号登录",
      children: (
        <Form form={mobileForm} onFinish={onFinishMobile}>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号!" },
              { len: 11, message: "请输入11位手机号" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入11位手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <div className="captcha-input">
              <Input
                prefix={<LockOutlined />}
                placeholder="请输入短信验证码"
                size="large"
              />
              <Button
                type="primary"
                size="large"
                disabled={countdown > 0}
                onClick={() => setCountdown(60)}
              >
                {countdown ? `${countdown}秒后重试` : "获取验证码"}
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "account",
      label: "账号密码登录",
      children: (
        <Form form={accountForm} onFinish={onFinishAccount}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名/邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码!" },
              { min: 4, message: "密码至少4位" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="login-container">
      {/* 左侧宣传区 */}
      <div className="promotion-section">
        <div className="brand">
          <h1>智研LabMaster</h1>
          <p className="slogan">智能实验室科研数据协同管理平台</p>
        </div>
        <div className="graphic"></div>
      </div>

      {/* 右侧登录表单 */}
      <div className="login-form-section">
        <h2 className="form-title">登录</h2>
        <Tabs
          activeKey={activeKey}
          items={tabItems}
          onChange={setActiveKey}
          centered
          className="login-tabs"
        />

        <div className="additional-links">
          <Button type="link" onClick={navigateToRegister} block>
            还没有账号？立即注册
          </Button>
        </div>

        <div className="footer">
          <p>lab-master.com 版权所有 ©2025</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
