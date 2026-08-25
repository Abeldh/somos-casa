import api from './api';

export const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/me'),
  getAll: (params) => api.get('/appointments', { params }),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  reschedule: (id, data) => api.patch(`/appointments/${id}/reschedule`, data),
  setZoomUrl: (id, zoomUrl) => api.patch(`/appointments/${id}/zoom`, { zoomUrl }),
  releaseSessions: (userId, sessions = 4) => api.post('/appointments/release-sessions', { userId, sessions }),
  uploadSessionProof: (paymentProofUrl) => api.patch('/appointments/session-proof', { paymentProofUrl }),
};
