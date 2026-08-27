import { referralService } from '../services/referral.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const referralController = {
  async getMyCode(req, res, next) {
    try { return successResponse(res, await referralService.getMyReferralCode(req.user.id)); } catch (e) { next(e); }
  },

  async getMyReferrals(req, res, next) {
    try { return successResponse(res, await referralService.getMyReferrals(req.user.id)); } catch (e) { next(e); }
  },

  // Admin
  async getStats(req, res, next) {
    try { return successResponse(res, await referralService.getStats()); } catch (e) { next(e); }
  },
};
