import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const userController = {
  async getAll(req, res, next) { try { return successResponse(res, await userService.getAll()); } catch (e) { next(e); } },
  async getById(req, res, next) { try { return successResponse(res, await userService.getById(req.params.id)); } catch (e) { next(e); } },
  async getActivity(req, res, next) { try { return successResponse(res, await userService.getUserActivity(req.params.id)); } catch (e) { next(e); } },
  async updateRole(req, res, next) { try { return successResponse(res, await userService.updateRole(req.params.id, req.body.role), 'Rol actualizado'); } catch (e) { next(e); } },
  async toggleActive(req, res, next) { try { return successResponse(res, await userService.toggleActive(req.params.id), 'Estado actualizado'); } catch (e) { next(e); } },
  async createAdmin(req, res, next) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;
      if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, message: 'Nombre, apellido, email y contraseña son requeridos' });
      if (password.length < 8) return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
      return successResponse(res, await userService.createAdmin({ firstName, lastName, email, password, phone }), 'Administrador creado');
    } catch (e) { next(e); }
  },
};
