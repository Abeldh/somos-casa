/**
 * Backfill de pagos históricos:
 * Crea un registro Payment (VERIFIED, BOOK_ORDER) por cada orden ya PAGADA
 * que todavía no tenga su Payment asociado. Así el dashboard financiero
 * refleja los ingresos de ventas anteriores a la corrección.
 *
 * Uso: node prisma/backfill-payments.js
 * Es idempotente: puede ejecutarse varias veces sin crear duplicados.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔁 Backfill de pagos para órdenes ya pagadas...');

  const paidOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    select: {
      id: true,
      userId: true,
      total: true,
      orderNumber: true,
      paidAt: true,
      createdAt: true,
      paymentProofUrl: true,
    },
  });

  console.log(`   Órdenes pagadas encontradas: ${paidOrders.length}`);

  let created = 0;
  let skipped = 0;

  for (const order of paidOrders) {
    const existing = await prisma.payment.findFirst({
      where: { orderId: order.id, type: 'BOOK_ORDER', status: 'VERIFIED' },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const verifiedAt = order.paidAt || order.createdAt || new Date();

    await prisma.payment.create({
      data: {
        userId: order.userId,
        type: 'BOOK_ORDER',
        method: 'TRANSFER',
        status: 'VERIFIED',
        amount: order.total,
        orderId: order.id,
        reference: order.orderNumber,
        proofUrl: order.paymentProofUrl || null,
        verifiedAt,
        notes: `Backfill: pago de pedido ${order.orderNumber}`,
      },
    });
    created++;
  }

  console.log(`✅ Backfill completo. Creados: ${created} · Omitidos (ya existían): ${skipped}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
