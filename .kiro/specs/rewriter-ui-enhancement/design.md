# Design Document

## Overview

تصميم واجهة محسنة لصفحة إعادة الصياغة بنقل جميع الوظائف من النافذة المنبثقة إلى الصفحة الرئيسية، مع تحسين تجربة المستخدم وتنظيم أفضل للمحتوى والخيارات.

## Architecture

### Component Structure

```
RewriterPage (الصفحة الرئيسية)
├── RewriterHeader (العنوان والإحصائيات)
├── RewriterTabs (تبويبات الإدخال)
│   ├── TextInput (إدخال نص مباشر)
│   └── UrlInput (جلب من رابط)
├── RewriterSettings (إعدادات الصياغة)
├── ContentArea (منطقة المحتوى)
│   ├── SourceContent (المحتوى الأصلي)
│   └── RewrittenContent (المحتوى المُعاد صياغته)
├── ActionButtons (أزرار التحكم)
└── StatusMessages (رسائل الحالة والأخطاء)
```

### Layout Design

#### Desktop Layout (شاشات كبيرة)

```
┌─────────────────────────────────────────────────────────┐
│ Header: العنوان + الإحصائيات + أزرار سريعة              │
├─────────────────────────────────────────────────────────┤
│ Tabs: [إدخال محتوى] [جلب من رابط]                      │
├─────────────────────────────────────────────────────────┤
│ URL Input (إذا كان التبويب الثاني مفعل)                │
├─────────────────────────────────────────────────────────┤
│ Settings Panel: الأسلوب | الطول | النموذج              │
├─────────────────────────────────────────────────────────┤
│ Content Area:                                           │
│ ┌─────────────────────┬─────────────────────────────────┐ │
│ │ المحتوى الأصلي      │ المحتوى المُعاد صياغته        │ │
│ │                     │                                 │ │
│ │ [منطقة النص/المعاينة] │ [منطقة النتائج]               │ │
│ │                     │                                 │ │
│ └─────────────────────┴─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Action Buttons: [بدء جديد] [نسخ] [إعادة صياغة]          │
└─────────────────────────────────────────────────────────┘
```

#### Mobile Layout (شاشات صغيرة)

```
┌─────────────────────────────────┐
│ Header (مبسط)                   │
├─────────────────────────────────┤
│ Tabs (عمودي)                    │
├─────────────────────────────────┤
│ Settings (قابل للطي)            │
├─────────────────────────────────┤
│ المحتوى الأصلي                  │
│ (كامل العرض)                    │
├─────────────────────────────────┤
│ المحتوى المُعاد صياغته          │
│ (كامل العرض)                    │
├─────────────────────────────────┤
│ Action Buttons (مكدسة)          │
└─────────────────────────────────┘
```

## Components and Interfaces

### 1. RewriterHeader Component

**Purpose:** عرض العنوان والمعلومات الأساسية

**Props:**

```typescript
interface RewriterHeaderProps {
  sourceWordCount: number;
  rewrittenWordCount: number;
  isProcessing: boolean;
}
```

**Features:**

- عرض عداد الكلمات للمحتوى الأصلي والمُعاد صياغته
- مؤشر حالة المعالجة
- أزرار سريعة للإجراءات الشائعة

### 2. RewriterTabs Component

**Purpose:** التبديل بين أنماط الإدخال المختلفة

**Props:**

```typescript
interface RewriterTabsProps {
  activeTab: 'text' | 'url';
  onTabChange: (tab: 'text' | 'url') => void;
  disabled: boolean;
}
```

**Features:**

- تبويب لإدخال النص المباشر
- تبويب لجلب المحتوى من رابط
- تصميم متجاوب وواضح

### 3. UrlInput Component

**Purpose:** جلب المحتوى من الروابط الخارجية

**Props:**

```typescript
interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  disabled: boolean;
}
```

**Features:**

- حقل إدخال الرابط مع التحقق من الصحة
- زر جلب المحتوى مع مؤشر التحميل
- معاينة سريعة للمحتوى المجلب

### 4. RewriterSettings Component

**Purpose:** إعدادات إعادة الصياغة

**Props:**

```typescript
interface RewriterSettingsProps {
  settings: RewriteSettings;
  onSettingsChange: (settings: RewriteSettings) => void;
  disabled: boolean;
}

interface RewriteSettings {
  style: 'professional' | 'simple' | 'creative' | 'academic';
  targetLength: 'shorter' | 'same' | 'longer';
  provider: 'groq' | 'gemini' | 'cohere' | 'huggingface';
}
```

**Features:**

- اختيار أسلوب الكتابة
- تحديد طول المحتوى المطلوب
- اختيار نموذج الذكاء الاصطناعي
- تصميم مدمج وغير مزعج

### 5. ContentArea Component

**Purpose:** عرض المحتوى الأصلي والمُعاد صياغته

**Props:**

```typescript
interface ContentAreaProps {
  sourceContent: string;
  rewrittenContent: string;
  isTextMode: boolean;
  onSourceChange: (content: string) => void;
  isLoading: boolean;
}
```

**Features:**

