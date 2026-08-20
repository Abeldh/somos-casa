import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Solo admins pueden obtener firma para upload
router.get('/signature', authMiddleware, adminMiddleware, uploadController.getSignature);

export default router;
