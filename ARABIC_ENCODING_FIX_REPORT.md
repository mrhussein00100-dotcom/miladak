# تقرير إصلاح ترميز النصوص العربية في صفحات المقالات الفردية

## المشكلة

كانت النصوص العربية تظهر كعلامات استفهام (??????) في صفحات المقالات الفردية فقط، بينما باقي الموقع يعمل بشكل صحيح.

## السبب

المشكلة كانت في دالة `fixArabicEncoding` التي تستخدم `escape()` المهجورة والتي لا تعمل بشكل صحيح مع النصوص العربية.

## الحل المطبق

### 1. تحديث دالة إصلاح الترميز

استبدلت دالة `fixArabicEncoding` القديمة بنسخة محسنة تستخدم:

- `Buffer.from(text, 'latin1').toString('utf8')` كطريقة أولى
- `TextEncoder` و `TextDecoder` كطريقة احتياطية
- فحص ذكي للنصوص التي تحتاج إصلاح ترميز

### 2. الملفات المحدثة

- `miladak_v2/app/articles/[slug]/page.tsx` - صفحة المقال الفردي
- `miladak_v2/components/ArticlePageClient.tsx` - مكون عرض المقال

### 3. التحسينات المطبقة

- إصلاح ترميز العنوان
- إصلاح ترميز المحتوى
- إصلاح ترميز الوصف والكلمات المفتاحية
- تحسين فحص النصوص التي تحتاج إصلاح

## الكود الجديد

```typescript
const fixArabicEncoding = (text: string): string => {
  try {
    // إذا كان النص يحتوي على علامات استفهام، جرب إصلاح الترميز
    if (
      text.includes('??????') ||
      (text.includes('?') && !/[\u0600-\u06FF]/.test(text))
    ) {
      // جرب إصلاح الترميز باستخدام Buffer
      try {
        return Buffer.from(text, 'latin1').toString('utf8');
      } catch {
        // إذا فشل، جرب TextDecoder
        try {
          const encoder = new TextEncoder();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const bytes = encoder.encode(text);
          return decoder.decode(bytes);
        } catch {
          return text;
        }
      }
    }
    return text;
  } catch {
    return text;
  }
};
```

## النتيجة المتوقعة

- النصوص العربية تظهر بشكل صحيح في صفحات المقالات الفردية
- لا تأثير على باقي أجزاء الموقع
- حل آمن مع معالجة الأخطاء

## التاريخ

8 يناير 2026
