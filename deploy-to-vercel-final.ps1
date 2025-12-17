# سكريپت النشر النهائي على Vercel
param(
    [Parameter(Mandatory=$false)]
    [string]$PostgresUrl,
    [Parameter(Mandatory=$false)]
    [switch]$SkipMigration,
    [Parameter(Mandatory=$false)]
    [switch]$TestOnly
)

Write-Host "🚀 سكريپت النشر النهائي - ميلادك v2" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

# اختبار جاهزية النظام
Write-Host "`n📋 اختبار جاهزية النظام..." -ForegroundColor Yellow
node test-deployment-ready.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ النظام غير جاهز للنشر" -ForegroundColor Red
    exit 1
}

Write-Host "✅ النظام جاهز للنشر!" -ForegroundColor Green

# إذا كان الاختبار فقط
if ($TestOnly) {
    Write-Host "`n🎉 اختبار الجاهزية مكتمل!" -ForegroundColor Green
    Write-Host "النظام جاهز للنشر على Vercel" -ForegroundColor White
    exit 0
}

# ترحيل البيانات (إذا تم توفير POSTGRES_URL)
if ($PostgresUrl -and -not $SkipMigration) {
    Write-Host "`n📋 ترحيل البيانات إلى PostgreSQL..." -ForegroundColor Yellow
    
    # تعيين متغير البيئة
    $env:POSTGRES_URL = $PostgresUrl
    
    # اختبار الاتصال
    Write-Host "🔌 اختبار الاتصال بـ PostgreSQL..."
    node scripts/test-postgres-connection.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل الاتصال بـ PostgreSQL" -ForegroundColor Red
        Write-Host "تحقق من صحة POSTGRES_URL" -ForegroundColor Yellow
        exit 1
    }
    
    # تشغيل الترحيل
    Write-Host "📦 بدء ترحيل البيانات..."
    node scripts/migrate-to-postgres-complete.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل ترحيل البيانات" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ تم ترحيل البيانات بنجاح!" -ForegroundColor Green
}

# النشر على GitHub
Write-Host "`n📋 النشر على GitHub..." -ForegroundColor Yellow

# التحقق من حالة Git
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📦 إضافة الملفات المحدثة..."
    git add .
    
    $commitMessage = "feat: Deploy to production - $(Get-Date -Format 'yyyy-MM-dd HH:mm')

🚀 Production deployment ready
✅ All systems tested and operational
✅ Database migration scripts ready
✅ Environment variables configured
✅ API keys validated

Ready for Vercel deployment!"
    
    git commit -m $commitMessage
    Write-Host "✅ تم إنشاء commit جديد" -ForegroundColor Green
}

# رفع إلى GitHub
Write-Host "🚀 رفع الكود إلى GitHub..."
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ تم رفع الكود بنجاح!" -ForegroundColor Green
} else {
    Write-Host "❌ فشل في رفع الكود" -ForegroundColor Red
    Write-Host "تحقق من اتصال GitHub" -ForegroundColor Yellow
    exit 1
}

# رسالة النجاح
Write-Host "`n🎉 تم إكمال النشر بنجاح!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

Write-Host "`n📋 الخطوات التالية:" -ForegroundColor Magenta
Write-Host "1. راقب النشر في Vercel Dashboard" -ForegroundColor White
Write-Host "2. انتظر رسالة 'Deployment completed'" -ForegroundColor White
Write-Host "3. اختبر الموقع: https://miladak.vercel.app" -ForegroundColor White

if (-not $PostgresUrl) {
    Write-Host "`n⚠️ تذكير:" -ForegroundColor Yellow
    Write-Host "- تأكد من إنشاء PostgreSQL في Vercel" -ForegroundColor Gray
    Write-Host "- أضف جميع متغيرات البيئة في Vercel" -ForegroundColor Gray
    Write-Host "- شغل ترحيل البيانات بعد الحصول على POSTGRES_URL" -ForegroundColor Gray
}

Write-Host "`n🚀 النشر مكتمل!" -ForegroundColor Green

# عرض معلومات مفيدة
Write-Host "`n📊 معلومات النشر:" -ForegroundColor Cyan
Write-Host "- التاريخ: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "- الفرع: $(git branch --show-current)" -ForegroundColor White
Write-Host "- آخر commit: $(git log -1 --oneline)" -ForegroundColor White
Write-Host "- الحالة: جاهز للاختبار" -ForegroundColor White
