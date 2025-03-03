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

export const getSoftwareCopyrights = async () => {
  try {
    const response = await api.get("/software-copyrights");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取软件著作权失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createSoftwareCopyright = async (softwareCopyrightData) => {
  try {
    const response = await api.post("/software-copyrights", softwareCopyrightData);
    return response.data;
  } catch (error) {
    console.error("创建软件著作权失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSoftwareCopyright = async (softwareCopyrightId, softwareCopyrightData) => {
  try {    
    const response = await api.put(`/software-copyrights/${softwareCopyrightId}`, softwareCopyrightData);
    return response.data;
  } catch (error) {
    console.error("更新软件著作权失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteSoftwareCopyright = async (softwareCopyrightId) => {
  try {
    const response = await api.delete(`/software-copyrights/${softwareCopyrightId}`);
    return response.data;
  } catch (error) {
    console.error("删除软件著作权失败:", error);
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
