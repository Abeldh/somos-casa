import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.get('/me', paymentController.getMyPayments);
router.post('/', paymentController.create);

// Admin routes
router.get('/', adminMiddleware, paymentController.getAll);
router.get('/summary', adminMiddleware, paymentController.getSummary);
router.patch('/:id/verify', adminMiddleware, paymentController.verify);
router.patch('/:id/reject', adminMiddleware, paymentController.reject);

export default router;
