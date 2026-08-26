import { testimonialService } from '../services/testimonial.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const testimonialController = {
  async getApproved(req, res, next) { try { return successResponse(res, await testimonialService.getApproved()); } catch (e) { next(e); } },
  async create(req, res, next) { try { const { name, text, rating } = req.body; if (!name || !text) return res.status(400).json({ success: false, message: 'Nombre y testimonio son requeridos' }); return createdResponse(res, await testimonialService.create(req.user.id, { name, text, rating }), 'Testimonio enviado. Será revisado por el administrador.'); } catch (e) { next(e); } },
  async getAll(req, res, next) { try { return successResponse(res, await testimonialService.getAll()); } catch (e) { next(e); } },
  async approve(req, res, next) { try { return successResponse(res, await testimonialService.approve(req.params.id), 'Aprobado'); } catch (e) { next(e); } },
  async toggleApproval(req, res, next) { try { return successResponse(res, await testimonialService.toggleApproval(req.params.id)); } catch (e) { next(e); } },
  async remove(req, res, next) { try { return successResponse(res, await testimonialService.remove(req.params.id)); } catch (e) { next(e); } },
};
