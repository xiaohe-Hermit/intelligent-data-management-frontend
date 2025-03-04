import React, { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import dayjs from "dayjs"; // 确保导入 dayjs
import {
  getPatents,
  createPatent,
  updatePatent,
  deletePatent,
  getAllUserIdAndUserName,
  getUserNameByUserId,
} from "../services/patentApi";
import CustomModal from "../components/Modal/CustomModal/CustomModal";
import DataTable from "../components/DataTable/DataTable";
import PatentForm from "../components/Form/PatentForm/PatentForm";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import useDeleteHandler from "../hooks/useDeleteHandler";
import useDataManage from "../hooks/useDataManage";
const Patents = () => {
  const [patents, setPatents] = useState([]);
  const [allUserIdAndUserName, setAllUserIdAndUserName] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPatents();
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

  // 修改后的 fetchPatents 函数
  const fetchPatents = async () => {
    try {
      const response = await getPatents();
      if (Array.isArray(response)) {
        const updatedPatents = await Promise.all(
          response.map(async (patent) => {
            if (patent.user_id) {
              const userName = await getUserNameByUserId(patent.user_id);
              return {
                ...patent,
                user_name: userName,
              };
            } else {
              return {
                ...patent,
                user_name: "无",
              };
            }
          })
        );
        setPatents(updatedPatents);
      } else {
        setPatents([]);
        message.error("获取专利数据格式不正确");
      }
    } catch (error) {
      console.error("获取专利失败:", error);
      message.error("获取专利失败，请重试");
    }
  };

  const {
    isDeleteModalOpen,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteHandler({
    deleteFunction: deletePatent,
    fetchFunction: fetchPatents,
    successMessage: "删除专利成功！",
    errorMessage: "删除专利失败，请重试",
    idField: "patent_id",
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
      application_date: dayjs(record.application_date),
      authorization_date: dayjs(record.authorization_date),
    };
    return formattedRecord;
  };

  const {
    isModalOpen,
    isAddingData: isAddingPatent,
    handleCancel,
    handleEdit,
    handleAdd,
    handleFinish,
  } = useDataManage({
    form: form,
    createFunction: createPatent,
    updateFunction: updatePatent,
    fetchFunction: fetchPatents,
    dataName: "专利",
    dataIdKey: "patent_id",
    hasFormatFunction: true,
    dataFormatFunction: dataFormatFunction,
    hasDateTypeAttribute: true,
    dateTypeFormatFunction: dateTypeFormatFunction,
  });

  const columns = [
      {
        title: "专利名称",
        dataIndex: "patent_name",
        key: "patent_name",
      },
  
      {
        title: "专利号",
        dataIndex: "patent_number",
        key: "patent_number",
      },
      {
        title: "申请日期",
        dataIndex: "application_date",
        key: "application_date",
      },
      {
        title: "授权日期",
        dataIndex: "authorization_date",
        key: "authorization_date",
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
        title: "专利名称",
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
        dataText="专利"
        dataSource={patents}
        columns={columns}
        row_key="patent_id"
        onClick={handleAdd}
      />
      <CustomModal
        title={isAddingPatent ? "添加专利" : "更新专利"}
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        form={form}
        submitButtonText={isAddingPatent ? "添加专利" : "更新专利"}
      >
        <PatentForm
          form={form}
          onFinish={handleFinish}
          allUserIdAndUserName={allUserIdAndUserName}
        />
      </CustomModal>
      <ConfirmDeleteModal
        title="删除专利"
        description={`确定要删除该专利吗？`}
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default Patents;
