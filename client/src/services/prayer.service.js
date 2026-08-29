import api from './api';

export const prayerService = {
  // Público / usuario
  create: (data) => api.post('/prayers', data),
  getWall: () => api.get('/prayers/wall'),
  getMine: (page = 1, limit = 10) => api.get('/prayers/mine', { params: { page, limit } }),
  // Admin
  getAll: (status, page = 1, limit = 10) => api.get('/prayers', { params: { status, page, limit } }),
  markPrayed: (id) => api.patch(`/prayers/${id}/prayed`),
  archive: (id) => api.patch(`/prayers/${id}/archive`),
  remove: (id) => api.delete(`/prayers/${id}`),
};
