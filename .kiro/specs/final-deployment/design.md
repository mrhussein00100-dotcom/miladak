# تصميم إكمال النشر النهائي - ميلادك v2

## نظرة عامة

هذا التصميم يحدد الخطوات التفصيلية لإكمال نشر موقع ميلادك v2 على Vercel مع دعم PostgreSQL وجميع الخدمات المطلوبة.

## البنية المعمارية

### مكونات النظام

1. **Frontend**: Next.js 15 مع React 18
2. **Database**: PostgreSQL (إنتاج) + SQLite (تطوير)
3. **AI Services**: Groq, Gemini, Cohere, HuggingFace
4. **Image Service**: Pexels API
5. **Deployment**: Vercel
6. **Monitoring**: Vercel Analytics

### تدفق النشر

```
Local Development → GitHub → Vercel → PostgreSQL → Live Site
```

## المكونات والواجهات

### 1. نظام قاعدة البيانات الموحد

```typescript
interface DatabaseConnection {
  type: 'sqlite' | 'postgresql';
  url: string;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<any>;
}
```

### 2. إدارة مفاتيح API

```typescript
interface APIKeysConfig {
  groq: string;
  gemini: string;
  pexels: string;
  adsense: string;
  validateKeys(): Promise<ValidationResult>;
}
```

### 3. نظام النشر

```typescript
interface DeploymentConfig {
  environment: 'development' | 'production';
  databaseUrl: string;
  apiKeys: APIKeysConfig;
  vercelConfig: VercelConfig;
}
```

## نماذج البيانات

### بيانات الإنتاج

- **الأدوات**: 20 أداة نشطة
- **المقالات**: 47 مقال منشور
- **المواليد المشهورة**: 618 سجل
- **الأحداث التاريخية**: 698 سجل
- **البيانات الإضافية**: أحجار كريمة، ألوان، فصول

### هيكل قاعدة البيانات

```sql
-- الجداول الأساسية
CREATE TABLE tools (id, name, slug, category_id, active);
CREATE TABLE articles (id, title, slug, content, published);
CREATE TABLE daily_birthdays (id, name, birth_date, description);
CREATE TABLE daily_events (id, event_date, title, description);
-- ... 24 جدول إضافي
```

## خصائص الصحة

_خاصية هي سمة أو سلوك يجب أن يكون صحيحاً عبر جميع التنفيذات الصالحة للنظام - في الأساس، بيان رسمي حول ما يجب أن يفعله النظام._

### خاصية 1: سلامة البيانات

_لأي_ عملية ترحيل بيانات، عدد السجلات في قاعدة البيانات المصدر يجب أن يساوي عدد السجلات في قاعدة البيانات الهدف
**يتحقق من: المتطلبات 2.4**

### خاصية 2: صحة مفاتيح API

_لأي_ مفتاح API مطلوب، النظام يجب أن يتحقق من صحته قبل الاستخدام ويرجع خطأ واضح في حالة عدم الصحة
**يتحقق من: المتطلبات 1.2**

### خاصية 3: استقرار النشر

_لأي_ عملية نشر، النظام يجب أن يبنى بنجاح ويكون متاحاً للوصول خلال 5 دقائق من اكتمال النشر
**يتحقق من: المتطلبات 4.2**

### خاصية 4: أداء الاستجابة

_لأي_ صفحة في الموقع، زمن التحميل الأولي يجب أن يكون أقل من 3 ثوان في ظروف الشبكة العادية
**يتحقق من: المتطلبات 5.1**

## معالجة الأخطاء

### أخطاء قاعدة البيانات

```typescript
try {
  await migrateToPostgreSQL();
} catch (error) {
  logger.error('Database migration failed:', error);
  await rollbackMigration();
  throw new DeploymentError('Migration failed');
}
```

### أخطاء مفاتيح API

