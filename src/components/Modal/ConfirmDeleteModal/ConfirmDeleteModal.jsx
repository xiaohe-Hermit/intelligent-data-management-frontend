// src/components/ConfirmDeleteModal/ConfirmDeleteModal.jsx
import React from "react";
import { Modal, Button } from "antd";
import "./ConfirmDeleteModal.css"; // 引入自定义样式文件

const ConfirmDeleteModal = ({
  title,
  description,
  open,
  onCancel,
  onOk,
  okText = "确认",
  cancelText = "取消",
}) => {
  return (
    <Modal
      title={<div className="modal-title">{title}</div>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} className="cancel-button">
          {cancelText}
        </Button>,
        <Button key="submit" type="danger" onClick={onOk} className="ok-button">
          {okText}
        </Button>,
      ]}
    >
        <p>{description}</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;