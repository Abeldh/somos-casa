import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(20),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], { message: 'Tipo debe ser PERCENTAGE o FIXED_AMOUNT' }),
  value: z.number({ coerce: true }).positive('El valor debe ser mayor a 0'),
  appliesTo: z.enum(['ALL', 'BOOKS', 'SESSIONS']).default('ALL'),
  minPurchase: z.number({ coerce: true }).positive().nullable().optional(),
  maxDiscount: z.number({ coerce: true }).positive().nullable().optional(),
  maxUses: z.number({ coerce: true }).int().positive().nullable().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

export const updateCouponSchema = z.object({
  code: z.string().min(3).max(20).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
  value: z.number({ coerce: true }).positive().optional(),
  appliesTo: z.enum(['ALL', 'BOOKS', 'SESSIONS']).optional(),
  minPurchase: z.number({ coerce: true }).positive().nullable().optional(),
  maxDiscount: z.number({ coerce: true }).positive().nullable().optional(),
  maxUses: z.number({ coerce: true }).int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Código es requerido'),
  subtotal: z.number({ coerce: true }).min(0).default(0),
});
