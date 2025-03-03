import { useState } from "react";
import { message } from "antd";

const useDataManage = ({
  createFunction = async () => {
    throw new Error("createFunction 函数未提供！");
  },
  updateFunction = async () => {
    throw new Error("updateFunction 函数未提供！");
  },
  fetchFunction = async () => {
    throw new Error("fetchFunction 函数未提供！");
  },
  hasCheckFunction = false,
  dataCheckFunction = async () => {},
  dataName = "数据",
  dataIdKey = "data_id",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingData, setIsAddingData] = useState(false);
  const [editingDataId, setEditingDataId] = useState(null);

  const handleCreate = async (values) => {
    try {
      await createFunction(values);
      message.success(`${dataName}创建成功！`);
      fetchFunction();
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || `${dataName}创建失败，请重试`);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateFunction(editingDataId, values);
      message.success(`${dataName}更新成功！`);
      fetchFunction();
      setEditingDataId(null);
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || `${dataName}更新失败，请重试`);
    }
  };

  const handleCancel = () => {
    setEditingDataId(null);
    setIsModalOpen(false);
    setIsAddingData(false);
  };

  const handleEdit = (record) => {
    setEditingDataId(record[dataIdKey]);
    setIsModalOpen(true);
    setIsAddingData(false);
  };

  const handleAdd = () => {
    setEditingDataId(null);
    setIsModalOpen(true);
    setIsAddingData(true);
  };

  const handleFinish = async (values) => {
    // 如果是添加数据，则调用 dataCheckFunction 检查数据是否符合规则
    if (hasCheckFunction && isAddingData) {
      const isDataOk = await dataCheckFunction(values);
      if (!isDataOk) {
        return;
      }
    }
    // 如果是编辑数据，则调用 handleUpdate
    if (editingDataId) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  return {
    isModalOpen,
    isAddingData,
    editingDataId,
    setIsModalOpen,
    setIsAddingData,
    setEditingDataId,
    handleCreate,
    handleUpdate,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  };
};

export default useDataManage;
