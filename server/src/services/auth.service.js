import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { createTokenPair, rotateRefreshToken, revokeAllTokens } from './token.service.js';
import { mfaService } from './mfa.service.js';
import { audit, EVENTS } from '../utils/auditLog.js';

export const authService = {
  async register({ firstName, lastName, email, phone, password }, req = null) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const error = new Error('El email ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, phone, password: hashed },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const tokens = await createTokenPair(user);
    await audit(EVENTS.REGISTER, { userId: user.id, detail: `Registered: ${email}`, req });

    return { user, ...tokens };
  },

  async login({ email, password, mfaCode }, req = null) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      await audit(EVENTS.LOGIN_FAILED, { detail: `Failed login: ${email}`, req });
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 401;
      throw error;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      await audit(EVENTS.LOGIN_FAILED, { userId: user.id, detail: 'Invalid password', req });
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 401;
      throw error;
    }

    // Verificar MFA si está activo
    const hasMfa = await mfaService.hasMfa(user.id);
    if (hasMfa) {
      if (!mfaCode) {
        // Primer paso: credenciales OK pero falta MFA
        return { requireMfa: true, userId: user.id };
      }
      const mfaValid = await mfaService.validateLogin(user.id, mfaCode, req);
      if (!mfaValid) {
        const error = new Error('Código MFA inválido');
        error.statusCode = 401;
        throw error;
      }
    }

    const { password: _, ...userWithoutPassword } = user;
    const tokens = await createTokenPair(userWithoutPassword);

    await audit(EVENTS.LOGIN_SUCCESS, { userId: user.id, req });

    return { user: userWithoutPassword, ...tokens };
  },

  async refresh(refreshToken, req = null) {
    const result = await rotateRefreshToken(refreshToken, req);
    return result;
  },

  async logout(userId, req = null) {
    await revokeAllTokens(userId);
    await audit(EVENTS.LOGOUT, { userId, req });
    return { message: 'Sesión cerrada' };
  },

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const hasMfa = await mfaService.hasMfa(userId);
    return { user: { ...user, mfaEnabled: hasMfa } };
  },

  async changePassword(userId, { currentPassword, newPassword }, req = null) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { const e = new Error('Usuario no encontrado'); e.statusCode = 404; throw e; }

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) { const e = new Error('La contraseña actual es incorrecta'); e.statusCode = 401; throw e; }

    if (newPassword.length < 8) { const e = new Error('La nueva contraseña debe tener mínimo 8 caracteres'); e.statusCode = 422; throw e; }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    // Revocar todos los refresh tokens (forzar re-login en otros dispositivos)
    await revokeAllTokens(userId);

    await audit(EVENTS.LOGIN_SUCCESS, { userId, detail: 'Password changed', req });

    return { message: 'Contraseña actualizada correctamente' };
  },
};
