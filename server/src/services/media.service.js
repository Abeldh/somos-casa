import prisma from '../config/database.js';
import { cache } from '../utils/cache.js';

export const mediaService = {
  async getAll(type) {
    const where = {};
    if (type) where.type = type;
    const media = await prisma.media.findMany({ where, orderBy: { order: 'asc' } });
    return { media };
  },

  async getActive(type) {
    const cacheKey = `media:active:${type || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const where = { isActive: true };
    if (type) where.type = type;
    const media = await prisma.media.findMany({ where, orderBy: { order: 'asc' } });
    const result = { media };
    cache.set(cacheKey, result, 300); // 5 min
    return result;
  },

  async create({ type, title, url, description, category, thumbnail }) {
    const maxOrder = await prisma.media.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order || 0) + 1;
    const item = await prisma.media.create({ data: { type, title, url, description, category, thumbnail, order } });
    cache.invalidatePattern('media:');
    return { media: item };
  },

  async update(id, data) {
    const item = await prisma.media.update({ where: { id }, data });
    cache.invalidatePattern('media:');
    return { media: item };
  },

  async remove(id) {
    await prisma.media.delete({ where: { id } });
    cache.invalidatePattern('media:');
    return { message: 'Contenido eliminado' };
  },

  async reorder(items) {
    const updates = items.map((item, index) => prisma.media.update({ where: { id: item.id }, data: { order: index + 1 } }));
    await prisma.$transaction(updates);
    cache.invalidatePattern('media:');
    return { message: 'Orden actualizado' };
  },
};
