import React from "react";
import { Form, Input, Select, DatePicker } from "antd";

const ProjectForm = ({ form, onFinish, allUserIdAndUserName }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="project_name"
                label="项目名称"
                rules={[
                    { required: true, message: "请输入项目名称" },
                    { max: 30, message: "项目名称不能超过30个字符" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="start_date"
                label="开始时间"
                rules={[{ required: true, message: "请选择开始时间" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="end_date"
                label="结束时间"
                rules={[{ required: true, message: "请选结束时间" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="description"
                label="项目描述"
                rules={[
                    { required: false, message: "请输入项目描述" },
                    { max: 50, message: "项目名称不能超过50个字符" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="manager_name"
                label="项目负责人"
                rules={[{ required: true, message: "请选择项目负责人" }]}
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
                name="status"
                label="项目状态"
                rules={[{ required: true, message: "请选择项目状态" }]}
            >
                <Select>
                    <Select.Option value="planning">planning</Select.Option>
                    <Select.Option value="ongoing">ongoing</Select.Option>
                    <Select.Option value="completed">completed</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default ProjectForm;