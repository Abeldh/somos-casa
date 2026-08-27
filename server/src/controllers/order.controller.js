import { orderService } from '../services/order.service.js';
import prisma from '../config/database.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const orderController = {
  async create(req, res, next) { try { return createdResponse(res, await orderService.create(req.user.id, req.body), 'Orden creada'); } catch (e) { next(e); } },
  async getMyOrders(req, res, next) { try { return successResponse(res, await orderService.getByUser(req.user.id)); } catch (e) { next(e); } },
  async getMyBooks(req, res, next) { try { return successResponse(res, await orderService.getMyBooks(req.user.id)); } catch (e) { next(e); } },
  async getById(req, res, next) { try { return successResponse(res, await orderService.getById(req.params.id, req.user.id)); } catch (e) { next(e); } },
  async getAll(req, res, next) { try { return successResponse(res, await orderService.getAll(req.query.status, req.query.page, req.query.limit)); } catch (e) { next(e); } },
  async updateStatus(req, res, next) { try { return successResponse(res, await orderService.updateStatus(req.params.id, req.body.status), 'Actualizado'); } catch (e) { next(e); } },
  async confirmPayment(req, res, next) { try { return successResponse(res, await orderService.confirmPayment(req.params.id, req), 'Pago confirmado'); } catch (e) { next(e); } },

  // Usuario sube comprobante de pago
  async uploadProof(req, res, next) {
    try {
      const { paymentProofUrl } = req.body;
      if (!paymentProofUrl) return res.status(400).json({ success: false, message: 'URL del comprobante requerida' });
      const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id } });
      if (!order) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
      await prisma.order.update({ where: { id: req.params.id }, data: { paymentProofUrl } });
      return successResponse(res, { message: 'Comprobante enviado exitosamente' });
    } catch (e) { next(e); }
  },
};
