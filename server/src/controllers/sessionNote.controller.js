import { sessionNoteService } from '../services/sessionNote.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const sessionNoteController = {
  async getByAppointment(req, res, next) {
    try { return successResponse(res, await sessionNoteService.getByAppointment(req.params.appointmentId)); } catch (e) { next(e); }
  },

  async getByUser(req, res, next) {
    try { return successResponse(res, await sessionNoteService.getByUser(req.params.userId)); } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { appointmentId, content, isPrivate } = req.body;
      if (!appointmentId || !content) return res.status(400).json({ success: false, message: 'ID de cita y contenido son requeridos' });
      return createdResponse(res, await sessionNoteService.create({ appointmentId, adminId: req.user.id, content, isPrivate }));
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ success: false, message: 'Contenido es requerido' });
      return successResponse(res, await sessionNoteService.update(req.params.id, content));
    } catch (e) { next(e); }
  },

  async delete(req, res, next) {
    try { return successResponse(res, await sessionNoteService.delete(req.params.id)); } catch (e) { next(e); }
  },
};
