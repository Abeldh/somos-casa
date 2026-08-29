import { Router } from 'express';
import { blogController } from '../controllers/blog.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Público
router.get('/published', blogController.getPublished);
router.get('/slug/:slug', blogController.getBySlug);

// Admin
router.get('/', authMiddleware, adminMiddleware, blogController.getAll);
router.get('/:id', authMiddleware, adminMiddleware, blogController.getById);
router.post('/', authMiddleware, adminMiddleware, blogController.create);
router.patch('/:id', authMiddleware, adminMiddleware, blogController.update);
router.delete('/:id', authMiddleware, adminMiddleware, blogController.remove);

export default router;
