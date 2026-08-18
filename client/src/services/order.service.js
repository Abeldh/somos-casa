import api from './api';

export const orderService = {
  create: (shippingData) => api.post('/orders', shippingData),
  getMyOrders: () => api.get('/orders/me'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};
