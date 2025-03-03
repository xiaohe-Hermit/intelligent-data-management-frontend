// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // 示例 API
});

export const getUsers = () => api.get('/users');
export const getProducts = () => api.get('/products');