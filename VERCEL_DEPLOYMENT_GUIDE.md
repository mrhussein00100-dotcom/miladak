# دليل نشر ميلادك على Vercel

## الخطوات

### 1. إنشاء قاعدة بيانات Postgres

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى **Storage** > **Create Database**
4. اختر **Postgres**
5. اختر اسم قاعدة البيانات (مثل: `miladak-db`)
6. اختر المنطقة الأقرب (مثل: `fra1` لأوروبا)
7. انقر **Create**

### 2. نسخ متغيرات البيئة

بعد إنشاء قاعدة البيانات، ستحصل على متغيرات البيئة التالية:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. إضافة متغيرات البيئة في Vercel

اذهب إلى **Settings** > **Environment Variables** وأضف:

```
# قاعدة البيانات (تُضاف تلقائياً عند ربط Postgres)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# الموقع
NEXT_PUBLIC_APP_URL=https://miladak.com
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.com
NEXT_PUBLIC_SITE_URL=https://miladak.com

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118

# AI (اختياري)
GEMINI_API_KEY=...
GROQ_API_KEY=...

# Pexels (اختياري)
NEXT_PUBLIC_PEXELS_API_KEY=...
PEXELS_API_KEY=...
```

### 4. ترحيل البيانات

#### الطريقة 1: من الجهاز المحلي

```bash
# تثبيت الحزم
npm install

# إضافة متغيرات Postgres إلى .env.local
# ثم تشغيل سكريبت الترحيل
node scripts/migrate-to-postgres.js
```

#### الطريقة 2: استخدام Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# ربط المشروع
vercel link

# سحب متغيرات البيئة
vercel env pull .env.local

# تشغيل الترحيل
node scripts/migrate-to-postgres.js
```

### 5. النشر

```bash
# من خلال Git
git add .
git commit -m "Prepare for Vercel deployment"
git push

# أو من خلال Vercel CLI
vercel --prod
```

## ملاحظات مهمة

### قاعدة البيانات

- SQLite تُستخدم للتطوير المحلي فقط
- Postgres تُستخدم في الإنتاج على Vercel
- الكود يكتشف تلقائياً نوع قاعدة البيانات

### AdSense

- كود AdSense: `ca-pub-5755672349927118`
- تأكد من إضافة موقعك في لوحة AdSense
- قد يستغرق التفعيل 24-48 ساعة

### الأمان

- لا ترفع ملف `.env.local` إلى Git
- استخدم متغيرات البيئة في Vercel
- غيّر `NEXTAUTH_SECRET` لقيمة عشوائية قوية

## استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات

```
Error: Connection refused
```

**الحل:** تأكد من إضافة متغيرات Postgres بشكل صحيح

### خطأ في البناء

```
Error: Module not found: @vercel/postgres
```

**الحل:** شغل `npm install` ثم أعد النشر

### AdSense لا يظهر

- تأكد من تفعيل الموقع في لوحة AdSense
- تأكد من إضافة `NEXT_PUBLIC_ADSENSE_CLIENT` بشكل صحيح
- انتظر 24-48 ساعة للتفعيل

## الدعم

إذا واجهت مشاكل، تحقق من:

1. سجلات Vercel: **Deployments** > اختر النشر > **Logs**
2. سجلات الدوال: **Functions** > اختر الدالة > **Logs**
