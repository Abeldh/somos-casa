import { env } from './config/env.js';
import app from './app.js';
import prisma from './config/database.js';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada');

    const server = app.listen(env.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
      console.log(`📡 API disponible en http://localhost:${env.port}/api`);
      console.log(`🌍 Entorno: ${env.nodeEnv}`);
      console.log(`💾 Memoria: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    });

    // Timeouts para conexiones lentas
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n📦 ${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('👋 Servidor detenido correctamente');
        process.exit(0);
      });

      // Forzar cierre después de 10s
      setTimeout(() => {
        console.error('⚠️ Forzando cierre...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Error al iniciar:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  process.exit(1);
});

main();
