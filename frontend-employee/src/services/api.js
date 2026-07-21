import axios from 'axios';

// Production = Render cloud backend | Development = local backend
const isLocal = typeof window !== 'undefined' &&
  (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));

const API_URL = import.meta.env.VITE_API_URL ||
  (isLocal ? 'http://localhost:5050/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

const getStoredToken = () => {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        token = JSON.parse(authStorage)?.state?.token;
      }
    } catch {
      // ignore invalid persisted state
    }
  }
  return token;
};

const updateStoredToken = (token) => {
  if (!token) return;
  localStorage.setItem('token', token);
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return;
    const parsed = JSON.parse(authStorage);
    if (!parsed?.state) return;
    parsed.state.token = token;
    localStorage.setItem('auth-storage', JSON.stringify(parsed));
  } catch {
    // ignore invalid persisted state
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          if (data?.token) {
            updateStoredToken(data.token);
            if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = 'Bearer ' + data.token;
            return api(originalRequest);
          }
        } catch {
          // refresh failed; enforce logout below
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
