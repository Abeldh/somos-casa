import { mediaService } from '../services/media.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const mediaController = {
  async getAll(req, res, next) {
    try {
      const { type } = req.query;
      const result = await mediaService.getAll(type);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getActive(req, res, next) {
    try {
      const { type } = req.query;
      const result = await mediaService.getActive(type);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { type, title, url, description, category, thumbnail } = req.body;
      const result = await mediaService.create({ type, title, url, description, category, thumbnail });
      return createdResponse(res, result, 'Contenido agregado');
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await mediaService.update(req.params.id, req.body);
      return successResponse(res, result, 'Contenido actualizado');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await mediaService.remove(req.params.id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async reorder(req, res, next) {
    try {
      const { items } = req.body;
      const result = await mediaService.reorder(items);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },
};
