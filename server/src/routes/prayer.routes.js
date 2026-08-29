import { Router } from 'express';
import { prayerController } from '../controllers/prayer.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware.js';

const router = Router();

// Público: muro de oración
router.get('/wall', prayerController.getPublicWall);

// Crear petición (usuario logueado o anónimo)
router.post('/', optionalAuthMiddleware, prayerController.create);

// Usuario autenticado: sus peticiones
router.get('/mine', authMiddleware, prayerController.getMine);

// Admin
router.get('/', authMiddleware, adminMiddleware, prayerController.getAll);
router.patch('/:id/prayed', authMiddleware, adminMiddleware, prayerController.markPrayed);
router.patch('/:id/archive', authMiddleware, adminMiddleware, prayerController.archive);
router.delete('/:id', authMiddleware, adminMiddleware, prayerController.remove);

export default router;
