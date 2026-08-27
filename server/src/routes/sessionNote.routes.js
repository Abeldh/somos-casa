import { Router } from 'express';
import { sessionNoteController } from '../controllers/sessionNote.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validateZod } from '../middleware/validateZod.middleware.js';
import { createSessionNoteSchema, updateSessionNoteSchema } from '../validators/sessionNote.schema.js';

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/appointment/:appointmentId', sessionNoteController.getByAppointment);
router.get('/user/:userId', sessionNoteController.getByUser);
router.post('/', validateZod(createSessionNoteSchema), sessionNoteController.create);
router.patch('/:id', validateZod(updateSessionNoteSchema), sessionNoteController.update);
router.delete('/:id', sessionNoteController.delete);

export default router;
