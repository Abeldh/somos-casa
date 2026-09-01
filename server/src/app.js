import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
import { securityHeaders } from './middleware/security.middleware.js';
import { sanitizeInputs } from './middleware/sanitize.middleware.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Seguridad básica
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Timeout de requests: corta conexiones lentas o colgadas para no agotar recursos
// (mitigación básica de Slowloris / conexiones abusivas). 30s cubre de sobra
// cualquier operación legítima de esta API.
const REQUEST_TIMEOUT_MS = 30 * 1000;
app.use((req, res, next) => {
  res.setTimeout(REQUEST_TIMEOUT_MS, () => {
    if (!res.headersSent) {
      res.status(503).json({ success: false, message: 'La solicitud tardó demasiado. Intenta de nuevo.' });
    }
    // Cierra el socket si sigue colgado tras responder
    if (req.socket && !req.socket.destroyed) req.socket.destroy();
  });
  next();
});

// Security Headers (CSP, HSTS, X-Frame, etc.)
app.use(securityHeaders);

// Compresión gzip
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (typeof body === 'string' && body.length > 1024 && req.headers['accept-encoding']?.includes('gzip')) {
      zlib.gzip(body, (err, compressed) => {
        if (err) return originalSend.call(this, body);
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', compressed.length);
        originalSend.call(this, compressed);
      });
    } else {
      originalSend.call(this, body);
    }
  };
  next();
});

// CORS
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());

// Body parsing con límites restrictivos
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Sanitización global de inputs (XSS, NoSQL injection, prototype pollution)
app.use(sanitizeInputs);

// Rate limiting global para API
app.use('/api', apiRateLimiter);

// API routes
app.use('/api', routes);

// Serve frontend con cache headers
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist, {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    if (filePath.match(/\.(js|css)$/) && filePath.includes('-')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

// SPA fallback
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Error handler
app.use(errorHandler);

export default app;
