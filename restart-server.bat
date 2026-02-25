@echo off
chcp 65001 >nul
echo ========================================
echo    إعادة تشغيل سيرفر Miladak V2
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] إيقاف أي سيرفر قيد التشغيل...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] حذف مجلد .next للتخلص من الكاش...
if exist ".next" (
    rmdir /s /q ".next"
    echo    تم حذف مجلد .next
) else (
    echo    مجلد .next غير موجود
)

echo [3/3] تشغيل السيرفر...
echo.
echo ========================================
echo    السيرفر يعمل على: http://localhost:3000
echo    اضغط Ctrl+C لإيقاف السيرفر
echo ========================================
echo.

npm run dev
