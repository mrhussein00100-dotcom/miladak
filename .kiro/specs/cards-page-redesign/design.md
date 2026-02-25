# Design Document - إعادة تصميم صفحة البطاقات

## Overview

تصميم جديد بالكامل لصفحة البطاقات مع معاينة مباشرة وتجربة مستخدم سلسة.

## Architecture

### Components Structure

```
components/cards/
├── NewCardsPage.tsx        # الصفحة الرئيسية الجديدة
├── SimpleCardGenerator.tsx # منشئ البطاقات البسيط
├── CardPreviewPanel.tsx    # لوحة المعاينة
└── TemplateSelector.tsx    # اختيار القوالب (موجود)
```

### Layout

- **Desktop**: عمودين - الإعدادات يسار، المعاينة يمين
- **Mobile**: عمود واحد مع زر تبديل للمعاينة

## Data Models

```typescript
interface CardState {
  recipientName: string;
  message: string;
  age?: number;
  templateId: string;
}
```

## Error Handling

- استخدام try-catch مع html-to-image
- عرض رسائل خطأ واضحة للمستخدم
- تجنب dynamic imports المعقدة

## Testing Strategy

- اختبار يدوي على الجوال والديسكتوب
- التأكد من عمل المعاينة المباشرة
