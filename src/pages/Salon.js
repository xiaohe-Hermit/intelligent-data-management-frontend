import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getSalons,
  createSalon,
  updateSalon,
  deleteSalon,
  getAllUserIdAndUserName,
  getUserNameByUserId,
} from "../services/salonApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import DataTable from "../components/DataTable/DataTable";
import SalonForm from "../components/Form/SalonForm/SalonForm";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";
import useDataManage from "../hooks/useDataManage";
const Salons = () => {
  const [salons, setSalons] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSalons();
    fetchAllUserIdAndUserName();
  }, []);
  useEffect(() => {}, [form]);

  // 获取所有用户id和用户名
  const fetchAllUserIdAndUserName = async () => {
    try {
      const allUserIdAndUserName = await getAllUserIdAndUserName();
      if (Array.isArray(allUserIdAndUserName)) {
        setAllUserIdAndUserName(allUserIdAndUserName);
      } else {
        setAllUserIdAndUserName([]);
        message.error("获取用户数据格式不正确");
      }
    } catch (error) {
      console.error("获取用户失败:", error);
    }
  };

  // 修改后的 fetchSalons 函数
  const fetchSalons = async () => {
    try {
      const response = await getSalons();
      if (Array.isArray(response)) {
        const updatedSalons = await Promise.all(
          response.map(async (salon) => {
            if (salon.organizer_id) {
              const userName = await getUserNameByUserId(salon.organizer_id);
              return {
                ...salon,
                organizer_name: userName,
              };
            } else {
              return {
                ...salon,
                organizer_name: "无",
              };
            }
          })
        );
        setSalons(updatedSalons);
      } else {
        setSalons([]);
        message.error("获取沙龙数据格式不正确");
      }
    } catch (error) {
      console.error("获取沙龙失败:", error);
      message.error("获取沙龙失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteSalon,
    fetchFunction: fetchSalons,
    successMessage: "删除沙龙成功！",
    errorMessage: "删除沙龙失败，请重试",
    idField: "salon_id",
  });

  const dataFormatFunction = async (data) => {
    let userId = null;
    for (const user of allUserIdAndUserName) {
      if (data.organizer_name == user.userName) {
        userId = user.userId;
      }
    }
    const formattedData = {
      ...data,
      organizer_id: userId,
    };
    const { organizer_name, ...finalData } = formattedData;
    return finalData;
  };
  const dateTypeFormatFunction = (record) => {
    const formattedRecord = {
      ...record,
      salon_date: dayjs(record.salon_date),
    };
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingSalon,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createSalon,
    updateFunction: updateSalon,
    fetchFunction: fetchSalons,
    dataName: "沙龙",
    dataIdKey: "salon_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
      {
        title: "沙龙名称",
        dataIndex: "salon_name",
        key: "salon_name",
      },
  
      {
        title: "举办时间",
        dataIndex: "salon_date",
        key: "salon_date",
      },
      {
        title: "地点",
        dataIndex: "location",
        key: "location",
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "沙龙负责人",
        dataIndex: "organizer_name",
        key: "organizer_name",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <div>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => handleDelete(record)}>
              删除
            </Button>
          </div>
        ),
      },
    ];

  return (
    <div>
      <DataTable
        dataText="沙龙"
        dataSource={salons}
        columns={columns}
        row_key="salon_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingSalon ? "添加沙龙" : "更新沙龙"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingSalon ? "添加沙龙" : "更新沙龙"}
      >
        <SalonForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除沙龙"
        description={`确定要删除该沙龙吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default Salons;
