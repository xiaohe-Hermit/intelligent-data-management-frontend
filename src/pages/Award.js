import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
  getAllUserIdAndUserName,
  getUserNameByUserId,
} from "../services/awardApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import DataTable from "../components/DataTable/DataTable";
import AwardForm from "../components/Form/AwardForm/AwardForm";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";
import useDataManage from "../hooks/useDataManage";
const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAwards();
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

  // 修改后的 fetchAwards 函数
  const fetchAwards = async () => {
    try {
      const response = await getAwards();
      if (Array.isArray(response)) {
        const updatedAwards = await Promise.all(
          response.map(async (award) => {
            if (award.user_id) {
              const userName = await getUserNameByUserId(award.user_id);
              return {
                ...award,
                user_name: userName,
              };
            } else {
              return {
                ...award,
                user_name: "无",
              };
            }
          })
        );
        setAwards(updatedAwards);
      } else {
        setAwards([]);
        message.error("获取奖项数据格式不正确");
      }
    } catch (error) {
      console.error("获取奖项失败:", error);
      message.error("获取奖项失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deleteAward,
    fetchFunction: fetchAwards,
    successMessage: "删除奖项成功！",
    errorMessage: "删除奖项失败，请重试",
    idField: "award_id",
  });

  const dataFormatFunction = async (data) => {
    let userId = null;
    for (const user of allUserIdAndUserName) {
      if (data.user_name == user.userName) {
        userId = user.userId;
      }
    }
    const formattedData = {
      ...data,
      user_id: userId,
      // project_id: projectId,
    };
    const { user_name, ...finalData } = formattedData;
    return finalData;
  };
  const dateTypeFormatFunction = (record) => {
    const formattedRecord = {
      ...record,
      award_date: dayjs(record.award_date),
    };
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingAward,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createAward,
    updateFunction: updateAward,
    fetchFunction: fetchAwards,
    dataName: "奖项",
    dataIdKey: "award_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
    {
      title: "奖项名称",
      dataIndex: "award_name",
      key: "award_name",
    },
    {
      title: "获奖日期",
      dataIndex: "award_date",
      key: "award_date",
    },
    {
      title: "奖项级别",
      dataIndex: "award_level",
      key: "award_level",
    },
    {
      title: "颁奖组织",
      dataIndex: "award_organization",
      key: "award_organization",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "获得者",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "奖项名称",
      dataIndex: "project_name",
      key: "project_name",
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
        dataText="奖项"
        dataSource={awards}
        columns={columns}
        row_key="award_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingAward ? "添加奖项" : "更新奖项"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingAward ? "添加奖项" : "更新奖项"}
      >
        <AwardForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除奖项"
        description={`确定要删除该奖项吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default Awards;
