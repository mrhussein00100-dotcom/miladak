# سكريبت إعداد متغيرات البيئة في Vercel
# Setup Vercel Environment Variables Script

param(
    [Parameter(Mandatory=$true)]
    [string]$PostgresUrl
)

Write-Host "🚀 إعداد متغيرات البيئة في Vercel..." -ForegroundColor Green

# قائمة متغيرات البيئة المطلوبة
$envVars = @{
    "DATABASE_TYPE" = "postgresql"
    "POSTGRES_URL" = $PostgresUrl
    "GROQ_API_KEY" = "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"
    "GEMINI_API_KEY" = "AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM"
    "PEXELS_API_KEY" = "Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx"
    "NEXT_PUBLIC_PEXELS_API_KEY" = "Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx"
    "NEXT_PUBLIC_ADSENSE_CLIENT" = "ca-pub-5755672349927118"
    "ADSENSE_PUBLISHER_ID" = "pub-5755672349927118"
    "NEXT_PUBLIC_APP_URL" = "https://miladak.vercel.app"
    "NEXT_PUBLIC_APP_NAME" = "Miladak"
    "NEXT_PUBLIC_BASE_URL" = "https://miladak.vercel.app"
    "NEXT_PUBLIC_SITE_URL" = "https://miladak.vercel.app"
    "AUTH_SECRET" = "miladak_production_secret_2025_strong_key_xyz123"
}

Write-Host "📋 متغيرات البيئة المطلوبة:" -ForegroundColor Yellow
foreach ($key in $envVars.Keys) {
    if ($key -eq "POSTGRES_URL") {
        Write-Host "  ✓ $key = [POSTGRES_URL من Vercel]" -ForegroundColor Cyan
    } elseif ($key -like "*API_KEY*" -or $key -eq "AUTH_SECRET") {
        Write-Host "  ✓ $key = [مخفي للأمان]" -ForegroundColor Cyan
    } else {
        Write-Host "  ✓ $key = $($envVars[$key])" -ForegroundColor Cyan
    }
}

Write-Host "`n🔧 الخطوات التالية:" -ForegroundColor Green
Write-Host "1. اذهب إلى Vercel Dashboard" -ForegroundColor White
Write-Host "2. اختر مشروع miladak" -ForegroundColor White
Write-Host "3. اذهب إلى Settings → Environment Variables" -ForegroundColor White
Write-Host "4. أضف المتغيرات المذكورة أعلاه" -ForegroundColor White
Write-Host "5. تأكد من إضافة POSTGRES_URL الصحيح" -ForegroundColor White

Write-Host "`n✅ جاهز للخطوة التالية: ترحيل البيانات" -ForegroundColor Green