/**
 * Security Headers Middleware
 * Implementa: CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy, Permissions-Policy, CORP, COOP
 * 
 * Basado en OWASP Secure Headers Project
 */

const isProduction = process.env.NODE_ENV === 'production';

export function securityHeaders(req, res, next) {
  // ═══════════════════════════════════════════════════════════════
  // P0: Content-Security-Policy (CSP) — Previene XSS
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    // Scripts: mismo origen + inline + Google Analytics (gtag)
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    // Estilos: mismo origen + inline (Tailwind) + Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fuentes: mismo origen + Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Imágenes: mismo origen + HTTPS + data URIs + blobs (Cloudinary, portadas)
    "img-src 'self' https: data: blob:",
    // Conexiones: mismo origen + Cloudinary upload + Railway
    "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://*.railway.app https://fonts.googleapis.com https://fonts.gstatic.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
    // Frames: solo Spotify y YouTube (embeds de la landing)
    "frame-src https://open.spotify.com https://www.youtube.com",
    // No permitir plugins (Flash, Java, etc.)
    "object-src 'none'",
    // Base URI: solo mismo origen (previene base tag injection)
    "base-uri 'self'",
    // Forms: solo enviar a mismo origen
    "form-action 'self'",
    // Quien puede embeber esta página: solo nosotros (anti-clickjacking)
    "frame-ancestors 'self'",
    // Forzar HTTPS para recursos mixtos
    "upgrade-insecure-requests",
  ].join('; '));

  // ═══════════════════════════════════════════════════════════════
  // P0: Strict-Transport-Security (HSTS) — Previene downgrade attacks
  // ═══════════════════════════════════════════════════════════════
  if (isProduction) {
    // max-age=1 año, incluye subdominios, permite preload list
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // ═══════════════════════════════════════════════════════════════
  // X-Content-Type-Options — Previene MIME sniffing
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // ═══════════════════════════════════════════════════════════════
  // X-Frame-Options — Previene clickjacking (legacy, CSP frame-ancestors es el estándar)
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // ═══════════════════════════════════════════════════════════════
  // Referrer-Policy — Controla qué se envía en el header Referer
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ═══════════════════════════════════════════════════════════════
  // Permissions-Policy — Restringe APIs del navegador
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '));

  // ═══════════════════════════════════════════════════════════════
  // Cross-Origin Policies — Aislamiento de contexto
  // ═══════════════════════════════════════════════════════════════
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  // unsafe-none para permitir embeds de YouTube/Spotify
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

  // ═══════════════════════════════════════════════════════════════
  // Limpieza — Eliminar headers que revelan información
  // ═══════════════════════════════════════════════════════════════
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  next();
}
