import { authService } from '../services/auth.service.js';
import { mfaService } from '../services/mfa.service.js';
import { emailService } from '../services/email.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
      const result = await authService.register({ firstName, lastName, email, phone, password }, req);
      emailService.sendWelcome({ to: email, firstName });
      return createdResponse(res, result, 'Registro exitoso');
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password, mfaCode } = req.body;
      const result = await authService.login({ email, password, mfaCode }, req);
      return successResponse(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token requerido' });
      }
      const result = await authService.refresh(refreshToken, req);
      return successResponse(res, result, 'Token renovado');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user.id, req);
      return successResponse(res, result);
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

  // MFA endpoints
  async mfaSetup(req, res, next) {
    try {
      const result = await mfaService.generateSecret(req.user.id);
      return successResponse(res, result, 'Escanea el QR con tu app de autenticación');
    } catch (error) {
      next(error);
    }
  },

  async mfaVerify(req, res, next) {
    try {
      const { code } = req.body;
      if (!code || code.length !== 6) {
        return res.status(400).json({ success: false, message: 'Código de 6 dígitos requerido' });
      }
      const result = await mfaService.verifyAndEnable(req.user.id, code, req);
      return successResponse(res, result, 'MFA activado correctamente');
    } catch (error) {
      next(error);
    }
  },

  async mfaDisable(req, res, next) {
    try {
      const { code } = req.body;
      if (!code || code.length !== 6) {
        return res.status(400).json({ success: false, message: 'Código de 6 dígitos requerido' });
      }
      const result = await mfaService.disable(req.user.id, code, req);
      return successResponse(res, result, 'MFA desactivado');
    } catch (error) {
      next(error);
    }
  },

  async mfaStatus(req, res, next) {
    try {
      const enabled = await mfaService.hasMfa(req.user.id);
      return successResponse(res, { mfaEnabled: enabled });
    } catch (error) {
      next(error);
    }
  },
};
