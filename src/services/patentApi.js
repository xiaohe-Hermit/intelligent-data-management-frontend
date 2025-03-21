import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:7001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dm-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPatents = async () => {
  try {
    const response = await api.get("/patents");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取专利失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createPatent = async (patentData) => {
  try {
    const response = await api.post("/patents", patentData);
    return response.data;
  } catch (error) {
    console.error("创建专利失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePatent = async (patentId, patentData) => {
  try {    
    const response = await api.put(`/patents/${patentId}`, patentData);
    return response.data;
  } catch (error) {
    console.error("更新专利失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deletePatent = async (patentId) => {
  try {
    const response = await api.delete(`/patents/${patentId}`);
    return response.data;
  } catch (error) {
    console.error("删除专利失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};


