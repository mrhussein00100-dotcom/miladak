# سكريبت البناء المحسن للنشر
Write-Host "🔨 بناء المشروع للنشر..." -ForegroundColor Yellow

# 1. تنظيف الملفات القديمة
Write-Host "1. تنظيف الملفات القديمة..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✓ تم حذف .next" -ForegroundColor Green
}

# 2. تعيين متغيرات البيئة للبناء
Write-Host "2. إعداد متغيرات البيئة..." -ForegroundColor Cyan
$env:SKIP_DATABASE_INIT = "true"
$env:DATABASE_TYPE = "sqlite"
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"
Write-Host "   ✓ تم إعداد متغيرات البيئة" -ForegroundColor Green

# 3. البناء
Write-Host "3. بناء المشروع..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تم البناء بنجاح!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 المشروع جاهز للنشر!" -ForegroundColor Green
    Write-Host "يمكنك الآن تشغيل: vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ فشل البناء" -ForegroundColor Red
    Write-Host "يرجى مراجعة الأخطاء أعلاه" -ForegroundColor Yellow
}