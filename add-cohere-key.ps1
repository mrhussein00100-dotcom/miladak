# إضافة مفتاح Cohere إلى Vercel
Write-Host "إضافة COHERE_API_KEY إلى Vercel..." -ForegroundColor Cyan

# استخدام echo لإرسال القيمة
$env:COHERE_KEY = "J5jEPCOl4a3uWLJqHZx22pJHMeo7onJsuqfogkdj"
echo $env:COHERE_KEY | vercel env add COHERE_API_KEY production

Write-Host "تم!" -ForegroundColor Green
