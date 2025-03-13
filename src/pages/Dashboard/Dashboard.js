// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Button, DatePicker } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import './Dashboard.css';
/**
 * Dashboard组件用于渲染仪表盘页面
 * 该组件会从后端获取信息和用户数据，并展示在页面上
 */
const Dashboard = () => {
  // 使用useEffect钩子在组件挂载时获取数据
  useEffect(() => {
    document.title = "智能数据管理系统";
  }, []);

  const deviceData = [
    { type: "正常", value: 512 },
    { type: "停机", value: 5 },
    { type: "保养", value: 27 },
    { type: "维修", value: 27 },
  ];

  // 文档操作数据
  const docData = [
    { type: "上传", value: 8 },
    { type: "下载", value: 15 },
    { type: "删除", value: 2 },
    { type: "过期", value: 36 },
  ];

  // 柱状图配置
  const columnConfig = {
    data: [
      { date: "2023/02/03", value: 1620 },
      { date: "2023/02/04", value: 2623 },
      { date: "2023/02/09", value: 2023 },
    ],
    xField: "date",
    yField: "value",
  };

  // 渲染仪表盘页面
  return (
    <div className="dashboard-container">
      {/* 顶部状态栏 */}
      <Row gutter={16} className="status-row">
        <Col span={12}>
          <Card className="status-card blue">
            <Statistic
              title="未读消息"
              value={2974}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="status-card blue">
            <Statistic
              title="流程待办"
              value={13}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={16}>
        {/* 左侧内容 */}
        <Col span={16}>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="设备状态" extra={<DatePicker />}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Pie
                      data={deviceData}
                      angleField="value"
                      colorField="type"
                    />
                  </Col>
                  <Col span={12}>
                    <div className="device-status">
                      <div className="status-item">
                        <span>总设备数</span>
                        <h2>600个</h2>
                      </div>
                      <div className="status-item">
                        <span>正常运行</span>
                        <h3>512台</h3>
                      </div>
                      {/* 其他状态项 */}
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="chart-row">
            <Col span={12}>
              <Card title="每月文档操作" extra={<DatePicker />}>
                <Pie data={docData} angleField="value" colorField="type" />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="每日文档上传量" extra={<DatePicker />}>
                <Column {...columnConfig} />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 右侧快捷菜单 */}
        <Col span={8}>
          <Card title="快捷操作" className="quick-actions">
            <Button block className="action-btn">
              设备区域合格
            </Button>
            <Button block className="action-btn">
              销售订单
            </Button>
            <Button block className="action-btn">
              生产计划列表
            </Button>
            <Button block className="action-btn">
              车间管理
            </Button>
            <Button block className="action-btn">
              班组作业
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
