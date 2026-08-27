import { z } from 'zod';

export const createSessionNoteSchema = z.object({
  appointmentId: z.string().uuid('ID de cita inválido'),
  content: z.string().min(1, 'Contenido es requerido').max(5000),
  isPrivate: z.boolean().default(true),
});

export const updateSessionNoteSchema = z.object({
  content: z.string().min(1, 'Contenido es requerido').max(5000),
});
