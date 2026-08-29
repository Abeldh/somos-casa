import { prayerService } from '../services/prayer.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const prayerController = {
  // Usuario autenticado o público: crear petición
  async create(req, res, next) {
    try {
      const { name, request, isPrivate } = req.body;
      if (!name || !request) return res.status(400).json({ success: false, message: 'Nombre y petición son requeridos' });
      const userId = req.user ? req.user.id : null;
      return createdResponse(
        res,
        await prayerService.create({ userId, name, request, isPrivate }),
        'Tu petición de oración fue recibida. Oraremos por ti.'
      );
    } catch (e) { next(e); }
  },

  async getMine(req, res, next) {
    try { return successResponse(res, await prayerService.getMine(req.user.id, { page: req.query.page, limit: req.query.limit })); } catch (e) { next(e); }
  },

  async getPublicWall(req, res, next) {
    try { return successResponse(res, await prayerService.getPublicWall()); } catch (e) { next(e); }
  },

  // Admin
  async getAll(req, res, next) {
    try { return successResponse(res, await prayerService.getAll({ status: req.query.status, page: req.query.page, limit: req.query.limit })); } catch (e) { next(e); }
  },
  async markPrayed(req, res, next) {
    try { return successResponse(res, await prayerService.markPrayed(req.params.id, req.user.id), 'Marcada como orada'); } catch (e) { next(e); }
  },
  async archive(req, res, next) {
    try { return successResponse(res, await prayerService.archive(req.params.id), 'Petición archivada'); } catch (e) { next(e); }
  },
  async remove(req, res, next) {
    try { return successResponse(res, await prayerService.remove(req.params.id)); } catch (e) { next(e); }
  },
};
