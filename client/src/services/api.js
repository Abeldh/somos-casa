import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    const status = error.response?.status;

    let message = data?.message || 'Error de conexión';

    // Si hay errores de validación (422), construir mensaje detallado
    if (status === 422 && data?.errors && Array.isArray(data.errors)) {
      message = data.errors.map((e) => e.message).join(' • ');
    }

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject({ message, status, errors: data?.errors });
  }
);

export default api;
