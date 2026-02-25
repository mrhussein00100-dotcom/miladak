# نسخة احتياطية كاملة - miladak.com

## تاريخ النسخة الاحتياطية
**التاريخ:** 9 يناير 2026 - 7:00 مساءً

## محتويات النسخة الاحتياطية

### 1. الكود المصدري (`code/`)
- نسخة كاملة من الكود المنشور على GitHub
- المصدر: `https://github.com/mrhussein00100-dotcom/miladak`
- يشمل جميع الملفات والمجلدات

### 2. قاعدة البيانات (`database/`)
- تصدير كامل من Vercel Postgres
- **33 جدول** بإجمالي **1,987 سجل**
- الجداول الرئيسية:
  - `articles` - 94 مقال
  - `categories` - 49 تصنيف
  - `daily_events` - 698 حدث يومي
  - `daily_birthdays` - 618 عيد ميلاد
  - `chinese_zodiac` - 201 سجل
  - `tools` - 20 أداة
  - وغيرها...

### 3. ملفات البيئة
- `.env.local` - إعدادات التطوير المحلي
- `.env.prod.local` - إعدادات الإنتاج (تشمل مفاتيح API)
- `.env.vercel` - إعدادات Vercel

## كيفية استخدام النسخة الاحتياطية

### للعمل محلياً:
```bash
cd code
npm install
npm run dev
```

### لاستعادة قاعدة البيانات:
1. أنشئ قاعدة بيانات PostgreSQL جديدة
2. استخدم ملفات JSON في مجلد `database/` لاستيراد البيانات
3. أو استخدم ملف `_schema.json` لإنشاء الهيكل ثم استورد البيانات

### للنشر على Vercel:
1. ارفع الكود إلى GitHub repository جديد
2. اربط المشروع بـ Vercel
3. أضف متغيرات البيئة من `.env.prod.local`
4. انشر!

## معلومات تقنية

### قاعدة البيانات
- **النوع:** PostgreSQL (Vercel Postgres)
- **الاتصال:** موجود في `.env.prod.local`

### مفاتيح API المضمنة
- Gemini API (3 مفاتيح)
- Groq API
- Pexels API
- Unsplash API
- Cohere API

### الموقع المنشور
- **الدومين:** https://miladak.com
- **Vercel URL:** https://miladak.vercel.app

## ملاحظات مهمة
⚠️ لا تشارك ملفات `.env` مع أي شخص - تحتوي على مفاتيح سرية
⚠️ قم بتغيير المفاتيح إذا كنت ستنشر نسخة عامة
