import { authService } from '../services/auth.service.js';
import { emailService } from '../services/email.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
      const result = await authService.register({ firstName, lastName, email, phone, password });

      emailService.sendWelcome({ to: email, firstName });

      return createdResponse(res, result, 'Registro exitoso');
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return successResponse(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const result = await authService.getMe(req.user.id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },
};
