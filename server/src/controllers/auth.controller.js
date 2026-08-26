import { authService } from '../services/auth.service.js';
import { mfaService } from '../services/mfa.service.js';
import { emailService } from '../services/email.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

const isProduction = process.env.NODE_ENV === 'production';

// Cookie options para refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,          // No accesible desde JavaScript (protege contra XSS)
  secure: isProduction,    // Solo HTTPS en producción
  sameSite: 'Strict',      // No se envía en requests cross-site
  path: '/api/auth',       // Solo se envía a rutas de auth
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
};

function setAuthCookies(res, { accessToken, refreshToken }) {
  // Access token en cookie httpOnly (corta duración)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Strict',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutos
  });
  // Refresh token en cookie httpOnly (larga duración)
  res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
}

function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth' });
}

export const authController = {
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
      const result = await authService.register({ firstName, lastName, email, phone, password }, req);
      emailService.sendWelcome({ to: email, firstName });

      setAuthCookies(res, result);
      return createdResponse(res, { user: result.user, accessToken: result.accessToken }, 'Registro exitoso');
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password, mfaCode } = req.body;
      const result = await authService.login({ email, password, mfaCode }, req);

      // Si requiere MFA, no setear cookies aún
      if (result.requireMfa) {
        return successResponse(res, result);
      }

      setAuthCookies(res, result);
      return successResponse(res, { user: result.user, accessToken: result.accessToken }, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      // Leer refresh token de cookie O del body (compatibilidad)
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token requerido' });
      }
      const result = await authService.refresh(refreshToken, req);

      setAuthCookies(res, result);
      return successResponse(res, { user: result.user, accessToken: result.accessToken }, 'Token renovado');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user.id, req);
      clearAuthCookies(res);
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

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Contraseña actual y nueva son requeridas' });
      }
      const result = await authService.changePassword(req.user.id, { currentPassword, newPassword }, req);
      clearAuthCookies(res);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // Forgot password (público, rate limited)
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: 'Email requerido' });
      const { passwordResetService } = await import('../services/passwordReset.service.js');
      const result = await passwordResetService.forgotPassword(email, req);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // Reset password con token (público)
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const { passwordResetService } = await import('../services/passwordReset.service.js');
      const result = await passwordResetService.resetPassword(token, newPassword, req);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // MFA
  async mfaSetup(req, res, next) { try { return successResponse(res, await mfaService.generateSecret(req.user.id), 'Escanea el QR con tu app'); } catch (e) { next(e); } },
  async mfaVerify(req, res, next) { try { const { code } = req.body; if (!code || code.length !== 6) return res.status(400).json({ success: false, message: 'Código de 6 dígitos requerido' }); return successResponse(res, await mfaService.verifyAndEnable(req.user.id, code, req), 'MFA activado'); } catch (e) { next(e); } },
  async mfaDisable(req, res, next) { try { const { code } = req.body; if (!code || code.length !== 6) return res.status(400).json({ success: false, message: 'Código requerido' }); return successResponse(res, await mfaService.disable(req.user.id, code, req), 'MFA desactivado'); } catch (e) { next(e); } },
  async mfaStatus(req, res, next) { try { return successResponse(res, { mfaEnabled: await mfaService.hasMfa(req.user.id) }); } catch (e) { next(e); } },
};
