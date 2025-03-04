import React from "react";
import { Form, Select, DatePicker, Input } from "antd";

const PublicationForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
    allProjectIdAndProjectName
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: "请输入标题" },
                { max: 20, message: "标题不能超过20个字符" },
                ]}

            >
                <Input />
            </Form.Item>
            <Form.Item
                name="authors"
                label="作者"
                rules={[{ required: true, message: "请输入作者" },
                { max: 20, message: "作者不能超过15个字符" },]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="publish_date"
                label="发布日期"
                rules={[{ required: true, message: "请选择发布日期" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="publisher"
                label="出版社"
                rules={[{ required: true, message: "请选择出版社" }]}
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
                name="user_id"
                label="用户ID"
                rules={[{ required: true, message: "请选择用户ID" }]}
            >
                <Select>
                    {allUserIdAndUserName.map((user) => (
                        <Select.Option key={user.userId} value={user.userId}>
                            {user.userId}
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

export default PublicationForm;