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

export const getPublications = async () => {
  try {
    const response = await api.get("/publications");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取出版物失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createPublication = async (publicationData) => {
  try {
    const response = await api.post("/publications", publicationData);
    return response.data;
  } catch (error) {
    console.error("创建出版物失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePublication = async (publicationId, publicationData) => {
  try {    
    const response = await api.put(`/publications/${publicationId}`, publicationData);
    return response.data;
  } catch (error) {
    console.error("更新出版物失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deletePublication = async (publicationId) => {
  try {
    const response = await api.delete(`/publications/${publicationId}`);
    return response.data;
  } catch (error) {
    console.error("删除出版物失败:", error);
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
