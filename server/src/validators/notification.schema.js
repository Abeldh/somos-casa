import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string().uuid('userId inválido'),
  type: z.enum(['APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PAYMENT_VERIFIED', 'SESSIONS_RELEASED', 'NEW_BOOK', 'REFERRAL_BONUS', 'COUPON_RECEIVED', 'GENERAL']).default('GENERAL'),
  title: z.string().min(1, 'Título es requerido').max(200),
  message: z.string().min(1, 'Mensaje es requerido').max(1000),
  link: z.string().nullable().optional(),
});

export const broadcastNotificationSchema = z.object({
  type: z.enum(['APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PAYMENT_VERIFIED', 'SESSIONS_RELEASED', 'NEW_BOOK', 'REFERRAL_BONUS', 'COUPON_RECEIVED', 'GENERAL']).default('GENERAL'),
  title: z.string().min(1, 'Título es requerido').max(200),
  message: z.string().min(1, 'Mensaje es requerido').max(1000),
  link: z.string().nullable().optional(),
});
