import 'dotenv/config';
import { execSync } from 'child_process';

console.log('Running database migrations...');
execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: process.env });

console.log('Seeding database...');
execSync('npx tsx scripts/seed.ts', { stdio: 'inherit', env: process.env });

console.log('Database setup complete!');
