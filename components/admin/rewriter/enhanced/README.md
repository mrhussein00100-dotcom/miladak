# Enhanced Rewriter Components

مكونات إعادة الصياغة المحسنة للواجهة الجديدة

## البنية

```
enhanced/
├── RewriterHeader.tsx      # العنوان والإحصائيات
├── RewriterTabs.tsx        # تبويبات الإدخال
├── UrlInput.tsx           # جلب من رابط
├── RewriterSettings.tsx   # إعدادات الصياغة
├── ContentArea.tsx        # منطقة المحتوى
├── ActionButtons.tsx      # أزرار التحكم
├── StatusMessages.tsx     # رسائل الحالة
├── index.ts              # ملف التصدير
└── README.md             # هذا الملف
```

## المكونات

### RewriterHeader

- عرض العنوان والوصف
- إحصائيات الكلمات (أصلية/جديدة)
- مؤشرات حالة المعالجة
- شريط التقدم

### RewriterTabs

- تبويب إدخال النص المباشر
- تبويب جلب من رابط
- مؤشرات الحالة النشطة
- تصميم متجاوب

### UrlInput

- حقل إدخال الرابط مع التحقق
- زر جلب المحتوى
- مؤشرات التحميل
- نصائح الاستخدام

### RewriterSettings

- اختيار أسلوب الكتابة
- تحديد طول المحتوى
- اختيار نموذج AI
- معاينة الإعدادات

### ContentArea

- عرض المحتوى جنباً إلى جنب
- إمكانية التحرير والمعاينة
- أزرار النسخ المدمجة
- إحصائيات المقارنة

### ActionButtons

- زر إعادة الصياغة الرئيسي
- أزرار النسخ والإعادة
- حالات التفعيل الذكية
- معلومات إضافية

### StatusMessages

- رسائل الخطأ مع الحلول
- رسائل النجاح
- أزرار الإغلاق والإعادة

## الاستخدام

```tsx
import {
  RewriterHeader,
  RewriterTabs,
  UrlInput,
  RewriterSettings,
  ContentArea,
  ActionButtons,
  StatusMessages,
} from '@/components/admin/rewriter/enhanced';

// استخدام المكونات في الصفحة الرئيسية
```

## الأنواع

جميع الأنواع متوفرة في `@/types/rewriter-enhanced`

## الحالة

إدارة الحالة عبر `@/hooks/useRewriterState`

## الميزات

- ✅ تصميم متجاوب
- ✅ دعم الوضع المظلم
- ✅ إمكانية الوصول
- ✅ رسوم متحركة سلسة
- ✅ معالجة شاملة للأخطاء
- ✅ TypeScript كامل
