import React from "react";
import { Input, Form, Select, DatePicker } from "antd";

const PatentForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
    allProjectIdAndProjectName
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="patent_name"
                label="专利名称"
                rules={[{ required: true, message: "请选择专利名称" }]}
            >
                <Input />

            </Form.Item>
            <Form.Item
                name="patent_number"
                label="专利号"
                rules={[{ required: true, message: "请选择专利号" }]}
            >
                <Input />

            </Form.Item>
            <Form.Item
                name="application_date"
                label="申请时间"
                rules={[{ required: true, message: "请选择申请时间" }]}
            >
                <DatePicker />

            </Form.Item>
            <Form.Item
                name="authorization_date"
                label="授予时间"
                rules={[{ required: true, message: "请选择授予时间" }]}
            >
                <DatePicker />

            </Form.Item>
            <Form.Item
                name="description"
                label="描述"
                rules={[
                    { required: false, message: "请输入描述" },
                    { max: 20, message: "描述不能超过20个字符" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="user_name"
                label="获得者"
                rules={[{ required: true, message: "请选择获得者" }]}
            >
                <Select>
                    {allUserIdAndUserName.map((user) => (
                        <Select.Option key={user.userId} value={user.userName}>
                            {user.userName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="project_name"
                label="项目名称"
                rules={[{ required: true, message: "请选择项目名称" }]}
            >
                <Select>
                    {allProjectIdAndProjectName.map((project) => (
                        <Select.Option key={project.projectId} value={project.projectName}>
                            {project.projectName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default PatentForm;