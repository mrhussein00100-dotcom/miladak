#!/usr/bin/env pwsh

Write-Host "🐘 النشر مع دعم PostgreSQL..." -ForegroundColor Yellow

# 1. تنظيف cache
Write-Host "1️⃣ تنظيف cache..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "tsconfig.tsbuildinfo") { Remove-Item -Force "tsconfig.tsbuildinfo" }

# 2. تثبيت dependencies الجديدة
Write-Host "2️⃣ تثبيت dependencies..." -ForegroundColor Green
npm install

# 3. اختبار البناء محلياً
Write-Host "3️⃣ اختبار البناء..." -ForegroundColor Cyan
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
git commit -m "🐘 feat: Add PostgreSQL support for production

- Add PostgreSQL connection and query functions
- Create database schema for PostgreSQL
- Add migration script from SQLite to PostgreSQL
- Update unified database system to support both SQLite and PostgreSQL
- Add pg and @types/pg dependencies
- Create setup guide for Vercel PostgreSQL"

# 5. النشر
Write-Host "5️⃣ النشر على GitHub..." -ForegroundColor Magenta
git push origin main

Write-Host "`n✅ تم النشر بنجاح!" -ForegroundColor Green

Write-Host "`n📋 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "1. اذهب إلى Vercel Dashboard" -ForegroundColor Gray
Write-Host "2. أنشئ قاعدة بيانات PostgreSQL" -ForegroundColor Gray
Write-Host "3. أضف متغيرات البيئة" -ForegroundColor Gray
Write-Host "4. شغل سكريپت النقل: npm run migrate" -ForegroundColor Gray

Write-Host "`n🔗 روابط مفيدة:" -ForegroundColor Cyan
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "- دليل الإعداد: ./setup-vercel-postgres.md" -ForegroundColor Gray
Write-Host "- الموقع: https://miladak.vercel.app" -ForegroundColor Gray
