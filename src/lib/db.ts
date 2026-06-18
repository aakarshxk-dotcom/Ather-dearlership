import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined

  // Supabase Transaction Pooler (port 6543) requires PgBouncer flags
  // to prevent "prepared statement already exists" (42P05) errors.
  // Prisma + PgBouncer requires these flags for unnamed prepared statements.
  if (url.includes(':6543/') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    const fixed = `${url}${separator}pgbouncer=true&connection_limit=1`
    if (process.env.NODE_ENV !== 'production') {
      console.log('[db] Auto-appended PgBouncer flags to DATABASE_URL (port 6543)')
    }
    return fixed
  }

  return url
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: buildDatasourceUrl() ?? process.env.DATABASE_URL ?? 'postgresql://localhost:5432/postgres',
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
