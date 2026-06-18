import 'dotenv/config';
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await db.admin.findUnique({ where: { username } });
  const passwordHash = await bcrypt.hash(password, 10);

  if (!existing) {
    await db.admin.create({
      data: {
        username,
        passwordHash,
        name,
        email: 'admin@atherdealership.in',
        role: 'admin',
      },
    });
    console.log(`Admin user created: ${username}`);
  } else {
    await db.admin.update({
      where: { username },
      data: { passwordHash, name },
    });
    console.log(`Admin user updated: ${username}`);
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  });
