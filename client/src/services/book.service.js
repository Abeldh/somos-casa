import api from './api';
export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getBySlug: (slug) => api.get(`/books/${slug}`),
  getCategories: () => api.get('/books/categories'),
  getFeatured: () => api.get('/books/featured'),
  getAllAdmin: () => api.get('/books/admin/all'),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  remove: (id) => api.delete(`/books/${id}`),
  toggleFeatured: (id) => api.patch(`/books/${id}/featured`),
};
