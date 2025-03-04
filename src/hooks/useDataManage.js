import { useState, useEffect } from "react";
import { message } from "antd";

const useDataManage = ({
  form, // 表单实例
  createFunction = async () => {
    throw new Error("createFunction 函数未提供！");
  },
  updateFunction = async () => {
    throw new Error("updateFunction 函数未提供！");
  },
  fetchFunction = async () => {
    throw new Error("fetchFunction 函数未提供！");
  },
  dataName = "数据",
  dataIdKey = "data_id",
  hasFormatFunction = false, // 是否有数据检查函数
  dataFormatFunction = async () => {}, // 检查函数
  hasCheckFunction = false, // 是否有数据检查函数
  dataCheckFunction = async () => {}, // 检查函数
  hasDateTypeAttribute = false, // 是否有日期类型属性,在编辑时需要格式化日期类型数据
  dateTypeFormatFunction = (data) => {}, // 日期类型数据格式化函数
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingData, setIsAddingData] = useState(false);
  const [editingDataId, setEditingDataId] = useState(null);

  useEffect(() => {
    if (form) {
      // 在这里可以使用 form 实例进行操作
    }
  }, [form]);

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

  const handleEdit = async (record) => {    
    if (hasDateTypeAttribute) {        
      record = dateTypeFormatFunction(record);
    }
    if (hasFormatFunction) {
      record = await dataFormatFunction(record);
    }    
    form.setFieldsValue(record);
    setEditingDataId(record[dataIdKey]);
    setIsModalOpen(true);
    setIsAddingData(false);
  };

  const handleAdd = () => {
    setEditingDataId(null);
    form.resetFields();
    setIsModalOpen(true);
    setIsAddingData(true);
  };

  const handleFinish = async (values) => {
    // 如果是添加数据，则调用 dataCheckFunction 检查数据是否符合规则
    if (hasCheckFunction && dataName !== "用户") {
      const isDataOk = await dataCheckFunction(values);
      if (!isDataOk) {
        message.error("数据不符合规则，请检查！");
        return;
      }
    }
    // 如果存在数据格式化函数，则调用 dataFormatFunction 格式化数据
    let formattedData = values;
    if (hasFormatFunction) {
      formattedData = await dataFormatFunction(values);
    }    
    // 如果是编辑数据，则调用 handleUpdate
    if (editingDataId) {
      handleUpdate(formattedData);
    } else {
      handleCreate(formattedData);
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
