# إعداد PostgreSQL على Vercel

## الخطوات المطلوبة

### 1. إنشاء قاعدة بيانات PostgreSQL على Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك `miladak`
3. اذهب إلى تبويب **Storage**
4. اضغط على **Create Database**
5. اختر **Postgres**
6. اختر المنطقة: **Frankfurt (fra1)** (نفس منطقة المشروع)
7. اضغط **Create**

### 2. الحصول على متغيرات البيئة

بعد إنشاء قاعدة البيانات، ستحصل على:

```bash
POSTGRES_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.us-east-1.postgres.vercel-storage.com/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="xxx.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxx"
POSTGRES_DATABASE="verceldb"
```

### 3. إضافة متغيرات البيئة للمشروع

1. في Vercel Dashboard، اذهب إلى **Settings** > **Environment Variables**
2. أضف المتغيرات التالية:

```
POSTGRES_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
POSTGRES_PRISMA_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15
DATABASE_URL=postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
NODE_ENV=production
```

### 4. تشغيل سكريپت النقل

```bash
# تثبيت dependencies
npm install

# تشغيل سكريپت النقل
POSTGRES_URL="your-postgres-url" node scripts/migrate-to-postgres.js
```

### 5. إعادة النشر

```bash
git add .
git commit -m "feat: Add PostgreSQL support for production"
git push origin main
```

## اختبار الاتصال

يمكنك اختبار الاتصال بقاعدة البيانات:

```bash
# اختبار محلي
POSTGRES_URL="your-postgres-url" node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

## ملاحظات مهمة

1. **الأمان**: لا تضع متغيرات البيئة في الكود
2. **الاتصال**: استخدم `POSTGRES_URL` للاتصال العادي
3. **Connection Pooling**: استخدم `POSTGRES_PRISMA_URL` للتطبيقات الكبيرة
4. **SSL**: يتم تفعيل SSL تلقائياً في الإنتاج

## استكشاف الأخطاء

### خطأ الاتصال

```
Error: connect ECONNREFUSED
```

**الحل**: تأكد من صحة `POSTGRES_URL`

### خطأ SSL

```
Error: self signed certificate
```

**الحل**: تأكد من إعداد SSL في الكود

### خطأ المهلة الزمنية

```
Error: Connection timeout
```

**الحل**: زيادة `connectionTimeoutMillis` في إعدادات Pool
