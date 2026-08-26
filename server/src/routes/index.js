import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import appointmentRoutes from './appointment.routes.js';
import availabilityRoutes from './availability.routes.js';
import mediaRoutes from './media.routes.js';
import bookRoutes from './book.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import uploadRoutes from './upload.routes.js';
import auditRoutes from './audit.routes.js';
import testimonialRoutes from './testimonial.routes.js';

import { cache } from '../utils/cache.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/availability', availabilityRoutes);
router.use('/media', mediaRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/audit', auditRoutes);
router.use('/testimonials', testimonialRoutes);

// Health check con métricas
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + 's',
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
    cache: cache.stats(),
  });
});

export default router;
