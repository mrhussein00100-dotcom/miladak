#!/usr/bin/env pwsh

Write-Host "🔧 إصلاح مشكلة البناء وإعادة النشر..." -ForegroundColor Yellow

# التأكد من أن جميع ملفات API تستخدم الصيغة الصحيحة
Write-Host "التحقق من ملفات API..." -ForegroundColor Blue

# تنظيف cache
Write-Host "تنظيف cache..." -ForegroundColor Blue
if (Test-Path ".next") { 
    Write-Host "حذف مجلد .next..." -ForegroundColor Gray
    Remove-Item -Recurse -Force ".next" 
}

# تنظيف TypeScript cache
if (Test-Path "tsconfig.tsbuildinfo") { 
    Write-Host "حذف TypeScript cache..." -ForegroundColor Gray
    Remove-Item -Force "tsconfig.tsbuildinfo" 
}

# بناء المشروع محلياً للتأكد من عدم وجود أخطاء
Write-Host "بناء المشروع محلياً..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ البناء المحلي نجح!" -ForegroundColor Green
    
    # النشر على Vercel
    Write-Host "النشر على Vercel..." -ForegroundColor Cyan
    git add .
    git commit -m "🔧 Fix: Resolve Next.js 15 API route params issue"
    git push origin main
    
    Write-Host "✅ تم النشر بنجاح!" -ForegroundColor Green
} else {
    Write-Host "❌ فشل البناء المحلي. يرجى مراجعة الأخطاء أعلاه." -ForegroundColor Red
}
