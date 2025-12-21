# Static build script - no database
Write-Host "Building static version for deployment..." -ForegroundColor Yellow

# Clean
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
}

# Set environment for static build
$env:SKIP_DATABASE_INIT = "true"
$env:DATABASE_TYPE = "none"
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Build with static export
npm run build:static

if ($LASTEXITCODE -eq 0) {
    Write-Host "Static build successful!" -ForegroundColor Green
    Write-Host "Ready to deploy with: vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host "Build failed" -ForegroundColor Red
}