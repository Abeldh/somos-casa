import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createAppointmentSchema, updateStatusSchema } from '../validators/appointment.validator.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createAppointmentSchema), appointmentController.create);
router.get('/me', appointmentController.getMyAppointments);
router.patch('/:id/cancel', appointmentController.cancel);
router.patch('/:id/reschedule', appointmentController.reschedule);

// Admin routes
router.get('/', adminMiddleware, appointmentController.getAll);
router.patch('/:id/status', adminMiddleware, validate(updateStatusSchema), appointmentController.updateStatus);

export default router;
