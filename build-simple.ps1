# Build script for deployment
Write-Host "Building project for deployment..." -ForegroundColor Yellow

# Clean old files
Write-Host "1. Cleaning old files..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   Cleaned .next directory" -ForegroundColor Green
}

# Set environment variables for build
Write-Host "2. Setting environment variables..." -ForegroundColor Cyan
$env:SKIP_DATABASE_INIT = "true"
$env:DATABASE_TYPE = "sqlite"
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"
Write-Host "   Environment variables set" -ForegroundColor Green

# Build
Write-Host "3. Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to deploy! Run: vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host "Build failed" -ForegroundColor Red
    Write-Host "Please check errors above" -ForegroundColor Yellow
}