#!/usr/bin/env pwsh

Write-Host "🚀 بدء الترحيل الذكي - حل نهائي!" -ForegroundColor Green

# تعيين متغيرات البيئة
$env:POSTGRES_URL = "postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require"
$env:DATABASE_URL = $env:POSTGRES_URL

Write-Host "📊 هذا السكريبت سيقوم بـ:" -ForegroundColor Yellow
Write-Host "  1. قراءة بنية الجداول من SQLite" -ForegroundColor Cyan
Write-Host "  2. إنشاء نفس البنية في PostgreSQL" -ForegroundColor Cyan  
Write-Host "  3. نسخ البيانات كما هي" -ForegroundColor Cyan
Write-Host "  4. تجاهل الأخطاء والمتابعة" -ForegroundColor Cyan

# تشغيل الترحيل الذكي
node scripts/smart-migration.js

Write-Host "`n✅ انتهى الترحيل الذكي!" -ForegroundColor Green