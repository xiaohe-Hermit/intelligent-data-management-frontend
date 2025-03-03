// src/services/permissionApi.js
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

export const getPermissions = async () => {
  try {
    const response = await api.get("/permissions");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取权限失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createPermission = async (permissionData) => {
  try {
    const response = await api.post("/permissions", permissionData);
    return response.data;
  } catch (error) {
    console.error("创建权限失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePermission = async (permissionId, permissionData) => {
  try {
    const response = await api.put(`/permissions/${permissionId}`, permissionData);
    return response.data;
  } catch (error) {
    console.error("更新权限失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deletePermission = async (permissionId) => {
  try {
    const response = await api.delete(`/permissions/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error("删除权限失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};