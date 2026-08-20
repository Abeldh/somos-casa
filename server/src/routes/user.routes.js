import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.get('/:id/activity', userController.getActivity);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/toggle-active', userController.toggleActive);

export default router;
