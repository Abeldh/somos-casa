import { Router } from 'express';
import { availabilityController } from '../controllers/availability.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Public routes (anyone can see availability)
router.get('/', availabilityController.getByDate);
router.get('/month', availabilityController.getByMonth);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, availabilityController.create);
router.post('/bulk', authMiddleware, adminMiddleware, availabilityController.createBulk);
router.delete('/:id', authMiddleware, adminMiddleware, availabilityController.remove);

export default router;
