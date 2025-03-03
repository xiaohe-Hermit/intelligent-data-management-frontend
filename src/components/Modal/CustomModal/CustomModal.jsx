// src/components/CustomModal/CustomModal.jsx
import React from "react";
import { Modal,Button } from "antd";

const CustomModal = ({
  title,
  open,
  onCancel,
  form,
  children,
  submitButtonText,
  cancelButtonText,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {cancelButtonText || "取消"}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {submitButtonText || "提交"}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;