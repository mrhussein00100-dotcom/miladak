# سكريبت النشر الشامل على Vercel مع PostgreSQL
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   نشر ميلادك على Vercel - PostgreSQL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من Node.js
Write-Host "1. التحقق من البيئة..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "   ❌ Node.js غير مثبت!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Node.js: $(node --version)" -ForegroundColor Green

# التحقق من npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "   ❌ npm غير مثبت!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ npm: $(npm --version)" -ForegroundColor Green
Write-Host ""

# تثبيت Vercel CLI إذا لم يكن مثبتاً
Write-Host "2. التحقق من Vercel CLI..." -ForegroundColor Yellow
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "   تثبيت Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ فشل تثبيت Vercel CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "   ✓ Vercel CLI جاهز" -ForegroundColor Green
Write-Host ""

# تنظيف المشروع
Write-Host "3. تنظيف المشروع..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✓ تم حذف .next" -ForegroundColor Green
}
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "   ✓ تم حذف الكاش" -ForegroundColor Green
}
Write-Host ""

# تثبيت التبعيات
Write-Host "4. تثبيت التبعيات..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ فشل تثبيت التبعيات" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ تم تثبيت التبعيات" -ForegroundColor Green
Write-Host ""

# إصلاح قاعدة البيانات
Write-Host "5. إصلاح قاعدة البيانات PostgreSQL..." -ForegroundColor Yellow
node scripts/fix-postgres-and-deploy.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️ تحذير: قد تكون هناك مشكلة في قاعدة البيانات" -ForegroundColor Yellow
    Write-Host "   سنستمر في عملية النشر..." -ForegroundColor Yellow
}
Write-Host ""

# بناء المشروع
Write-Host "6. بناء المشروع..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ فشل البناء!" -ForegroundColor Red
    Write-Host ""
    Write-Host "يرجى إصلاح الأخطاء أعلاه ثم المحاولة مرة أخرى." -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ تم البناء بنجاح" -ForegroundColor Green
Write-Host ""

# النشر على Vercel
Write-Host "7. النشر على Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "سيتم فتح متصفح لتسجيل الدخول إلى Vercel" -ForegroundColor White
Write-Host "إذا كانت هذه أول مرة، قم بإنشاء حساب جديد" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# النشر
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ تم النشر بنجاح!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "الخطوات التالية المهمة:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. إضافة متغيرات البيئة في Vercel:" -ForegroundColor White
    Write-Host "   - انتقل إلى: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "   - اختر مشروعك" -ForegroundColor Cyan
    Write-Host "   - Settings > Environment Variables" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. أضف هذه المتغيرات:" -ForegroundColor White
    Write-Host "   DATABASE_URL=postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" -ForegroundColor Gray
    Write-Host "   POSTGRES_URL=postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" -ForegroundColor Gray
    Write-Host "   PRISMA_DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19kZG4yU3lBYU5Kb3RyclRJTF9qMmgiLCJhcGlfa2V5IjoiMDFLQ05HUjU2NEs3WlZaTkdHSDlSQjRYRkMiLCJ0ZW5hbnRfaWQiOiI2NjEwN2JjNWNjZWRhMzYyMTZhOTY5NTZmNjFlMDY5YTQ3ZTQxNTRlOTM1YjBhNjE2NmUzN2RmMzk0ZDRhYzY0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYmEyMjI4NWQtNTQ0ZS00M2MxLTgxYjEtOTlhNmE4MzY0MDVhIn0.vsUOQlB0KJe_xJrdtk5qAjlF9WFH89DEIZaZQTnVKzw" -ForegroundColor Gray
    Write-Host "   DATABASE_TYPE=postgres" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. أضف مفاتيح API الأخرى من ملف .env.local" -ForegroundColor White
    Write-Host ""
    Write-Host "4. بعد إضافة المتغيرات، قم بإعادة النشر:" -ForegroundColor White
    Write-Host "   vercel --prod" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ❌ فشل النشر" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "يرجى التحقق من الأخطاء أعلاه" -ForegroundColor Yellow
    Write-Host ""
}
