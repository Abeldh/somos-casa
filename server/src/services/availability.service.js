import prisma from '../config/database.js';
import { getStartOfDay, getEndOfDay, getMonthRange, toISODate } from '../utils/formatDate.js';

export const availabilityService = {
  async getByDate(dateStr) {
    const start = getStartOfDay(dateStr);
    const end = getEndOfDay(dateStr);

    const slots = await prisma.availability.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { startTime: 'asc' },
    });
    return { slots };
  },

  async getByMonth(year, month) {
    const { start, end } = getMonthRange(year, month);

    const slots = await prisma.availability.findMany({
      where: { date: { gte: start, lte: end }, isBooked: false },
      select: { date: true },
    });

    const datesSet = new Set(slots.map((s) => toISODate(s.date)));
    return { dates: [...datesSet] };
  },

  async create({ date, startTime, endTime }) {
    const existing = await prisma.availability.findFirst({
      where: { date: new Date(date), startTime, endTime },
    });
    if (existing) {
      const error = new Error('Este horario ya existe');
      error.statusCode = 409;
      throw error;
    }

    const slot = await prisma.availability.create({
      data: { date: new Date(date), startTime, endTime },
    });
    return { slot };
  },

  async createBulk(slots) {
    const data = slots.map((s) => ({
      date: new Date(s.date),
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    const result = await prisma.availability.createMany({ data, skipDuplicates: true });
    return { count: result.count };
  },

  async remove(id) {
    const slot = await prisma.availability.findUnique({ where: { id } });
    if (!slot) {
      const error = new Error('Horario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    if (slot.isBooked) {
      const error = new Error('No se puede eliminar un horario reservado');
      error.statusCode = 422;
      throw error;
    }

    await prisma.availability.delete({ where: { id } });
    return { message: 'Horario eliminado' };
  },
};
