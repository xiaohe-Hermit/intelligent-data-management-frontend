import React from "react";
import { Layout, Card, Row, Col, Statistic, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./ProfilePage.css";

const { Content } = Layout;

const ProfilePage = () => {
  // 示例数据
  const teamMembers = [
    { name: "Michael Wang", position: "高级UI设计师", avatar: "" },
    { name: "Lovelyzhong", position: "客户销售", avatar: "" },
    { name: "Jiajingwang", position: "开发工程师", avatar: "" },
  ];

  return (
    <div className="profile-page">
      <Layout style={{ background: "#f0f2f5" }}>
        {/* 账户信息头部 */}
        <div
          style={{
            background: "#1890ff",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{ backgroundColor: "#fff", color: "#1890ff" }}
            icon={<UserOutlined />}
            size={40}
          />
          <h2 style={{ color: "white", marginLeft: 12, marginBottom: 0 }}>
            个人账户
          </h2>
        </div>

        <Content style={{ padding: "24px" }}>
          {/* 个人信息区块 */}
          <Card title="个人信息" style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Statistic title="手机" value="+86 13923734567" />
              </Col>
              <Col span={8}>
                <Statistic title="邮件" value="AccountingQQ.com" />
              </Col>
              <Col span={8}>
                <Statistic title="职位" value="系统研发" />
                <div style={{ marginTop: 8 }}>入职：2021-07-01</div>
              </Col>
            </Row>
          </Card>

          {/* 实验室成员区块 */}
          <Card title="实验室成员" style={{ marginBottom: 24 }}>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={teamMembers}
              renderItem={(item) => (
                <List.Item>
                  <Card>
                    <div style={{ textAlign: "center" }}>
                      <Avatar
                        size={64}
                        src={
                          item.avatar ||
                          "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                        }
                      />
                      <h4 style={{ margin: "8px 0" }}>{item.name}</h4>
                      <p style={{ color: "rgba(0,0,0,.45)" }}>
                        {item.position}
                      </p>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>

          {/* 服务产品区块 */}
          <Card title="个人成就">
            <Row gutter={24}>
              {["Aa", "Bb", "Cc", "Dd"].map((item, index) => (
                <Col span={6} key={index} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      backgroundColor: index % 2 ? "#e6f7ff" : "#f6ffed",
                      borderRadius: 8,
                      padding: "24px 16px",
                      textAlign: "center",
                    }}
                  >
                    <h2 style={{ fontSize: 28 }}>{item}</h2>
                    <p style={{ color: "rgba(0,0,0,.45)" }}>描述</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Content>
      </Layout>
    </div>
  );
};
export default ProfilePage;
