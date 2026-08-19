import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Connection pooling optimizado
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Prevenir múltiples instancias en hot reload (dev)
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default globalThis.__prisma || prisma;
