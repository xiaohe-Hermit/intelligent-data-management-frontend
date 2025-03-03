import React from "react";
import { Form, Select, DatePicker,Input } from "antd";

const SalonForm = ({
    form,
    onFinish,
    allUserIdAndUserName,
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="salon_name"
                label="沙龙名称"
                rules={[{ required: true, message: "请选择沙龙名称" }]}
            >
                <Input />

            </Form.Item>
            <Form.Item
                name="salon_date"
                label="日期"
                rules={[{ required: true, message: "请选择日期" }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                name="location"
                label="地点"
                rules={[{ required: true, message: "请选择地点" }]}
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
                name="organizer_name"
                label="组织者"
                rules={[{ required: true, message: "请选择组织者" }]}
            >
                <Select>
                    {allUserIdAndUserName.map((user) => (
                        <Select.Option key={user.userId} value={user.userName}>
                            {user.userName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

        </Form>
    );
};

export default SalonForm;