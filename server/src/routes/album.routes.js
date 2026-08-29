import { Router } from 'express';
import { albumController } from '../controllers/album.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Público: álbum de restauración (fotos aprobadas)
router.get('/approved', albumController.getApproved);

// Usuario autenticado
router.get('/mine', authMiddleware, albumController.getMine);
router.post('/', authMiddleware, albumController.create);

// Admin
router.get('/', authMiddleware, adminMiddleware, albumController.getAll);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, albumController.toggleApproval);
router.delete('/:id', authMiddleware, adminMiddleware, albumController.remove);

export default router;
