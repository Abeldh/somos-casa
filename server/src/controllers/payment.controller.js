import { paymentService } from '../services/payment.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const paymentController = {
  async getMyPayments(req, res, next) {
    try { return successResponse(res, await paymentService.getByUser(req.user.id)); } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { type, method, amount, reference, orderId, proofUrl, notes } = req.body;
      return createdResponse(res, await paymentService.create({ userId: req.user.id, type, method, amount, reference, orderId, proofUrl, notes }));
    } catch (e) { next(e); }
  },

  // Admin
  async getAll(req, res, next) {
    try { return successResponse(res, await paymentService.getAll({ status: req.query.status, type: req.query.type, page: req.query.page, limit: req.query.limit })); } catch (e) { next(e); }
  },

  async verify(req, res, next) {
    try { return successResponse(res, await paymentService.verify(req.params.id, req.user.id), 'Pago verificado'); } catch (e) { next(e); }
  },

  async reject(req, res, next) {
    try { return successResponse(res, await paymentService.reject(req.params.id, req.user.id, req.body.rejectionNote), 'Pago rechazado'); } catch (e) { next(e); }
  },

  async getSummary(req, res, next) {
    try { return successResponse(res, await paymentService.getSummary()); } catch (e) { next(e); }
  },
};
