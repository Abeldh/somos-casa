import prisma from '../config/database.js';

export const dashboardService = {
  async getAdminMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalAppointments,
      appointmentsThisMonth,
      appointmentsLastMonth,
      cancelledThisMonth,
      completedThisMonth,
      totalOrders,
      ordersThisMonth,
      paidOrdersThisMonth,
      paidOrdersLastMonth,
      activeBooks,
      totalReferrals,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'CLIENT', createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: 'CLIENT', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.appointment.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.appointment.count({ where: { status: 'CANCELLED', createdAt: { gte: startOfMonth } } }),
      prisma.appointment.count({ where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.findMany({ where: { status: 'PAID', paidAt: { gte: startOfMonth } }, select: { total: true } }),
      prisma.order.findMany({ where: { status: 'PAID', paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, select: { total: true } }),
      prisma.book.count({ where: { isActive: true } }),
      prisma.referral.count({ where: { status: 'COMPLETED' } }),
    ]);

    const revenueThisMonth = paidOrdersThisMonth.reduce((sum, o) => sum + o.total, 0);
    const revenueLastMonth = paidOrdersLastMonth.reduce((sum, o) => sum + o.total, 0);
    const cancellationRate = appointmentsThisMonth > 0 ? Math.round((cancelledThisMonth / appointmentsThisMonth) * 100) : 0;

    return {
      users: { total: totalUsers, thisMonth: newUsersThisMonth, lastMonth: newUsersLastMonth },
      appointments: { total: totalAppointments, thisMonth: appointmentsThisMonth, lastMonth: appointmentsLastMonth, completed: completedThisMonth, cancellationRate },
      orders: { total: totalOrders, thisMonth: ordersThisMonth },
      revenue: { thisMonth: revenueThisMonth, lastMonth: revenueLastMonth },
      books: { active: activeBooks },
      referrals: { completed: totalReferrals },
    };
  },

  async getFinancialDashboard({ year, month }) {
    const targetYear = year || new Date().getFullYear();

    // Ingresos mensuales del año
    const monthlyRevenue = [];
    for (let m = 0; m < 12; m++) {
      const start = new Date(targetYear, m, 1);
      const end = new Date(targetYear, m + 1, 0, 23, 59, 59);

      const orders = await prisma.order.findMany({
        where: { status: 'PAID', paidAt: { gte: start, lte: end } },
        select: { total: true },
      });

      // Ingresos por sesiones (usuarios que pagaron en ese mes)
      const sessionPayments = await prisma.user.count({
        where: { sessionsPaidAt: { gte: start, lte: end } },
      });

      monthlyRevenue.push({
        month: m + 1,
        books: Math.round(orders.reduce((s, o) => s + o.total, 0) * 100) / 100,
        sessions: sessionPayments * 500, // $500 por paquete
        total: Math.round(orders.reduce((s, o) => s + o.total, 0) * 100) / 100 + sessionPayments * 500,
      });
    }

    // Top libros vendidos
    const topBooks = await prisma.orderItem.groupBy({
      by: ['bookId', 'title'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    // Ingresos totales del año
    const yearTotal = monthlyRevenue.reduce((s, m) => s + m.total, 0);

    // Detalle del mes específico si se pide
    let monthDetail = null;
    if (month) {
      const mStart = new Date(targetYear, month - 1, 1);
      const mEnd = new Date(targetYear, month, 0, 23, 59, 59);
      const mOrders = await prisma.order.findMany({
        where: { status: 'PAID', paidAt: { gte: mStart, lte: mEnd } },
        include: { items: true, user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { paidAt: 'desc' },
      });
      monthDetail = { orders: mOrders, count: mOrders.length, total: mOrders.reduce((s, o) => s + o.total, 0) };
    }

    return { year: targetYear, monthlyRevenue, topBooks, yearTotal, monthDetail };
  },

  async getRecentActivity(limit = 10) {
    const [recentAppointments, recentOrders, recentUsers] = await Promise.all([
      prisma.appointment.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      prisma.order.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      prisma.user.findMany({
        take: limit,
        where: { role: 'CLIENT' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
      }),
    ]);
    return { recentAppointments, recentOrders, recentUsers };
  },
};
