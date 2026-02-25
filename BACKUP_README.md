# 📦 نسخة احتياطية كاملة - موقع ميلادك المنشور

## 📅 معلومات النسخة

- **تاريخ النسخ:** 9 يناير 2026
- **المصدر:** GitHub + Vercel Postgres Production
- **Repository:** https://github.com/mrhussein00100-dotcom/miladak.git

## 📁 محتويات النسخة

### الكود المصدري

- ✅ تم تحميله من GitHub (branch: main)
- ✅ جميع الملفات والمجلدات

### قاعدة البيانات (1987 صف)

- `database-backup.json` - نسخة JSON كاملة
- `database-backup.sql` - نسخة SQL للاستعادة

### الجداول المحفوظة:

| الجدول                | عدد الصفوف |
| --------------------- | ---------- |
| articles              | 94         |
| categories            | 49         |
| article_categories    | 51         |
| tools                 | 20         |
| tool_categories       | 7          |
| page_keywords         | 36         |
| admin_users           | 5          |
| daily_birthdays       | 618        |
| daily_events          | 698        |
| chinese_zodiac        | 201        |
| years                 | 76         |
| major_events          | 25         |
| site_settings         | 22         |
| sona_settings         | 16         |
| birthstones           | 12         |
| birth_flowers         | 12         |
| lucky_colors          | 12         |
| seasons               | 12         |
| rewrite_history       | 11         |
| sona_generation_logs  | 4          |
| sona_plugins          | 4          |
| auto_publish_settings | 1          |
| quick_tools           | 1          |

### ملفات البيئة

- `.env.local` - متغيرات البيئة المحلية
- `.env.prod.local` - متغيرات الإنتاج (تحتوي على POSTGRES_URL)

## 🚀 كيفية الاستخدام

### للتشغيل المحلي:

```powershell
# 1. تثبيت الحزم
npm install

# 2. تشغيل الموقع
npm run dev
```

### لاستعادة قاعدة البيانات:

```javascript
// استخدم ملف database-backup.json للاستيراد البرمجي
const backup = require('./database-backup.json');

// أو استخدم database-backup.sql مع أي أداة PostgreSQL
```

### للنشر على Vercel:

1. ارفع المجلد على GitHub جديد
2. اربطه بـ Vercel
3. أضف متغيرات البيئة من `.env.prod.local`
4. استعد قاعدة البيانات

## ⚠️ ملاحظات مهمة

- ❌ لا تشارك ملفات `.env` مع أي شخص
- 💾 احتفظ بهذه النسخة في مكان آمن
- 🔑 تأكد من تحديث مفاتيح API إذا لزم الأمر

## 🔗 روابط مهمة

- **الموقع المنشور:** https://miladak.com
- **GitHub:** https://github.com/mrhussein00100-dotcom/miladak
- **Vercel Dashboard:** https://vercel.com/miladaks-projects/miladak

---

تم إنشاء هذه النسخة تلقائياً بواسطة Kiro
