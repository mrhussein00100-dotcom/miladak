# Deploy Script for Miladak v2
Write-Host "Starting deployment preparation..." -ForegroundColor Green

# Test database
Write-Host "Testing database..." -ForegroundColor Yellow
node scripts/test-database-simple.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database test passed!" -ForegroundColor Green
} else {
    Write-Host "Database test failed!" -ForegroundColor Red
    exit 1
}

# Create production env file
Write-Host "Creating production environment file..." -ForegroundColor Yellow

$envContent = @"
DATABASE_TYPE=postgresql
GROQ_API_KEY=[GROQ_API_KEY_HIDDEN]
GEMINI_API_KEY=AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM
PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx
NEXT_PUBLIC_PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118
NEXT_PUBLIC_APP_URL=https://miladak.vercel.app
NEXT_PUBLIC_APP_NAME=Miladak
NEXT_PUBLIC_BASE_URL=https://miladak.vercel.app
NEXT_PUBLIC_SITE_URL=https://miladak.vercel.app
AUTH_SECRET=miladak_production_secret_2025_strong_key_xyz123
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "Production environment file created!" -ForegroundColor Green

# Prepare Git
Write-Host "Preparing Git commit..." -ForegroundColor Yellow
git add .
git commit -m "feat: Production deployment ready - all systems go"

Write-Host "Deployment preparation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create PostgreSQL database in Vercel" -ForegroundColor White
Write-Host "2. Add environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "3. Run migration: node scripts/migrate-to-postgres-complete.js" -ForegroundColor White
Write-Host "4. Deploy: git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "System ready for deployment!" -ForegroundColor Green
