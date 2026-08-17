import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const userController = {
  async getAll(req, res, next) {
    try {
      const result = await userService.getAll();
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await userService.getById(req.params.id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async updateRole(req, res, next) {
    try {
      const result = await userService.updateRole(req.params.id, req.body.role);
      return successResponse(res, result, 'Rol actualizado');
    } catch (error) {
      next(error);
    }
  },

  async toggleActive(req, res, next) {
    try {
      const result = await userService.toggleActive(req.params.id);
      return successResponse(res, result, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  },
};
