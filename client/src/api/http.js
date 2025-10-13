import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// API methods
export const api = {
  // Auth
  auth: {
    register: (data) => http.post('/auth/register', data),
    login: (data) => http.post('/auth/login', data),
    getMe: () => http.get('/auth/me'),
  },
  
  // Users
  users: {
    getAll: (params) => http.get('/users', { params }),
    getById: (id) => http.get(`/users/${id}`),
    update: (id, data) => http.put(`/users/${id}`, data),
    delete: (id) => http.delete(`/users/${id}`),
  },
  
  // Categories
  categories: {
    getAll: (params) => http.get('/categories', { params }),
    getById: (id) => http.get(`/categories/${id}`),
    create: (data) => http.post('/categories', data),
    update: (id, data) => http.put(`/categories/${id}`, data),
    delete: (id) => http.delete(`/categories/${id}`),
  },
  
  // Navigation
  navigation: {
    get: (name = 'main') => http.get(`/navigation/${name}`),
    update: (name, data) => http.put(`/navigation/${name}`, data),
  },
  
  // Articles
  articles: {
    search: (params) => http.get('/articles/search', { params }),
    getAll: (params) => http.get('/articles', { params }),
    getById: (id) => http.get(`/articles/${id}`),
    incrementView: (id) => http.post(`/articles/${id}/view`),
    create: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if ((key === 'tags' || key === 'sources') && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      return http.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    update: (id, data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if ((key === 'tags' || key === 'sources') && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      return http.put(`/articles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    delete: (id) => http.delete(`/articles/${id}`),
  },
  
  // Comments
  comments: {
    getByArticle: (articleId) => http.get(`/articles/${articleId}/comments`),
    create: (articleId, data) => http.post(`/articles/${articleId}/comments`, data),
    delete: (articleId, commentId) => http.delete(`/articles/${articleId}/comments/${commentId}`),
  },
};

export default http;

