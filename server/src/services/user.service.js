import prisma from '../config/database.js';

export const userService = {
  async getAll() {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return { users };
  },

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true },
    });
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return { user };
  },

  async updateRole(id, role) {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    return { user };
  },

  async toggleActive(id) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: !existing.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });
    return { user };
  },
};
