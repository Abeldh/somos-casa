import api from './api';

export const dashboardService = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getFinancial: (year, month) => api.get('/dashboard/financial', { params: { year, month } }),
  getRecentActivity: (limit = 10) => api.get('/dashboard/activity', { params: { limit } }),
  getSystemHealth: () => api.get('/dashboard/health'),
};
