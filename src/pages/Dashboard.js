// src/pages/Dashboard.js
import React, { useEffect} from 'react';

/**
 * Dashboard组件用于渲染仪表盘页面
 * 该组件会从后端获取信息和用户数据，并展示在页面上
 */
const Dashboard = () => {

  // 使用useEffect钩子在组件挂载时获取数据
  useEffect(() => {
    
  }, []);

  // 渲染仪表盘页面
  return (
    <div style={{ padding: 24 }}>
      <h1>欢迎来到仪表盘</h1>
      {/* 展示从后端获取的信息 */}
    </div>
  );
};

export default Dashboard;