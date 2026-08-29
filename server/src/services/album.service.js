import prisma from '../config/database.js';
import { cache } from '../utils/cache.js';

export const albumService = {
  // Público: fotos aprobadas para la landing (álbum de restauración)
  async getApproved() {
    const cached = cache.get('album:approved');
    if (cached) return cached;

    const photos = await prisma.albumPhoto.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: { id: true, coupleName: true, message: true, photoUrl: true, createdAt: true },
    });
    const result = { photos };
    cache.set('album:approved', result, 300); // 5 min
    return result;
  },

  // Usuario: subir foto (queda pendiente de aprobación)
  async create(userId, { coupleName, message, photoUrl }) {
    const photo = await prisma.albumPhoto.create({
      data: { userId, coupleName, message, photoUrl },
    });
    return { photo };
  },

  // Usuario: sus propias fotos subidas
  async getMine(userId) {
    const photos = await prisma.albumPhoto.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { photos };
  },

  // Admin: todas (aprobadas + pendientes) — paginado
  async getAll({ page = 1, limit = 10 } = {}) {
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (p - 1) * l;
    const [photos, total] = await Promise.all([
      prisma.albumPhoto.findMany({
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: l,
      }),
      prisma.albumPhoto.count(),
    ]);
    return { photos, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  },

  // Admin: alternar aprobación
  async toggleApproval(id) {
    const existing = await prisma.albumPhoto.findUnique({ where: { id } });
    if (!existing) { const e = new Error('Foto no encontrada'); e.statusCode = 404; throw e; }
    const photo = await prisma.albumPhoto.update({
      where: { id },
      data: { isApproved: !existing.isApproved },
    });
    cache.invalidatePattern('album:');
    return { photo };
  },

  // Admin: eliminar
  async remove(id) {
    await prisma.albumPhoto.delete({ where: { id } });
    cache.invalidatePattern('album:');
    return { message: 'Foto eliminada' };
  },
};
