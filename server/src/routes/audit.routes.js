import { Router } from 'express';
import { auditController } from '../controllers/audit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.get('/', auditController.getLogs);
router.get('/export', auditController.exportCsv);

export default router;
