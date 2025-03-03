import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/loginApi'; // 导入登录 API


const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {        
      const response = await login(values.username, values.password);
      
      if (response.code === 200) {
        message.success('登录成功！');
        localStorage.setItem('dm-token', response.data.token); // 保存 token
        localStorage.setItem('user', JSON.stringify(response.data.user)); // 保存用户信息
        onLogin(response.data.user); // 更新登录状态
        navigate('/'); // 跳转到仪表盘页面
      } else {
        message.error(response.message || '登录失败，请重试');
      }
    } catch (error) {
      message.error(error.message || '登录失败，请检查网络或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 添加跳转到注册页面的函数
  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h1>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          {/* 添加跳转到注册页面的按钮 */}
          <Form.Item>
            <Button type="link" onClick={navigateToRegister} block>
              去注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;