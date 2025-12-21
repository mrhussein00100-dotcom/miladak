#!/usr/bin/env pwsh

# تعيين متغيرات البيئة
$env:POSTGRES_URL = "postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require"
$env:DATABASE_URL = $env:POSTGRES_URL

Write-Host "🚀 بدء ترحيل البيانات..." -ForegroundColor Green
Write-Host "📂 POSTGRES_URL: $($env:POSTGRES_URL.Substring(0, 30))..." -ForegroundColor Yellow

# تشغيل الترحيل
node scripts/migrate-to-postgres-fixed.js