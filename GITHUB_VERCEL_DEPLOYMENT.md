# 🚀 دليل نشر ميلادك V2 على Vercel عبر GitHub

## 📋 نظرة عامة

هذا الدليل يشرح خطوات نشر النسخة الثانية من موقع ميلادك على Vercel باستخدام مستودع GitHub.

**المتطلبات:**

- حساب GitHub
- حساب Vercel (مجاني)
- النسخة الأولى مرفوعة مسبقاً على Vercel

---

## 📁 الخطوة 1: تجهيز المشروع للرفع

### 1.1 التأكد من ملف .gitignore

تأكد أن الملفات الحساسة مستثناة:

```gitignore
# Environment files
.env
.env.local
.env.production.local

# Database
*.sqlite
*.sqlite-shm
*.sqlite-wal
database.sqlite

# Dependencies
node_modules/

# Build
.next/
out/

# IDE
.vscode/
.idea/
```

### 1.2 التأكد من الملفات المطلوبة

```
✅ package.json
✅ next.config.mjs
✅ vercel.json
✅ lib/db/postgres.ts
✅ lib/db/postgres-schema.sql
✅ scripts/migrate-to-postgres.js
```

---

## 🔗 الخطوة 2: إنشاء مستودع GitHub

### 2.1 إنشاء مستودع جديد

