import api from './api';

export const referralService = {
  getMyCode: () => api.get('/referrals/my-code'),
  getMyReferrals: () => api.get('/referrals/my-referrals'),
  // Admin
  getStats: () => api.get('/referrals/stats'),
};
