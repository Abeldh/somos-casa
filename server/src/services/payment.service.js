import prisma from '../config/database.js';
import { notificationService } from './notification.service.js';

export const paymentService = {
  async create({ userId, type, method = 'TRANSFER', amount, reference, orderId, proofUrl, notes }) {
    const payment = await prisma.payment.create({
      data: { userId, type, method, amount, reference, orderId, proofUrl, notes },
    });
    return { payment };
  },

  async getByUser(userId) {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { payments };
  },

  async getAll({ status, type, page = 1, limit = 50 } = {}) {
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parsedLimit,
      }),
      prisma.payment.count({ where }),
    ]);
    return { payments, total, page: parsedPage, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit) };
  },

  async verify(id, adminId) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) { const e = new Error('Pago no encontrado'); e.statusCode = 404; throw e; }
    if (payment.status !== 'PENDING') { const e = new Error('Este pago ya fue procesado'); e.statusCode = 422; throw e; }

    const updated = await prisma.payment.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedBy: adminId, verifiedAt: new Date() },
    });

    // Notificar al usuario
    await notificationService.create({
      userId: payment.userId,
      type: 'PAYMENT_VERIFIED',
      title: 'Pago verificado',
      message: `Tu pago de $${payment.amount} MXN ha sido verificado.`,
      link: '/dashboard',
    });

    return { payment: updated };
  },

  async reject(id, adminId, rejectionNote = '') {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) { const e = new Error('Pago no encontrado'); e.statusCode = 404; throw e; }
    if (payment.status !== 'PENDING') { const e = new Error('Este pago ya fue procesado'); e.statusCode = 422; throw e; }

    const updated = await prisma.payment.update({
      where: { id },
      data: { status: 'REJECTED', rejectedAt: new Date(), rejectionNote },
    });

    await notificationService.create({
      userId: payment.userId,
      type: 'GENERAL',
      title: 'Pago rechazado',
      message: rejectionNote || 'Tu comprobante de pago fue rechazado. Por favor, verifica los datos y vuelve a intentar.',
      link: '/dashboard',
    });

    return { payment: updated };
  },

  async getSummary() {
    const [pending, verified, totalAmount] = await Promise.all([
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'VERIFIED' } }),
      prisma.payment.aggregate({ where: { status: 'VERIFIED' }, _sum: { amount: true } }),
    ]);
    return { pending, verified, totalRevenue: totalAmount._sum.amount || 0 };
  },
};
