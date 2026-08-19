import crypto from 'crypto';
import prisma from '../config/database.js';
import { audit, EVENTS } from '../utils/auditLog.js';

/**
 * MFA Service — TOTP (Time-based One-Time Password)
 * Compatible con Google Authenticator, Authy, 1Password
 * 
 * Implementación sin dependencia externa usando HMAC-SHA1 (RFC 6238)
 */

const TOTP_PERIOD = 30;     // Segundos por código
const TOTP_DIGITS = 6;      // Longitud del código
const TOTP_WINDOW = 1;      // Ventana de tolerancia (±1 período = ±30s)
const SECRET_LENGTH = 20;   // Bytes del secret

// Base32 encoding/decoding para secrets TOTP
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer) {
  let result = '';
  let bits = 0;
  let value = 0;
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 31];
  }
  return result;
}

function base32Decode(str) {
  const cleaned = str.replace(/[^A-Z2-7]/gi, '').toUpperCase();
  const bytes = [];
  let bits = 0;
  let value = 0;
  for (const char of cleaned) {
    const index = BASE32_CHARS.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/**
 * Genera un código TOTP para un timestamp dado
 */
function generateTOTP(secret, timestamp = Date.now()) {
  const time = Math.floor(timestamp / 1000 / TOTP_PERIOD);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(0, 0);
  timeBuffer.writeUInt32BE(time, 4);

  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % (10 ** TOTP_DIGITS);

  return String(code).padStart(TOTP_DIGITS, '0');
}

export const mfaService = {
  /**
   * Genera un secret MFA para un usuario (paso 1: setup)
   * Retorna el secret en base32 y la URI para QR code
   */
  async generateSecret(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });

    // Eliminar secret anterior no verificado
    await prisma.mfaSecret.deleteMany({ where: { userId, isVerified: false } });

    const secretBytes = crypto.randomBytes(SECRET_LENGTH);
    const secret = base32Encode(secretBytes);

    await prisma.mfaSecret.create({
      data: { userId, secret },
    });

    // URI para Google Authenticator QR
    const issuer = 'SomosCasa';
    const otpauthUri = `otpauth://totp/${issuer}:${user.email}?secret=${secret}&issuer=${issuer}&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;

    return { secret, otpauthUri };
  },

  /**
   * Verifica un código TOTP y activa MFA (paso 2: confirmar setup)
   */
  async verifyAndEnable(userId, code, req = null) {
    const mfa = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!mfa) throw Object.assign(new Error('MFA no configurado'), { statusCode: 400 });

    const secretBuffer = base32Decode(mfa.secret);
    const isValid = this.validateCode(secretBuffer, code);

    if (!isValid) {
      await audit(EVENTS.MFA_FAILED, { userId, detail: 'Invalid code during setup', req });
      throw Object.assign(new Error('Código inválido'), { statusCode: 401 });
    }

    await prisma.mfaSecret.update({
      where: { userId },
      data: { isVerified: true },
    });

    await audit(EVENTS.MFA_ENABLED, { userId, req });
    return { enabled: true };
  },

  /**
   * Valida un código TOTP durante login
   */
  async validateLogin(userId, code, req = null) {
    const mfa = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!mfa || !mfa.isVerified) return true; // MFA no activo → skip

    const secretBuffer = base32Decode(mfa.secret);
    const isValid = this.validateCode(secretBuffer, code);

    if (!isValid) {
      await audit(EVENTS.MFA_FAILED, { userId, detail: 'Invalid code during login', req });
      return false;
    }

    await audit(EVENTS.MFA_VERIFIED, { userId, req });
    return true;
  },

  /**
   * Verifica si un código es válido (con ventana de tolerancia ±30s)
   */
  validateCode(secretBuffer, code) {
    const now = Date.now();
    for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
      const timestamp = now + (i * TOTP_PERIOD * 1000);
      const expected = generateTOTP(secretBuffer, timestamp);
      if (crypto.timingSafeEqual(Buffer.from(code), Buffer.from(expected))) {
        return true;
      }
    }
    return false;
  },

  /**
   * Verifica si un usuario tiene MFA activo
   */
  async hasMfa(userId) {
    const mfa = await prisma.mfaSecret.findUnique({ where: { userId } });
    return !!(mfa && mfa.isVerified);
  },

  /**
   * Desactiva MFA (requiere código válido para confirmar)
   */
  async disable(userId, code, req = null) {
    const mfa = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!mfa || !mfa.isVerified) throw Object.assign(new Error('MFA no activo'), { statusCode: 400 });

    const secretBuffer = base32Decode(mfa.secret);
    if (!this.validateCode(secretBuffer, code)) {
      throw Object.assign(new Error('Código inválido'), { statusCode: 401 });
    }

    await prisma.mfaSecret.delete({ where: { userId } });
    await audit(EVENTS.MFA_ENABLED, { userId, detail: 'MFA disabled', req });
    return { disabled: true };
  },
};
