import api from './api';

export const blogService = {
  // Público
  getPublished: () => api.get('/blog/published'),
  getBySlug: (slug) => api.get(`/blog/slug/${slug}`),
  // Admin
  getAll: () => api.get('/blog'),
  getById: (id) => api.get(`/blog/${id}`),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.patch(`/blog/${id}`, data),
  remove: (id) => api.delete(`/blog/${id}`),
};
