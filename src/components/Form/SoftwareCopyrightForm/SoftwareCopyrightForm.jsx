import React from "react";
import { Form, Select, DatePicker, Input } from "antd";

const SoftwareCopyrightForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
    allProjectIdAndProjectName
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="software_name"
                label="软著名称"
                rules={[{ required: true, message: "请选择软著名称" }]}
            >
                <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
                name="copyright_number"
                label="版权号"
                rules={[{ required: true, message: "请选择版权号" }]}
            >
                <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
                name="registration_date"
                label="注册时间"
                rules={[{ required: true, message: "请选择注册时间" }]}
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

export default SoftwareCopyrightForm;