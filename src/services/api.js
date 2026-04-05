import axios from 'axios';

const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

const API_URL = isProduction 
  ? 'https://paradigmshift-backend.onrender.com/api'
  : 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true'
  },
});

// Request interceptor to add token
api.interceptors.request. use(
  (config) => {
    const token = localStorage. getItem('token');
    if (token) {
      config.headers. Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors. response.use(
  (response) => response,
  (error) => {
    if (error.response?. status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;