import prisma from '../config/database.js';

export const userService = {
  async getAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, isActive: true, createdAt: true,
        _count: { select: { orders: true, appointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { users };
  },

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, isActive: true, createdAt: true,
      },
    });
    if (!user) { const e = new Error('Usuario no encontrado'); e.statusCode = 404; throw e; }
    return { user };
  },

  /**
   * Obtener detalle completo de un usuario con toda su actividad
   */
  async getUserActivity(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, isActive: true, createdAt: true,
      },
    });
    if (!user) { const e = new Error('Usuario no encontrado'); e.statusCode = 404; throw e; }

    // Órdenes/compras
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { book: { select: { title: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Citas
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Audit logs (actividad de seguridad)
    const auditLogs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Sesiones activas (refresh tokens no revocados)
    const activeSessions = await prisma.refreshToken.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      select: { id: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Estadísticas
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.total, 0),
      totalAppointments: appointments.length,
      activeSessions: activeSessions.length,
    };

    return { user, orders, appointments, auditLogs, activeSessions, stats };
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
    if (!existing) { const e = new Error('Usuario no encontrado'); e.statusCode = 404; throw e; }
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: !existing.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });
    return { user };
  },
};
