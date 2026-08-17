import { Router } from 'express';
import { mediaController } from '../controllers/media.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createMediaSchema } from '../validators/media.validator.js';

const router = Router();

// Public routes
router.get('/', mediaController.getAll);
router.get('/active', mediaController.getActive);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, validate(createMediaSchema), mediaController.create);
router.put('/:id', authMiddleware, adminMiddleware, mediaController.update);
router.delete('/:id', authMiddleware, adminMiddleware, mediaController.remove);
router.patch('/reorder', authMiddleware, adminMiddleware, mediaController.reorder);

export default router;
