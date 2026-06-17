import 'dotenv/config';
import { execSync } from 'child_process';

console.log('=== Database Setup ===');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.length + ' chars)' : 'NOT SET'}`);

// Test basic connectivity first
try {
  console.log('Testing database connectivity...');
  execSync('node -e "const { PrismaClient } = require(\'@prisma/client\'); const p = new PrismaClient(); p.$queryRaw`SELECT 1`.then(() => { console.log(\'DB connection OK\'); process.exit(0); }).catch(e => { console.error(\'DB connection FAILED:\', e.message); process.exit(1); })"', {
    stdio: 'inherit',
    env: process.env,
    timeout: 15000,
  });
  console.log('Database is reachable!');
} catch (e) {
  console.error('Database connectivity test failed. Skipping DB setup.');
  process.exit(0);
}

// Migrate old schema columns if needed (idempotent - safe to run multiple times)
try {
  console.log('Running schema migration...');
  execSync('node -e "
    const { PrismaClient } = require(\'@prisma/client\');
    const p = new PrismaClient();
    (async () => {
      // Check if old column \'password\' exists
      const rows = await p.\$queryRawUnsafe(\"SELECT column_name FROM information_schema.columns WHERE table_name=\'Admin\' AND column_name=\'password\'\");
      if (rows.length > 0) {
        console.log(\'Old schema detected - migrating...\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"Admin\" RENAME COLUMN \"password\" TO \"passwordHash\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"Admin\" DROP COLUMN IF EXISTS \"isActive\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"Admin\" DROP COLUMN IF EXISTS \"activeSessionId\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"Admin\" DROP COLUMN IF EXISTS \"activeSessionExpires\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"Admin\" DROP COLUMN IF EXISTS \"lastLogin\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" RENAME COLUMN \"sessionId\" TO \"token\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" DROP COLUMN IF EXISTS \"deviceId\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" DROP COLUMN IF EXISTS \"userAgent\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" DROP COLUMN IF EXISTS \"ipAddress\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" DROP COLUMN IF EXISTS \"lastActive\"\');
        await p.\$executeRawUnsafe(\'ALTER TABLE \"AdminSession\" DROP COLUMN IF EXISTS \"isValid\"\');
        await p.\$executeRawUnsafe(\'DELETE FROM \"AdminSession\"\');
        console.log(\'Migration complete - old sessions cleared\');
      } else {
        console.log(\'Schema already up to date\');
      }
    })().catch(e => console.error(\'Migration check failed:\', e.message)).finally(() => p.\$disconnect());
  "', {
    stdio: 'inherit',
    env: process.env,
    timeout: 30000,
  });
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
