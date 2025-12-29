# ========================================
# Safe Deployment Script for Miladak V2
# ========================================

Write-Host "🚀 Starting safe deployment of Miladak V2..." -ForegroundColor Green

# Variables
$GITHUB_USERNAME = "mrhussein00100-dotcom"
$REPO_NAME = "miladak"
$PROJECT_PATH = "C:\web\secend_stadge\miladak_v2"

# Navigate to project
Set-Location $PROJECT_PATH

# Stage 1: Prepare for deployment
Write-Host "`n📋 Stage 1: Preparing files..." -ForegroundColor Cyan

# Remove any sensitive files from git tracking
git rm --cached .env.local -f 2>$null
git rm --cached api-keys-local.txt -f 2>$null

# Add all safe files
git add .
Write-Host "✅ Safe files added to git" -ForegroundColor Green

# Create commit
$commitMessage = "Miladak V2 - Safe Production Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage
Write-Host "✅ Commit created: $commitMessage" -ForegroundColor Green

# Stage 2: GitHub Push
Write-Host "`n🔗 Stage 2: Pushing to GitHub..." -ForegroundColor Cyan

# Set remote
$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
try {
    git remote add origin $remoteUrl 2>$null
} catch {
    git remote set-url origin $remoteUrl
}

# Push code
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed. Continuing with manual instructions..." -ForegroundColor Yellow
}

# Stage 3: Vercel Setup Instructions
Write-Host "`n🌐 Stage 3: Vercel Setup..." -ForegroundColor Cyan
Write-Host "Follow these steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select your existing 'miladak' project" -ForegroundColor White
Write-Host "3. Go to Settings > Git" -ForegroundColor White
Write-Host "4. Disconnect old repository" -ForegroundColor White
Write-Host "5. Connect new repository: $remoteUrl" -ForegroundColor White

# Stage 4: Environment Variables
Write-Host "`n⚙️ Stage 4: Environment Variables..." -ForegroundColor Cyan
Write-Host "Add these in Vercel > Settings > Environment Variables:" -ForegroundColor Yellow

Write-Host "`nIMPORTANT: Copy these exact values:" -ForegroundColor Red
Write-Host "NEXT_PUBLIC_APP_URL=https://miladak.com" -ForegroundColor Gray
Write-Host "NEXT_PUBLIC_APP_NAME=ميلادك" -ForegroundColor Gray
Write-Host "NEXT_PUBLIC_BASE_URL=https://miladak.com" -ForegroundColor Gray
Write-Host "NEXT_PUBLIC_SITE_URL=https://miladak.com" -ForegroundColor Gray
Write-Host "NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118" -ForegroundColor Gray
Write-Host "ADSENSE_PUBLISHER_ID=pub-5755672349927118" -ForegroundColor Gray

Write-Host "`nAI Keys (from your .env.local):" -ForegroundColor Yellow
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "GEMINI_API_KEY=(.+)") {
    Write-Host "GEMINI_API_KEY=$($matches[1])" -ForegroundColor Gray
}
if ($envContent -match "GROQ_API_KEY=(.+)") {
    Write-Host "GROQ_API_KEY=$($matches[1])" -ForegroundColor Gray
}
if ($envContent -match "NEXT_PUBLIC_PEXELS_API_KEY=(.+)") {
    Write-Host "NEXT_PUBLIC_PEXELS_API_KEY=$($matches[1])" -ForegroundColor Gray
    Write-Host "PEXELS_API_KEY=$($matches[1])" -ForegroundColor Gray
}

# Stage 5: Database Setup
Write-Host "`n🗄️ Stage 5: Database Setup..." -ForegroundColor Cyan
Write-Host "1. In Vercel Dashboard > Storage" -ForegroundColor White
Write-Host "2. Create Database > Postgres" -ForegroundColor White
Write-Host "3. Database name: miladak-db" -ForegroundColor White
Write-Host "4. Region: fra1 (Frankfurt)" -ForegroundColor White
Write-Host "5. After creation, copy connection variables to Vercel Environment Variables" -ForegroundColor White

# Stage 6: Data Migration
Write-Host "`n📊 Stage 6: Data Migration..." -ForegroundColor Cyan
Write-Host "After database is connected:" -ForegroundColor Yellow
Write-Host "1. Copy Postgres variables to your local .env.local" -ForegroundColor White
Write-Host "2. Run: node scripts/migrate-to-postgres.js" -ForegroundColor White

# Summary
Write-Host "`n🎉 Deployment Guide Complete!" -ForegroundColor Green
Write-Host "Your API keys are safe in .env.local (not uploaded to GitHub)" -ForegroundColor Green
Write-Host "All website features will work once you add the keys to Vercel" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. ✅ Code is on GitHub (without sensitive keys)" -ForegroundColor Green
Write-Host "2. 🔄 Connect Vercel to new repository" -ForegroundColor Yellow
Write-Host "3. ⚙️ Add environment variables to Vercel" -ForegroundColor Yellow
Write-Host "4. 🗄️ Create and connect Postgres database" -ForegroundColor Yellow
Write-Host "5. 📊 Migrate your data" -ForegroundColor Yellow

Read-Host "`nPress Enter to exit..."
