import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding database...');

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await prisma.admin.findUnique({ where: { username } });

  if (!existing) {
    await prisma.admin.create({
      data: {
        username,
        password: hashPassword(password),
        name,
        email: 'admin@atherdealership.in',
        role: 'admin',
        isActive: true,
      },
    });
    console.log(`Admin user created: ${username}`);
  } else {
    console.log(`Admin user already exists: ${username}`);
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
