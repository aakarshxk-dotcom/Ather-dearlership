import 'dotenv/config';
import { execSync } from 'child_process';

console.log('=== Database Setup ===');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.length + ' chars)' : 'NOT SET'}`);
console.log(`DIRECT_URL: ${process.env.DIRECT_URL ? 'set (' + process.env.DIRECT_URL.length + ' chars)' : 'NOT SET'}`);

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
  console.error('Database connectivity test failed. This is expected if the database has not been set up yet.');
  console.error('Error:', e instanceof Error ? e.message : String(e));
  process.exit(0); // Non-fatal - server can still start for static pages
}

// Push schema
try {
  console.log('Pushing Prisma schema...');
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
    timeout: 30000,
  });
  console.log('Schema push complete');
} catch (e) {
  console.error('Schema push failed:', e instanceof Error ? e.message : e);
  process.exit(0);
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
