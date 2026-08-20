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

    // Si es 401 y NO es el endpoint de refresh/login → intentar refresh
    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject({ message: 'Sesión expirada' });
        }

        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newToken = res.data.accessToken;
          const newRefresh = res.data.refreshToken;

          localStorage.setItem('token', newToken);
          if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

          isRefreshing = false;
          onRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject({ message: 'Sesión expirada' });
        }
      } else {
        // Si ya está refrescando, encolar el request
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    // Error normal
    let message = data?.message || 'Error de conexión';
    if (status === 422 && data?.errors && Array.isArray(data.errors)) {
      message = data.errors.map((e) => e.message).join(' • ');
    }

    return Promise.reject({ message, status, errors: data?.errors });
  }
);

export default api;
