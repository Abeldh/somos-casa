import prisma from '../config/database.js';

export const mediaService = {
  async getAll(type) {
    const where = {};
    if (type) where.type = type;

    const media = await prisma.media.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    return { media };
  },

  async getActive(type) {
    const where = { isActive: true };
    if (type) where.type = type;

    const media = await prisma.media.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    return { media };
  },

  async create({ type, title, url, description, category, thumbnail }) {
    const maxOrder = await prisma.media.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order || 0) + 1;

    const item = await prisma.media.create({
      data: { type, title, url, description, category, thumbnail, order },
    });
    return { media: item };
  },

  async update(id, data) {
    const item = await prisma.media.update({
      where: { id },
      data,
    });
    return { media: item };
  },

  async remove(id) {
    await prisma.media.delete({ where: { id } });
    return { message: 'Contenido eliminado' };
  },

  async reorder(items) {
    const updates = items.map((item, index) =>
      prisma.media.update({ where: { id: item.id }, data: { order: index + 1 } })
    );
    await prisma.$transaction(updates);
    return { message: 'Orden actualizado' };
  },
};
