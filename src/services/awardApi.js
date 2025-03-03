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

export const getAwards = async () => {
  try {
    const response = await api.get("/awards");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取奖项失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createAward = async (awardData) => {
  try {
    const response = await api.post("/awards", awardData);
    return response.data;
  } catch (error) {
    console.error("创建奖项失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateAward = async (awardId, awardData) => {
  try {    
    const response = await api.put(`/awards/${awardId}`, awardData);
    return response.data;
  } catch (error) {
    console.error("更新奖项失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteAward = async (awardId) => {
  try {
    const response = await api.delete(`/awards/${awardId}`);
    return response.data;
  } catch (error) {
    console.error("删除奖项失败:", error);
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
