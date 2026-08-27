import prisma from '../config/database.js';

export const couponService = {
  async getAll() {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return { coupons };
  },

  async getById(id) {
    const coupon = await prisma.coupon.findUnique({ where: { id }, include: { usages: true } });
    if (!coupon) { const e = new Error('Cupón no encontrado'); e.statusCode = 404; throw e; }
    return { coupon };
  },

  async create({ code, type, value, appliesTo = 'ALL', minPurchase, maxDiscount, maxUses, startsAt, expiresAt }) {
    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) { const e = new Error('Ya existe un cupón con ese código'); e.statusCode = 409; throw e; }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        appliesTo,
        minPurchase: minPurchase || null,
        maxDiscount: maxDiscount || null,
        maxUses: maxUses || null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return { coupon };
  },

  async update(id, data) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) { const e = new Error('Cupón no encontrado'); e.statusCode = 404; throw e; }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code.toUpperCase() }),
        ...(data.type && { type: data.type }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.appliesTo && { appliesTo: data.appliesTo }),
        ...(data.minPurchase !== undefined && { minPurchase: data.minPurchase }),
        ...(data.maxDiscount !== undefined && { maxDiscount: data.maxDiscount }),
        ...(data.maxUses !== undefined && { maxUses: data.maxUses }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.startsAt !== undefined && { startsAt: data.startsAt ? new Date(data.startsAt) : null }),
        ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }),
      },
    });
    return { coupon: updated };
  },

  async validate(code, userId, subtotal = 0) {
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) { const e = new Error('Cupón no válido'); e.statusCode = 404; throw e; }
    if (!coupon.isActive) { const e = new Error('Este cupón está inactivo'); e.statusCode = 422; throw e; }

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) { const e = new Error('Este cupón aún no está vigente'); e.statusCode = 422; throw e; }
    if (coupon.expiresAt && now > coupon.expiresAt) { const e = new Error('Este cupón ha expirado'); e.statusCode = 422; throw e; }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) { const e = new Error('Este cupón ha alcanzado su límite de usos'); e.statusCode = 422; throw e; }
    if (coupon.minPurchase && subtotal < coupon.minPurchase) { const e = new Error(`El monto mínimo de compra es $${coupon.minPurchase}`); e.statusCode = 422; throw e; }

    // Verificar si el usuario ya usó este cupón
    const alreadyUsed = await prisma.couponUsage.findFirst({ where: { couponId: coupon.id, userId } });
    if (alreadyUsed) { const e = new Error('Ya has usado este cupón'); e.statusCode = 422; throw e; }

    // Calcular descuento
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.value;
    }
    if (discount > subtotal) discount = subtotal;

    return { coupon, discount: Math.round(discount * 100) / 100 };
  },

  async apply(couponId, userId, orderId, discount) {
    await prisma.$transaction([
      prisma.couponUsage.create({ data: { couponId, userId, orderId, discount } }),
      prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } }),
    ]);
  },

  async delete(id) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) { const e = new Error('Cupón no encontrado'); e.statusCode = 404; throw e; }
    await prisma.coupon.delete({ where: { id } });
    return { message: 'Cupón eliminado' };
  },
};
