# 🚀 دليل نشر ميلادك V2

## الخطوات السريعة

### 1. تشغيل سكريبت النشر

```powershell
# في PowerShell كمدير
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-to-vercel.ps1
```

### 2. إعداد Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع **miladak** الموجود
3. **Settings** > **Git** > **Disconnect** (فصل المستودع القديم)
4. **Connect Git Repository** > اختر `mrhussein00100-dotcom/miladak`

### 3. إنشاء قاعدة البيانات

1. **Storage** > **Create Database** > **Postgres**
2. اسم قاعدة البيانات: `miladak-db`
3. المنطقة: `fra1` (فرانكفورت)
4. **Connect to Project** > اختر مشروع miladak

### 4. إضافة متغيرات البيئة

في **Settings** > **Environment Variables**:

```env
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
```

### 5. ترحيل البيانات

```powershell
# انسخ متغيرات Postgres من Vercel إلى .env.local
# ثم شغل:
.\migrate-data.ps1
```

### 6. النشر

بعد ربط GitHub، سيتم النشر تلقائياً!

---

## معلومات الحساب

- **GitHub**: `mrhussein00100-dotcom/miladak`
- **Vercel**: `mrhussein00100-6276`
- **Email**: `mr.hussein00100@gmail.com`
- **Domain**: `miladak.com`

---

## استكشاف الأخطاء

### Git غير مثبت

```powershell
# تحميل Git من: https://git-scm.com/download/win
# أو استخدام Chocolatey:
choco install git
```

### خطأ في رفع الكود

```powershell
# تسجيل الدخول إلى Git
git config --global user.name "mrhussein00100-dotcom"
git config --global user.email "mr.hussein00100@gmail.com"

# إعادة المحاولة
git push -u origin main --force
```

### فشل ترحيل البيانات

1. تأكد من إنشاء قاعدة البيانات في Vercel
2. تأكد من ربط قاعدة البيانات بالمشروع
3. تأكد من نسخ متغيرات Postgres إلى `.env.local`

---

## الملفات المهمة

- `deploy-to-vercel.ps1` - سكريبت النشر الرئيسي
- `migrate-data.ps1` - سكريبت ترحيل البيانات
- `scripts/migrate-to-postgres.js` - ترحيل البيانات
- `lib/db/postgres.ts` - اتصال قاعدة البيانات
- `.env.local` - متغيرات البيئة المحلية

---

## بعد النشر

✅ **تحقق من:**

- الصفحة الرئيسية: https://miladak.com
- الأدوات: https://miladak.com/tools
- المقالات: https://miladak.com/articles
- لوحة الإدارة: https://miladak.com/admin
- حاسبة العمر: https://miladak.com/calculate-birthday
- بطاقات التهنئة: https://miladak.com/cards

🔧 **إعدادات إضافية:**

- إضافة الموقع في Google Search Console
- إرسال sitemap.xml: https://miladak.com/sitemap.xml
- التحقق من تفعيل AdSense (24-48 ساعة)

---

_آخر تحديث: ديسمبر 2024_
