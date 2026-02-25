# ========================================
# سكريبت نشر ميلادك V2 على Vercel
# ========================================

Write-Host "🚀 بدء عملية نشر ميلادك V2 على Vercel..." -ForegroundColor Green

# المتغيرات
$GITHUB_USERNAME = "mrhussein00100-dotcom"
$REPO_NAME = "miladak"
$PROJECT_PATH = "C:\web\secend_stadge\miladak_v2"

# التحقق من وجود Git
try {
    git --version | Out-Null
    Write-Host "✅ Git متوفر" -ForegroundColor Green
} catch {
    Write-Host "❌ Git غير مثبت. يرجى تثبيت Git أولاً" -ForegroundColor Red
    exit 1
}

# الانتقال لمجلد المشروع
Set-Location $PROJECT_PATH
Write-Host "📁 الانتقال لمجلد المشروع: $PROJECT_PATH" -ForegroundColor Yellow

# المرحلة 1: تهيئة Git وإضافة الملفات
Write-Host "`n📋 المرحلة 1: تهيئة Git..." -ForegroundColor Cyan

# تهيئة Git إذا لم يكن موجوداً
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ تم تهيئة Git" -ForegroundColor Green
}

# إضافة جميع الملفات
git add .
Write-Host "✅ تم إضافة جميع الملفات" -ForegroundColor Green

# عمل commit
$commitMessage = "Miladak V2 - Production Ready $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage
Write-Host "✅ تم عمل commit: $commitMessage" -ForegroundColor Green

# المرحلة 2: ربط GitHub
Write-Host "`n🔗 المرحلة 2: ربط GitHub..." -ForegroundColor Cyan

# إضافة remote origin
$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
try {
    git remote add origin $remoteUrl
    Write-Host "✅ تم ربط المستودع: $remoteUrl" -ForegroundColor Green
} catch {
    Write-Host "⚠️ المستودع مربوط مسبقاً، تحديث الرابط..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
}

# رفع الكود
Write-Host "`n📤 رفع الكود إلى GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ تم رفع الكود بنجاح!" -ForegroundColor Green
} else {
    Write-Host "❌ فشل في رفع الكود. تحقق من بيانات GitHub" -ForegroundColor Red
    Write-Host "💡 تأكد من تسجيل الدخول إلى Git:" -ForegroundColor Yellow
    Write-Host "   git config --global user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "   git config --global user.email 'mr.hussein00100@gmail.com'" -ForegroundColor Gray
    exit 1
}

# المرحلة 3: معلومات Vercel
Write-Host "`n🌐 المرحلة 3: إعداد Vercel..." -ForegroundColor Cyan
Write-Host "الآن يجب عليك:" -ForegroundColor Yellow
Write-Host "1. الذهاب إلى https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. اختيار مشروع 'miladak' الموجود" -ForegroundColor White
Write-Host "3. الذهاب إلى Settings > Git" -ForegroundColor White
Write-Host "4. فصل المستودع القديم (Disconnect)" -ForegroundColor White
Write-Host "5. ربط المستودع الجديد: $remoteUrl" -ForegroundColor White

# المرحلة 4: إنشاء قاعدة البيانات
Write-Host "`n🗄️ المرحلة 4: قاعدة البيانات..." -ForegroundColor Cyan
Write-Host "إنشاء قاعدة بيانات Postgres:" -ForegroundColor Yellow
Write-Host "1. في Vercel Dashboard > Storage" -ForegroundColor White
Write-Host "2. Create Database > Postgres" -ForegroundColor White
Write-Host "3. اسم قاعدة البيانات: miladak-db" -ForegroundColor White
Write-Host "4. المنطقة: fra1 (فرانكفورت)" -ForegroundColor White

# المرحلة 5: متغيرات البيئة
Write-Host "`n⚙️ المرحلة 5: متغيرات البيئة..." -ForegroundColor Cyan
Write-Host "إضافة المتغيرات التالية في Vercel > Settings > Environment Variables:" -ForegroundColor Yellow

$envVars = @"
# الموقع
NEXT_PUBLIC_APP_URL=https://miladak.com
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.com
NEXT_PUBLIC_SITE_URL=https://miladak.com

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118

# AI (Add your API keys here)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Pexels (Add your API key here)
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
"@

Write-Host $envVars -ForegroundColor Gray

# المرحلة 6: ترحيل البيانات
Write-Host "`n📊 المرحلة 6: ترحيل البيانات..." -ForegroundColor Cyan
Write-Host "بعد إنشاء قاعدة البيانات وربطها بالمشروع:" -ForegroundColor Yellow
Write-Host "1. انسخ متغيرات Postgres إلى .env.local" -ForegroundColor White
Write-Host "2. شغل: npm install" -ForegroundColor White
Write-Host "3. شغل: node scripts/migrate-to-postgres.js" -ForegroundColor White

# الخلاصة
Write-Host "`n🎉 تم رفع الكود بنجاح!" -ForegroundColor Green
Write-Host "الخطوات التالية:" -ForegroundColor Yellow
Write-Host "1. ✅ الكود مرفوع على GitHub" -ForegroundColor Green
Write-Host "2. 🔄 ربط Vercel بالمستودع الجديد" -ForegroundColor Yellow
Write-Host "3. 🗄️ إنشاء قاعدة بيانات Postgres" -ForegroundColor Yellow
Write-Host "4. ⚙️ إضافة متغيرات البيئة" -ForegroundColor Yellow
Write-Host "5. 📊 ترحيل البيانات" -ForegroundColor Yellow
Write-Host "6. 🚀 النشر التلقائي" -ForegroundColor Yellow

Write-Host "`nرابط المستودع: $remoteUrl" -ForegroundColor Cyan
Write-Host "رابط Vercel: https://vercel.com/dashboard" -ForegroundColor Cyan

Read-Host "`nاضغط Enter للخروج..."
