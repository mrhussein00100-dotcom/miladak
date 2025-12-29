# Design Document: Navbar, Mobile Settings & Quick Tools Fixes

## Overview

هذا التصميم يغطي إصلاح ثلاث مشاكل في واجهة المستخدم:

1. ألوان النصوص في الجزء الأيسر من النافبار
2. تنسيق صفحة إعدادات الموبايل
3. عدم ظهور الأدوات في صفحة أدوات سريعة

## Architecture

### Component Structure

```
miladak_v2/
├── components/
│   └── FinalNavbar.tsx          # إصلاح ألوان النصوص
├── app/
│   └── admin/
│       ├── mobile-settings/
│       │   └── page.tsx         # إصلاح التنسيق
│       └── quick-tools/
│           └── page.tsx         # إصلاح عرض الأدوات
└── app/
    └── globals.css              # تحديث الألوان
```

## Components and Interfaces

### 1. FinalNavbar Component

**المشكلة الحالية:**

- النصوص في الجزء الأيسر (البحث، المظهر) قد لا تكون واضحة في بعض الأوضاع

**الحل:**

- إضافة classes صريحة للألوان في كل وضع
- استخدام `text-foreground` للنصوص الأساسية
- استخدام `text-foreground/70` للنصوص الثانوية

```tsx
// Right Actions Section
<div className="flex items-center gap-2">
  {/* Search Button */}
  <button className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-foreground">
    <SearchIcon />
  </button>

  {/* Theme Switcher */}
  <button className="px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-1 transition-colors text-foreground">
    <ThemeIcon />
  </button>
</div>
```

### 2. Mobile Settings Page

**المشكلة الحالية:**

- عدم تناسق في التنسيق والمسافات

**الحل:**

- توحيد padding و margin
- إضافة borders واضحة
- تحسين تباين الألوان

```tsx
// Consistent Card Styling
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
  {/* Content */}
</div>
```

### 3. Quick Tools Admin Page

**المشكلة الحالية:**

- عند الضغط على "إضافة أداة"، لا تظهر الأدوات المتاحة
- السبب: API `/api/tools` يعمل لكن قد يكون هناك مشكلة في معالجة البيانات

**الحل:**

- التأكد من استدعاء API بشكل صحيح
- إضافة معالجة أفضل للأخطاء
- إضافة loading state واضح

```tsx
const fetchAvailableTools = async () => {
  setLoadingTools(true);
  try {
    const res = await fetch('/api/tools');
    const data = await res.json();

    if (data.success && data.data) {
      const formattedTools = data.data.map((tool: any) => ({
        id: tool.id,
        name: tool.title,
        slug: tool.slug,
        description: tool.description || '',
        icon: tool.icon || 'Calculator',
        category_id: tool.category_id,
      }));
      setAvailableTools(formattedTools);
    }
  } catch (error) {
    console.error('Error fetching available tools:', error);
    setError('فشل في جلب الأدوات');
  } finally {
    setLoadingTools(false);
  }
};
```

## Data Models

### QuickTool Interface

```typescript
interface QuickTool {
  id: string;
  href: string;
  label: string;
  icon: string;
  color: string;
  emoji: string;
  isScroll: boolean;
  order: number;
  isActive: boolean;
}
```

### AvailableTool Interface

```typescript
interface AvailableTool {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category_id: number;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Tool Search Filtering

_For any_ search query entered in the quick tools modal, all displayed tools should contain the search query in their name or slug (case-insensitive).
**Validates: Requirements 3.4**

### Property 2: Already Added Tools Marking

_For any_ tool that exists in the current quick tools list, when displayed in the available tools modal, it should be marked as "مضافة" and have selection disabled.
**Validates: Requirements 3.5**

### Property 3: Tools Modal Display

_For any_ click on "إضافة أداة" button, the modal should display and contain tools fetched from the API (or show loading/error state).
**Validates: Requirements 3.1**

## Error Handling

### API Errors

- عرض رسالة خطأ واضحة للمستخدم
- إمكانية إعادة المحاولة
- تسجيل الأخطاء في console للتصحيح

### Loading States

- عرض spinner أثناء التحميل
- تعطيل الأزرار أثناء العمليات

## Testing Strategy

### Unit Tests

- اختبار تصفية الأدوات بناءً على البحث
- اختبار تحديد الأدوات المضافة مسبقاً

### Property-Based Tests

- استخدام مكتبة `fast-check` للاختبارات
- اختبار خاصية التصفية لأي نص بحث
- اختبار خاصية تحديد الأدوات المضافة

### Visual Tests

- التحقق من الألوان في الأوضاع المختلفة
- التحقق من التنسيق في صفحة إعدادات الموبايل

## Implementation Notes

### CSS Variables Used

```css
--foreground: #1a202c; /* Light mode text */
--foreground: #f7fafc; /* Dark mode text */
--foreground: #ffffff; /* Miladak mode text */
--muted: #fff0f5; /* Light mode muted bg */
--muted: #16213e; /* Dark mode muted bg */
```

### Key Classes

- `text-foreground` - للنصوص الأساسية
- `text-foreground/70` - للنصوص الثانوية
- `hover:bg-muted` - لخلفية hover
- `bg-white dark:bg-gray-800` - للبطاقات
