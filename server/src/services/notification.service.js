import prisma from '../config/database.js';

export const notificationService = {
  async getByUser(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { notifications, total, unreadCount, page, limit };
  },

  async getUnreadCount(userId) {
    const count = await prisma.notification.count({ where: { userId, isRead: false } });
    return { unreadCount: count };
  },

  async markAsRead(id, userId) {
    const notification = await prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) { const e = new Error('Notificación no encontrada'); e.statusCode = 404; throw e; }
    const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return { notification: updated };
  },

  async markAllAsRead(userId) {
    const { count } = await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    return { markedCount: count };
  },

  async create({ userId, type = 'GENERAL', title, message, link = null }) {
    const notification = await prisma.notification.create({
      data: { userId, type, title, message, link },
    });
    return { notification };
  },

  async createForAll({ type = 'GENERAL', title, message, link = null }) {
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    const data = users.map((u) => ({ userId: u.id, type, title, message, link }));
    const { count } = await prisma.notification.createMany({ data });
    return { sentCount: count };
  },

  async delete(id, userId) {
    const notification = await prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) { const e = new Error('Notificación no encontrada'); e.statusCode = 404; throw e; }
    await prisma.notification.delete({ where: { id } });
    return { message: 'Notificación eliminada' };
  },
};
