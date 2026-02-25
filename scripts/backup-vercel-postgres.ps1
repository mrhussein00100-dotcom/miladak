# سكريبت لأخذ نسخة احتياطية من Vercel Postgres
# يتطلب تسجيل الدخول إلى Vercel CLI

Write-Host "🔄 جاري سحب متغيرات البيئة من Vercel..." -ForegroundColor Cyan

# سحب متغيرات البيئة
vercel env pull .env.production.local --yes

Write-Host ""
Write-Host "📋 متغيرات PostgreSQL:" -ForegroundColor Yellow

# عرض متغيرات PostgreSQL
$envContent = Get-Content .env.production.local -ErrorAction SilentlyContinue
if ($envContent) {
    $envContent | Where-Object { $_ -match "POSTGRES" } | ForEach-Object {
        if ($_ -match "POSTGRES_URL=") {
            $url = $_ -replace "POSTGRES_URL=", ""
            Write-Host "POSTGRES_URL موجود ✅" -ForegroundColor Green
            Write-Host ""
            Write-Host "🚀 لأخذ النسخة الاحتياطية، شغل:" -ForegroundColor Cyan
            Write-Host "node scripts/backup-production-db.js `"$url`"" -ForegroundColor White
        } else {
            Write-Host $_
        }
    }
} else {
    Write-Host "⚠️ لم يتم العثور على ملف .env.production.local" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "تأكد من:" -ForegroundColor Yellow
    Write-Host "1. تسجيل الدخول: vercel login" -ForegroundColor White
    Write-Host "2. ربط المشروع: vercel link" -ForegroundColor White
    Write-Host "3. إعادة تشغيل السكريبت" -ForegroundColor White
}
