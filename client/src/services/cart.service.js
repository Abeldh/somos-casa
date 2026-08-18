import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (bookId, quantity = 1) => api.post('/cart/items', { bookId, quantity }),
  updateQuantity: (itemId, quantity) => api.patch(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
