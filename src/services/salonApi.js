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

export const getSalons = async () => {
  try {
    const response = await api.get("/salons");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取沙龙失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createSalon = async (salonData) => {
  try {
    const response = await api.post("/salons", salonData);
    return response.data;
  } catch (error) {
    console.error("创建沙龙失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSalon = async (salonId, salonData) => {
  try {    
    const response = await api.put(`/salons/${salonId}`, salonData);
    return response.data;
  } catch (error) {
    console.error("更新沙龙失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteSalon = async (salonId) => {
  try {
    const response = await api.delete(`/salons/${salonId}`);
    return response.data;
  } catch (error) {
    console.error("删除沙龙失败:", error);
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
