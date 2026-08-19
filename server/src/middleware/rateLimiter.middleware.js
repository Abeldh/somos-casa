/**
 * Rate Limiter in-memory
 * Protección contra fuerza bruta y abuso sin dependencias externas
 */

const requests = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_API = 200;              // 200 requests por ventana (API general)
const MAX_AUTH = 7;               // 7 intentos en auth

// Limpieza cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requests.entries()) {
    if (now - data.start > WINDOW_MS) requests.delete(key);
  }
}, 10 * 60 * 1000);

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
}

function checkLimit(key, max) {
  const now = Date.now();
  const record = requests.get(key);

  if (!record || now - record.start > WINDOW_MS) {
    requests.set(key, { count: 1, start: now });
    return null;
  }

  if (record.count >= max) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - record.start)) / 1000);
    return retryAfter;
  }

  record.count++;
  return null;
}

/**
 * Rate limiter para API general (200 req/15min)
 */
export function apiRateLimiter(req, res, next) {
  const key = `api:${getIp(req)}`;
  const blocked = checkLimit(key, MAX_API);
  if (blocked) {
    res.setHeader('Retry-After', blocked);
    return res.status(429).json({ success: false, message: 'Demasiadas solicitudes. Intenta más tarde.' });
  }
  next();
}

/**
 * Rate limiter para auth (7 intentos/15min)
 */
export function authRateLimiter(req, res, next) {
  const key = `auth:${getIp(req)}`;
  const blocked = checkLimit(key, MAX_AUTH);
  if (blocked) {
    res.setHeader('Retry-After', blocked);
    return res.status(429).json({ success: false, message: `Demasiados intentos. Espera ${Math.ceil(blocked / 60)} minutos.` });
  }
  next();
}
