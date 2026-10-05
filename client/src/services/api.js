import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error message formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, can notify AuthContext
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // Auth session expired
      }
    }
    return Promise.reject(error);
  }
);

export default api;
