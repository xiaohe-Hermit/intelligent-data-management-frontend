// src/services/registerApi.js
import axios from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://127.0.0.1:7001",
});

// 请求拦截器：在每次请求的头部添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dm-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 检查用户名和手机号是否可用
 * @param {string} username 用户名
 * @param {string} phone 手机号
 * @returns {Promise<Object>} 返回一个Promise对象，包含可用性检查结果
 */
export const checkUsernameAndPhoneAvailability = async (username, phone) => {
  try {
    const response = await api.get("/check-availability", {
      params: { username, phone },
    });
    const { code, message, data } = response.data;
    if (code === 200) {
      let available = false;
      let msg = "";

      if (data.isUsernameAvailable && data.isPhoneAvailable) {
        available = true;
        msg = "用户名和手机号可用";
      } else if (!data.isUsernameAvailable && data.isPhoneAvailable) {
        msg = "用户名已存在";
      } else if (data.isUsernameAvailable && !data.isPhoneAvailable) {
        msg = "手机号已存在";
      } else {
        msg = "用户名和手机号都已存在";
      }

      return { available, message: msg };
    } else {
      return { available: false, message: message || "检查失败，请稍后重试" };
    }
  } catch (error) {
    console.error("检查用户名和手机号可用性失败:", error);
    throw error.response ? error.response.data : error.message; // 抛出错误信息
  }
};

/**
 * 注册用户
 * @param {string} username 用户名
 * @param {string} phone 手机号
 * @param {string} password 密码
 * @returns {Promise<Object>} 返回一个Promise对象，包含注册结果
 */
export const register = async (username, phone, password) => {
  try {
    const response = await api.post("/user/register", {
      name: username,
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("注册失败:", error);
    throw error.response ? error.response.data : error.message; // 抛出错误信息
  }
};
