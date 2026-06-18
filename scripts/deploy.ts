import 'dotenv/config';
import { execSync } from 'child_process';
import { db } from '../src/lib/db';

const DB_URL =
  process.env.DATABASE_URL?.substring(0, 30) +
  '...' +
  (process.env.DATABASE_URL?.includes('@') ? '@' + process.env.DATABASE_URL?.split('@')[1]?.substring(0, 20) : '');

console.log('=== Database Setup ===');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.length + ' chars, host: ' + DB_URL + ')' : 'NOT SET'}`);
console.log(`DIRECT_URL: ${process.env.DIRECT_URL ? 'set' : 'NOT SET'}`);

// Test basic connectivity first
try {
  console.log('Testing database connectivity...');
  await db.$queryRaw`SELECT 1`;
  console.log('Database is reachable!');
} catch (e) {
  console.error('Database connectivity test failed:', e instanceof Error ? e.message : e);
  console.log('Skipping DB setup.');
  process.exit(0);
}

// Migrate old schema columns if needed (idempotent - safe to run multiple times)
try {
  console.log('Running schema migration...');

  const rows: unknown[] = await db.$queryRawUnsafe(
    "SELECT column_name FROM information_schema.columns WHERE table_name='Admin' AND column_name='password'"
  );

  if (Array.isArray(rows) && rows.length > 0) {
    console.log('Old schema detected - migrating...');
    await db.$executeRawUnsafe('ALTER TABLE "Admin" RENAME COLUMN "password" TO "passwordHash"');
    await db.$executeRawUnsafe('ALTER TABLE "Admin" DROP COLUMN IF EXISTS "isActive"');
    await db.$executeRawUnsafe('ALTER TABLE "Admin" DROP COLUMN IF EXISTS "activeSessionId"');
    await db.$executeRawUnsafe('ALTER TABLE "Admin" DROP COLUMN IF EXISTS "activeSessionExpires"');
    await db.$executeRawUnsafe('ALTER TABLE "Admin" DROP COLUMN IF EXISTS "lastLogin"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" RENAME COLUMN "sessionId" TO "token"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" DROP COLUMN IF EXISTS "deviceId"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" DROP COLUMN IF EXISTS "userAgent"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" DROP COLUMN IF EXISTS "ipAddress"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" DROP COLUMN IF EXISTS "lastActive"');
    await db.$executeRawUnsafe('ALTER TABLE "AdminSession" DROP COLUMN IF EXISTS "isValid"');
    await db.$executeRawUnsafe('DELETE FROM "AdminSession"');
    console.log('Migration complete - old sessions cleared');
  } else {
    console.log('Schema already up to date');
  }
} catch (e) {
  console.error('Schema migration step failed (non-fatal):', e instanceof Error ? e.message : e);
}

// Push schema (creates missing tables/columns, updates Prisma client)
try {
  console.log('Pushing Prisma schema...');
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
    timeout: 30000,
  });
  console.log('Schema push complete');
} catch (e) {
  console.error('Schema push failed (non-fatal):', e instanceof Error ? e.message : e);
}

// Seed admin user
try {
  console.log('Running seed...');
  execSync('npx tsx scripts/seed.ts', {
    stdio: 'inherit',
    env: process.env,
    timeout: 15000,
  });
  console.log('Seed complete');
} catch (e) {
  console.error('Seed failed:', e instanceof Error ? e.message : e);
}

console.log('=== Database setup complete ===');
