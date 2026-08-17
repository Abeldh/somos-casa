import api from './api';

export const mediaService = {
  getAll: (type) => api.get('/media', { params: { type } }),
  getActive: (type) => api.get('/media/active', { params: { type } }),
  create: (data) => api.post('/media', data),
  update: (id, data) => api.put(`/media/${id}`, data),
  remove: (id) => api.delete(`/media/${id}`),
  reorder: (items) => api.patch('/media/reorder', { items }),
};
