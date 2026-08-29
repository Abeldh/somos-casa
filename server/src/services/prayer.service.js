import prisma from '../config/database.js';
import { notificationService } from './notification.service.js';

export const prayerService = {
  // Usuario/público: crear petición de oración
  async create({ userId = null, name, request, isPrivate = true }) {
    const prayer = await prisma.prayerRequest.create({
      data: { userId, name, request, isPrivate: !!isPrivate },
    });
    return { prayer };
  },

  // Usuario: sus propias peticiones (paginado)
  async getMine(userId, { page = 1, limit = 10 } = {}) {
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (p - 1) * l;
    const [prayers, total] = await Promise.all([
      prisma.prayerRequest.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: l }),
      prisma.prayerRequest.count({ where: { userId } }),
    ]);
    return { prayers, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  },

  // Público: muro de oración (solo peticiones NO privadas y no archivadas)
  async getPublicWall() {
    const prayers = await prisma.prayerRequest.findMany({
      where: { isPrivate: false, status: { not: 'ARCHIVED' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { id: true, name: true, request: true, status: true, createdAt: true },
    });
    return { prayers };
  },

  // Admin: todas (paginado)
  async getAll({ status, page = 1, limit = 10 } = {}) {
    const where = {};
    if (status) where.status = status;
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (p - 1) * l;
    const [prayers, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
        skip,
        take: l,
      }),
      prisma.prayerRequest.count({ where }),
    ]);
    return { prayers, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  },

  // Admin: marcar como orada
  async markPrayed(id, adminId) {
    const existing = await prisma.prayerRequest.findUnique({ where: { id } });
    if (!existing) { const e = new Error('Petición no encontrada'); e.statusCode = 404; throw e; }

    const prayer = await prisma.prayerRequest.update({
      where: { id },
      data: { status: 'PRAYED', prayedBy: adminId, prayedAt: new Date() },
    });

    // Notificar al usuario (si tiene cuenta)
    if (existing.userId) {
      await notificationService.create({
        userId: existing.userId,
        type: 'GENERAL',
        title: 'Hemos orado por ti',
        message: 'Tu petición de oración fue recibida y hemos orado por ella. Que Dios te bendiga.',
        link: '/dashboard',
      }).catch(() => {});
    }

    return { prayer };
  },

  // Admin: archivar
  async archive(id) {
    const existing = await prisma.prayerRequest.findUnique({ where: { id } });
    if (!existing) { const e = new Error('Petición no encontrada'); e.statusCode = 404; throw e; }
    const prayer = await prisma.prayerRequest.update({ where: { id }, data: { status: 'ARCHIVED' } });
    return { prayer };
  },

  // Admin: eliminar
  async remove(id) {
    await prisma.prayerRequest.delete({ where: { id } });
    return { message: 'Petición eliminada' };
  },
};
