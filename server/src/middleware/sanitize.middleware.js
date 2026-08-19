/**
 * Input Sanitization Middleware
 * - Limita longitud de strings (previene DoS por payload gigante)
 * - Escapa caracteres HTML peligrosos (previene Stored XSS)
 * - Elimina null bytes y caracteres de control
 * - Bloquea operadores NoSQL ($gt, $ne, etc.)
 */

const MAX_STRING_LENGTH = 5000; // Máximo por campo individual

/**
 * Escapa los 5 caracteres HTML que causan XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Elimina caracteres de control y null bytes
 */
function stripControlChars(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Sanitiza un valor recursivamente
 */
function sanitize(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    let clean = stripControlChars(value);
    // Truncar si excede máximo
    if (clean.length > MAX_STRING_LENGTH) {
      clean = clean.substring(0, MAX_STRING_LENGTH);
    }
    return escapeHtml(clean.trim());
  }

  if (Array.isArray(value)) {
    return value.slice(0, 100).map(sanitize); // Max 100 items en arrays
  }

  if (typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      // Bloquear keys que empiecen con $ (NoSQL injection)
      if (key.startsWith('$')) continue;
      // Bloquear keys con prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      result[key] = sanitize(val);
    }
    return result;
  }

  return value;
}

/**
 * Middleware que sanitiza body, query y params
 */
export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitize(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitize(req.params);
  }
  next();
}
