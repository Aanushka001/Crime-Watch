import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let accessToken = null;
let refreshRequest = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const register = async (credentials) => (await apiClient.post('/auth/register', credentials)).data;
export const login = async (credentials) => (await apiClient.post('/auth/login', credentials)).data;
export const googleLogin = async (credential) => (await apiClient.post('/auth/google', { credential })).data;
export const refreshSession = () => {
  if (!refreshRequest) {
    refreshRequest = apiClient.post('/auth/refresh')
      .then((response) => response.data)
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
};
export const logout = async () => (await apiClient.post('/auth/logout')).data;
export const getUserProfile = async () => (await apiClient.get('/auth/profile')).data;
export const submitReport = async (reportData) => (await apiClient.post('/reports', reportData)).data;
export const getUserReports = async () => (await apiClient.get('/reports')).data;
export const getPendingReports = async () => (await apiClient.get('/reports/moderation')).data;
export const getPublicReports = async (limit = 100, crimeType, center, radiusKm = 50) => (
  await apiClient.get('/reports/public', {
    params: {
      limit,
      ...(crimeType ? { crimeType } : {}),
      ...(center ? { latitude: center[0], longitude: center[1], radiusKm } : {})
    }
  })
).data;
export const updateReport = async (reportId, updates) => (
  await apiClient.patch(`/reports/${reportId}`, updates)
).data;
export const deleteReport = async (reportId) => (await apiClient.delete(`/reports/${reportId}`)).data;
export const moderateReport = async (reportId, decision) => (
  await apiClient.patch(`/reports/${reportId}/moderate`, decision)
).data;
export const getAnalytics = async () => (await apiClient.get('/analytics')).data;

export default apiClient;
