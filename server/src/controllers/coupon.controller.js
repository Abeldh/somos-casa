import { couponService } from '../services/coupon.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const couponController = {
  async getAll(req, res, next) {
    try { return successResponse(res, await couponService.getAll()); } catch (e) { next(e); }
  },

  async getById(req, res, next) {
    try { return successResponse(res, await couponService.getById(req.params.id)); } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { code, type, value, appliesTo, minPurchase, maxDiscount, maxUses, startsAt, expiresAt } = req.body;
      if (!code || !type || value === undefined) return res.status(400).json({ success: false, message: 'Código, tipo y valor son requeridos' });
      return createdResponse(res, await couponService.create({ code, type, value, appliesTo, minPurchase, maxDiscount, maxUses, startsAt, expiresAt }));
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try { return successResponse(res, await couponService.update(req.params.id, req.body)); } catch (e) { next(e); }
  },

  async validate(req, res, next) {
    try {
      const { code, subtotal } = req.body;
      if (!code) return res.status(400).json({ success: false, message: 'Código es requerido' });
      return successResponse(res, await couponService.validate(code, req.user.id, subtotal || 0));
    } catch (e) { next(e); }
  },

  async delete(req, res, next) {
    try { return successResponse(res, await couponService.delete(req.params.id)); } catch (e) { next(e); }
  },
};
