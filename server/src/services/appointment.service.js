import prisma from '../config/database.js';
import { audit, EVENTS } from '../utils/auditLog.js';

export const appointmentService = {
  async create({ userId, date, startTime, endTime, partnerName, reason, notes }) {
    // Verificar que el usuario tenga sesiones disponibles
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { sessionsRemaining: true } });
    if (!user || user.sessionsRemaining <= 0) {
      const error = new Error('No tienes sesiones disponibles. Realiza el pago de tu paquete mensual para poder agendar.');
      error.statusCode = 422;
      throw error;
    }

    const slot = await prisma.availability.findFirst({
      where: { date: new Date(date), startTime, endTime, isBooked: false },
    });
    if (!slot) {
      const error = new Error('El horario seleccionado ya no está disponible');
      error.statusCode = 409;
      throw error;
    }

    const [appointment] = await prisma.$transaction([
      prisma.appointment.create({
        data: { userId, date: new Date(date), startTime, endTime, partnerName, reason, notes },
      }),
      prisma.availability.update({ where: { id: slot.id }, data: { isBooked: true } }),
      // Decrementar sesión disponible
      prisma.user.update({ where: { id: userId }, data: { sessionsRemaining: { decrement: 1 } } }),
    ]);

    return { appointment };
  },

  async getByUser(userId) {
    const [appointments, user] = await Promise.all([
      prisma.appointment.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
      prisma.user.findUnique({ where: { id: userId }, select: { sessionsRemaining: true, sessionsTotal: true, sessionsPaidAt: true } }),
    ]);
    return { appointments, sessionsRemaining: user.sessionsRemaining, sessionsTotal: user.sessionsTotal, sessionsPaidAt: user.sessionsPaidAt };
  },

  async getAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    const appointments = await prisma.appointment.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, sessionsRemaining: true, sessionsTotal: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { appointments };
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

    const newSlot = await prisma.availability.findFirst({ where: { date: new Date(date), startTime, endTime, isBooked: false } });
    if (!newSlot) { const e = new Error('El nuevo horario no está disponible'); e.statusCode = 409; throw e; }

    const [updated] = await prisma.$transaction([
      prisma.appointment.update({ where: { id }, data: { date: new Date(date), startTime, endTime, status: 'PENDING' } }),
      prisma.availability.updateMany({ where: { date: appointment.date, startTime: appointment.startTime, endTime: appointment.endTime }, data: { isBooked: false } }),
      prisma.availability.update({ where: { id: newSlot.id }, data: { isBooked: true } }),
    ]);

    return { appointment: updated };
  },
};
