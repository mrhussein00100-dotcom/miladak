# Implementation Plan

- [x] 1. إصلاح صفحة محول التاريخ

  - [x] 1.1 تحديث صفحة date-converter لاستخدام ToolPageLayout

    - استيراد ToolPageLayout من @/components/tools/ToolPageLayout
    - إزالة استخدام Breadcrumbs المباشر غير المستورد
    - تغليف محتوى الأداة داخل ToolPageLayout
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. إصلاح عرض أيقونات التصنيفات في صفحة الأدوات

  - [ ] 2.1 تعديل ToolsPageClient لإصلاح عرض أيقونات التصنيفات

    - تعديل قسم عرض التصنيفات لاستخدام getCategoryIcon(cat.name) بدلاً من cat.icon
    - التأكد من أن الأيقونات تظهر كمكونات React وليس نص

    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.2 كتابة اختبار خاصية لعرض الأيقونات

    - **Property 1: Category icons render as React components**

    - **Validates: Requirements 2.1, 2.2, 2.3**

- [ ] 3. توحيد حجم بطاقات الأدوات

  - [ ] 3.1 تعديل مكون ToolCard لتوحيد الارتفاع

    - إضافة h-full flex flex-col للبطاقة الرئيسية

    - إضافة flex-shrink-0 لـ CardHeader
    - إضافة flex-grow flex flex-col justify-end لـ CardContent

    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 3.2 كتابة اختبار خاصية لتوحيد ارتفاع البطاقات
    - **Property 2: Tool cards maintain consistent height**
    - **Validates: Requirements 3.1, 3.2**

- [x] 4. تغيير لون حد البطاقات المميزة

  - [ ] 4.1 تعديل ألوان البطاقات المميزة في ToolCard
    - تغيير ring-yellow-400 إلى ring-purple-400
    - تغيير shadow-yellow-200 إلى shadow-purple-200
    - تحديث ألوان الوضع الداكن
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. إضافة رابط صفحة الكلمات المفتاحية في لوحة التحكم

  - [ ] 5.1 فحص وتحديث صفحة admin الرئيسية
    - البحث عن صفحة admin الرئيسية أو إنشاؤها
    - إضافة رابط لـ /admin/page-keywords مع أيقونة Tag
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6. Checkpoint - التأكد من عمل جميع الإصلاحات
  - Ensure all tests pass, ask the user if questions arise.
