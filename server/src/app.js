import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Serve frontend static files
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// SPA fallback - any non-API route serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Error handler
app.use(errorHandler);

export default app;
