import prisma from '../config/database.js';
import { emailService } from './email.service.js';
import { audit, EVENTS } from '../utils/auditLog.js';

function genNum() {
  const d = new Date();
  return `SC-${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export const orderService = {
  async create(userId, shipping) {
    const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { book: true } });
    if (!cartItems.length) { const e = new Error('Carrito vacío'); e.statusCode = 422; throw e; }
    for (const i of cartItems) {
      if (i.quantity > i.book.stock) { const e = new Error(`Stock insuficiente: ${i.book.title}`); e.statusCode = 422; throw e; }
    }

    const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
    const shippingCost = 0; // Libros digitales no tienen envío
    const total = subtotal;

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId, orderNumber: genNum(), subtotal, shippingCost, total,
          shippingName: shipping.name, shippingPhone: shipping.phone,
          notes: shipping.notes,
          items: { create: cartItems.map(i => ({ bookId: i.bookId, title: i.book.title, price: i.book.price, quantity: i.quantity })) },
        },
        include: { items: true },
      });
      for (const i of cartItems) {
        // Lock optimista: solo decrementa si hay stock suficiente
        const updated = await tx.book.updateMany({
          where: { id: i.bookId, stock: { gte: i.quantity } },
          data: { stock: { decrement: i.quantity } },
        });
        if (updated.count === 0) {
          throw Object.assign(new Error(`Stock agotado para "${i.book.title}" durante el proceso`), { statusCode: 409 });
        }
      }
      await tx.cartItem.deleteMany({ where: { userId } });
      return o;
    });

    return { order };
  },

  async getByUser(userId) {
    return {
      orders: await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { book: { select: { id: true, title: true, coverImage: true, slug: true, pdfUrl: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
    };
  },

  async getById(id, userId) {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { book: { select: { id: true, title: true, coverImage: true, slug: true, pdfUrl: true } } } } },
    });
    if (!order) { const e = new Error('No encontrada'); e.statusCode = 404; throw e; }
    return { order };
  },

  // Admin
  async getAll(status, page = 1, limit = 50) {
    const where = {};
    if (status) where.status = status;
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
          items: { include: { book: { select: { id: true, title: true, coverImage: true, pdfUrl: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id, status) {
    const data = { status };
    if (status === 'PAID') data.paidAt = new Date();
    if (status === 'SHIPPED') data.shippedAt = new Date();
    if (status === 'DELIVERED') data.deliveredAt = new Date();
    return { order: await prisma.order.update({ where: { id }, data }) };
  },

  /**
   * Confirmar pago — Libera los libros para descarga y notifica al usuario
   */
  async confirmPayment(orderId, req = null) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, email: true, firstName: true } },
        items: { include: { book: { select: { title: true } } } },
      },
    });

    if (!order) { const e = new Error('Orden no encontrada'); e.statusCode = 404; throw e; }
    if (order.status === 'PAID') { const e = new Error('Esta orden ya fue confirmada'); e.statusCode = 422; throw e; }

    // Actualizar estado a PAID
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID', paidAt: new Date() },
      include: { items: { include: { book: { select: { title: true } } } } },
    });

    // Enviar email al usuario
    const bookTitles = order.items.map(i => i.book.title).join(', ');
    emailService.sendDownloadReady({
      to: order.user.email,
      firstName: order.user.firstName,
      orderNumber: order.orderNumber,
      books: bookTitles,
    });

    // Audit log
    await audit(EVENTS.ORDER_STATUS_CHANGED, {
      userId: order.user.id,
      detail: `Payment confirmed for order ${order.orderNumber}. Books released: ${bookTitles}`,
      req,
    });

    return { order: updated };
  },

  /**
   * Obtener libros disponibles para descarga (solo de órdenes PAID)
   */
  async getMyBooks(userId) {
    const orders = await prisma.order.findMany({
      where: { userId, status: 'PAID' },
      include: {
        items: {
          include: {
            book: { select: { id: true, title: true, author: true, coverImage: true, pdfUrl: true, slug: true } },
          },
        },
      },
    });

    // Flatten: extraer todos los libros de todas las órdenes pagadas
    const booksMap = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        if (item.book.pdfUrl && !booksMap.has(item.book.id)) {
          booksMap.set(item.book.id, {
            ...item.book,
            purchasedAt: order.paidAt,
            orderNumber: order.orderNumber,
          });
        }
      }
    }

    return { books: Array.from(booksMap.values()) };
  },
};
