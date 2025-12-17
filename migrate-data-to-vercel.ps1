# سكريبت ترحيل البيانات إلى Vercel PostgreSQL
param(
    [Parameter(Mandatory=$true)]
    [string]$PostgresUrl
)

Write-Host "🚀 بدء ترحيل البيانات إلى Vercel PostgreSQL..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# التحقق من صحة الرابط
if (-not $PostgresUrl.StartsWith("postgres://")) {
    Write-Host "❌ خطأ: POSTGRES_URL يجب أن يبدأ بـ postgres://" -ForegroundColor Red
    Write-Host "مثال: postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb" -ForegroundColor Yellow
    exit 1
}

# تعيين متغير البيئة
$env:POSTGRES_URL = $PostgresUrl
Write-Host "✅ تم تعيين POSTGRES_URL" -ForegroundColor Green

# اختبار قاعدة البيانات المحلية أولاً
Write-Host "`n📋 اختبار قاعدة البيانات المحلية..." -ForegroundColor Yellow
node scripts/test-database-simple.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل اختبار قاعدة البيانات المحلية" -ForegroundColor Red
    exit 1
}

# اختبار الاتصال بـ PostgreSQL
Write-Host "`n📋 اختبار الاتصال بـ PostgreSQL..." -ForegroundColor Yellow
if (Test-Path "scripts/test-postgres-connection.js") {
    node scripts/test-postgres-connection.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل الاتصال بـ PostgreSQL" -ForegroundColor Red
        Write-Host "تحقق من صحة POSTGRES_URL" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⚠️ ملف اختبار PostgreSQL غير موجود، سنتابع مع الترحيل..." -ForegroundColor Yellow
}

# تشغيل ترحيل البيانات
Write-Host "`n📋 بدء ترحيل البيانات..." -ForegroundColor Yellow
node scripts/migrate-to-postgres-complete.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 تم ترحيل البيانات بنجاح!" -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "`n📋 الخطوات التالية:" -ForegroundColor Magenta
    Write-Host "1. تأكد من إضافة جميع متغيرات البيئة في Vercel" -ForegroundColor White
    Write-Host "2. شغل: git push origin main" -ForegroundColor White
    Write-Host "3. راقب النشر في Vercel Dashboard" -ForegroundColor White
    Write-Host "4. اختبر الموقع: https://miladak.vercel.app" -ForegroundColor White
    Write-Host "`n🚀 النشر جاهز!" -ForegroundColor Green
} else {
    Write-Host "`n❌ فشل في ترحيل البيانات" -ForegroundColor Red
    Write-Host "تحقق من:" -ForegroundColor Yellow
    Write-Host "- صحة POSTGRES_URL" -ForegroundColor Gray
    Write-Host "- اتصال الإنترنت" -ForegroundColor Gray
    Write-Host "- صلاحيات قاعدة البيانات" -ForegroundColor Gray
    exit 1
}

Write-Host "`n=================================================" -ForegroundColor Cyan