import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // Enviar cookies httpOnly en cada request
});

// Flag para evitar loops de refresh
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.request.use((config) => {
  // Compatibilidad: si hay token en localStorage, enviarlo en header
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const data = error.response?.data;

    // Si es 401 y NO es refresh/login → intentar refresh automático
    if (status === 401 && !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/register')) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // El refresh token se envía automáticamente via cookie httpOnly
          // También enviamos el de localStorage como fallback
          const refreshToken = localStorage.getItem('refreshToken');
          const res = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            refreshToken ? { refreshToken } : {},
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true, // Importante: enviar cookies
            }
          );

          const newToken = res.data.accessToken;
          if (newToken) {
            localStorage.setItem('token', newToken);
          }
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }

          isRefreshing = false;
          onRefreshed(newToken);

          // Reintentar request original con nuevo token
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          // Refresh falló → sesión expirada completamente
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject({ message: 'Sesión expirada. Inicia sesión de nuevo.' });
        }
      } else {
        // Ya hay un refresh en progreso, encolar este request
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
    }

    // Error normal (no 401)
    let message = data?.message || 'Error de conexión';
    if (status === 422 && data?.errors && Array.isArray(data.errors)) {
      message = data.errors.map((e) => e.message).join(' • ');
    }

    return Promise.reject({ message, status, errors: data?.errors });
  }
);

export default api;
