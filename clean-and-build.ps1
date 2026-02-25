#!/usr/bin/env pwsh

Write-Host "🧹 تنظيف cache وإعادة البناء..." -ForegroundColor Yellow

# حذف مجلدات cache
Write-Host "حذف مجلدات cache..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules/.cache") { Remove-Item -Recurse -Force "node_modules/.cache" }

# تنظيف npm cache
Write-Host "تنظيف npm cache..." -ForegroundColor Blue
npm cache clean --force

# إعادة تثبيت dependencies
Write-Host "إعادة تثبيت dependencies..." -ForegroundColor Blue
npm ci

# بناء المشروع
Write-Host "بناء المشروع..." -ForegroundColor Green
npm run build

Write-Host "✅ تم الانتهاء!" -ForegroundColor Green
