# ========================================
# Complete Miladak V2 Deployment Script
# ========================================

Write-Host "🚀 إكمال نشر ميلادك V2..." -ForegroundColor Green

# المتغيرات
$PROJECT_PATH = "C:\web\secend_stadge\miladak_v2"
$GITHUB_REPO = "https://github.com/mrhussein00100-dotcom/miladak"

# الانتقال لمجلد المشروع
Set-Location $PROJECT_PATH

Write-Host "`n✅ الوضع الحالي:" -ForegroundColor Cyan
Write-Host "   - الكود مرفوع على GitHub: $GITHUB_REPO" -ForegroundColor Green
Write-Host "   - المفاتيح آمنة في .env.local" -ForegroundColor Green
Write-Host "   - جميع الملفات جاهزة للنشر" -ForegroundColor Green

Write-Host "`n📋 الخطوات التالية المطلوبة:" -ForegroundColor Yellow

Write-Host "`n1️⃣ ربط Vercel بالمستودع الجديد:" -ForegroundColor Cyan
Write-Host "   • اذهب إلى: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   • اختر مشروع 'miladak' الموجود" -ForegroundColor White
Write-Host "   • Settings > Git > Disconnect (فصل المستودع القديم)" -ForegroundColor White
Write-Host "   • Connect Git Repository > اختر: mrhussein00100-dotcom/miladak" -ForegroundColor White

Write-Host "`n2️⃣ إنشاء قاعدة بيانات Postgres:" -ForegroundColor Cyan
Write-Host "   • في Vercel Dashboard > Storage" -ForegroundColor White
Write-Host "   - Create Database > Postgres" -ForegroundColor White
Write-Host "   • اسم قاعدة البيانات: miladak-db" -ForegroundColor White
Write-Host "   • المنطقة: fra1 (فرانكفورت)" -ForegroundColor White

Write-Host "`n3️⃣ إضافة متغيرات البيئة في Vercel:" -ForegroundColor Cyan
Write-Host "   في Settings > Environment Variables أضف:" -ForegroundColor White

# قراءة المفاتيح من .env.local
$envContent = Get-Content ".env.local" -Raw

Write-Host "`n   📱 متغيرات الموقع:" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_APP_URL=https://miladak.com" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_APP_NAME=ميلادك" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_BASE_URL=https://miladak.com" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SITE_URL=https://miladak.com" -ForegroundColor Gray

Write-Host "`n   💰 متغيرات AdSense:" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118" -ForegroundColor Gray
Write-Host "   ADSENSE_PUBLISHER_ID=pub-5755672349927118" -ForegroundColor Gray

Write-Host "`n   🤖 متغيرات AI:" -ForegroundColor Yellow
if ($envContent -match "GEMINI_API_KEY=(.+)") {
    Write-Host "   GEMINI_API_KEY=$($matches[1])" -ForegroundColor Gray
}
if ($envContent -match "GROQ_API_KEY=(.+)") {
    Write-Host "   GROQ_API_KEY=$($matches[1])" -ForegroundColor Gray
}

Write-Host "`n   🖼️ متغيرات Pexels:" -ForegroundColor Yellow
if ($envContent -match "NEXT_PUBLIC_PEXELS_API_KEY=(.+)") {
    Write-Host "   NEXT_PUBLIC_PEXELS_API_KEY=$($matches[1])" -ForegroundColor Gray
    Write-Host "   PEXELS_API_KEY=$($matches[1])" -ForegroundColor Gray
}

Write-Host "`n4️⃣ ربط قاعدة البيانات بالمشروع:" -ForegroundColor Cyan
Write-Host "   • في Storage > اختر miladak-db" -ForegroundColor White
Write-Host "   - Connect to Project > Choose miladak project" -ForegroundColor White

Write-Host "`n5️⃣ ترحيل البيانات:" -ForegroundColor Cyan
Write-Host "   بعد ربط قاعدة البيانات:" -ForegroundColor White
Write-Host "   • انسخ متغيرات Postgres إلى .env.local" -ForegroundColor White
Write-Host "   • شغل: node scripts/migrate-to-postgres.js" -ForegroundColor White

Write-Host "`n6️⃣ التحقق من النشر:" -ForegroundColor Cyan
Write-Host "   • افتح الموقع وتحقق من:" -ForegroundColor White
Write-Host "     - الصفحة الرئيسية" -ForegroundColor Gray
Write-Host "     - صفحة الأدوات /tools" -ForegroundColor Gray
Write-Host "     - صفحة المقالات /articles" -ForegroundColor Gray
Write-Host "     - لوحة الإدارة /admin" -ForegroundColor Gray
Write-Host "     - حاسبة العمر" -ForegroundColor Gray
Write-Host "     - بطاقات التهنئة /cards" -ForegroundColor Gray

Write-Host "`n🔗 روابط مهمة:" -ForegroundColor Cyan
Write-Host "   • Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Blue
Write-Host "   • GitHub Repository: $GITHUB_REPO" -ForegroundColor Blue
Write-Host "   • ملف المهمات: DEPLOYMENT_TASKS.md" -ForegroundColor Blue

Write-Host "`n💡 نصائح:" -ForegroundColor Yellow
Write-Host "   • احفظ متغيرات Postgres في مكان آمن" -ForegroundColor White
Write-Host "   • تأكد من إضافة جميع المتغيرات في Vercel" -ForegroundColor White
Write-Host "   • انتظر 2-5 دقائق لاكتمال البناء" -ForegroundColor White
Write-Host "   • تحقق من سجلات البناء في حالة وجود أخطاء" -ForegroundColor White

Write-Host "`n🎉 الموقع جاهز للنشر!" -ForegroundColor Green
Write-Host "جميع الملفات والمفاتيح جاهزة، اتبع الخطوات أعلاه لإكمال النشر." -ForegroundColor Green

Read-Host "`nPress Enter to exit..."
