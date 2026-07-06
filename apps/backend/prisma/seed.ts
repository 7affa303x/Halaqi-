import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@halaqi.app',
      password: passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+966500000001',
      role: UserRole.ADMIN,
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: 'owner@halaqi.app',
      password: passwordHash,
      firstName: 'Shop',
      lastName: 'Owner',
      phone: '+966500000002',
      role: UserRole.OWNER,
    },
  });

  const barberUser = await prisma.user.create({
    data: {
      email: 'barber@halaqi.app',
      password: passwordHash,
      firstName: 'Master',
      lastName: 'Barber',
      phone: '+966500000003',
      role: UserRole.BARBER,
    },
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@halaqi.app',
      password: passwordHash,
      firstName: 'Happy',
      lastName: 'Client',
      phone: '+966500000004',
      role: UserRole.CLIENT,
    },
  });

  const barbershop = await prisma.barbershop.create({
    data: {
      name: 'Halaqi Premium Barbershop',
      slug: 'halaqi-premium',
      description: 'The finest barbershop experience in town.',
      address: '123 Main Street, Al Olaya',
      city: 'Riyadh',
      phone: '+966500000005',
      email: 'contact@halaqi.app',
      ownerId: owner.id,
      workingHours: {
        create: [
          { dayOfWeek: 0, openTime: '14:00', closeTime: '22:00' },
          { dayOfWeek: 1, openTime: '10:00', closeTime: '22:00' },
          { dayOfWeek: 2, openTime: '10:00', closeTime: '22:00' },
          { dayOfWeek: 3, openTime: '10:00', closeTime: '22:00' },
          { dayOfWeek: 4, openTime: '10:00', closeTime: '22:00' },
          { dayOfWeek: 5, openTime: '10:00', closeTime: '23:00' },
          { dayOfWeek: 6, openTime: '14:00', closeTime: '23:00' },
        ],
      },
    },
  });

  const barber = await prisma.barber.create({
    data: {
      userId: barberUser.id,
      barbershopId: barbershop.id,
      bio: 'Expert in fades and beard trims with 10 years of experience.',
      specialties: ['Haircut', 'Beard Trim', 'Fade'],
    },
  });

  await prisma.service.createMany({
    data: [
      { barbershopId: barbershop.id, name: 'Classic Haircut', durationMinutes: 30, price: 60.00 },
      { barbershopId: barbershop.id, name: 'Beard Trim', durationMinutes: 15, price: 30.00 },
      { barbershopId: barbershop.id, name: 'Haircut & Beard', durationMinutes: 45, price: 80.00 },
      { barbershopId: barbershop.id, name: 'Hot Towel Shave', durationMinutes: 30, price: 50.00 },
      { barbershopId: barbershop.id, name: 'Hair Coloring', durationMinutes: 60, price: 150.00 },
    ],
  });

  console.log('Seed completed successfully.');
  console.log({ admin: admin.email, owner: owner.email, barber: barberUser.email, client: client.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
