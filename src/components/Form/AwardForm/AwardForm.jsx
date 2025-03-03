import React from "react";
import { Form, Select, DatePicker, Input } from "antd";

const AwardForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
    allProjectIdAndProjectName
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="award_name"
                label="奖项名称"
                rules={[{ required: true, message: "请输入奖项名称" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="award_date"
                label="获奖日期"
                rules={[{ required: true, message: "请选择获奖日期" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="award_level"
                label="奖项级别"
                rules={[{ required: true, message: "请选择奖项级别" }]}
            >
                <Select>
                    <Select.Option value="国家级">国家级</Select.Option>
                    <Select.Option value="省级">省级</Select.Option>
                    <Select.Option value="市级">市级</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="award_organization"
                label="颁奖组织"
                rules={[{ required: true, message: "请输入颁奖组织" }]}
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

export default AwardForm;