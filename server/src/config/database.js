import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Middleware: soft delete filter — excluye usuarios con deletedAt en queries de lectura
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    // En findMany y count, filtrar soft-deleted automáticamente
    if (params.action === 'findMany' || params.action === 'count') {
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};
      // Solo agregar filtro si no se especifica explícitamente deletedAt
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    // En findFirst y findUnique, filtrar si no se pide explícitamente
    if (params.action === 'findFirst') {
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    // Interceptar delete → convertir a soft delete (update con deletedAt)
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date(), isActive: false };
    }

    // Interceptar deleteMany → convertir a updateMany
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (!params.args) params.args = {};
      params.args.data = { deletedAt: new Date(), isActive: false };
    }
  }

  return next(params);
});

// Prevenir múltiples instancias en hot reload (dev)
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default globalThis.__prisma || prisma;
