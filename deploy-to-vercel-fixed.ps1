# ========================================
# Miladak V2 Deployment to Vercel Script
# ========================================

Write-Host "Starting Miladak V2 deployment to Vercel..." -ForegroundColor Green

# Variables
$GITHUB_USERNAME = "mrhussein00100-dotcom"
$REPO_NAME = "miladak"
$PROJECT_PATH = "C:\web\secend_stadge\miladak_v2"

# Check Git availability
try {
    git --version | Out-Null
    Write-Host "Git is available" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git first" -ForegroundColor Red
    exit 1
}

# Navigate to project folder
Set-Location $PROJECT_PATH
Write-Host "Navigating to project folder: $PROJECT_PATH" -ForegroundColor Yellow

# Stage 1: Initialize Git and add files
Write-Host "`nStage 1: Initializing Git..." -ForegroundColor Cyan

# Initialize Git if not exists
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Git initialized" -ForegroundColor Green
}

# Add all files
git add .
Write-Host "All files added" -ForegroundColor Green

# Create commit
$commitMessage = "Miladak V2 - Production Ready $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage
Write-Host "Commit created: $commitMessage" -ForegroundColor Green

# Stage 2: Connect GitHub
Write-Host "`nStage 2: Connecting GitHub..." -ForegroundColor Cyan

# Add remote origin
$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
try {
    git remote add origin $remoteUrl
    Write-Host "Repository connected: $remoteUrl" -ForegroundColor Green
} catch {
    Write-Host "Repository already connected, updating URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
}

# Push code
Write-Host "`nPushing code to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "Code pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to push code. Check GitHub credentials" -ForegroundColor Red
    Write-Host "Make sure Git is configured:" -ForegroundColor Yellow
    Write-Host "   git config --global user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "   git config --global user.email 'mr.hussein00100@gmail.com'" -ForegroundColor Gray
    exit 1
}

# Stage 3: Vercel Information
Write-Host "`nStage 3: Vercel Setup..." -ForegroundColor Cyan
Write-Host "Now you need to:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select existing 'miladak' project" -ForegroundColor White
Write-Host "3. Go to Settings > Git" -ForegroundColor White
Write-Host "4. Disconnect old repository" -ForegroundColor White
Write-Host "5. Connect new repository: $remoteUrl" -ForegroundColor White

# Stage 4: Database Creation
Write-Host "`nStage 4: Database..." -ForegroundColor Cyan
Write-Host "Create Postgres database:" -ForegroundColor Yellow
Write-Host "1. In Vercel Dashboard > Storage" -ForegroundColor White
Write-Host "2. Create Database > Postgres" -ForegroundColor White
Write-Host "3. Database name: miladak-db" -ForegroundColor White
Write-Host "4. Region: fra1 (Frankfurt)" -ForegroundColor White

# Stage 5: Environment Variables
Write-Host "`nStage 5: Environment Variables..." -ForegroundColor Cyan
Write-Host "Add these variables in Vercel > Settings > Environment Variables:" -ForegroundColor Yellow

$envVars = @"
# Site
NEXT_PUBLIC_APP_URL=https://miladak.com
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.com
NEXT_PUBLIC_SITE_URL=https://miladak.com

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118

# AI (Add your API keys here)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Pexels (Add your API key here)
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
"@

Write-Host $envVars -ForegroundColor Gray

# Stage 6: Data Migration
Write-Host "`nStage 6: Data Migration..." -ForegroundColor Cyan
Write-Host "After creating database and connecting to project:" -ForegroundColor Yellow
Write-Host "1. Copy Postgres variables to .env.local" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host "3. Run: node scripts/migrate-to-postgres.js" -ForegroundColor White

# Summary
Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Code uploaded to GitHub" -ForegroundColor Green
Write-Host "2. Connect Vercel to new repository" -ForegroundColor Yellow
Write-Host "3. Create Postgres database" -ForegroundColor Yellow
Write-Host "4. Add environment variables" -ForegroundColor Yellow
Write-Host "5. Migrate data" -ForegroundColor Yellow
Write-Host "6. Automatic deployment" -ForegroundColor Yellow

Write-Host "`nRepository URL: $remoteUrl" -ForegroundColor Cyan
Write-Host "Vercel URL: https://vercel.com/dashboard" -ForegroundColor Cyan

Read-Host "`nPress Enter to exit..."
