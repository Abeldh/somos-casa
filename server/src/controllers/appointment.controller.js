import { appointmentService } from '../services/appointment.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const appointmentController = {
  async create(req, res, next) {
    try {
      const { date, startTime, endTime, partnerName, reason, notes } = req.body;
      const result = await appointmentService.create({
        userId: req.user.id,
        date,
        startTime,
        endTime,
        partnerName,
        reason,
        notes,
      });
      return createdResponse(res, result, 'Cita agendada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getMyAppointments(req, res, next) {
    try {
      const result = await appointmentService.getByUser(req.user.id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const { status } = req.query;
      const result = await appointmentService.getAll({ status });
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const result = await appointmentService.updateStatus(req.params.id, status);
      return successResponse(res, result, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  },

  async cancel(req, res, next) {
    try {
      const result = await appointmentService.cancel(req.params.id, req.user.id);
      return successResponse(res, result, 'Cita cancelada');
    } catch (error) {
      next(error);
    }
  },

  async reschedule(req, res, next) {
    try {
      const { date, startTime, endTime } = req.body;
      const result = await appointmentService.reschedule(req.params.id, req.user.id, { date, startTime, endTime });
      return successResponse(res, result, 'Cita reprogramada');
    } catch (error) {
      next(error);
    }
  },
};
