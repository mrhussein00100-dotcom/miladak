# ========================================
# Deployment Readiness Check
# ========================================

Write-Host "Checking Miladak V2 deployment readiness..." -ForegroundColor Green

$errors = @()
$warnings = @()
$success = @()

# Check Git
try {
    git --version | Out-Null
    $success += "Git is installed and available"
} catch {
    $errors += "Git is not installed - please install from https://git-scm.com"
}

# Check Node.js
try {
    $nodeVersion = node --version
    $success += "Node.js is installed - Version: $nodeVersion"
} catch {
    $errors += "Node.js is not installed - please install from https://nodejs.org"
}

# Check npm
try {
    $npmVersion = npm --version
    $success += "npm is available - Version: $npmVersion"
} catch {
    $errors += "npm is not available"
}

# Check required files
$requiredFiles = @(
    "package.json",
    "next.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    ".gitignore",
    "lib/db/postgres.ts",
    "lib/db/postgres-schema.sql",
    "scripts/migrate-to-postgres.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $success += "File exists: $file"
    } else {
        $errors += "File missing: $file"
    }
}

# Check local database
if (Test-Path "database.sqlite") {
    $success += "Local database exists"
} else {
    $warnings += "Local database not found - you may need to create it"
}

# Check environment file
if (Test-Path ".env.local") {
    $success += ".env.local file exists"
    
    $envContent = Get-Content ".env.local" -Raw
    
    # Check required environment variables
    $requiredEnvVars = @(
        "NEXT_PUBLIC_APP_URL",
        "NEXT_PUBLIC_ADSENSE_CLIENT",
        "GEMINI_API_KEY",
        "GROQ_API_KEY"
    )
    
    foreach ($envVar in $requiredEnvVars) {
        if ($envContent -match $envVar) {
            $success += "Environment variable exists: $envVar"
        } else {
            $warnings += "Environment variable missing: $envVar"
        }
    }
} else {
    $warnings += ".env.local file not found - copy from .env.example"
}

# Check package.json
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    # Check required dependencies
    $requiredDeps = @(
        "@vercel/postgres",
        "better-sqlite3",
        "next",
        "react",
        "react-dom"
    )
    
    foreach ($dep in $requiredDeps) {
        if ($packageJson.dependencies.$dep) {
            $success += "Package installed: $dep"
        } else {
            $errors += "Package missing: $dep"
        }
    }
}

# Check node_modules
if (Test-Path "node_modules") {
    $success += "node_modules exists"
} else {
    $warnings += "node_modules not found - run npm install"
}

# Display results
Write-Host "`nCheck Results:" -ForegroundColor Cyan

if ($success.Count -gt 0) {
    Write-Host "`nSuccess ($($success.Count)):" -ForegroundColor Green
    foreach ($item in $success) {
        Write-Host "   ✅ $item" -ForegroundColor Green
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`nWarnings ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "   ⚠️ $item" -ForegroundColor Yellow
    }
}

if ($errors.Count -gt 0) {
    Write-Host "`nErrors ($($errors.Count)):" -ForegroundColor Red
    foreach ($item in $errors) {
        Write-Host "   ❌ $item" -ForegroundColor Red
    }
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    if ($warnings.Count -eq 0) {
        Write-Host "🎉 Project is fully ready for deployment!" -ForegroundColor Green
        Write-Host "You can run: .\deploy-to-vercel.ps1" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Project is ready for deployment with some warnings" -ForegroundColor Yellow
        Write-Host "You can proceed or fix warnings first" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Project is not ready for deployment" -ForegroundColor Red
    Write-Host "Please fix errors first" -ForegroundColor Red
}

# Fix suggestions
if ($warnings.Count -gt 0 -or $errors.Count -gt 0) {
    Write-Host "`nFix Suggestions:" -ForegroundColor Cyan
    
    if ($errors -match "Node.js") {
        Write-Host "   - Download Node.js: https://nodejs.org" -ForegroundColor Gray
    }
    
    if ($errors -match "Git") {
        Write-Host "   - Download Git: https://git-scm.com" -ForegroundColor Gray
    }
    
    if ($warnings -match "node_modules") {
        Write-Host "   - Run: npm install" -ForegroundColor Gray
    }
    
    if ($warnings -match ".env.local") {
        Write-Host "   - Copy: copy .env.example .env.local" -ForegroundColor Gray
        Write-Host "   - Edit variables in .env.local" -ForegroundColor Gray
    }
}

Read-Host "`nPress Enter to exit..."