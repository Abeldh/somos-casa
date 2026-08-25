import { appointmentService } from '../services/appointment.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const appointmentController = {
  async create(req, res, next) {
    try {
      const { date, startTime, endTime, partnerName, reason, notes } = req.body;
      const result = await appointmentService.create({ userId: req.user.id, date, startTime, endTime, partnerName, reason, notes });
      return createdResponse(res, result, 'Cita agendada exitosamente');
    } catch (error) { next(error); }
  },

  async getMyAppointments(req, res, next) {
    try { return successResponse(res, await appointmentService.getByUser(req.user.id)); }
    catch (error) { next(error); }
  },

  async getAll(req, res, next) {
    try { return successResponse(res, await appointmentService.getAll({ status: req.query.status })); }
    catch (error) { next(error); }
  },

  async updateStatus(req, res, next) {
    try { return successResponse(res, await appointmentService.updateStatus(req.params.id, req.body.status), 'Estado actualizado'); }
    catch (error) { next(error); }
  },

  async setZoomUrl(req, res, next) {
    try {
      const { zoomUrl } = req.body;
      if (!zoomUrl) return res.status(400).json({ success: false, message: 'URL de Zoom requerida' });
      return successResponse(res, await appointmentService.setZoomUrl(req.params.id, zoomUrl), 'URL de Zoom agregada');
    } catch (error) { next(error); }
  },

  async releaseSessions(req, res, next) {
    try {
      const { userId, sessions } = req.body;
      if (!userId) return res.status(400).json({ success: false, message: 'userId requerido' });
      return successResponse(res, await appointmentService.releaseSessions(userId, sessions || 4, req), 'Sesiones liberadas');
    } catch (error) { next(error); }
  },

  async cancel(req, res, next) {
    try { return successResponse(res, await appointmentService.cancel(req.params.id, req.user.id), 'Cita cancelada'); }
    catch (error) { next(error); }
  },

  async reschedule(req, res, next) {
    try {
      const { date, startTime, endTime } = req.body;
      return successResponse(res, await appointmentService.reschedule(req.params.id, req.user.id, { date, startTime, endTime }), 'Cita reprogramada');
    } catch (error) { next(error); }
  },
};
