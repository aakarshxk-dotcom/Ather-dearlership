# Ather Project - Fix and Build Script
# Run this in PowerShell as Administrator

Write-Host "=== STEP 1: Restore clean lockfile ===" -ForegroundColor Cyan
git checkout 88c4241 -- package-lock.json

Write-Host "=== STEP 2: Delete corrupted bcryptjs ===" -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules/bcryptjs -ErrorAction SilentlyContinue

Write-Host "=== STEP 3: Reinstall bcryptjs properly ===" -ForegroundColor Cyan
npm install bcryptjs@3.0.3 --legacy-peer-deps --save

Write-Host "=== STEP 4: Build ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "=== BUILD PASSED ===" -ForegroundColor Green
    Write-Host "=== STEP 5: Commit and push ===" -ForegroundColor Cyan
    git add -A
    git commit -m "Fix bcryptjs install and clean lockfile"
    git push
    
    Write-Host "=== DONE ===" -ForegroundColor Green
    Write-Host "Now go to Render Dashboard -> Manual Deploy -> Deploy latest commit" -ForegroundColor Yellow
} else {
    Write-Host "=== BUILD FAILED ===" -ForegroundColor Red
    Write-Host "Paste the error output above." -ForegroundColor Yellow
}
