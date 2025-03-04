// src/services/roleApi.js
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

export const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取角色失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await api.post("/roles", roleData);
    return response.data;
  } catch (error) {
    console.error("创建角色失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error("更新角色失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await api.delete(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("删除角色失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// 获取所有的角色名
export const getAllRoleName = async () => {
  try {
    const response = await api.get("/roles");
    const roles = response.data.data;    
    const roleName = roles.map((role) => ({
      roleId: role.role_id,
      roleName: role.role_name,
    }));
    return roleName;
  } catch (error) {
    console.error("获取角色名失败:", error);
  }
}