```typescript
const validateAPIKeys = async () => {
  const results = await Promise.allSettled([
    validateGroqKey(),
    validateGeminiKey(),
    validatePexelsKey(),
  ]);

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    throw new APIKeyError('Invalid API keys detected');
  }
};
```

### أخطاء النشر

```typescript
const deployWithRetry = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await deployToVercel();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
};
```

## استراتيجية الاختبار

### اختبارات ما قبل النشر

1. **اختبار قاعدة البيانات المحلية**

   ```bash
   node scripts/test-database-simple.js
   ```

2. **اختبار مفاتيح API**

   ```bash
   node scripts/test-api-keys.js
   ```

3. **اختبار البناء**
   ```bash
   npm run build
   ```

### اختبارات ما بعد النشر

1. **اختبار الاتصال بـ PostgreSQL**

   ```bash
   node scripts/test-postgres-connection.js
   ```

2. **اختبار API endpoints**

   ```bash
   curl https://miladak.vercel.app/api/tools
   ```

3. **اختبار الصفحات الأساسية**
   - الصفحة الرئيسية: `/`
   - صفحة الأدوات: `/tools`
   - صفحة المقالات: `/articles`
   - حاسبة العمر: `/calculate-birthday`

### اختبارات الخصائص

```javascript
// خاصية سلامة البيانات
describe('Data Integrity Property', () => {
  test('migration preserves record count', async () => {
    const sqliteCount = await getSQLiteRecordCount();
    await migrateToPostgreSQL();
    const postgresCount = await getPostgreSQLRecordCount();
    expect(postgresCount).toBe(sqliteCount);
  });
});

// خاصية صحة مفاتيح API
describe('API Keys Validity Property', () => {
  test('all required keys are valid', async () => {
    const validation = await validateAllAPIKeys();
    expect(validation.allValid).toBe(true);
  });
});
```

## خطة النشر

### المرحلة 1: التحضير (5 دقائق)

1. التحقق من حالة النظام المحلي
2. تحديث متغيرات البيئة
3. اختبار البناء المحلي

### المرحلة 2: إعداد الإنتاج (10 دقائق)

1. إنشاء قاعدة بيانات PostgreSQL في Vercel
2. تكوين متغيرات البيئة في Vercel
3. ترحيل البيانات إلى PostgreSQL

### المرحلة 3: النشر (5 دقائق)

1. رفع الكود إلى GitHub
2. مراقبة عملية النشر في Vercel
3. التحقق من نجاح النشر

### المرحلة 4: الاختبار والتحقق (10 دقائق)

1. اختبار الصفحات الأساسية
2. اختبار API endpoints
3. اختبار الوظائف التفاعلية
4. مراقبة الأداء والأخطاء

## المراقبة والصيانة

### مؤشرات الأداء الرئيسية

- **زمن الاستجابة**: < 3 ثوان
- **معدل النجاح**: > 99%
- **استخدام قاعدة البيانات**: مراقبة مستمرة
- **استخدام API**: تتبع الحدود اليومية

### التنبيهات

```typescript
const monitoringConfig = {
  responseTime: { threshold: 3000, alert: true },
  errorRate: { threshold: 0.01, alert: true },
  databaseConnections: { threshold: 100, alert: true },
};
```

### النسخ الاحتياطية

- **قاعدة البيانات**: نسخ احتياطية يومية تلقائية
- **الكود**: محفوظ في GitHub
- **التكوين**: موثق في ملفات البيئة

## الأمان

### حماية مفاتيح API

- تشفير المفاتيح في متغيرات البيئة
- عدم تسجيل المفاتيح في logs
- تدوير المفاتيح بشكل دوري

### حماية قاعدة البيانات

- اتصالات مشفرة (SSL)
- صلاحيات محدودة للمستخدمين
- مراقبة الاستعلامات المشبوهة

### حماية التطبيق

- Headers أمان في next.config.mjs
- تحقق من صحة المدخلات
- حماية من CSRF و XSS
