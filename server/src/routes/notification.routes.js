import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validateZod } from '../middleware/validateZod.middleware.js';
import { sendNotificationSchema, broadcastNotificationSchema } from '../validators/notification.schema.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.get('/me', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.delete);

// Admin routes
router.post('/send', adminMiddleware, validateZod(sendNotificationSchema), notificationController.send);
router.post('/broadcast', adminMiddleware, validateZod(broadcastNotificationSchema), notificationController.broadcast);

export default router;
