import api from './api';
export const orderService = {
  create: (shippingData) => api.post('/orders', shippingData),
  getMyOrders: () => api.get('/orders/me'),
  getMyBooks: () => api.get('/orders/my-books'),
  uploadProof: (id, paymentProofUrl) => api.patch(`/orders/${id}/proof`, { paymentProofUrl }),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  confirmPayment: (id) => api.post(`/orders/${id}/confirm-payment`),
};
