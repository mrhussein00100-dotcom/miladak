@echo off
chcp 65001 >nul
echo ========================================
echo    تشغيل سيرفر miladak_v2
echo ========================================
echo.

cd /d "%~dp0"

echo جاري تثبيت الحزم...
call npm install

echo.
echo ========================================
echo    السيرفر يعمل على: http://localhost:3000
echo ========================================
echo.

npm run dev
pause
