import axios from 'axios';

// Use tunnel URL when running on Vercel, localhost for local dev
const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
const API_URL = isProduction
  ? 'https://paradigmshift-backend.loca.lt/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5050/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Try localStorage first (set during login)
    let token = localStorage.getItem('token');
    // Fallback: read from Zustand persist
    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        }
      } catch (e) { /* ignore */ }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;