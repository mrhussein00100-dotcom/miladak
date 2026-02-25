# Design Document

## Overview

تصميم تحسينات الأداء لموقع ميلادك بناءً على تقرير PageSpeed Insights. الهدف هو رفع نتيجة الموبايل من 32 إلى 70+ والديسكتوب من 75 إلى 90+.

### المشاكل الرئيسية المكتشفة:

1. **CLS = 1.0** - بسبب تحميل الخطوط (Web fonts causing layout shift)
2. **LCP = 7.4s** - بسبب render delay 2,980ms
3. **Render Blocking = 1,200ms** - CSS و Google Fonts
4. **Unused JS = 189 KiB** - framer-motion و AdSense
5. **Unused CSS = 21 KiB** - أنماط غير مستخدمة

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Optimization                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Fonts     │  │    CSS      │  │     JS      │         │
│  │ Optimization│  │ Optimization│  │ Optimization│         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────────────────────────────────────────┐       │
│  │              Next.js Configuration               │       │
│  │  - Font preloading                               │       │
│  │  - CSS splitting                                 │       │
│  │  - Dynamic imports                               │       │
│  │  - Modern JS target                              │       │
│  └─────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Font Optimization Module

**الملفات المتأثرة:**

- `app/layout.tsx` - تحميل الخطوط
- `app/globals.css` - @import للخطوط

**التغييرات:**

```typescript
// قبل: تحميل مكرر
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'], // 5 أوزان
  variable: '--font-cairo',
  display: 'swap',
});

// بعد: تحميل محسّن
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '600', '700'], // 3 أوزان فقط
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial'],
  adjustFontFallback: true, // يمنع CLS
});
```

### 2. CSS Optimization Module

**الملفات المتأثرة:**

- `app/globals.css` - إزالة CSS غير مستخدم
- `app/layout.tsx` - إزالة @import مكرر

**التغييرات:**

- إزالة @import للخطوط من globals.css (مكرر)
- إزالة أنماط وضع miladak غير المستخدمة (~800 سطر)
- تقسيم CSS إلى critical و non-critical

### 3. JavaScript Optimization Module

**الملفات المتأثرة:**

- `next.config.mjs` - إعدادات البناء
- المكونات التي تستخدم framer-motion

**التغييرات:**

```javascript
// next.config.mjs
const nextConfig = {
  // استهداف متصفحات حديثة
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // تقسيم الكود
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
};
```

### 4. AdSense Lazy Loading

**الملفات المتأثرة:**

- `app/layout.tsx` - تحميل AdSense

**التغييرات:**

```typescript
// قبل: تحميل مباشر في head
<script async src="...adsbygoogle.js" />;

// بعد: تحميل كسول
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadAdSense());
  } else {
    setTimeout(loadAdSense, 2000);
  }
}, []);
```

## Data Models

لا توجد تغييرات في نماذج البيانات - هذا تحسين للأداء فقط.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Images have dimensions

_For any_ image element in the application, the element should have both width and height attributes defined to prevent layout shift.
**Validates: Requirements 1.3**

### Property 2: Buttons have accessible names

_For any_ button element in the application, the element should have either text content, aria-label, or aria-labelledby attribute.
**Validates: Requirements 8.1**

### Property 3: Select elements have labels

_For any_ select element in the application, the element should have an associated label element via id/for or be wrapped in a label.
**Validates: Requirements 8.2**

### Property 4: Color contrast is sufficient

_For any_ text element with a background color, the contrast ratio between text and background should be at least 4.5:1 for normal text.
**Validates: Requirements 8.3**

### Property 5: Interactive elements are focusable

_For any_ interactive element (button, link, input), the element should be keyboard focusable (tabindex >= 0 or native focusable).
**Validates: Requirements 8.4**

## Error Handling

### Font Loading Errors

- إذا فشل تحميل الخط، يجب استخدام الخط البديل (system-ui, Arial)
- لا يجب أن يؤثر فشل تحميل الخط على عرض المحتوى

### AdSense Loading Errors

- إذا فشل تحميل AdSense، يجب إخفاء مساحة الإعلان
- لا يجب أن تظهر أخطاء في console

### CSS Loading Errors

- إذا فشل تحميل CSS غير الحرج، يجب أن يبقى الموقع قابلاً للاستخدام
- يجب أن يكون هناك CSS حرج مضمن كاحتياطي

## Testing Strategy

### Unit Tests

- اختبار وجود خصائص الصور (width, height)
- اختبار وجود labels للعناصر التفاعلية
- اختبار إعدادات Next.js

### Property-Based Tests

سنستخدم مكتبة `fast-check` للاختبارات:

1. **Property 1**: لكل صورة، يجب أن تحتوي على width و height
2. **Property 2**: لكل زر، يجب أن يكون له اسم accessible
3. **Property 3**: لكل select، يجب أن يكون له label
4. **Property 5**: لكل عنصر تفاعلي، يجب أن يكون focusable

### Integration Tests

- اختبار تحميل الصفحة بدون أخطاء console
- اختبار أن الخطوط تُحمّل بشكل صحيح
- اختبار أن AdSense يُحمّل بشكل كسول

### Performance Tests (Manual)

- قياس LCP قبل وبعد التحسينات
- قياس CLS قبل وبعد التحسينات
- قياس حجم الـ bundle قبل وبعد
