import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:7001', // 示例 API
});

// 请求拦截器：在每次请求的头部添加 token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('dm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

export const getInfom = () => api.get('/');
export const getUsers = () => api.get('/user');
// 登录接口
export const login = async (name, password) => {
    try {        
      const response = await api.post('/user/login', {
        name,
        password,
      });
      return response.data; // 返回后端响应的数据
    } catch (error) {
      throw error.response ? error.response.data : error.message; // 抛出错误信息
    }
  };