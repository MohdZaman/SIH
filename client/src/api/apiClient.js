import axios from 'axios';
import { getTokenCookie } from '../utils/cookieUtils';

// Normalize BASE_URL so that:
// 1. If VITE_API_URL is configured in .env, use it.
// 2. Default to 'https://sih-five-eta.vercel.app/api'.
// 3. Ensure trailing /api is included so endpoints like '/procurement' or '/chat' resolve correctly to '/api/procurement', '/api/chat', etc.
const resolveBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://sih-five-eta.vercel.app/api';
  url = url.trim().replace(/\/+$/, '');
  // If user enters 'https://sih-five-eta.vercel.app' without '/api', append '/api'
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

export const BASE_URL = resolveBaseUrl();

// Create Axios instance with cookie credentials enabled
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token from cookie
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error connecting to backend',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const apiClient = {
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, data, config) => axiosInstance.post(url, data, config),
  put: (url, data, config) => axiosInstance.put(url, data, config),
  delete: (url, config) => axiosInstance.delete(url, config),
  patch: (url, data, config) => axiosInstance.patch(url, data, config),
};

export default apiClient;