- عرض جنباً إلى جنب في الشاشات الكبيرة
- عرض مكدس في الشاشات الصغيرة
- إمكانية التمرير المستقل
- أزرار نسخ مدمجة

### 6. ActionButtons Component

**Purpose:** أزرار التحكم الرئيسية

**Props:**

```typescript
interface ActionButtonsProps {
  onRewrite: () => void;
  onReset: () => void;
  onCopy: () => void;
  canRewrite: boolean;
  canCopy: boolean;
  isLoading: boolean;
}
```

**Features:**

- زر إعادة الصياغة الرئيسي
- زر البدء من جديد
- زر نسخ النتائج
- حالات التفعيل/التعطيل الذكية

## Data Models

### RewriterState Interface

```typescript
interface RewriterState {
  // Content
  sourceContent: string;
  rewrittenContent: string;
  externalUrl: string;

  // UI State
  activeTab: 'text' | 'url';
  isLoading: boolean;
  isFetching: boolean;

  // Settings
  settings: RewriteSettings;

  // Status
  error: string | null;
  success: string | null;

  // Statistics
  sourceWordCount: number;
  rewrittenWordCount: number;
}
```

### API Response Types

```typescript
interface RewriteResponse {
  success: boolean;
  rewritten_content?: string;
  error?: string;
  metadata?: {
    model_used: string;
    processing_time: number;
    word_count: number;
  };
}

interface FetchResponse {
  success: boolean;
  content?: string;
  title?: string;
  error?: string;
  metadata?: {
    word_count: number;
    char_count: number;
    images_found: number;
  };
}
```

## Error Handling

### Error Types

1. **Network Errors:** مشاكل الاتصال بالخادم
2. **Validation Errors:** بيانات غير صحيحة من المستخدم
3. **API Errors:** أخطاء من خدمات الذكاء الاصطناعي
4. **Content Errors:** مشاكل في معالجة المحتوى

### Error Display Strategy

```typescript
interface ErrorState {
  type: 'network' | 'validation' | 'api' | 'content';
  message: string;
  details?: string;
  retryable: boolean;
}
```

**Error UI Components:**

- رسائل خطأ واضحة ومفيدة
- أزرار إعادة المحاولة عند الإمكان
- إرشادات لحل المشاكل الشائعة

## Testing Strategy

### Unit Tests

1. **Component Tests:**

   - اختبار عرض المكونات بشكل صحيح
   - اختبار التفاعل مع المستخدم
   - اختبار حالات الخطأ

2. **Hook Tests:**
   - اختبار إدارة الحالة
   - اختبار استدعاءات API
   - اختبار معالجة الأخطاء

### Integration Tests

1. **Workflow Tests:**

   - اختبار تدفق إعادة الصياغة الكامل
   - اختبار جلب المحتوى من الروابط
   - اختبار تغيير الإعدادات

2. **API Tests:**
   - اختبار استدعاءات API الفعلية
   - اختبار معالجة الاستجابات
   - اختبار حالات الفشل

### Performance Tests

1. **Loading Tests:**

   - قياس أوقات التحميل
   - اختبار الاستجابة مع المحتوى الكبير
   - قياس استهلاك الذاكرة

2. **User Experience Tests:**
   - اختبار سرعة الاستجابة
   - اختبار التجاوب مع الأجهزة المختلفة
   - اختبار إمكانية الوصول

## Implementation Approach

### Phase 1: Core Structure

1. إنشاء المكونات الأساسية
2. تطبيق التخطيط الأساسي
3. إعداد إدارة الحالة

### Phase 2: Functionality

1. تطبيق وظائف إعادة الصياغة
2. إضافة جلب المحتوى من الروابط
3. تطبيق الإعدادات والخيارات

### Phase 3: Enhancement

1. تحسين التصميم والتجاوب
2. إضافة الرسوم المتحركة
3. تحسين معالجة الأخطاء

### Phase 4: Testing & Polish

1. اختبار شامل لجميع الوظائف
2. تحسين الأداء
3. إضافة اللمسات الأخيرة

## Technical Considerations

### Performance Optimizations

1. **Lazy Loading:** تحميل المكونات عند الحاجة
2. **Memoization:** تخزين النتائج المؤقت للعمليات المكلفة
3. **Debouncing:** تأخير استدعاءات API للبحث والتحقق
4. **Virtual Scrolling:** للمحتوى الطويل جداً

### Accessibility Features

1. **Keyboard Navigation:** دعم كامل للتنقل بلوحة المفاتيح
2. **Screen Reader Support:** تسميات وأوصاف واضحة
3. **High Contrast:** دعم الألوان عالية التباين
4. **Focus Management:** إدارة ذكية للتركيز

### Browser Compatibility

- دعم جميع المتصفحات الحديثة
- تدهور تدريجي للميزات المتقدمة
- اختبار على الأجهزة المحمولة المختلفة

### Security Considerations

1. **Input Sanitization:** تنظيف جميع المدخلات
2. **XSS Prevention:** منع هجمات البرمجة النصية
3. **CSRF Protection:** حماية من هجمات التزوير
4. **Rate Limiting:** تحديد معدل الطلبات
