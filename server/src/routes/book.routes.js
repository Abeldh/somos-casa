import { Router } from 'express';
import { bookController } from '../controllers/book.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', bookController.getAll);
router.get('/categories', bookController.getCategories);
router.get('/featured', bookController.getFeatured);
router.get('/admin/all', authMiddleware, adminMiddleware, bookController.getAllAdmin);
router.get('/:slug', bookController.getBySlug);
router.post('/', authMiddleware, adminMiddleware, bookController.create);
router.put('/:id', authMiddleware, adminMiddleware, bookController.update);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.remove);
router.patch('/:id/featured', authMiddleware, adminMiddleware, bookController.toggleFeatured);

export default router;
