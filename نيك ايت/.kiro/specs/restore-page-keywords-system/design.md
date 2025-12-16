# تصميم استعادة نظام الكلمات المفتاحية

## هيكل النظام

```mermaid
flowchart TD
    A[صفحة الأداة] --> B{showKeywords=true?}
    B -->|نعم| C[KeywordsSection]
    C --> D{بيانات في قاعدة البيانات؟}
    D -->|نعم| E[جلب من page_keywords]
    D -->|لا| F[جلب من lib/keywords/*.ts]
    E --> G[عرض الكلمات]
    F --> G

    H[لوحة التحكم] --> I[/admin/page-keywords]
    I --> J[عرض جميع الكلمات]
    J --> K[تعديل/حذف/إضافة]
    K --> L[حفظ في قاعدة البيانات]
```

## مسار البيانات

### 1. استعادة البيانات

```
نسخة احتياطية → استخراج جدول page_keywords → استعادة البيانات المفقودة
```

### 2. عرض الكلمات في الواجهة

```
صفحة الأداة → ToolPageLayout → KeywordsSection → API Call → قاعدة البيانات
```

### 3. إدارة الكلمات

```
لوحة التحكم → صفحة الإدارة → API Calls → قاعدة البيانات
```

## APIs المطلوبة

### 1. للواجهة الأمامية

```typescript
// GET /api/page-keywords/[type]/[slug]
// مثال: /api/page-keywords/tool/date-converter
interface KeywordsResponse {
  keywords: string[];
  meta_description?: string;
  source: 'database' | 'fallback';
}
```

### 2. للوحة التحكم

```typescript
// GET /api/admin/page-keywords
interface AdminKeywordsResponse {
  data: PageKeyword[];
  total: number;
  page: number;
}

// POST /api/admin/page-keywords
interface CreateKeywordRequest {
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string;
  meta_description?: string;
}

// PUT /api/admin/page-keywords/[id]
// DELETE /api/admin/page-keywords/[id]
```

## مكونات النظام

### 1. KeywordsSection المحدث

```typescript
interface KeywordsSectionProps {
  toolSlug: string;
  fallbackKeywords?: string[];
}

// منطق العمل:
// 1. محاولة جلب من قاعدة البيانات
// 2. في حالة الفشل، استخدام fallbackKeywords
// 3. في حالة عدم وجود fallback، استخدام lib/keywords
```

### 2. صفحة الإدارة

```typescript
// app/admin/page-keywords/page.tsx
- جدول عرض الكلمات
- فلترة حسب النوع
- بحث في العناوين والكلمات
- إضافة/تعديل/حذف
- إحصائيات (عدد الكلمات لكل صفحة)
```

## خطة الاستعادة

### المرحلة 1: البحث عن النسخة الاحتياطية

1. فحص المجلدات العربية (بيك فايف، بيك سيكس، إلخ)
2. البحث عن ملفات قاعدة البيانات الأكبر حجماً
3. فحص محتوى جدول page_keywords في كل نسخة

### المرحلة 2: استعادة البيانات

1. استخراج بيانات جدول page_keywords من النسخة الاحتياطية
2. إنشاء سكريبت استعادة يحافظ على البيانات الحالية
3. تشغيل السكريبت وتأكيد النتائج

### المرحلة 3: إصلاح النظام

1. تحديث KeywordsSection ليقرأ من قاعدة البيانات أولاً
2. إصلاح صفحة لوحة التحكم
3. اختبار النظام بالكامل

## الأمان والحماية

### 1. النسخ الاحتياطي

- إنشاء نسخة احتياطية من قاعدة البيانات الحالية قبل الاستعادة
- حفظ سجل بجميع العمليات المنفذة

### 2. التحقق من البيانات

- التأكد من صحة البيانات المستعادة
- فحص عدم وجود تضارب في المعرفات
- التحقق من سلامة الترميز العربي

## مؤشرات الأداء

### 1. قاعدة البيانات

- عدد السجلات المستعادة
- متوسط عدد الكلمات لكل صفحة
- سرعة الاستعلامات

### 2. الواجهة

- زمن تحميل قسم "مواضيع ذات صلة"
- معدل نجاح جلب البيانات من قاعدة البيانات
- معدل الرجوع للـ fallback

## خطة الاختبار

### 1. اختبار الاستعادة

- التأكد من استعادة جميع البيانات
- فحص سلامة الترميز العربي
- التحقق من عدم فقدان أي بيانات حالية

### 2. اختبار الواجهة

- عرض الكلمات في جميع صفحات الأدوات
- عمل الـ fallback في حالة عدم وجود بيانات
- سرعة التحميل

### 3. اختبار لوحة التحكم

- عرض جميع الكلمات
- عمل البحث والفلترة
- إضافة وتعديل وحذف الكلمات

## هيكل الملفات المتأثرة

```
├── app/
│   ├── admin/page-keywords/page.tsx (إصلاح)
│   └── api/
│       ├── admin/page-keywords/route.ts (فحص)
│       ├── admin/page-keywords/[id]/route.ts (فحص)
│       └── page-keywords/[type]/[slug]/route.ts (إنشاء/إصلاح)
├── components/
│   └── tools/KeywordsSection.tsx (تحديث)
├── lib/
│   ├── db/database.ts (فحص)
│   └── keywords/ (احتفاظ كـ fallback)
└── scripts/
    ├── restore-page-keywords.js (جديد)
    ├── backup-current-db.js (جديد)
    └── verify-keywords-data.js (جديد)
```

## استراتيجية التنفيذ

### الأولوية الأولى: البحث والاستعادة

1. العثور على النسخة الاحتياطية الصحيحة
2. إنشاء سكريبت الاستعادة الآمن
3. تشغيل الاستعادة واختبار النتائج

### الأولوية الثانية: إصلاح النظام

1. تحديث KeywordsSection للقراءة من قاعدة البيانات
2. إصلاح APIs إذا لزم الأمر
3. إصلاح لوحة التحكم

### الأولوية الثالثة: الاختبار والتحسين

1. اختبار شامل للنظام
2. تحسين الأداء
3. توثيق التغييرات
