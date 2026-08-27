import { Router } from 'express';
import { couponController } from '../controllers/coupon.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.post('/validate', couponController.validate);

// Admin routes
router.get('/', adminMiddleware, couponController.getAll);
router.get('/:id', adminMiddleware, couponController.getById);
router.post('/', adminMiddleware, couponController.create);
router.patch('/:id', adminMiddleware, couponController.update);
router.delete('/:id', adminMiddleware, couponController.delete);

export default router;
