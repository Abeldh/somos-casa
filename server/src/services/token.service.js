import crypto from 'crypto';
import prisma from '../config/database.js';
import { signToken, verifyToken } from '../config/jwt.js';
import { audit, EVENTS } from '../utils/auditLog.js';
import { emailService } from './email.service.js';

/**
 * Envía alerta de seguridad al admin
 */
async function sendSecurityAlert(userId, subject, detail) {
  try {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN', isActive: true }, select: { email: true } });
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
    for (const admin of admins) {
      emailService.sendSecurityAlert({ to: admin.email, subject, detail, affectedUser: user?.email || userId });
    }
  } catch (e) { console.error('[SECURITY ALERT] Error:', e.message); }
}

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutos

/**
 * Genera un access token corto (15 min)
 */
export function generateAccessToken(user) {
  return signToken(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_EXPIRY
  );
}

/**
 * Genera un refresh token opaco (random, almacenado en BD)
 * Cada refresh token pertenece a una "familia" para detectar reutilización
 */
async function generateRefreshToken(userId, family = null) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenFamily = family || crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { userId, token, family: tokenFamily, expiresAt },
  });

  return { token, family: tokenFamily };
}

/**
 * Crea un par access + refresh token para un usuario
 */
export async function createTokenPair(user) {
  const accessToken = generateAccessToken(user);
  const { token: refreshToken } = await generateRefreshToken(user.id);
  return { accessToken, refreshToken };
}

/**
 * Rota un refresh token: invalida el anterior, genera uno nuevo
 * Si el token ya fue usado (reutilización) → revoca TODA la familia (posible robo)
 */
export async function rotateRefreshToken(oldToken, req = null) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } });

  // Token no existe
  if (!stored) {
    const error = new Error('Refresh token inválido');
    error.statusCode = 401;
    throw error;
  }

  // Token ya fue revocado → POSIBLE ROBO: revocar toda la familia
  if (stored.isRevoked) {
    await prisma.refreshToken.updateMany({
      where: { family: stored.family },
      data: { isRevoked: true },
    });
    await audit(EVENTS.TOKEN_REUSE_DETECTED, {
      userId: stored.userId,
      detail: `Refresh token reuse detected. Family ${stored.family} revoked.`,
      req,
    });

    // Alerta al admin por email
    sendSecurityAlert(stored.userId, 'Token Reuse Detected', `Posible robo de sesión. Family: ${stored.family}. Todos los tokens revocados.`);
    const error = new Error('Sesión comprometida. Inicia sesión de nuevo.');
    error.statusCode = 401;
    throw error;
  }

  // Token expirado
  if (new Date() > stored.expiresAt) {
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { isRevoked: true } });
    const error = new Error('Sesión expirada. Inicia sesión de nuevo.');
    error.statusCode = 401;
    throw error;
  }

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    const error = new Error('Usuario no autorizado');
    error.statusCode = 401;
    throw error;
  }

  // Revocar el token anterior
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { isRevoked: true },
  });

  // Generar nuevo par (misma familia)
  const accessToken = generateAccessToken(user);
  const { token: newRefreshToken } = await generateRefreshToken(user.id, stored.family);

  await audit(EVENTS.TOKEN_REFRESH, { userId: user.id, req });

  return { accessToken, refreshToken: newRefreshToken, user };
}

/**
 * Revoca todos los refresh tokens de un usuario (logout completo)
 */
export async function revokeAllTokens(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
}

/**
 * Limpia tokens expirados (ejecutar periódicamente)
 */
export async function cleanupExpiredTokens() {
  const result = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
