import { orderService } from '../services/order.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const orderController = {
  async create(req, res, next) { try { return createdResponse(res, await orderService.create(req.user.id, req.body), 'Orden creada'); } catch (e) { next(e); } },
  async getMyOrders(req, res, next) { try { return successResponse(res, await orderService.getByUser(req.user.id)); } catch (e) { next(e); } },
  async getMyBooks(req, res, next) { try { return successResponse(res, await orderService.getMyBooks(req.user.id)); } catch (e) { next(e); } },
  async getById(req, res, next) { try { return successResponse(res, await orderService.getById(req.params.id, req.user.id)); } catch (e) { next(e); } },
  async getAll(req, res, next) { try { return successResponse(res, await orderService.getAll(req.query.status)); } catch (e) { next(e); } },
  async updateStatus(req, res, next) { try { return successResponse(res, await orderService.updateStatus(req.params.id, req.body.status), 'Actualizado'); } catch (e) { next(e); } },
  async confirmPayment(req, res, next) { try { return successResponse(res, await orderService.confirmPayment(req.params.id, req), 'Pago confirmado. Libro liberado para descarga.'); } catch (e) { next(e); } },
};
