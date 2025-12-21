#!/usr/bin/env pwsh

Write-Host "🚀 نشر موقع ميلادك v2 على Vercel" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n📋 ما سيتم تنفيذه:" -ForegroundColor Yellow
Write-Host "  1. التحقق من Vercel CLI وتثبيته إذا لزم الأمر" -ForegroundColor White
Write-Host "  2. إعداد جميع متغيرات البيئة المطلوبة" -ForegroundColor White
Write-Host "  3. بناء المشروع للإنتاج" -ForegroundColor White
Write-Host "  4. نشر المشروع على Vercel" -ForegroundColor White
Write-Host "  5. اختبار الموقع المنشور" -ForegroundColor White
Write-Host "  6. إعداد النطاق المخصص miladak.com" -ForegroundColor White

Write-Host "`n⚠️ ملاحظات مهمة:" -ForegroundColor Red
Write-Host "  • تأكد من أن لديك حساب Vercel" -ForegroundColor Yellow
Write-Host "  • ستحتاج لتسجيل الدخول إذا لم تكن مسجلاً" -ForegroundColor Yellow
Write-Host "  • قد تحتاج لإعداد DNS للنطاق يدوياً" -ForegroundColor Yellow

$confirmation = Read-Host "`n❓ هل تريد المتابعة؟ (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y' -or $confirmation -eq 'yes') {
    Write-Host "`n🎯 بدء عملية النشر..." -ForegroundColor Green
    
    # تشغيل سكريبت النشر
    node scripts/deploy-to-vercel-complete.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 تم النشر بنجاح!" -ForegroundColor Green
        Write-Host "🌐 يمكنك الآن زيارة موقعك على:" -ForegroundColor Cyan
        Write-Host "   • الرابط المؤقت من Vercel" -ForegroundColor White
        Write-Host "   • https://miladak.com (بعد انتشار DNS)" -ForegroundColor White
        
        Write-Host "`n📝 خطوات إضافية قد تحتاجها:" -ForegroundColor Yellow
        Write-Host "  1. تحديث إعدادات DNS للنطاق" -ForegroundColor White
        Write-Host "  2. اختبار جميع الأدوات والمقالات" -ForegroundColor White
        Write-Host "  3. اختبار لوحة الإدارة" -ForegroundColor White
    } else {
        Write-Host "`n❌ فشل في النشر!" -ForegroundColor Red
        Write-Host "📋 راجع الأخطاء أعلاه وحاول مرة أخرى" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ تم إلغاء النشر" -ForegroundColor Red
    Write-Host "💡 يمكنك تشغيل هذا السكريبت مرة أخرى عندما تكون جاهزاً" -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")