# سكريبت بناء بسيط لـ Vercel
Write-Host "🔨 بناء المشروع لـ Vercel..." -ForegroundColor Cyan
Write-Host ""

# تعيين متغيرات البيئة
$env:DATABASE_TYPE = "postgres"
$env:SKIP_ENV_VALIDATION = "true"

# حذف .next إذا كان موجوداً
if (Test-Path ".next") {
    Write-Host "🗑️ حذف .next القديم..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# البناء
Write-Host "🔨 بناء المشروع..." -ForegroundColor Yellow
npm run build:safe

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ تم البناء بنجاح!" -ForegroundColor Green
    Write-Host ""
    Write-Host "الآن يمكنك النشر باستخدام:" -ForegroundColor Cyan
    Write-Host "vercel --prod" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ فشل البناء" -ForegroundColor Red
}
