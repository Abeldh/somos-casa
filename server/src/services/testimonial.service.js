import prisma from '../config/database.js';
import { cache } from '../utils/cache.js';

export const testimonialService = {
  // Público: obtener testimonios aprobados (para landing)
  async getApproved() {
    const cached = cache.get('testimonials:approved');
    if (cached) return cached;

    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const result = { testimonials };
    cache.set('testimonials:approved', result, 300); // 5 min cache
    return result;
  },

  // Usuario: crear testimonio (queda pendiente de aprobación)
  async create(userId, { name, text, rating }) {
    const testimonial = await prisma.testimonial.create({
      data: { userId, name, text, rating: Math.min(Math.max(rating || 5, 1), 5) },
    });
    return { testimonial };
  },

  // Admin: obtener todos (aprobados y pendientes) — paginado
  async getAll({ page = 1, limit = 10 } = {}) {
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (p - 1) * l;
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: l,
      }),
      prisma.testimonial.count(),
    ]);
    return { testimonials, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  },

  // Admin: aprobar testimonio
  async approve(id) {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { isApproved: true },
    });
    cache.invalidatePattern('testimonials:');
    return { testimonial };
  },

  // Admin: rechazar/eliminar
  async remove(id) {
    await prisma.testimonial.delete({ where: { id } });
    cache.invalidatePattern('testimonials:');
    return { message: 'Testimonio eliminado' };
  },

  // Admin: toggle aprobación
  async toggleApproval(id) {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) { const e = new Error('No encontrado'); e.statusCode = 404; throw e; }
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { isApproved: !existing.isApproved },
    });
    cache.invalidatePattern('testimonials:');
    return { testimonial };
  },
};
