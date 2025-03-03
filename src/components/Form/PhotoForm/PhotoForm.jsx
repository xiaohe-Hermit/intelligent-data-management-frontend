import React from "react";
import { Form, Select, DatePicker, Input } from "antd";

const PhotoForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
    allProjectIdAndProjectName
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="photo_name"
                label="照片名称"
                rules={[{ required: true, message: "请选择照片名称" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="photo_url"
                label="照片路径"
                rules={[{ required: true, message: "请选择照片路径" }]}
            >
                <Input />
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

export default PhotoForm;