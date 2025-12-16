# ========================================
# سكريبت ترحيل البيانات إلى Postgres
# ========================================

Write-Host "📊 بدء ترحيل البيانات من SQLite إلى Postgres..." -ForegroundColor Green

# التحقق من وجود Node.js
try {
    node --version | Out-Null
    Write-Host "✅ Node.js متوفر" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js غير مثبت" -ForegroundColor Red
    exit 1
}

# التحقق من وجود قاعدة البيانات المحلية
$dbPath = "database.sqlite"
if (-not (Test-Path $dbPath)) {
    Write-Host "❌ قاعدة البيانات المحلية غير موجودة: $dbPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ قاعدة البيانات المحلية موجودة" -ForegroundColor Green

# التحقق من متغيرات البيئة
$envPath = ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ ملف .env.local غير موجود" -ForegroundColor Red
    Write-Host "💡 أنشئ الملف وأضف متغيرات Postgres" -ForegroundColor Yellow
    exit 1
}

# قراءة متغيرات البيئة
$envContent = Get-Content $envPath -Raw
if ($envContent -notmatch "POSTGRES_URL") {
    Write-Host "❌ متغير POSTGRES_URL غير موجود في .env.local" -ForegroundColor Red
    Write-Host "💡 أضف متغيرات Postgres من Vercel Dashboard" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ متغيرات Postgres موجودة" -ForegroundColor Green

# تثبيت الحزم
Write-Host "`n📦 تثبيت الحزم..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل في تثبيت الحزم" -ForegroundColor Red
    exit 1
}

Write-Host "✅ تم تثبيت الحزم" -ForegroundColor Green

# تشغيل سكريبت الترحيل
Write-Host "`n🔄 بدء ترحيل البيانات..." -ForegroundColor Cyan
node scripts/migrate-to-postgres.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 تم ترحيل البيانات بنجاح!" -ForegroundColor Green
    Write-Host "✅ يمكنك الآن النشر على Vercel" -ForegroundColor Green
} else {
    Write-Host "`n❌ فشل في ترحيل البيانات" -ForegroundColor Red
    Write-Host "💡 تحقق من:" -ForegroundColor Yellow
    Write-Host "   - اتصال الإنترنت" -ForegroundColor Gray
    Write-Host "   - صحة متغيرات Postgres" -ForegroundColor Gray
    Write-Host "   - إنشاء قاعدة البيانات في Vercel" -ForegroundColor Gray
}

Read-Host "`nاضغط Enter للخروج..."