import prisma from '../config/database.js';
import { parseDevice } from './deviceParser.js';

/**
 * Audit Logger — Registra eventos de seguridad y acciones importantes
 * Incluye: IP, User-Agent, tipo de dispositivo, navegador, SO
 */

export async function audit(event, { userId = null, detail = null, req = null } = {}) {
  try {
    const ip = req ? (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip) : null;
    const userAgent = req ? req.headers['user-agent']?.substring(0, 500) : null;
    const device = parseDevice(userAgent);

    await prisma.auditLog.create({
      data: {
        event,
        userId,
        detail: detail ? String(detail).substring(0, 2000) : null,
        ip,
        userAgent,
        deviceType: device.type,
        browser: device.browser,
        os: device.os,
      },
    });
  } catch (error) {
    console.error('[AUDIT ERROR]', error.message);
  }
}

export const EVENTS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  TOKEN_REUSE_DETECTED: 'TOKEN_REUSE_DETECTED',
  MFA_ENABLED: 'MFA_ENABLED',
  MFA_VERIFIED: 'MFA_VERIFIED',
  MFA_FAILED: 'MFA_FAILED',
  BOOK_CREATED: 'BOOK_CREATED',
  BOOK_UPDATED: 'BOOK_UPDATED',
  BOOK_DELETED: 'BOOK_DELETED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  APPOINTMENT_STATUS_CHANGED: 'APPOINTMENT_STATUS_CHANGED',
  MEDIA_CREATED: 'MEDIA_CREATED',
  MEDIA_DELETED: 'MEDIA_DELETED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  RATE_LIMIT_HIT: 'RATE_LIMIT_HIT',
  INVALID_TOKEN: 'INVALID_TOKEN',
};
