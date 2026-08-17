import { env } from './config/env.js';
import app from './app.js';
import prisma from './config/database.js';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada');

    app.listen(env.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
      console.log(`📡 API disponible en http://localhost:${env.port}/api`);
      console.log(`🌍 Entorno: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n👋 Servidor detenido');
  process.exit(0);
});

main();
