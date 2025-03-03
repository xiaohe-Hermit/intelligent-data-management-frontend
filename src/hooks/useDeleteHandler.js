import { useState } from 'react';
import { message } from 'antd';

const useDeleteHandler = ({deleteFunction, fetchFunction, successMessage, errorMessage, idField = 'id'}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = (record) => {
    setDeletingId(record[idField]); // 使用动态的 ID 字段名称
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFunction(deletingId);
      message.success(successMessage);
      fetchFunction();
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error(error.message || errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
    setIsDeleteModalOpen(false);
  };

  return {
    deletingId,
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};

export default useDeleteHandler;