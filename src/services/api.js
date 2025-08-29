import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const superadminAPI = {
  getPendingAdmins: () => api.get('/superadmin/pending-admins'),
  getAdmins: () => api.get('/superadmin/admins'),
  getPromotableUsers: () => api.get('/superadmin/promotable-users'),
  approveAdmin: (userId) => api.post(`/superadmin/approve-admin/${userId}`),
  rejectAdmin: (userId) => api.post(`/superadmin/reject-admin/${userId}`),
  revokeAdmin: (userId) => api.post(`/superadmin/revoke-admin/${userId}`),
  promoteToAdmin: (userId) => api.post(`/superadmin/promote-to-admin/${userId}`),
  getStats: () => api.get('/superadmin/stats'),
};

export const excelAPI = {
  uploadFile: (formData) => api.post('/excel/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFiles: () => api.get('/excel/files'),
  getAllFiles: () => api.get('/excel/files/all'),
  getFile: (id) => api.get(`/excel/files/${id}`),
  deleteFile: (id) => api.delete(`/excel/files/${id}`),
  analyzeFile: (id) => api.get(`/excel/files/${id}/analyze`),
};

export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  getUsersWithFiles: () => api.get('/users/with-files'),
  getUserDetails: (id) => api.get(`/users/${id}/details`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  getUserStats: () => api.get('/users/stats/overview'),
};

export default api;
