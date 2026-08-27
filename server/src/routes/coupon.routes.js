import { Router } from 'express';
import { couponController } from '../controllers/coupon.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validateZod } from '../middleware/validateZod.middleware.js';
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from '../validators/coupon.schema.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.post('/validate', validateZod(validateCouponSchema), couponController.validate);

// Admin routes
router.get('/', adminMiddleware, couponController.getAll);
router.get('/:id', adminMiddleware, couponController.getById);
router.post('/', adminMiddleware, validateZod(createCouponSchema), couponController.create);
router.patch('/:id', adminMiddleware, validateZod(updateCouponSchema), couponController.update);
router.delete('/:id', adminMiddleware, couponController.delete);

export default router;
