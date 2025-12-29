#!/usr/bin/env pwsh

Write-Host "🔧 إصلاح قاعدة البيانات والنشر..." -ForegroundColor Yellow

# 1. تنظيف cache
Write-Host "1️⃣ تنظيف cache..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "tsconfig.tsbuildinfo") { Remove-Item -Force "tsconfig.tsbuildinfo" }

# 2. اختبار قاعدة البيانات محلياً
Write-Host "2️⃣ اختبار قاعدة البيانات..." -ForegroundColor Green
if (Test-Path "database.sqlite") {
    Write-Host "   ✅ ملف قاعدة البيانات موجود" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ ملف قاعدة البيانات غير موجود - سيتم إنشاؤه تلقائياً" -ForegroundColor Yellow
}

# 3. بناء محلي للتأكد
Write-Host "3️⃣ بناء محلي..." -ForegroundColor Cyan
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build:vercel

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل البناء المحلي" -ForegroundColor Red
    exit 1
}

Write-Host "✅ البناء المحلي نجح!" -ForegroundColor Green

# 4. إضافة التغييرات
Write-Host "4️⃣ إضافة التغييرات..." -ForegroundColor Blue
git add .
git commit -m "🔧 Fix: Database connection for Vercel deployment

- Add in-memory SQLite support for production
- Create fallback database system
- Optimize database connection for Vercel
- Add database testing scripts"

# 5. النشر
Write-Host "5️⃣ النشر على GitHub..." -ForegroundColor Magenta
git push origin main

Write-Host "`n✅ تم النشر بنجاح!" -ForegroundColor Green
Write-Host "🔗 تحقق من: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "📊 الموقع: https://miladak.vercel.app" -ForegroundColor Cyan

Write-Host "`n📋 ملاحظات مهمة:" -ForegroundColor Yellow
Write-Host "- قاعدة البيانات ستعمل في الذاكرة على Vercel" -ForegroundColor Gray
Write-Host "- البيانات ستكون مؤقتة ولكن الموقع سيعمل" -ForegroundColor Gray
Write-Host "- يمكن ترقية قاعدة البيانات لاحقاً إلى PostgreSQL" -ForegroundColor Gray
