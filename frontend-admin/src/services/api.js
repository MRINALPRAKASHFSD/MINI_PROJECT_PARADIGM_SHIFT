import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5050/api' 
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('admin-auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch (e) {
        // ignore parse errors
      }
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
      localStorage.removeItem('admin-auth-storage');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