1. اذهب إلى [github.com/new](https://github.com/new)
2. اختر اسم المستودع: `miladak-v2`
3. اجعله **Private** (خاص) للأمان
4. لا تضف README أو .gitignore (موجودين مسبقاً)
5. انقر **Create repository**

### 2.2 رفع الكود إلى GitHub

افتح Terminal في مجلد المشروع وشغل:

```powershell
# الانتقال لمجلد المشروع
cd C:\web\secend_stadge\miladak_v2

# تهيئة Git (إذا لم يكن موجوداً)
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Miladak V2 - Initial release"

# ربط المستودع البعيد
git remote add origin https://github.com/YOUR_USERNAME/miladak-v2.git

# رفع الكود
git branch -M main
git push -u origin main
```

> ⚠️ **استبدل `YOUR_USERNAME` باسم حسابك على GitHub**

---

## 🗄️ الخطوة 3: إنشاء قاعدة بيانات Postgres في Vercel

### 3.1 إنشاء قاعدة البيانات

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك الحالي (النسخة الأولى)
3. اذهب إلى **Storage** في القائمة الجانبية
4. انقر **Create Database**
5. اختر **Postgres**
6. أدخل الإعدادات:
   - **Name:** `miladak-db`
   - **Region:** `fra1` (فرانكفورت - الأقرب للشرق الأوسط)
7. انقر **Create**

### 3.2 نسخ متغيرات البيئة

بعد إنشاء قاعدة البيانات، ستظهر متغيرات البيئة:

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

**احفظ هذه القيم! ستحتاجها لاحقاً.**

---

## 📤 الخطوة 4: ترحيل البيانات من SQLite إلى Postgres

### 4.1 إضافة متغيرات Postgres محلياً

أضف متغيرات Postgres إلى ملف `.env.local`:

```env
# ===========================================
# Miladak V2 - Local Development Environment
# ===========================================

# Database - SQLite للتطوير المحلي
DATABASE_URL="database.sqlite"

# Vercel Postgres (للترحيل)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# باقي المتغيرات...
```

### 4.2 تشغيل سكريبت الترحيل

```powershell
# تأكد من تثبيت الحزم
npm install

# شغل سكريبت الترحيل
node scripts/migrate-to-postgres.js
```

**النتيجة المتوقعة:**

```
🚀 بدء ترحيل البيانات من SQLite إلى Postgres...

📊 إنشاء الجداول في Postgres...
✅ تم إنشاء الجداول

📊 ترحيل البيانات...

📦 ترحيل جدول: categories...
   ✅ تم ترحيل 10/10 صف
📦 ترحيل جدول: articles...
   ✅ تم ترحيل 50/50 صف
...

✅ اكتمل الترحيل! تم ترحيل 500 صف إجمالاً
```

---

## ⚙️ الخطوة 5: إعداد Vercel للنسخة الجديدة

### الخيار أ: تحديث المشروع الحالي (موصى به)

إذا كنت تريد استبدال النسخة الأولى بالنسخة الثانية:

1. اذهب إلى مشروعك في Vercel Dashboard
2. اذهب إلى **Settings** > **Git**
3. انقر **Disconnect** لفصل المستودع القديم
4. انقر **Connect Git Repository**
5. اختر مستودع `miladak-v2` الجديد
6. انقر **Connect**

### الخيار ب: إنشاء مشروع جديد

إذا كنت تريد الاحتفاظ بالنسخة الأولى:

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. انقر **Add New** > **Project**
3. اختر **Import Git Repository**
4. اختر مستودع `miladak-v2`
5. انقر **Import**

---

## 🔐 الخطوة 6: إضافة متغيرات البيئة في Vercel

### 6.1 الذهاب لإعدادات المتغيرات

1. اذهب إلى مشروعك في Vercel
2. انقر **Settings** > **Environment Variables**

### 6.2 إضافة المتغيرات المطلوبة

أضف المتغيرات التالية (لجميع البيئات: Production, Preview, Development):

```env
# قاعدة البيانات (تُضاف تلقائياً عند ربط Postgres Storage)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=default
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=verceldb

# الموقع
NEXT_PUBLIC_APP_URL=https://miladak.com
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_BASE_URL=https://miladak.com
NEXT_PUBLIC_SITE_URL=https://miladak.com

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-5755672349927118
ADSENSE_PUBLISHER_ID=pub-5755672349927118

# AI Providers (Add your API keys here)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Pexels (Add your API key here)
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
```

### 6.3 ربط قاعدة البيانات بالمشروع

1. اذهب إلى **Storage** في Vercel Dashboard
2. اختر قاعدة البيانات `miladak-db`
3. انقر **Connect to Project**
4. اختر مشروعك
5. انقر **Connect**

> هذا سيضيف متغيرات Postgres تلقائياً للمشروع

---

## 🚀 الخطوة 7: النشر

### 7.1 النشر التلقائي عبر Git

بعد ربط المستودع، أي push جديد سينشر تلقائياً:

```powershell
# إضافة التغييرات
git add .

# Commit
git commit -m "Ready for production"

# Push للنشر
git push origin main
```

### 7.2 النشر اليدوي (اختياري)

```powershell
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر للإنتاج
vercel --prod
```

---

## ✅ الخطوة 8: التحقق من النشر

### 8.1 فحص الموقع

1. افتح رابط الموقع: `https://miladak.com` أو الرابط المؤقت
2. تأكد من:
   - ✅ الصفحة الرئيسية تعمل
   - ✅ الأدوات تعمل
   - ✅ المقالات تظهر
   - ✅ لوحة الإدارة تعمل (`/admin`)

### 8.2 فحص قاعدة البيانات

1. اذهب إلى Vercel Dashboard > Storage > miladak-db
2. انقر **Data** لرؤية الجداول
3. تأكد من وجود البيانات

### 8.3 فحص السجلات

1. اذهب إلى Vercel Dashboard > Deployments
2. اختر آخر نشر
3. انقر **Functions** لرؤية سجلات API

---

## 🔧 استكشاف الأخطاء

### خطأ: Module not found: @vercel/postgres

```powershell
npm install @vercel/postgres
git add package.json package-lock.json
git commit -m "Add @vercel/postgres"
git push
```

### خطأ: Database connection failed

1. تأكد من ربط قاعدة البيانات بالمشروع
2. تأكد من وجود `POSTGRES_URL` في متغيرات البيئة
3. أعد النشر: `vercel --prod`

### خطأ: Build failed

1. اذهب إلى Deployments > اختر النشر الفاشل
2. انقر **View Build Logs**
3. ابحث عن الخطأ وأصلحه محلياً
4. Push التصحيح

### الموقع يعمل لكن البيانات فارغة

1. تأكد من تشغيل سكريبت الترحيل
2. تأكد من استخدام نفس قاعدة البيانات المربوطة

---

## 📊 ملخص المتغيرات المطلوبة

| المتغير                      | الوصف               | مثال                      |
| ---------------------------- | ------------------- | ------------------------- |
| `POSTGRES_URL`               | رابط قاعدة البيانات | `postgres://...`          |
| `NEXT_PUBLIC_APP_URL`        | رابط الموقع         | `https://miladak.com`     |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | كود AdSense         | `ca-pub-5755672349927118` |
| `GEMINI_API_KEY`             | مفتاح Gemini AI     | `[من .env.local]`         |
| `GROQ_API_KEY`               | مفتاح Groq AI       | `[من .env.local]`         |
| `PEXELS_API_KEY`             | مفتاح Pexels للصور  | `[من .env.local]`         |

---

## 🎉 تم النشر بنجاح!

بعد اتباع هذه الخطوات، سيكون موقعك:

- ✅ مرفوع على GitHub
- ✅ منشور على Vercel
- ✅ متصل بقاعدة بيانات Postgres
- ✅ يدعم AdSense
- ✅ يدعم AI للمقالات

---

## 📞 الدعم

إذا واجهت مشاكل:

1. راجع سجلات Vercel
2. تحقق من متغيرات البيئة
3. تأكد من ترحيل البيانات بنجاح

---

_آخر تحديث: ديسمبر 2024_
