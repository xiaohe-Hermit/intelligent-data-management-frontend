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

export const uploadImg = async (formData) => {
  try {
    const response = await api.post("/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("上传图片成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("上传图片失败:", error);
    throw error;
  }
};

export const getImg = async (imageUrl) => {
  try {
    const imageData = {
      imageUrl: imageUrl
    }
    const response = await api.post("/image/get",imageData);
    console.log("获取图片成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("获取图片失败:", error);
    throw error;
  }
};