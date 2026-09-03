import axios from 'axios';

/**
 * Axios instance configured for TrustFlow API.
 * Base URL is read from the VITE_API_BASE_URL env variable,
 * defaulting to a local dev server. When the backend is ready,
 * set VITE_API_BASE_URL in .env and mock logic in the api files
 * can be removed — the interceptors remain unchanged.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[TrustFlow API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
