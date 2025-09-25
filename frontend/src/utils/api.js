import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Attach token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle 401 errors here, but do not redirect to prevent reload loop
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.token) {
      localStorage.setItem('token', res.data.data.token);
    }
    return res;
  },
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    if (res.data?.data?.token) {
      localStorage.setItem('token', res.data.data.token);
    }
    return res;
  },
  logout: async () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  getMe: () => api.get('/auth/me'),
};

// Issues API
export const issuesAPI = {
  getIssues: (params) => api.get('/issues', { params }),
  getIssue: (id) => api.get(`/issues/${id}`),
  createIssue: (data) => api.post('/issues', data),
  voteIssue: (id, vote) => api.post(`/issues/${id}/vote`, { vote }),
  addComment: (id, text) => api.post(`/issues/${id}/comments`, { text }),
  getStats: () => api.get('/issues/stats'),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/issues/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Admin API
export const adminAPI = {
  getIssues: (params) => api.get('/admin/issues', { params }),
  updateStatus: (id, data) => api.patch(`/admin/issues/${id}/status`, data),
  assignIssue: (id, data) => api.patch(`/admin/issues/${id}/assign`, data),
  getStats: () => api.get('/admin/stats'),
};

// Users API
export const usersAPI = {
  getAuthorities: () => api.get('/users/authorities'),
};

export default api;