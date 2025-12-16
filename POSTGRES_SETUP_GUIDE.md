# دليل إعداد PostgreSQL - ميلادك V2

## نظرة عامة 🎯

تم تحديث المشروع ليدعم PostgreSQL كقاعدة بيانات دائمة للإنتاج، مع الاحتفاظ بدعم SQLite للتطوير المحلي.

## المميزات الجديدة ✨

- ✅ دعم PostgreSQL للإنتاج
- ✅ دعم SQLite للتطوير المحلي
- ✅ نظام قاعدة بيانات موحد
- ✅ سكريپت نقل البيانات التلقائي
- ✅ إعداد Connection Pooling
- ✅ دعم المعاملات (Transactions)

## إعداد قاعدة البيانات على Vercel 🚀

### الخطوة 1: إنشاء قاعدة البيانات

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `miladak`
3. **Storage** → **Create Database** → **Postgres**
4. اختر المنطقة: **Frankfurt (fra1)**
5. اضغط **Create**

### الخطوة 2: إضافة متغيرات البيئة

في **Settings** → **Environment Variables**، أضف:

```
POSTGRES_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
DATABASE_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
NODE_ENV=production
```

### الخطوة 3: نقل البيانات

```bash
# محلياً - نقل البيانات من SQLite إلى PostgreSQL
POSTGRES_URL="your-postgres-url" npm run db:migrate
```

## الاستخدام في الكود 💻

### استعلام بسيط

```typescript
import { queryOne, queryAll } from '@/lib/db/unified-database';

// جلب مقال واحد
const article = await queryOne('SELECT * FROM articles WHERE slug = $1', [
  slug,
]);

// جلب جميع الأدوات
const tools = await queryAll('SELECT * FROM tools WHERE active = $1', [true]);
```

### إدراج/تحديث

```typescript
import { execute } from '@/lib/db/unified-database';

// إدراج مقال جديد
const result = await execute(
  `
  INSERT INTO articles (title, slug, content, category_id) 
  VALUES ($1, $2, $3, $4) RETURNING id
`,
  [title, slug, content, categoryId]
);
```

### معاملة (Transaction)

```typescript
import { executePostgresTransaction } from '@/lib/db/postgres';

const result = await executePostgresTransaction(async (client) => {
  await client.query('INSERT INTO articles (...) VALUES (...)', [...]);
  await client.query('UPDATE categories SET article_count = article_count + 1 WHERE id = $1', [categoryId]);
  return { success: true };
});
```

## هيكل قاعدة البيانات 📊

### الجداول الرئيسية

- **tools** - الأدوات والحاسبات
- **tool_categories** - فئات الأدوات
- **articles** - المقالات والمحتوى
- **article_categories** - فئات المقالات
- **admin_users** - المستخدمين الإداريين

### جداول البيانات الإضافية

- **birthstones** - أحجار الميلاد
- **birth_flowers** - زهور الميلاد
- **celebrities** - المشاهير
- **historical_events** - الأحداث التاريخية
- **page_keywords** - الكلمات المفتاحية

## الأوامر المفيدة 🛠️

```bash
# تطوير محلي
npm run dev

# بناء للإنتاج
npm run build:vercel

# نقل البيانات
npm run db:migrate

# اختبار قاعدة البيانات
npm run db:test

# النشر الكامل
./deploy-with-postgres.ps1
```

## استكشاف الأخطاء 🔍

### خطأ الاتصال

```
Error: connect ECONNREFUSED
```

**الحل**: تأكد من صحة `POSTGRES_URL` في متغيرات البيئة

### خطأ الجداول

```
Error: relation "tools" does not exist
```

**الحل**: شغل سكريپت إنشاء الجداول:

```sql
-- في PostgreSQL console
\i lib/db/postgres-schema.sql
```

### خطأ الصلاحيات

```
Error: permission denied for table
```

**الحل**: تأكد من صلاحيات المستخدم في PostgreSQL

## الملفات المهمة 📁

- `lib/db/postgres.ts` - اتصال PostgreSQL
- `lib/db/unified-database.ts` - النظام الموحد
- `lib/db/postgres-schema.sql` - هيكل قاعدة البيانات
- `scripts/migrate-to-postgres.js` - سكريپت النقل
- `setup-vercel-postgres.md` - دليل الإعداد التفصيلي

## الدعم والمساعدة 💬

إذا واجهت أي مشاكل:

1. تحقق من متغيرات البيئة
2. راجع logs في Vercel Dashboard
3. اختبر الاتصال محلياً أولاً
4. تأكد من تشغيل سكريپت النقل

---

**ملاحظة**: هذا النظام يدعم التبديل التلقائي بين SQLite (تطوير) و PostgreSQL (إنتاج) حسب متغيرات البيئة.
