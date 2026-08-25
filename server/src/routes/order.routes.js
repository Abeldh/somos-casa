import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.post('/', orderController.create);
router.get('/me', orderController.getMyOrders);
router.get('/my-books', orderController.getMyBooks);
router.patch('/:id/proof', orderController.uploadProof);
router.get('/:id', orderController.getById);

// Admin routes
router.get('/', adminMiddleware, orderController.getAll);
router.patch('/:id/status', adminMiddleware, orderController.updateStatus);
router.post('/:id/confirm-payment', adminMiddleware, orderController.confirmPayment);

export default router;
