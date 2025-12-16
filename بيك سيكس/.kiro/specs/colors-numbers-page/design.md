# Design Document - صفحة الألوان والأرقام

## Overview

تصميم صفحة "الألوان والأرقام" لعرض الألوان المحظوظة والأرقام المحظوظة بناءً على تاريخ الميلاد. الصفحة ستجمع بين بيانات الألوان المحظوظة من قاعدة البيانات والأرقام المحظوظة من البرج الصيني لتقديم تجربة شاملة للمستخدم.

## Architecture

### Component Structure

```
app/colors-numbers/
├── page.tsx (Server Component with metadata)
└── components/
    └── ColorsNumbersPageClient.tsx (Client Component)

components/enhanced/
├── LuckyColorCard.tsx (عرض اللون المحظوظ)
├── LuckyNumbersCard.tsx (عرض الأرقام المحظوظة)
└── ColorNumbersResults.tsx (عرض النتائج المجمعة)

lib/
└── colorNumbersUtils.ts (دوال مساعدة)
```

### Data Flow

1. المستخدم يدخل تاريخ الميلاد
2. النظام يحسب الشهر للألوان المحظوظة
3. النظام يحسب السنة للبرج الصيني والأرقام المحظوظة
4. عرض النتائج مع إمكانية المشاركة

## Components and Interfaces

### 1. ColorsNumbersPageClient Component

```typescript
interface ColorsNumbersPageClientProps {}

interface UserInput {
  day: number;
  month: number;
  year: number;
}

interface LuckyColorData {
  color: string;
  colorEn: string;
  meaning: string;
  hex?: string;
}

interface LuckyNumbersData {
  numbers: number[];
  zodiacAnimal: string;
  zodiacColors: string[];
  description: string;
}

interface ColorsNumbersResult {
  luckyColor: LuckyColorData;
  luckyNumbers: LuckyNumbersData;
  birthDate: UserInput;
}
```

**Features:**

- واجهة إدخال تاريخ الميلاد (يوم/شهر/سنة)
- التحقق من صحة التاريخ
- عرض النتائج بشكل تفاعلي
- أزرار المشاركة
- تصميم متجاوب

### 2. LuckyColorCard Component

```typescript
interface LuckyColorCardProps {
  color: LuckyColorData;
  month: number;
  monthName: string;
}
```

**Features:**

- عرض اللون مع عينة ملونة
- اسم اللون بالعربية والإنجليزية
- معنى ودلالة اللون
- نصائح لاستخدام اللون

### 3. LuckyNumbersCard Component

```typescript
interface LuckyNumbersCardProps {
  numbers: LuckyNumbersData;
  year: number;
}
```

**Features:**

- عرض الأرقام المحظوظة
- معلومات البرج الصيني
- ألوان البرج الصيني المحظوظة
- شرح معنى الأرقام

### 4. ColorNumbersResults Component

```typescript
interface ColorNumbersResultsProps {
  result: ColorsNumbersResult;
  onShare: (platform: string) => void;
}
```

**Features:**

- عرض النتائج المجمعة
- مقارنة بين ألوان الشهر وألوان البرج
- أزرار المشاركة
- نصائح للاستخدام

## Data Models

### API Integration

#### 1. Monthly Color API

```typescript
// استخدام API موجود: /api/monthly-info/[month]
interface MonthlyInfoResponse {
  success: boolean;
  data: {
    month: number;
    monthName: string;
    luckyColor: {
      color: string;
      colorEn: string;
      meaning: string;
    };
  };
}
```

#### 2. Chinese Zodiac Integration

```typescript
// استخدام lib/calculations/zodiacCalculations.ts
import { getZodiacInfo } from '@/lib/calculations/zodiacCalculations';

interface ZodiacInfo {
  animal: string;
  luckyNumbers: number[];
  luckyColors: string[];
  description: string;
}
```

### Color Hex Mapping

```typescript
const COLOR_HEX_MAP: Record<string, string> = {
  الأبيض: '#FFFFFF',
  الأرجواني: '#8B5CF6',
  الأخضر: '#10B981',
  الوردي: '#EC4899',
  الأصفر: '#F59E0B',
  الأزرق: '#3B82F6',
  الأحمر: '#EF4444',
  البرتقالي: '#F97316',
  الذهبي: '#D4AF37',
  البني: '#92400E',
  الفضي: '#9CA3AF',
  'الأزرق الداكن': '#1E40AF',
};
```

