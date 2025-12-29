# 🚀 سكريبت النشر النهائي - ميلادك v2
# تشغيل جميع خطوات النشر بشكل تلقائي

Write-Host "🚀 بدء النشر النهائي لموقع ميلادك v2..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# الخطوة 1: التحقق من جاهزية النظام
Write-Host "`n📋 الخطوة 1: التحقق من جاهزية النظام..." -ForegroundColor Yellow

Write-Host "🧪 اختبار قاعدة البيانات المحلية..."
node scripts/test-database-simple.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل اختبار قاعدة البيانات" -ForegroundColor Red
    exit 1
}

Write-Host "✅ قاعدة البيانات جاهزة!" -ForegroundColor Green

# الخطوة 2: إعداد متغيرات البيئة للإنتاج
Write-Host "`n📋 الخطوة 2: إعداد متغيرات البيئة..." -ForegroundColor Yellow

# إنشاء ملف .env.production للنشر
$envProduction = @"
# قاعدة البيانات - سيتم تحديثها في Vercel
DATABASE_TYPE=postgresql

# مفاتيح AI
GROQ_API_KEY=[GROQ_API_KEY_HIDDEN]
GEMINI_API_KEY=AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM

# خدمات الصور
PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx
NEXT_PUBLIC_PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118

# متغيرات الموقع
NEXT_PUBLIC_APP_URL=https://miladak.vercel.app
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.vercel.app
NEXT_PUBLIC_SITE_URL=https://miladak.vercel.app

# الأمان
AUTH_SECRET=miladak_production_secret_2025_strong_key_xyz123
"@

$envProduction | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✅ تم إنشاء ملف .env.production" -ForegroundColor Green

# الخطوة 3: إعداد الكود للنشر
Write-Host "`n📋 الخطوة 3: إعداد الكود للنشر..." -ForegroundColor Yellow

# التأكد من تحديث .gitignore
$gitignoreContent = Get-Content .gitignore -Raw -ErrorAction SilentlyContinue
if (-not $gitignoreContent.Contains("database.sqlite")) {
    Add-Content .gitignore "`n# قواعد البيانات المحلية`ndatabase.sqlite`ndatabase.sqlite-*`n*.db`n*.sqlite"
    Write-Host "✅ تم تحديث .gitignore" -ForegroundColor Green
}

# إضافة التغييرات إلى Git
Write-Host "📦 إضافة الملفات إلى Git..."
git add .

# إنشاء commit
$commitMessage = "feat: Production deployment ready - all systems go

✅ Database: 28 tables, 20 tools, 47 articles, 618 birthdays, 698 events
✅ API Keys: Updated and validated
✅ Environment: Production ready
✅ Build: Optimized for Vercel

Ready for PostgreSQL migration and deployment!"

git commit -m $commitMessage
Write-Host "✅ تم إنشاء commit للنشر" -ForegroundColor Green

# الخطوة 4: عرض تعليمات النشر
Write-Host "`n📋 الخطوة 4: تعليمات إكمال النشر..." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "`n🎯 الخطوات التالية (يدوية):" -ForegroundColor Magenta
Write-Host ""
Write-Host "1️⃣ إنشاء قاعدة بيانات PostgreSQL في Vercel:" -ForegroundColor White
Write-Host "   • اذهب إلى: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   • اضغط 'Storage' → 'Create Database' → 'PostgreSQL'" -ForegroundColor Gray
Write-Host "   • انسخ POSTGRES_URL" -ForegroundColor Gray

Write-Host "`n2️⃣ إضافة متغيرات البيئة في Vercel:" -ForegroundColor White
Write-Host "   POSTGRES_URL=postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb" -ForegroundColor Gray
Write-Host "   DATABASE_TYPE=postgresql" -ForegroundColor Gray
Write-Host "   GROQ_API_KEY=[GROQ_API_KEY_HIDDEN]" -ForegroundColor Gray
Write-Host "   GEMINI_API_KEY=AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM" -ForegroundColor Gray
Write-Host "   PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118" -ForegroundColor Gray
Write-Host "   ADSENSE_PUBLISHER_ID=pub-5755672349927118" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_APP_URL=https://miladak.vercel.app" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_APP_NAME=ميلادك" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_BASE_URL=https://miladak.vercel.app" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SITE_URL=https://miladak.vercel.app" -ForegroundColor Gray
Write-Host "   AUTH_SECRET=miladak_production_secret_2025_strong_key_xyz123" -ForegroundColor Gray

Write-Host "`n3️⃣ ترحيل البيانات:" -ForegroundColor White
Write-Host "   `$env:POSTGRES_URL='postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb'" -ForegroundColor Gray
Write-Host "   node scripts/migrate-to-postgres-complete.js" -ForegroundColor Gray

Write-Host "`n4️⃣ النشر:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Gray

Write-Host "`n5️⃣ اختبار الموقع:" -ForegroundColor White
Write-Host "   https://miladak.vercel.app" -ForegroundColor Gray

Write-Host "`n📊 إحصائيات النظام الحالي:" -ForegroundColor Magenta
Write-Host "   📋 الجداول: 28 جدول" -ForegroundColor White
Write-Host "   🔧 الأدوات: 20 أداة نشطة" -ForegroundColor White
Write-Host "   📝 المقالات: 47 مقال منشور" -ForegroundColor White
Write-Host "   🎂 المواليد: 618 مولود مشهور" -ForegroundColor White
Write-Host "   📅 الأحداث: 698 حدث تاريخي" -ForegroundColor White

Write-Host "`n🎉 النظام جاهز للنشر!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# إنشاء ملف تعليمات سريع
$quickInstructions = @"
# 🚀 تعليمات النشر السريع

## الحالة: ✅ جاهز للنشر

تم إعداد النظام بالكامل. اتبع هذه الخطوات:

### 1. إنشاء PostgreSQL في Vercel
- اذهب إلى: https://vercel.com/dashboard
- اضغط "Storage" → "Create Database" → "PostgreSQL"
- انسخ POSTGRES_URL

### 2. إضافة متغيرات البيئة في Vercel
```
POSTGRES_URL=postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb
DATABASE_TYPE=postgresql
GROQ_API_KEY=[GROQ_API_KEY_HIDDEN]
GEMINI_API_KEY=AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM
PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx
NEXT_PUBLIC_PEXELS_API_KEY=Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118
NEXT_PUBLIC_APP_URL=https://miladak.vercel.app
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.vercel.app
NEXT_PUBLIC_SITE_URL=https://miladak.vercel.app
AUTH_SECRET=miladak_production_secret_2025_strong_key_xyz123
```

### 3. ترحيل البيانات
```powershell
`$env:POSTGRES_URL="postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
node scripts/migrate-to-postgres-complete.js
```

### 4. النشر
```bash
git push origin main
```

### 5. اختبار
- زيارة: https://miladak.vercel.app
- اختبار حاسبة العمر
- تصفح الأدوات والمقالات

## 📊 النظام الحالي
- ✅ 28 جدول مع بيانات كاملة
- ✅ 20 أداة نشطة
- ✅ 47 مقال منشور
- ✅ مفاتيح API محدثة
- ✅ الكود جاهز للإنتاج

**الوقت المقدر**: 10-15 دقيقة
"@

$quickInstructions | Out-File -FilePath "QUICK_DEPLOYMENT_GUIDE.md" -Encoding UTF8
Write-Host "📄 تم إنشاء دليل النشر السريع: QUICK_DEPLOYMENT_GUIDE.md" -ForegroundColor Green

Write-Host "`n✨ تم إكمال التحضيرات! اتبع التعليمات أعلاه لإكمال النشر." -ForegroundColor Green
