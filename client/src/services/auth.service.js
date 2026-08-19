import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  // MFA
  mfaStatus: () => api.get('/auth/mfa/status'),
  mfaSetup: () => api.post('/auth/mfa/setup'),
  mfaVerify: (code) => api.post('/auth/mfa/verify', { code }),
  mfaDisable: (code) => api.post('/auth/mfa/disable', { code }),
};
