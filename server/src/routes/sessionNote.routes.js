import { Router } from 'express';
import { sessionNoteController } from '../controllers/sessionNote.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/appointment/:appointmentId', sessionNoteController.getByAppointment);
router.get('/user/:userId', sessionNoteController.getByUser);
router.post('/', sessionNoteController.create);
router.patch('/:id', sessionNoteController.update);
router.delete('/:id', sessionNoteController.delete);

export default router;
