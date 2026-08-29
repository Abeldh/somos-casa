import api from './api';

export const albumService = {
  // Público
  getApproved: () => api.get('/album/approved'),
  // Usuario
  getMine: () => api.get('/album/mine'),
  create: (data) => api.post('/album', data),
  // Admin
  getAll: () => api.get('/album'),
  toggleApproval: (id) => api.patch(`/album/${id}/toggle`),
  remove: (id) => api.delete(`/album/${id}`),
};
