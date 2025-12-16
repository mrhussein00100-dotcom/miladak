#!/usr/bin/env pwsh

Write-Host "🚀 إصلاح مشكلة البناء على Vercel..." -ForegroundColor Yellow

# 1. تنظيف شامل
Write-Host "1️⃣ تنظيف cache..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "tsconfig.tsbuildinfo") { Remove-Item -Force "tsconfig.tsbuildinfo" }
if (Test-Path "node_modules/.cache") { Remove-Item -Recurse -Force "node_modules/.cache" }

# 2. التحقق من TypeScript
Write-Host "2️⃣ التحقق من TypeScript..." -ForegroundColor Blue
npx tsc --noEmit

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ توجد أخطاء TypeScript. يرجى إصلاحها أولاً." -ForegroundColor Red
    exit 1
}

# 3. بناء محلي
Write-Host "3️⃣ بناء محلي..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل البناء المحلي." -ForegroundColor Red
    exit 1
}

Write-Host "✅ البناء المحلي نجح!" -ForegroundColor Green

# 4. إنشاء commit وpush
Write-Host "4️⃣ النشر..." -ForegroundColor Cyan
git add .
git commit -m "🔧 Fix: Clean build cache and resolve Next.js 15 compatibility"
git push origin main

Write-Host "✅ تم! يجب أن يعمل البناء على Vercel الآن." -ForegroundColor Green
Write-Host "🔗 تحقق من: https://vercel.com/dashboard" -ForegroundColor Cyan