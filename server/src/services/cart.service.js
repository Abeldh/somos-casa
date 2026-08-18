import prisma from '../config/database.js';

export const cartService = {
  async getCart(userId) {
    const items = await prisma.cartItem.findMany({ where: { userId }, include: { book: true }, orderBy: { createdAt: 'desc' } });
    const subtotal = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    return { items, subtotal, itemCount };
  },

  async addItem(userId, bookId, quantity = 1) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || !book.isActive) { const e = new Error('Libro no disponible'); e.statusCode = 404; throw e; }
    if (book.stock < quantity) { const e = new Error('Stock insuficiente'); e.statusCode = 422; throw e; }

    const existing = await prisma.cartItem.findUnique({ where: { userId_bookId: { userId, bookId } } });
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > book.stock) { const e = new Error('No hay suficiente stock'); e.statusCode = 422; throw e; }
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
    } else {
      await prisma.cartItem.create({ data: { userId, bookId, quantity } });
    }
    return this.getCart(userId);
  },

  async updateQuantity(userId, itemId, quantity) {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) { const e = new Error('Item no encontrado'); e.statusCode = 404; throw e; }
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const book = await prisma.book.findUnique({ where: { id: item.bookId } });
      if (quantity > book.stock) { const e = new Error('Stock insuficiente'); e.statusCode = 422; throw e; }
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }
    return this.getCart(userId);
  },

  async removeItem(userId, itemId) {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) { const e = new Error('Item no encontrado'); e.statusCode = 404; throw e; }
    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  },

  async clearCart(userId) {
    await prisma.cartItem.deleteMany({ where: { userId } });
    return { items: [], subtotal: 0, itemCount: 0 };
  },
};
