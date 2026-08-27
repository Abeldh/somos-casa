import { Router } from 'express';
import { referralController } from '../controllers/referral.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.get('/my-code', referralController.getMyCode);
router.get('/my-referrals', referralController.getMyReferrals);

// Admin
router.get('/stats', adminMiddleware, referralController.getStats);

export default router;
