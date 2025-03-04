// src/services/memberApi.js
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

export const getMembers = async () => {
  try {
    const response = await api.get("/members");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取成员失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await api.post("/members", memberData);
    return response.data;
  } catch (error) {
    console.error("创建成员失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    const response = await api.put(`/members/${memberId}`, memberData);
    return response.data;
  } catch (error) {
    console.error("更新成员失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteMember = async (memberId) => {
  try {
    const response = await api.delete(`/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("删除成员失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};
