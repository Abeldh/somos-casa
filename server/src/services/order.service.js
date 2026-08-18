import prisma from '../config/database.js';

function generateOrderNumber() {
  const d = new Date();
  const ts = `${d.getFullYear().toString().slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `SC-${ts}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
}

export const orderService = {
  async create(userId, shipping) {
    const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { book: true } });
    if (cartItems.length === 0) { const e = new Error('El carrito está vacío'); e.statusCode = 422; throw e; }

    for (const item of cartItems) {
      if (item.quantity > item.book.stock) { const e = new Error(`Stock insuficiente para "${item.book.title}"`); e.statusCode = 422; throw e; }
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
    const shippingCost = subtotal >= 500 ? 0 : 99;
    const total = subtotal + shippingCost;

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId, orderNumber: generateOrderNumber(), subtotal, shippingCost, total,
          shippingName: shipping.name, shippingPhone: shipping.phone, shippingAddress: shipping.address,
          shippingCity: shipping.city, shippingState: shipping.state, shippingZip: shipping.zip, notes: shipping.notes,
          items: { create: cartItems.map((i) => ({ bookId: i.bookId, title: i.book.title, price: i.book.price, quantity: i.quantity })) },
        },
        include: { items: true },
      });
      for (const item of cartItems) { await tx.book.update({ where: { id: item.bookId }, data: { stock: { decrement: item.quantity } } }); }
      await tx.cartItem.deleteMany({ where: { userId } });
      return o;
    });
    return { order };
  },

  async getByUser(userId) {
    const orders = await prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
    return { orders };
  },

  async getById(orderId, userId) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId }, include: { items: { include: { book: { select: { coverImage: true, slug: true } } } } } });
    if (!order) { const e = new Error('Orden no encontrada'); e.statusCode = 404; throw e; }
    return { order };
  },

  async getAll(status) {
    const where = {};
    if (status) where.status = status;
    const orders = await prisma.order.findMany({ where, include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, items: true }, orderBy: { createdAt: 'desc' } });
    return { orders };
  },

  async updateStatus(orderId, status) {
    const data = { status };
    if (status === 'PAID') data.paidAt = new Date();
    if (status === 'SHIPPED') data.shippedAt = new Date();
    if (status === 'DELIVERED') data.deliveredAt = new Date();
    const order = await prisma.order.update({ where: { id: orderId }, data });
    return { order };
  },
};
