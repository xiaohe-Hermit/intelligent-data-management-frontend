// src/App.js
import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Roles from "./pages/Role";
import Salons from "./pages/Salon";
import Photos from "./pages/Photo";
import Members from "./pages/Member";
import Awards from "./pages/Award";
import Publications from "./pages/Publication";
import Patents from "./pages/Patent";
import Permissions from "./pages/Permission";
import Projects from "./pages/Project";
import SoftwareCopyrights from "./pages/SoftwareCopyright";
import Register from "./pages/Register";
import { useNavigate } from "react-router-dom";
const { Header, Content, Sider } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登录状态
  const [user, setUser] = useState(() => {
    // 从 localStorage 中读取用户信息
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  useEffect(() => {
    document.title = "智能数据管理系统";
  }, []); 

  // 保护路由的组件
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />; // 未登录时重定向到登录页
    }
    return children;
  };

  // 主布局组件
  const MainLayout = () => {
    // 定义 Menu 的 items 数组
    const menuItems = [
      {
        key: "1",
        label: <Link to="/">Dashboard</Link>,
      },
      {
        key: "2",
        label: <Link to="/users">Users</Link>,
      },
      {
        key: "3",
        label: <Link to="/roles">Roles</Link>,
      },
      {
        key: "4",
        label: <Link to="/permissions">Permissions</Link>,
      },
      {
        key: "5",
        label: <Link to="/members">Members</Link>,
      },
      {
        key: "6",
        label: <Link to="/projects">Projects</Link>,
      },
      {
        key: "7",
        label: <Link to="/photos">Photos</Link>,
      },
      {
        key: "8",
        label: <Link to="/awards">Awards</Link>,
      },
      {
        key: "9",
        label: <Link to="/publications">Publications</Link>,
      },
      {
        key: "10",
        label: <Link to="/patents">Patents</Link>,
      },
      {
        key: "11",
        label: <Link to="/salons">Salons</Link>,
      },
      {
        key: "12",
        label: <Link to="/software-copyrights">SoftwareCopyrights</Link>,
      },
    ];

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <AppHeader user={user} onLogout={() => setIsLoggedIn(false)} />
          <Content style={{ margin: "24px 16px 0" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Outlet /> {/* 子路由的内容将在这里渲染 */}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  };

  return (
    <Router>
      <Routes>
        {/* 登录页 */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={(userData) => {
                setIsLoggedIn(true);
                setUser(userData); // 更新用户信息
              }}
            />
          }
        />
        {/* 注册页 */}
        <Route path="/register" element={<Register />} />{" "}
        {/* 添加注册页面路由 */}
        {/* 受保护的路由 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="members" element={<Members />} />
          <Route path="projects" element={<Projects />} />
          <Route path="photos" element={<Photos />} />
          <Route path="awards" element={<Awards />} />
          <Route path="publications" element={<Publications />} />
          <Route path="patents" element={<Patents />} />
          <Route path="salons" element={<Salons />} />
          <Route path="software-copyrights" element={<SoftwareCopyrights />} />
        </Route>
      </Routes>
    </Router>
  );
}

// 自定义 Header 组件
const AppHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("dm-token"); // 清除 token
    localStorage.removeItem("user"); // 清除用户信息
    onLogout(); // 更新登录状态
    navigate("/login"); // 跳转到登录页
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar src={user.avatar} size="default" />
        <span>{user.name}</span>
      </div>
      <Button type="primary" onClick={handleLogout} style={{ marginLeft: 16 }}>
        退出登录
      </Button>
    </Header>
  );
};

export default App;
