import prisma from '../config/database.js';

/**
 * Audit Logger — Registra eventos de seguridad y acciones importantes
 * 
 * Eventos registrados:
 * - AUTH: LOGIN_SUCCESS, LOGIN_FAILED, REGISTER, LOGOUT, TOKEN_REFRESH
 * - MFA: MFA_ENABLED, MFA_VERIFIED, MFA_FAILED
 * - ADMIN: BOOK_CREATED, BOOK_UPDATED, BOOK_DELETED, PRICE_CHANGED
 * - ADMIN: ORDER_STATUS_CHANGED, APPOINTMENT_STATUS_CHANGED
 * - ADMIN: MEDIA_CREATED, MEDIA_DELETED, AVAILABILITY_CREATED
 * - USER: PASSWORD_CHANGED, PROFILE_UPDATED
 * - SECURITY: TOKEN_REUSE_DETECTED, RATE_LIMIT_HIT, INVALID_TOKEN
 */

export async function audit(event, { userId = null, detail = null, req = null } = {}) {
  try {
    const ip = req ? (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip) : null;
    const userAgent = req ? req.headers['user-agent']?.substring(0, 500) : null;

    await prisma.auditLog.create({
      data: {
        event,
        userId,
        detail: detail ? String(detail).substring(0, 2000) : null,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    // Nunca dejar que un fallo de auditoría detenga la operación principal
    console.error('[AUDIT ERROR]', error.message);
  }
}

// Eventos predefinidos
export const EVENTS = {
  // Auth
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  TOKEN_REUSE_DETECTED: 'TOKEN_REUSE_DETECTED',

  // MFA
  MFA_ENABLED: 'MFA_ENABLED',
  MFA_VERIFIED: 'MFA_VERIFIED',
  MFA_FAILED: 'MFA_FAILED',

  // Admin
  BOOK_CREATED: 'BOOK_CREATED',
  BOOK_UPDATED: 'BOOK_UPDATED',
  BOOK_DELETED: 'BOOK_DELETED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  APPOINTMENT_STATUS_CHANGED: 'APPOINTMENT_STATUS_CHANGED',
  MEDIA_CREATED: 'MEDIA_CREATED',
  MEDIA_DELETED: 'MEDIA_DELETED',

  // Security
  RATE_LIMIT_HIT: 'RATE_LIMIT_HIT',
  INVALID_TOKEN: 'INVALID_TOKEN',
};
