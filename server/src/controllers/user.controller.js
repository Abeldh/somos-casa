import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';
import { audit, EVENTS } from '../utils/auditLog.js';

export const userController = {
  async getAll(req, res, next) { try { return successResponse(res, await userService.getAll({ page: req.query.page, limit: req.query.limit })); } catch (e) { next(e); } },
  async getById(req, res, next) { try { return successResponse(res, await userService.getById(req.params.id)); } catch (e) { next(e); } },
  async getActivity(req, res, next) { try { return successResponse(res, await userService.getUserActivity(req.params.id)); } catch (e) { next(e); } },
  async updateRole(req, res, next) { try { return successResponse(res, await userService.updateRole(req.params.id, req.body.role), 'Rol actualizado'); } catch (e) { next(e); } },
  async toggleActive(req, res, next) { try { return successResponse(res, await userService.toggleActive(req.params.id), 'Estado actualizado'); } catch (e) { next(e); } },
  async createAdmin(req, res, next) {
    try {
      const { firstName, lastName, email, password, phone, role } = req.body;
      if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, message: 'Nombre, apellido, email y contraseña son requeridos' });
      if (password.length < 8) return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
      const result = await userService.createAdmin({ firstName, lastName, email, password, phone, role }, req);
      return successResponse(res, result, result.user.role === 'ADMIN' ? 'Administrador creado' : 'Usuario creado');
    } catch (e) { next(e); }
  },
  async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const result = await userService.resetPassword(req.params.id, newPassword);
      // Auditoría: registra qué admin restableció la contraseña de qué usuario
      await audit(EVENTS.PASSWORD_CHANGED, {
        userId: req.user?.id,
        detail: `Admin ${req.user?.email} restableció la contraseña del usuario ${result.user.email}`,
        req,
      });
      return successResponse(res, { message: result.message }, 'Contraseña restablecida');
    } catch (e) { next(e); }
  },
};
