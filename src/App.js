// src/App.js
import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Button,
  Input,
  Dropdown,
  Space,
  Switch,
  message,
} from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import SettingPage from "./pages/SettingPage/SettingPage";
import UsersPage from "./pages/data-manage/UsersPage/UsersPage";
import RolesPage from "./pages/data-manage/RolePage/RolePage";
import SalonsPage from "./pages/data-manage/SalonPage/SalonPage";
import PhotosPage from "./pages/data-manage/PhotoPage/PhotoPage";
import MembersPage from "./pages/data-manage/MemberPage/MemberPage";
import AwardsPage from "./pages/data-manage/AwardPage/AwardPage";
import PublicationsPage from "./pages/data-manage/PublicationPage/PublicationPage";
import PatentsPage from "./pages/data-manage/PatentPage/PatentPage";
import PermissionsPage from "./pages/data-manage/PermissionPage/PermissionPage";
import ProjectsPage from "./pages/data-manage/ProjectPage/ProjectPage";
import SoftwareCopyrightsPage from "./pages/data-manage/SoftwareCopyrightPage/SoftwareCopyrightPage";
import DataOverviewPage from "./pages/data-vision/DataOverviewPage/DataOverviewPage";
import DataVisualizationPage from "./pages/data-vision/DataVisualizationPage/DataVisualizationPage";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  BellOutlined,
  CalendarOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登录状态
  const [user, setUser] = useState(() => {
    // 从 localStorage 中读取用户信息
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isDarkTheme, setIsDarkTheme] = useState(true); // 主题状态

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
        label: <Link to="/">首页</Link>,
      },
      {
        key: "2",
        label: "概览",
        children: [
          {
            key: "2-1",
            label: <Link to="/overview/data-overview">数据概览</Link>,
          },
          {
            key: "2-2",
            label: <Link to="/overview/data-visualization">数据可视化</Link>,
          },
        ],
      },
      {
        key: "3",
        label: "管理",
        children: [
          {
            key: "3-1",
            label: <Link to="/users">用户管理</Link>,
          },
          {
            key: "3-2",
            label: <Link to="/roles">角色管理</Link>,
          },
          {
            key: "3-3",
            label: <Link to="/permissions">权限管理</Link>,
          },
          {
            key: "3-4",
            label: <Link to="/members">成员管理</Link>,
          },
          {
            key: "3-5",
            label: <Link to="/projects">项目管理</Link>,
          },
          {
            key: "3-6",
            label: <Link to="/photos">图片管理</Link>,
          },
          {
            key: "3-7",
            label: <Link to="/awards">获奖管理</Link>,
          },
          {
            key: "3-8",
            label: <Link to="/publications">出版物管理</Link>,
          },
          {
            key: "3-9",
            label: <Link to="/patents">专利管理</Link>,
          },
          {
            key: "3-10",
            label: <Link to="/salons">沙龙管理</Link>,
          },
          {
            key: "3-11",
            label: <Link to="/software-copyrights">软著管理</Link>,
          },
        ],
      },
    ];

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider theme={isDarkTheme ? "dark" : "light"}>
          <div className="logo" />
          <Menu
            theme={isDarkTheme ? "dark" : "light"}
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <AppHeader
            user={user}
            onLogout={() => setIsLoggedIn(false)}
            isDarkTheme={isDarkTheme}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
          />
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
            <LoginPage
              onLogin={(userData) => {
                setIsLoggedIn(true);
                setUser(userData); // 更新用户信息
              }}
            />
          }
        />
        {/* 注册页 */}
        <Route path="/register" element={<RegisterPage />} />{" "}
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
          <Route path="overview/data-overview" element={<DataOverviewPage />} />
          <Route
            path="overview/data-visualization"
            element={<DataVisualizationPage />}
          />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="awards" element={<AwardsPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="patents" element={<PatentsPage />} />
          <Route path="salons" element={<SalonsPage />} />
          <Route
            path="software-copyrights"
            element={<SoftwareCopyrightsPage />}
          />
          <Route path="profile" element={<ProfilePage />} />
          {/* <Route path="settings" element={<SettingPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

// 自定义 Header 组件
const AppHeader = ({ user, onLogout, isDarkTheme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("dm-token"); // 清除 token
    localStorage.removeItem("user"); // 清除用户信息
    onLogout(); // 更新登录状态
    navigate("/login"); // 跳转到登录页
  };

  const handleDropdownOpenChange = (flag) => {
    setIsDropdownOpen(flag);
  };

  const menuItems = [
    {
      key: "1",
      label: <Link to="/profile">个人资料</Link>,
    },
    // {
    //   key: "2",
    //   label: <Link to="/settings">设置</Link>,
    // },
    {
      key: "3",
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: isDarkTheme ? "#001529" : "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64, // 设置Header的高度
        transition: "background-color 0.3s ease", // 添加背景颜色过渡效果
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 2 }}>
        <Input.Search
          placeholder="站内搜索"
          style={{ width: 400, height: 32 }} // 增加搜索栏的宽度和高度
          prefix={<SearchOutlined />}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button
          icon={<BellOutlined />}
          onClick={() => message.info("消息通知")}
          style={{ fontSize: 14, padding: "0 12px" }}
        />
        <Button
          icon={<CalendarOutlined />}
          onClick={() => message.info("日程安排")}
          style={{ fontSize: 14, padding: "0 12px" }}
        />
        <Switch
          checked={isDarkTheme}
          onChange={onToggleTheme}
          checkedChildren={<SettingOutlined />}
          unCheckedChildren={<SettingOutlined />}
          style={{ fontSize: 14 }}
        />
        <Dropdown
          menu={{ items: menuItems }}
          onOpenChange={handleDropdownOpenChange}
          open={isDropdownOpen}
        >
          <Button
            style={{
              height: "80%", // 设置按钮高度占Header的80%
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 12px",
              backgroundColor: isDarkTheme ? "#1890ff" : "#f0f0f0", // 根据主题调整背景颜色
              color: isDarkTheme ? "#fff" : "#000", // 根据主题调整文字颜色
              transition: "background-color 0.3s ease, color 0.3s ease", // 添加背景颜色和文字颜色过渡效果
            }}
          >
            <Space >
              <Avatar
                src={
                  user.avatar ||
                  "https://intellect-data-management.tos-cn-guangzhou.volces.com/avatar/default_avatar.jpeg"
                }
                size="large"
              />
              <div style={{ textAlign: "left" ,margin: "10px" }}>
                <div>{user.name}</div>
                <div>{user.role}</div>
              </div>
              {isDropdownOpen ? <UpOutlined /> : <DownOutlined />}
            </Space>
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default App;
