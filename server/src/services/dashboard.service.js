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
      prisma.order.aggregate({ where: { status: 'PAID', paidAt: { gte: startOfMonth } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { status: 'PAID', paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
      prisma.book.count({ where: { isActive: true } }),
      prisma.referral.count({ where: { status: 'COMPLETED' } }),
    ]);

    const revenueThisMonth = paidOrdersThisMonth._sum.total || 0;
    const revenueLastMonth = paidOrdersLastMonth._sum.total || 0;
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

    // Ingresos mensuales del año — basados en pagos VERIFICADOS de la tabla Payment
    const monthPromises = Array.from({ length: 12 }, (_, m) => {
      const start = new Date(targetYear, m, 1);
      const end = new Date(targetYear, m + 1, 0, 23, 59, 59);
      const dateFilter = { verifiedAt: { gte: start, lte: end } };

      return Promise.all([
        prisma.payment.aggregate({ where: { status: 'VERIFIED', type: 'BOOK_ORDER', ...dateFilter }, _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { status: 'VERIFIED', type: 'SESSION_PACKAGE', ...dateFilter }, _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { status: 'VERIFIED', type: 'OTHER', ...dateFilter }, _sum: { amount: true } }),
      ]).then(([books, sessions, other]) => {
        const b = Math.round((books._sum.amount || 0) * 100) / 100;
        const s = Math.round((sessions._sum.amount || 0) * 100) / 100;
        const o = Math.round((other._sum.amount || 0) * 100) / 100;
        return { month: m + 1, books: b, sessions: s, other: o, total: Math.round((b + s + o) * 100) / 100 };
      });
    });

    const monthlyRevenue = await Promise.all(monthPromises);

    // Top libros vendidos
    let topBooks = [];
    try {
      topBooks = await prisma.orderItem.groupBy({
        by: ['bookId', 'title'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      });
    } catch (e) { /* tabla vacía o sin datos */ }

    // Ingresos totales del año
    const yearTotal = monthlyRevenue.reduce((s, m) => s + m.total, 0);

    // Desglose por método de pago (año en curso)
    const yearStart = new Date(targetYear, 0, 1);
    const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);
    let byMethod = [];
    try {
      byMethod = await prisma.payment.groupBy({
        by: ['method'],
        where: { status: 'VERIFIED', verifiedAt: { gte: yearStart, lte: yearEnd } },
        _sum: { amount: true },
        _count: true,
      });
    } catch (e) { /* sin datos */ }

    // Detalle del mes específico si se pide
    let monthDetail = null;
    if (month) {
      const mStart = new Date(targetYear, month - 1, 1);
      const mEnd = new Date(targetYear, month, 0, 23, 59, 59);
      const payments = await prisma.payment.findMany({
        where: { status: 'VERIFIED', verifiedAt: { gte: mStart, lte: mEnd } },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { verifiedAt: 'desc' },
      });
      monthDetail = { payments, count: payments.length, total: payments.reduce((s, p) => s + p.amount, 0) };
    }

    return { year: targetYear, monthlyRevenue, topBooks, yearTotal, byMethod, monthDetail };
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

  // Panel de salud del sistema (admin)
  async getSystemHealth() {
    // Verificar conexión y latencia de la base de datos
    let db = { status: 'ok', latencyMs: null };
    try {
      const t0 = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      db.latencyMs = Date.now() - t0;
    } catch (e) {
      db = { status: 'error', latencyMs: null, message: e.message };
    }

    const mem = process.memoryUsage();
    const uptimeSec = Math.round(process.uptime());

    // Correo configurado
    const email = { provider: 'Resend', configured: !!process.env.RESEND_API_KEY };

    // Últimos eventos de error/seguridad del audit log (si existen)
    let recentErrors = [];
    try {
      recentErrors = await prisma.auditLog.findMany({
        where: { event: { contains: 'FAIL', mode: 'insensitive' } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, event: true, detail: true, ip: true, createdAt: true },
      });
    } catch (e) { /* sin datos */ }

    // Conteos generales
    const [users, appointments, orders, payments, books, pendingPayments] = await Promise.all([
      prisma.user.count(),
      prisma.appointment.count(),
      prisma.order.count(),
      prisma.payment.count(),
      prisma.book.count(),
      prisma.payment.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      db,
      email,
      server: {
        uptime: uptimeSec,
        uptimeHuman: formatUptime(uptimeSec),
        memoryMB: Math.round(mem.heapUsed / 1024 / 1024),
        memoryTotalMB: Math.round(mem.rss / 1024 / 1024),
        nodeEnv: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      },
      counts: { users, appointments, orders, payments, books, pendingPayments },
      recentErrors,
      checkedAt: new Date().toISOString(),
    };
  },
};

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  parts.push(`${m}m`);
  return parts.join(' ');
}
