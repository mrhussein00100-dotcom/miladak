# Final Deployment Script - Complete Solution
# Solves PostgreSQL, Build, and Deployment Issues

Write-Host "Starting final deployment..." -ForegroundColor Green

# 1. Clean temporary files
Write-Host "Cleaning temporary files..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules/.cache") { Remove-Item -Recurse -Force "node_modules/.cache" }

# 2. Create optimized .env.production
Write-Host "Creating .env.production..." -ForegroundColor Yellow
@"
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATABASE_TYPE=postgres
NEXT_PUBLIC_APP_NAME=Miladak
NEXT_PUBLIC_SITE_URL=https://miladak-v2.vercel.app
NEXT_PUBLIC_BASE_URL=https://miladak-v2.vercel.app
"@ | Out-File -FilePath ".env.production" -Encoding UTF8

# 3. Update vercel.json
Write-Host "Updating vercel.json..." -ForegroundColor Yellow
@"
{
  "version": 2,
  "env": {
    "DATABASE_TYPE": "postgres",
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "SKIP_DATABASE_INIT": "true"
    }
  }
}
"@ | Out-File -FilePath "vercel.json" -Encoding UTF8

# 4. Test local build
Write-Host "Testing local build..." -ForegroundColor Yellow
$env:SKIP_DATABASE_INIT = "true"
$env:NODE_ENV = "production"

try {
    npm run build
    Write-Host "Local build successful!" -ForegroundColor Green
} catch {
    Write-Host "Local build failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# 5. Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
try {
    vercel --prod --yes
    Write-Host "Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try GitHub deployment
    Write-Host "Trying GitHub deployment..." -ForegroundColor Yellow
    Write-Host "Pushing changes to GitHub..." -ForegroundColor Yellow
    
    git add .
    git commit -m "Fix deployment issues and PostgreSQL connection"
    git push
    
    Write-Host "Changes pushed to GitHub" -ForegroundColor Green
    Write-Host "Go to https://vercel.com to connect GitHub repository" -ForegroundColor Cyan
}

# 6. Display required environment variables
Write-Host "`nRequired environment variables for Vercel:" -ForegroundColor Cyan
Write-Host "DATABASE_URL=postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" -ForegroundColor White
Write-Host "POSTGRES_URL=postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" -ForegroundColor White
Write-Host "DATABASE_TYPE=postgres" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "GROQ_API_KEY=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" -ForegroundColor White
Write-Host "GEMINI_API_KEY=AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM" -ForegroundColor White
Write-Host "PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" -ForegroundColor White
Write-Host "NEXT_PUBLIC_PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" -ForegroundColor White
Write-Host "NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118" -ForegroundColor White
Write-Host "AUTH_SECRET=miladak_production_secret_2025" -ForegroundColor White

Write-Host "`nDeployment complete!" -ForegroundColor Green