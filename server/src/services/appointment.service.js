import prisma from '../config/database.js';
import { getStartOfDay, getEndOfDay } from '../utils/formatDate.js';

export const appointmentService = {
  async create({ userId, date, startTime, endTime, partnerName, reason, notes }) {
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
      prisma.availability.update({
        where: { id: slot.id },
        data: { isBooked: true },
      }),
    ]);

    return { appointment };
  },

  async getByUser(userId) {
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return { appointments };
  },

  async getAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { appointments };
  },

  async updateStatus(id, status) {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    return { appointment };
  },

  async cancel(id, userId) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      const error = new Error('Cita no encontrada');
      error.statusCode = 404;
      throw error;
    }
    if (appointment.userId !== userId) {
      const error = new Error('No tienes permiso para cancelar esta cita');
      error.statusCode = 403;
      throw error;
    }
    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      const error = new Error('No se puede cancelar esta cita');
      error.statusCode = 422;
      throw error;
    }

    const [updated] = await prisma.$transaction([
      prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } }),
      prisma.availability.updateMany({
        where: { date: appointment.date, startTime: appointment.startTime, endTime: appointment.endTime },
        data: { isBooked: false },
      }),
    ]);

    return { appointment: updated };
  },

  async reschedule(id, userId, { date, startTime, endTime }) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.userId !== userId) {
      const error = new Error('Cita no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const newSlot = await prisma.availability.findFirst({
      where: { date: new Date(date), startTime, endTime, isBooked: false },
    });
    if (!newSlot) {
      const error = new Error('El nuevo horario no está disponible');
      error.statusCode = 409;
      throw error;
    }

    const [updated] = await prisma.$transaction([
      prisma.appointment.update({
        where: { id },
        data: { date: new Date(date), startTime, endTime, status: 'PENDING' },
      }),
      prisma.availability.updateMany({
        where: { date: appointment.date, startTime: appointment.startTime, endTime: appointment.endTime },
        data: { isBooked: false },
      }),
      prisma.availability.update({ where: { id: newSlot.id }, data: { isBooked: true } }),
    ]);

    return { appointment: updated };
  },
};
