import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL =
  window._env_?.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const getUserProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const submitReport = async (reportData) => {
  const response = await apiClient.post('/reports', reportData);
  return response.data;
};

export const getUserReports = async () => {
  const response = await apiClient.get('/reports');
  return response.data;
};

export const getPublicReports = async (limit = 100) => {
  const response = await apiClient.get('/reports/public', {
    params: { limit }
  });
  return response.data;
};

export const updateReport = async (reportId, updates) => {
  const response = await apiClient.put(`/reports/${reportId}`, updates);
  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await apiClient.delete(`/reports/${reportId}`);
  return response.data;
};

export default apiClient;
