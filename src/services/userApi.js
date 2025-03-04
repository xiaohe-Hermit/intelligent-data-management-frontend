import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:7001", // 示例 API
});

// 请求拦截器：在每次请求的头部添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dm-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getInfom = () => api.get("/");
export const getUsers = () => api.get("/user");

// 创建用户
export const createUser = (userData) => {
  return api.post("/user", userData);
};

// 更新用户信息
export const updateUser = (userId, userData) => {
  return api.put(`/user/${userId}`, userData);
};

// 删除用户
export const deleteUser = (userId) => {
  return api.delete(`/user/${userId}`);
};
// 登录接口
export const login = async (name, password) => {
  try {
    const response = await api.post("/user/login", {
      name,
      password,
    });
    return response.data; // 返回后端响应的数据
  } catch (error) {
    throw error.response ? error.response.data : error.message; // 抛出错误信息
  }
};

// 根据用户ID获取用户名
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

