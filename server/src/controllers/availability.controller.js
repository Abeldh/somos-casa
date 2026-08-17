import { availabilityService } from '../services/availability.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const availabilityController = {
  async getByDate(req, res, next) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ success: false, message: 'Parámetro date es requerido' });
      }
      const result = await availabilityService.getByDate(date);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getByMonth(req, res, next) {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ success: false, message: 'Parámetros year y month son requeridos' });
      }
      const result = await availabilityService.getByMonth(parseInt(year), parseInt(month));
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { date, startTime, endTime } = req.body;
      const result = await availabilityService.create({ date, startTime, endTime });
      return createdResponse(res, result, 'Horario creado');
    } catch (error) {
      next(error);
    }
  },

  async createBulk(req, res, next) {
    try {
      const { slots } = req.body;
      const result = await availabilityService.createBulk(slots);
      return createdResponse(res, result, `${result.count} horarios creados`);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await availabilityService.remove(req.params.id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },
};
