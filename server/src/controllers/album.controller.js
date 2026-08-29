import { albumService } from '../services/album.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const albumController = {
  async getApproved(req, res, next) {
    try { return successResponse(res, await albumService.getApproved()); } catch (e) { next(e); }
  },

  async getMine(req, res, next) {
    try { return successResponse(res, await albumService.getMine(req.user.id)); } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { coupleName, message, photoUrl } = req.body;
      if (!coupleName || !message || !photoUrl) {
        return res.status(400).json({ success: false, message: 'Nombre, mensaje y foto son requeridos' });
      }
      return createdResponse(
        res,
        await albumService.create(req.user.id, { coupleName, message, photoUrl }),
        'Foto enviada. Será revisada por el administrador antes de publicarse.'
      );
    } catch (e) { next(e); }
  },

  // Admin
  async getAll(req, res, next) {
    try { return successResponse(res, await albumService.getAll()); } catch (e) { next(e); }
  },

  async toggleApproval(req, res, next) {
    try { return successResponse(res, await albumService.toggleApproval(req.params.id)); } catch (e) { next(e); }
  },

  async remove(req, res, next) {
    try { return successResponse(res, await albumService.remove(req.params.id)); } catch (e) { next(e); }
  },
};
