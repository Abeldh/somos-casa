import api from './api';

export const prayerService = {
  // Público / usuario
  create: (data) => api.post('/prayers', data),
  getWall: () => api.get('/prayers/wall'),
  getMine: () => api.get('/prayers/mine'),
  // Admin
  getAll: (status) => api.get('/prayers', { params: { status } }),
  markPrayed: (id) => api.patch(`/prayers/${id}/prayed`),
  archive: (id) => api.patch(`/prayers/${id}/archive`),
  remove: (id) => api.delete(`/prayers/${id}`),
};
