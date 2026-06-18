#!/bin/bash
# ==============================================
# Ather Energy Dealership - Production Start Script
# ==============================================
set -e

echo "[start] Ather Energy Dealership Server Starting..."
echo "[start] Node version: $(node -v)"
echo "[start] NODE_ENV: ${NODE_ENV:-not set}"
echo "[start] PORT: ${PORT:-3000}"
echo "[start] HOSTNAME: ${HOSTNAME:-0.0.0.0}"
echo "[start] DATABASE_URL: ${DATABASE_URL:+set (${#DATABASE_URL} chars)}"
if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):\([0-9]*\)\/.*/\1/p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):\([0-9]*\)\/.*/\2/p')
  echo "[start] DB HOST: ${DB_HOST:-unknown}"
  echo "[start] DB PORT: ${DB_PORT:-unknown}"

  # Validate PgBouncer flags when using Supabase pooler (port 6543)
  if echo "$DB_PORT" | grep -q '6543'; then
    if echo "$DATABASE_URL" | grep -q 'pgbouncer=true'; then
      echo "[start] PgBouncer flags: OK"
    else
      echo "[start] WARNING: Port 6543 detected but ?pgbouncer=true is MISSING!"
      echo "[start] Add '?pgbouncer=true&connection_limit=1' to your DATABASE_URL to prevent 42P05 errors."
    fi
  fi
fi
echo "[start] JWT_SECRET: ${JWT_SECRET:+set (${#JWT_SECRET} chars)}"
echo "[start] SEED_ADMIN_USERNAME: ${SEED_ADMIN_USERNAME:-admin}"
echo "[start] Working directory: $(pwd)"

# Run database setup (won't crash if DB is unavailable)
echo "[start] Running database setup..."
npx tsx scripts/deploy.ts || echo "[start] Database setup skipped (non-fatal)"

# Start Next.js standalone server
echo "[start] Starting Next.js standalone server..."
echo "[start] Listening on ${HOSTNAME:-0.0.0.0}:${PORT:-3000}"
exec node .next/standalone/server.js
