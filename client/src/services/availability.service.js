import api from './api';

export const availabilityService = {
  getByDate: (date) => api.get(`/availability?date=${date}`),
  getByMonth: (year, month) => api.get(`/availability/month?year=${year}&month=${month}`),
  create: (data) => api.post('/availability', data),
  createBulk: (slots) => api.post('/availability/bulk', { slots }),
  remove: (id) => api.delete(`/availability/${id}`),
};
