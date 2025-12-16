# Design Document: Tools UI Fixes

## Overview

هذا المستند يصف التصميم التقني لإصلاح مشاكل واجهة المستخدم في صفحة الأدوات وأداة محول التاريخ، بالإضافة إلى إضافة رابط صفحة الكلمات المفتاحية في لوحة التحكم.

## Architecture

### Components Affected

```
miladak_v2/
├── app/
│   ├── tools/
│   │   └── date-converter/
│   │       └── page.tsx          # إصلاح استيراد Breadcrumbs واستخدام ToolPageLayout
│   └── admin/
│       └── page.tsx              # إضافة رابط الكلمات المفتاحية (إذا موجود)
├── components/
│   ├── ToolsPageClient.tsx       # إصلاح الأيقونات وحجم البطاقات ولون الحد
│   └── Breadcrumbs.tsx           # مكون موجود للاستيراد
```

## Components and Interfaces

### 1. DateConverter Page Fix

**المشكلة:** الصفحة تستخدم `Breadcrumbs` بدون استيراده.

**الحل:**

- استيراد `Breadcrumbs` من `@/components/Breadcrumbs`
- أو استخدام `ToolPageLayout` الذي يتضمن Breadcrumbs تلقائياً

```typescript
// الحل المقترح - استخدام ToolPageLayout
import ToolPageLayout from '@/components/tools/ToolPageLayout';

export default function DateConverterPage() {
  return (
    <ToolPageLayout
      title="محول التاريخ الهجري والميلادي"
      description="حول التاريخ بين التقويم الهجري والميلادي بسهولة"
      toolSlug="date-converter"
    >
      {/* محتوى الأداة */}
    </ToolPageLayout>
  );
}
```

### 2. Category Icons Fix

**المشكلة:** الأيقونات تظهر كنص مثل "Hearthealth-tools2" بدلاً من أيقونات.

**السبب:** خاصية `cat.icon` في قاعدة البيانات تحتوي على نص بدلاً من مكون React.

**الحل:**

```typescript
// تعديل عرض عنوان التصنيف
<div className="flex items-center gap-3 mb-6">
  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">
    {/* استخدام getCategoryIcon بدلاً من cat.icon مباشرة */}
    {getCategoryIcon(cat.name)}
  </div>
  <div>
    <h2 className="text-2xl font-bold">{cat.name}</h2>
    <p className="text-sm text-gray-500">{catTools.length} أداة</p>
  </div>
</div>
```

### 3. Card Height Consistency

**المشكلة:** بطاقات الأدوات بأحجام مختلفة.

**الحل:** إضافة CSS classes لتوحيد الارتفاع:

```typescript
// في ToolCard component
<Card
  className={`
  group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 
  overflow-hidden relative
  h-full flex flex-col  // إضافة هذه الخصائص
  ${featured ? '...' : '...'}
`}
>
  <CardHeader className="flex-shrink-0">{/* ... */}</CardHeader>
  <CardContent className="flex-grow flex flex-col justify-end">
    {/* ... */}
  </CardContent>
</Card>
```

### 4. Featured Card Border Color

**المشكلة:** لون حد البطاقات المميزة أصفر.

**الحل:** تغيير من `ring-yellow-400` إلى تدرج بنفسجي-وردي:

```typescript
// قبل
featured ? 'ring-2 ring-yellow-400/50 shadow-yellow-200/50' : '';

// بعد
featured
  ? 'ring-2 ring-purple-400 dark:ring-purple-500 shadow-purple-200/50 dark:shadow-purple-900/50'
  : '';
```

### 5. Admin Keywords Link

**المشكلة:** لا يوجد رابط لصفحة الكلمات المفتاحية في لوحة التحكم.

**الحل:** إضافة رابط في صفحة admin الرئيسية أو إنشاء صفحة إذا لم تكن موجودة.

## Data Models

لا توجد تغييرات على نماذج البيانات.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Category icons render as React components

_For any_ category displayed on the tools page, the icon should render as a valid React component (SVG element) and not as a text string.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Tool cards maintain consistent height

_For any_ set of tool cards displayed in grid view, all cards should have the same height regardless of their content length.

**Validates: Requirements 3.1, 3.2**

## Error Handling

- إذا فشل تحميل أيقونة التصنيف، يتم عرض أيقونة افتراضية (Zap)
- إذا كان وصف البطاقة طويلاً، يتم اقتطاعه مع `line-clamp-2`

## Testing Strategy

### Unit Tests

- التحقق من أن صفحة date-converter تعمل بدون أخطاء
- التحقق من وجود رابط الكلمات المفتاحية في لوحة التحكم

### Property-Based Tests

- استخدام مكتبة `fast-check` للتحقق من خصائص الصحة
- كل اختبار يجب أن يعمل 100 مرة على الأقل

### Visual Tests

- التحقق يدوياً من:
  - ظهور الأيقونات بشكل صحيح
  - توحيد ارتفاع البطاقات
  - لون حد البطاقات المميزة
