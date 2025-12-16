# 🐘 دليل إعداد PostgreSQL الكامل لموقع ميلادك

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد نظام PostgreSQL كامل للموقع مع ترحيل البيانات من SQLite وحل مشاكل مفاتيح API.

## 🚀 الخطوات

### 1. إعداد PostgreSQL على Vercel

#### أ. إنشاء قاعدة بيانات PostgreSQL

```bash
# في Vercel Dashboard
1. اذهب إلى Storage > Create Database
2. اختر PostgreSQL
3. اختر المنطقة (يفضل us-east-1)
4. انقر Create
```

#### ب. الحصول على معلومات الاتصال

```bash
# ستحصل على:
POSTGRES_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.us-east-1.postgres.vercel-storage.com/verceldb"
```

### 2. تحديث متغيرات البيئة

#### أ. في Vercel Dashboard

```bash
# اذهب إلى Settings > Environment Variables
# أضف المتغيرات التالية:

POSTGRES_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
DATABASE_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
POSTGRES_HOST=xxx-pooler.us-east-1.postgres.vercel-storage.com
POSTGRES_USER=default
POSTGRES_PASSWORD=xxx
POSTGRES_DATABASE=verceldb
POSTGRES_SSL=true

# مفاتيح API
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=AIzaSyxxx
COHERE_API_KEY=xxx
HUGGINGFACE_API_KEY=hf_xxx
PEXELS_API_KEY=xxx

# الأمان
NEXTAUTH_SECRET=your-super-secret-key-here
AUTH_SECRET=miladak-production-secret-2025
```

#### ب. في الملف المحلي `.env.local`

```bash
# للتطوير المحلي - استخدم SQLite
DATABASE_TYPE=sqlite
DATABASE_URL=./database.sqlite

# مفاتيح API للتطوير
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=AIzaSyxxx
COHERE_API_KEY=xxx
HUGGINGFACE_API_KEY=hf_xxx
PEXELS_API_KEY=xxx
```

### 3. ترحيل البيانات

#### أ. تشغيل سكريبت الترحيل

```bash
# تأكد من وجود POSTGRES_URL في البيئة
export POSTGRES_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"

# تشغيل الترحيل
node scripts/migrate-to-postgres-complete.js
```

#### ب. التحقق من نجاح الترحيل

```bash
# تشغيل سكريبت التحقق
node scripts/test-postgres-connection.js
```

### 4. تحديث الكود

#### أ. استخدام النظام الموحد

```typescript
// استبدال database.ts القديم
import db from '@/lib/db/database-new';

// الاستخدام
const tools = await db.query('SELECT * FROM tools WHERE active = $1', [true]);
const tool = await db.queryOne('SELECT * FROM tools WHERE slug = $1', [
  'age-calculator',
]);
```

#### ب. تحديث ملفات API

```typescript
// في ملفات API
import { query, queryOne, execute } from '@/lib/db/database-new';

export async function GET() {
  const tools = await query('SELECT * FROM tools');
  return NextResponse.json({ tools });
}
```

### 5. حل مشاكل مفاتيح API

#### أ. إنشاء نظام إدارة المفاتيح

```typescript
// lib/config/api-keys.ts
export const getApiKey = (provider: string): string => {
  const keys = {
    groq: process.env.GROQ_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    cohere: process.env.COHERE_API_KEY,
    huggingface: process.env.HUGGINGFACE_API_KEY,
    pexels: process.env.PEXELS_API_KEY,
  };

  const key = keys[provider as keyof typeof keys];
  if (!key) {
    throw new Error(\`API key for \${provider} not found\`);
  }

  return key;
};
```

#### ب. تحديث موفري AI

```typescript
// في lib/ai/providers/groq.ts
import { getApiKey } from '@/lib/config/api-keys';

const apiKey = getApiKey('groq');
```

### 6. النشر والاختبار

#### أ. النشر على Vercel

```bash
# تأكد من commit جميع التغييرات
git add .
git commit -m "feat: Complete PostgreSQL setup with data migration"
git push origin main
```

#### ب. اختبار الموقع

```bash
# تحقق من:
1. تحميل الصفحة الرئيسية
2. عرض الأدوات
3. عرض المقالات
4. عمل لوحة التحكم
5. عمل مولد المحتوى بالذكاء الاصطناعي
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ الاتصال بقاعدة البيانات

```bash
# تحقق من:
- صحة POSTGRES_URL
- إعدادات SSL
- صلاحيات المستخدم
```

#### 2. مفاتيح API لا تعمل

```bash
# تحقق من:
- وجود المفاتيح في Vercel Environment Variables
- صحة أسماء المتغيرات
- عدم وجود مسافات إضافية
```

#### 3. بطء في الاستعلامات

```bash
# حلول:
- استخدام Connection Pooling
- إضافة فهارس للجداول
- تحسين الاستعلامات
```

## 📊 مراقبة الأداء

### 1. مراقبة قاعدة البيانات

```typescript
// إضافة logging للاستعلامات
const result = await db.query(sql, params);
console.log(\`Query executed in \${Date.now() - start}ms\`);
```

### 2. مراقبة مفاتيح API

```typescript
// تتبع استخدام API
const usage = await trackApiUsage(provider, endpoint);
```

## 🎯 الخطوات التالية

1. **تحسين الأداء**: إضافة Redis للتخزين المؤقت
2. **النسخ الاحتياطي**: إعداد نسخ احتياطية تلقائية
3. **المراقبة**: إعداد تنبيهات للأخطاء
4. **الأمان**: تشفير البيانات الحساسة
5. **التوسع**: إعداد Read Replicas

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من logs في Vercel Dashboard
2. راجع إعدادات Environment Variables
3. تأكد من صحة connection strings
4. اختبر الاتصال محلياً أولاً

---

**ملاحظة**: هذا النظام يدعم التبديل التلقائي بين SQLite (للتطوير) و PostgreSQL (للإنتاج) بناءً على متغيرات البيئة.
