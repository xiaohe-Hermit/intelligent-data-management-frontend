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

export const getUserNameByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    const user = response.data;
    if (!user.data.name) {
      throw new Error("用户名不存在");
    }
    return user.data.name;
  } catch (error) {
    console.error("获取用户名失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};
// 获取所有用户名和ID
export const getAllUserIdAndUserName = async () => {
  try {
    const response = await api.get("/user");
    const users = response.data;
    const userIdAndUserName = users.map((user) => ({   
      userId: user.user_id,
      userName: user.name,
    }));
    return userIdAndUserName;
  } catch (error) {
    console.error("获取用户名和ID失败:", error);
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