## User Interface Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│                Header                   │
│  🎨 الألوان والأرقام المحظوظة          │
│     اكتشف ألوانك وأرقامك المحظوظة      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Date Input Form              │
│  ┌─────┐ ┌─────┐ ┌─────────┐           │
│  │ يوم │ │شهر │ │  سنة   │ [احسب]    │
│  └─────┘ └─────┘ └─────────┘           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              Results Section            │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │  Lucky Color    │ │ Lucky Numbers   ││
│  │  ┌───────────┐  │ │  [2] [3] [7]   ││
│  │  │ Color Box │  │ │  برج الفأر      ││
│  │  └───────────┘  │ │  الأزرق، الذهبي ││
│  │  الأزرق - Blue │ │                 ││
│  └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Share Section                │
│  [واتساب] [تويتر] [فيسبوك] [نسخ]       │
└─────────────────────────────────────────┘
```

### Color Scheme

- Primary: Purple (#8B5CF6) - متسق مع باقي الموقع
- Secondary: Gray tones for text
- Accent: Dynamic based on lucky color
- Background: Light gray (#F9FAFB) / Dark gray (#111827)

### Responsive Design

- Mobile: Single column layout
- Tablet: Two column results
- Desktop: Optimized spacing and larger color displays

## Error Handling

### Input Validation

```typescript
interface ValidationError {
  field: 'day' | 'month' | 'year';
  message: string;
}

const validateDate = (
  day: number,
  month: number,
  year: number
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (day < 1 || day > 31) {
    errors.push({ field: 'day', message: 'اليوم يجب أن يكون بين 1 و 31' });
  }

  if (month < 1 || month > 12) {
    errors.push({ field: 'month', message: 'الشهر يجب أن يكون بين 1 و 12' });
  }

  if (year < 1900 || year > 2100) {
    errors.push({
      field: 'year',
      message: 'السنة يجب أن تكون بين 1900 و 2100',
    });
  }

  return errors;
};
```

### API Error Handling

- عرض رسائل خطأ واضحة للمستخدم
- Fallback للبيانات المحلية في حالة فشل API
- Loading states أثناء جلب البيانات

## Testing Strategy

### Unit Tests

- تست دوال التحقق من صحة التاريخ
- تست حسابات البرج الصيني
- تست تحويل الألوان إلى hex codes

### Integration Tests

- تست API calls للألوان المحظوظة
- تست عرض النتائج الصحيحة
- تست وظائف المشاركة

### User Experience Tests

- تست responsive design على أجهزة مختلفة
- تست accessibility features
- تست performance مع بيانات مختلفة

## Performance Considerations

### Optimization

- استخدام React.memo للمكونات الثقيلة
- Lazy loading للمكونات غير الأساسية
- Caching لبيانات الألوان المحظوظة
- Debouncing لإدخال التاريخ

### SEO Optimization

- Meta tags محسنة للبحث
- Structured data للألوان والأرقام
- Arabic keywords optimization
- Social media sharing optimization

## Integration Points

### Existing Systems

- استخدام نفس نظام المشاركة من الصفحات الأخرى
- التكامل مع نظام الثيمات (Dark/Light mode)
- استخدام نفس مكونات UI الموجودة
- التكامل مع نظام التنقل الموجود

### Database Integration

- استخدام API موجود للألوان المحظوظة
- استخدام مكتبة zodiacCalculations الموجودة
- لا حاجة لتعديلات على قاعدة البيانات

## Future Enhancements

### Phase 2 Features

- حفظ النتائج المفضلة
- مقارنة الألوان والأرقام مع الأصدقاء
- تقويم الألوان المحظوظة الشهري
- نصائح يومية بناءً على الألوان والأرقام

### Advanced Features

- تحليل شخصية بناءً على الألوان المفضلة
- توصيات الملابس والديكور
- تكامل مع تطبيقات التقويم
- إشعارات الأيام المحظوظة
