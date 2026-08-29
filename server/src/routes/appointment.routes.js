import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createAppointmentSchema, updateStatusSchema } from '../validators/appointment.validator.js';

const router = Router();
router.use(authMiddleware);

// User routes
router.post('/', validate(createAppointmentSchema), appointmentController.create);
router.get('/me', appointmentController.getMyAppointments);
router.get('/history', appointmentController.getMyHistory);
router.patch('/:id/cancel', appointmentController.cancel);
router.patch('/:id/rate', appointmentController.rate);
router.patch('/session-proof', appointmentController.uploadSessionProof);
router.patch('/:id/reschedule', appointmentController.reschedule);

// Admin routes
router.get('/', adminMiddleware, appointmentController.getAll);
router.patch('/:id/status', adminMiddleware, validate(updateStatusSchema), appointmentController.updateStatus);
router.patch('/:id/zoom', adminMiddleware, appointmentController.setZoomUrl);
router.post('/release-sessions', adminMiddleware, appointmentController.releaseSessions);

export default router;
