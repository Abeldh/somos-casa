import prisma from '../config/database.js';
import { audit, EVENTS } from '../utils/auditLog.js';
import { getStartOfDay, getEndOfDay } from '../utils/formatDate.js';

export const appointmentService = {
  async create({ userId, date, startTime, endTime, partnerName, reason, notes }) {
    // Normalizar la fecha como string YYYY-MM-DD
    const dateStr = String(date).split('T')[0];
    
    // Validar que la fecha/hora no sea pasada (usando zona horaria de México UTC-6)
    const appointmentUTC = new Date(`${dateStr}T${startTime}:00.000-06:00`);
    const nowUTC = new Date();

    if (appointmentUTC <= nowUTC) {
      const error = new Error('No puedes agendar en una fecha u horario que ya pasó.');
      error.statusCode = 422;
      throw error;
    }

    // Verificar sesiones disponibles (no bloquea, solo marca si necesita pago)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { sessionsRemaining: true } });
    const hasSessions = user && user.sessionsRemaining > 0;

    // Buscar por rango de fecha (evita problemas de timezone con igualdad exacta)
    const dayStart = getStartOfDay(dateStr);
    const dayEnd = getEndOfDay(dateStr);

    const slot = await prisma.availability.findFirst({
      where: { date: { gte: dayStart, lte: dayEnd }, startTime, endTime, isBooked: false },
    });
    if (!slot) {
      const error = new Error('El horario seleccionado ya no está disponible');
      error.statusCode = 409;
      throw error;
    }

    // Si tiene sesiones → decrementar. Si no → la cita queda pendiente de pago
    const appointmentDate = new Date(`${dateStr}T00:00:00.000Z`);
    const transactionOps = [
      prisma.appointment.create({
        data: { userId, date: appointmentDate, startTime, endTime, partnerName, reason, notes },
      }),
      prisma.availability.update({ where: { id: slot.id }, data: { isBooked: true } }),
    ];

    if (hasSessions) {
      transactionOps.push(
        prisma.user.update({ where: { id: userId }, data: { sessionsRemaining: { decrement: 1 } } })
      );
    }

    const [appointment] = await prisma.$transaction(transactionOps);

    return { appointment, needsPayment: !hasSessions };
  },

  async getByUser(userId) {
    const [appointments, user] = await Promise.all([
      prisma.appointment.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
      prisma.user.findUnique({ where: { id: userId }, select: { sessionsRemaining: true, sessionsTotal: true, sessionsPaidAt: true } }),
    ]);
    return { appointments, sessionsRemaining: user.sessionsRemaining, sessionsTotal: user.sessionsTotal, sessionsPaidAt: user.sessionsPaidAt };
  },

  /**
   * Usuario: historial de sesiones completadas, incluyendo notas NO privadas del consejero.
   */
  async getMyHistory(userId, { page = 1, limit = 10 } = {}) {
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (p - 1) * l;
    const where = { userId, status: 'COMPLETED' };
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
          sessionNotes: {
            where: { isPrivate: false },
            orderBy: { createdAt: 'desc' },
            select: { id: true, content: true, createdAt: true },
          },
        },
        skip,
        take: l,
      }),
      prisma.appointment.count({ where }),
    ]);
    return { appointments, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  },

  /**
   * Usuario: calificar una cita completada.
   */
  async rate(id, userId, { rating, comment }) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) { const e = new Error('Cita no encontrada'); e.statusCode = 404; throw e; }
    if (appointment.userId !== userId) { const e = new Error('No tienes permiso'); e.statusCode = 403; throw e; }
    if (appointment.status !== 'COMPLETED') { const e = new Error('Solo puedes calificar sesiones completadas'); e.statusCode = 422; throw e; }

    const value = Math.min(Math.max(parseInt(rating), 1), 5);
    const updated = await prisma.appointment.update({
      where: { id },
      data: { rating: value, ratingComment: comment || null, ratedAt: new Date() },
    });
    return { appointment: updated };
  },

  async getAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 50));
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, sessionsRemaining: true, sessionsTotal: true, paymentProofUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);
    return { appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id, status) {
    const appointment = await prisma.appointment.update({ where: { id }, data: { status } });
    return { appointment };
  },

  /**
   * Admin: Agregar URL de Zoom a una cita
   */
  async setZoomUrl(id, zoomUrl) {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { zoomUrl },
    });
    return { appointment };
  },

  /**
   * Admin: Liberar sesiones para un usuario (tras confirmar pago mensual)
   */
  async releaseSessions(userId, sessions = 4, req = null) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        sessionsRemaining: sessions,
        sessionsTotal: { increment: sessions },
        sessionsPaidAt: new Date(),
      },
      select: { id: true, email: true, firstName: true, lastName: true, sessionsRemaining: true, sessionsTotal: true },
    });

    await audit(EVENTS.ORDER_STATUS_CHANGED, { userId, detail: `Sessions released: ${sessions}. Total: ${user.sessionsTotal}`, req });

    return { user };
  },

  async cancel(id, userId) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) { const e = new Error('Cita no encontrada'); e.statusCode = 404; throw e; }
    if (appointment.userId !== userId) { const e = new Error('No tienes permiso'); e.statusCode = 403; throw e; }
    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') { const e = new Error('No se puede cancelar'); e.statusCode = 422; throw e; }

    const [updated] = await prisma.$transaction([
      prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } }),
      prisma.availability.updateMany({ where: { date: appointment.date, startTime: appointment.startTime, endTime: appointment.endTime }, data: { isBooked: false } }),
      // Devolver la sesión al usuario
      prisma.user.update({ where: { id: userId }, data: { sessionsRemaining: { increment: 1 } } }),
    ]);

    return { appointment: updated };
  },

  async reschedule(id, userId, { date, startTime, endTime }) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.userId !== userId) { const e = new Error('Cita no encontrada'); e.statusCode = 404; throw e; }

    const newDateStr = String(date).split('T')[0];
    const newDayStart = getStartOfDay(newDateStr);
    const newDayEnd = getEndOfDay(newDateStr);

    const newSlot = await prisma.availability.findFirst({ where: { date: { gte: newDayStart, lte: newDayEnd }, startTime, endTime, isBooked: false } });
    if (!newSlot) { const e = new Error('El nuevo horario no está disponible'); e.statusCode = 409; throw e; }

    const [updated] = await prisma.$transaction([
      prisma.appointment.update({ where: { id }, data: { date: new Date(`${newDateStr}T00:00:00.000Z`), startTime, endTime, status: 'PENDING' } }),
      prisma.availability.updateMany({ where: { date: appointment.date, startTime: appointment.startTime, endTime: appointment.endTime }, data: { isBooked: false } }),
      prisma.availability.update({ where: { id: newSlot.id }, data: { isBooked: true } }),
    ]);

    return { appointment: updated };
  },
};
