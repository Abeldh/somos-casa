import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Seguridad básica
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Compresión manual (sin dependencia extra)
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

// Body parsing con límites
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting global para API
app.use('/api', apiRateLimiter);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// API routes
app.use('/api', routes);

// Serve frontend con cache headers agresivos para assets
const clientDist = path.join(__dirname, '../../client/dist');

app.use(express.static(clientDist, {
  maxAge: '1y',            // Cache de assets (JS, CSS, imágenes) por 1 año
  etag: true,              // ETags para validación
  lastModified: true,
  setHeaders: (res, filePath) => {
    // index.html nunca cachear (SPA necesita siempre la última versión)
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Assets con hash en el nombre → cache inmutable
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
