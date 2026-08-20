import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const userController = {
  async getAll(req, res, next) { try { return successResponse(res, await userService.getAll()); } catch (e) { next(e); } },
  async getById(req, res, next) { try { return successResponse(res, await userService.getById(req.params.id)); } catch (e) { next(e); } },
  async getActivity(req, res, next) { try { return successResponse(res, await userService.getUserActivity(req.params.id)); } catch (e) { next(e); } },
  async updateRole(req, res, next) { try { return successResponse(res, await userService.updateRole(req.params.id, req.body.role), 'Rol actualizado'); } catch (e) { next(e); } },
  async toggleActive(req, res, next) { try { return successResponse(res, await userService.toggleActive(req.params.id), 'Estado actualizado'); } catch (e) { next(e); } },
};
