import { env } from './config/env.js';
import app from './app.js';
import prisma from './config/database.js';
import { cleanupExpiredTokens } from './services/token.service.js';

// ═══════════════════════════════════════════════════════════════
// Validación de variables de entorno críticas ANTES de arrancar
// ═══════════════════════════════════════════════════════════════
function validateEnv() {
  const errors = [];
  if (!process.env.DATABASE_URL) errors.push('DATABASE_URL no definida');
  if (!process.env.JWT_SECRET) errors.push('JWT_SECRET no definida');
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET debe tener mínimo 32 caracteres');
  }
  if (errors.length > 0) {
    console.error('🚨 ERRORES DE CONFIGURACIÓN:');
    errors.forEach((e) => console.error(`   ❌ ${e}`));
    console.error('   Corrige las variables de entorno antes de iniciar.');
    process.exit(1);
  }
}

validateEnv();

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

    // Limpieza de refresh tokens expirados cada 6 horas
    setInterval(async () => {
      const cleaned = await cleanupExpiredTokens();
      if (cleaned > 0) console.log(`🧹 ${cleaned} tokens expirados eliminados`);
    }, 6 * 60 * 60 * 1000);

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
