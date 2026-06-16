import 'dotenv/config';
import { execSync } from 'child_process';

console.log('Running database setup...');

try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: process.env, timeout: 30000 });
  console.log('Migrations complete');
} catch (e) {
  console.error('Migration failed (server will still start):', e instanceof Error ? e.message : e);
}

try {
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit', env: process.env, timeout: 15000 });
  console.log('Seed complete');
} catch (e) {
  console.error('Seed failed (server will still start):', e instanceof Error ? e.message : e);
}

console.log('Database setup complete!');
