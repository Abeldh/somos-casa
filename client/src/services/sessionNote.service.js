import api from './api';

export const sessionNoteService = {
  getByAppointment: (appointmentId) => api.get(`/session-notes/appointment/${appointmentId}`),
  getByUser: (userId) => api.get(`/session-notes/user/${userId}`),
  create: (data) => api.post('/session-notes', data),
  update: (id, content) => api.patch(`/session-notes/${id}`, { content }),
  delete: (id) => api.delete(`/session-notes/${id}`),
};
