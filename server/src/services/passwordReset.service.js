import crypto from 'crypto';
import prisma from '../config/database.js';
import { hashPassword } from '../utils/hashPassword.js';
import { isPasswordBreached } from '../utils/passwordCheck.js';
import { revokeAllTokens } from './token.service.js';
import { emailService } from './email.service.js';
import { audit, EVENTS } from '../utils/auditLog.js';

const TOKEN_EXPIRY_HOURS = 1;
const CLIENT_URL = process.env.CLIENT_URL || 'https://somos-casa-production.up.railway.app';

/**
 * Hashea el token de reset (no almacenamos el token plano en BD)
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const passwordResetService = {
  /**
   * Solicitar recuperación de contraseña
   * SIEMPRE responde con el mismo mensaje (previene enumeración de emails)
   */
  async forgotPassword(email, req = null) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Si el usuario no existe, respondemos igual (seguridad: no revelar si el email existe)
    if (!user || !user.isActive) {
      return { message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.' };
    }

    // Invalidar tokens anteriores no usados
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() }, // Marcar como "usados" para invalidarlos
    });

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Guardar HASH del token en BD (no el token plano)
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // Enviar email con link
    const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;
    emailService.sendPasswordReset({
      to: user.email,
      firstName: user.firstName,
      resetUrl,
      expiresIn: `${TOKEN_EXPIRY_HOURS} hora`,
    });

    await audit(EVENTS.PASSWORD_CHANGED, {
      userId: user.id,
      detail: 'Password reset requested',
      req,
    });

    return { message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.' };
  },

  /**
   * Resetear contraseña con token
   */
  async resetPassword(token, newPassword, req = null) {
    if (!token || !newPassword) {
      const e = new Error('Token y nueva contraseña son requeridos');
      e.statusCode = 400;
      throw e;
    }

    if (newPassword.length < 8) {
      const e = new Error('La contraseña debe tener mínimo 8 caracteres');
      e.statusCode = 422;
      throw e;
    }

    // Buscar token por hash
    const tokenHash = hashToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken) {
      const e = new Error('El enlace de recuperación es inválido o ya fue utilizado.');
      e.statusCode = 400;
      throw e;
    }

    // Verificar que no haya sido usado
    if (resetToken.usedAt) {
      const e = new Error('Este enlace ya fue utilizado. Solicita uno nuevo.');
      e.statusCode = 400;
      throw e;
    }

    // Verificar que no haya expirado
    if (new Date() > resetToken.expiresAt) {
      const e = new Error('El enlace ha expirado. Solicita uno nuevo (válido por 1 hora).');
      e.statusCode = 400;
      throw e;
    }

    // Verificar contraseña contra filtraciones conocidas
    const breach = await isPasswordBreached(newPassword);
    if (breach.breached) {
      const e = new Error('Esta contraseña ha sido expuesta en filtraciones. Elige otra más segura.');
      e.statusCode = 422;
      throw e;
    }

    // Hashear nueva contraseña
    const hashed = await hashPassword(newPassword);

    // Actualizar contraseña + marcar token como usado
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    // Revocar TODAS las sesiones (refresh tokens)
    await revokeAllTokens(resetToken.userId);

    await audit(EVENTS.PASSWORD_CHANGED, {
      userId: resetToken.userId,
      detail: 'Password reset completed via email link',
      req,
    });

    return { message: 'Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.' };
  },
};
