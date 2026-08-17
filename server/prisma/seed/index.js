import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@somoscasa.com' },
    update: {},
    create: {
      email: 'admin@somoscasa.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'SomosCasa',
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin creado:', admin.email);

  // Create test client user
  const clientPassword = await bcrypt.hash('cliente123', 12);
  const client = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      password: clientPassword,
      firstName: 'María',
      lastName: 'González',
      phone: '+52 555 111 2233',
      role: 'CLIENT',
    },
  });
  console.log('👤 Cliente creado:', client.email);

  // Create sample availability (next 7 days, 9am-5pm)
  const today = new Date();
  const slots = [];
  for (let d = 1; d <= 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    date.setHours(0, 0, 0, 0);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    for (const hour of hours) {
      const [h] = hour.split(':');
      const endHour = `${String(parseInt(h) + 1).padStart(2, '0')}:00`;
      slots.push({ date, startTime: hour, endTime: endHour });
    }
  }

  await prisma.availability.createMany({ data: slots, skipDuplicates: true });
  console.log(`📅 ${slots.length} horarios de disponibilidad creados`);

  // Create sample media
  const mediaItems = [
    {
      type: 'SPOTIFY',
      title: 'Comunicación efectiva en el matrimonio',
      url: 'https://open.spotify.com/episode/example1',
      description: 'Aprende las claves para una comunicación sana y efectiva.',
      category: 'Comunicación',
      order: 1,
    },
    {
      type: 'SPOTIFY',
      title: 'Finanzas en pareja: cómo evitar conflictos',
      url: 'https://open.spotify.com/episode/example2',
      description: 'Consejos prácticos para manejar el dinero en el matrimonio.',
      category: 'Finanzas',
      order: 2,
    },
    {
      type: 'YOUTUBE',
      title: '5 lenguajes del amor explicados',
      url: 'https://www.youtube.com/watch?v=example1',
      description: 'Descubre cuál es tu lenguaje del amor y el de tu pareja.',
      category: 'Intimidad',
      order: 3,
    },
    {
      type: 'YOUTUBE',
      title: 'Resolución de conflictos sin gritar',
      url: 'https://www.youtube.com/watch?v=example2',
      description: 'Técnicas probadas para resolver desacuerdos de forma sana.',
      category: 'Conflictos',
      order: 4,
    },
  ];

  for (const item of mediaItems) {
    await prisma.media.upsert({
      where: { id: item.title.slice(0, 8) },
      update: {},
      create: item,
    });
  }
  await prisma.media.createMany({ data: mediaItems, skipDuplicates: true });
  console.log(`🎬 ${mediaItems.length} contenidos multimedia creados`);

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
