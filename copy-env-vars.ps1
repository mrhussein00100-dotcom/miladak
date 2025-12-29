# Copy Environment Variables Script
Write-Host "Copying environment variables for Vercel..." -ForegroundColor Green
Write-Host ""

# Environment Variables
$envVars = @"
DATABASE_TYPE=postgresql
POSTGRES_URL=postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require
GROQ_API_KEY=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
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

# Copy to clipboard
$envVars | Set-Clipboard

Write-Host "Environment variables copied to clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select miladak project" -ForegroundColor White
Write-Host "3. Settings -> Environment Variables" -ForegroundColor White
Write-Host "4. Add each variable individually" -ForegroundColor White
Write-Host "5. Select Production, Preview, and Development" -ForegroundColor White
Write-Host ""
Write-Host "Total variables: 13" -ForegroundColor Cyan
Write-Host "Time required: 3 minutes" -ForegroundColor Cyan
Write-Host ""

# Open Vercel Dashboard
Write-Host "Opening Vercel Dashboard..." -ForegroundColor Blue
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "After adding variables, site will be available at:" -ForegroundColor Green
Write-Host "https://miladak.vercel.app" -ForegroundColor Cyan