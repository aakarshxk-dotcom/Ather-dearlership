param(
    [string]$DatabaseUrl = "postgresql://postgres.cwpyludakwuynjkuninc:YOUR_PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
)

Write-Host "===== Ather Energy Dealership - Setup Script =====" -ForegroundColor Green
Write-Host ""

# 1. Create .env file if not exists
if (-not (Test-Path ".env")) {
    @"
DATABASE_URL="$DatabaseUrl"
DIRECT_URL="$DatabaseUrl"
JWT_SECRET="ather-dealership-jwt-secret-$(Get-Random -Maximum 999999)"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Ather Energy Dealership <noreply@atherdealership.in>"
ADMIN_EMAIL="admin@atherdealership.in"
SEED_ADMIN_USERNAME="admin"
SEED_ADMIN_PASSWORD="admin123"
SEED_ADMIN_NAME="Admin"
"@ | Set-Content ".env"
    Write-Host "[OK] .env file created" -ForegroundColor Green
} else {
    Write-Host "[SKIP] .env already exists" -ForegroundColor Yellow
}

# 2. Install dependencies
Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
npm install --legacy-peer-deps --no-audit --no-fund
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed. Check network connection." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Dependencies installed" -ForegroundColor Green

# 3. Generate Prisma client
Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Prisma generate failed." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Prisma client generated" -ForegroundColor Green

# 4. Push database schema
Write-Host ""
Write-Host "Pushing database schema..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Database push failed. Ensure database is running." -ForegroundColor Yellow
}
Write-Host "[OK] Database schema pushed" -ForegroundColor Green

# 5. Seed admin user
Write-Host ""
Write-Host "Seeding admin user..." -ForegroundColor Cyan
npx tsx scripts/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Seed failed." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Admin user seeded (username: admin, password: admin123)" -ForegroundColor Green

# 6. Build
Write-Host ""
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green

Write-Host ""
Write-Host "===== Setup Complete =====" -ForegroundColor Green
Write-Host ""
Write-Host "Admin credentials:" -ForegroundColor Yellow
Write-Host "  URL:      http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Start development server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
