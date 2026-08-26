import { Router } from 'express';
import { testimonialController } from '../controllers/testimonial.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Público
router.get('/approved', testimonialController.getApproved);

// Usuario autenticado
router.post('/', authMiddleware, testimonialController.create);

// Admin
router.get('/', authMiddleware, adminMiddleware, testimonialController.getAll);
router.patch('/:id/approve', authMiddleware, adminMiddleware, testimonialController.approve);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, testimonialController.toggleApproval);
router.delete('/:id', authMiddleware, adminMiddleware, testimonialController.remove);

export default router;
