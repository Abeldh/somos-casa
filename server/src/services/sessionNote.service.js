import prisma from '../config/database.js';

export const sessionNoteService = {
  async getByAppointment(appointmentId) {
    const notes = await prisma.sessionNote.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return { notes };
  },

  async getByUser(userId) {
    const notes = await prisma.sessionNote.findMany({
      where: { appointment: { userId } },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: { select: { date: true, startTime: true, endTime: true, partnerName: true } },
      },
    });
    return { notes };
  },

  async create({ appointmentId, adminId, content, isPrivate = true }) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) { const e = new Error('Cita no encontrada'); e.statusCode = 404; throw e; }

    const note = await prisma.sessionNote.create({
      data: { appointmentId, userId: adminId, content, isPrivate },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return { note };
  },

  async update(id, content) {
    const note = await prisma.sessionNote.findUnique({ where: { id } });
    if (!note) { const e = new Error('Nota no encontrada'); e.statusCode = 404; throw e; }
    const updated = await prisma.sessionNote.update({ where: { id }, data: { content } });
    return { note: updated };
  },

  async delete(id) {
    const note = await prisma.sessionNote.findUnique({ where: { id } });
    if (!note) { const e = new Error('Nota no encontrada'); e.statusCode = 404; throw e; }
    await prisma.sessionNote.delete({ where: { id } });
    return { message: 'Nota eliminada' };
  },
};
