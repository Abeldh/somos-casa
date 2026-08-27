import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/metrics', dashboardController.getMetrics);
router.get('/financial', dashboardController.getFinancial);
router.get('/activity', dashboardController.getRecentActivity);

export default router;
