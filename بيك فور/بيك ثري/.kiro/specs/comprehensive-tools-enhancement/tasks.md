# Implementation Plan

## Phase 1: إنشاء جدول الكلمات المفتاحية وتعبئة البيانات

- [x] 1. إنشاء جدول page_keywords وتعبئته بالبيانات

  - [x] 1.1 إنشاء سكريبت لإنشاء جدول page_keywords

    - إنشاء الجدول مع الحقول: id, page_type, page_slug, page_title, keywords, meta_description
    - إنشاء الفهارس للأداء
    - _Requirements: 5.1_

  - [x] 1.2 تعبئة الكلمات المفتاحية لجميع صفحات الأدوات (21 أداة)

    - 100 كلمة مفتاحية لكل أداة
    - مراعاة اسم "ميلادك" في الكلمات المفتاحية
    - _Requirements: 5.1, 5.6_

  - [x] 1.3 تعبئة الكلمات المفتاحية للصفحات الرئيسية
    - صفحة الأدوات، المقالات، الرئيسية
    - _Requirements: 5.1_

## Phase 2: إنشاء APIs للكلمات المفتاحية

- [x] 2. إنشاء APIs للكلمات المفتاحية

  - [x] 2.1 إنشاء app/api/page-keywords/[type]/[slug]/route.ts

    - جلب الكلمات المفتاحية للصفحة من جدول page_keywords
    - _Requirements: 5.1_

  - [x] 2.2 إنشاء app/api/admin/page-keywords/route.ts

    - GET: جلب جميع الصفحات وكلماتها
    - POST: إضافة كلمات لصفحة جديدة
    - _Requirements: 5.1_

  - [x] 2.3 إنشاء app/api/admin/page-keywords/[id]/route.ts
    - PUT: تحديث كلمات صفحة
    - DELETE: حذف كلمات صفحة
    - _Requirements: 5.1_

## Phase 3: إنشاء صفحة إدارة الكلمات المفتاحية في لوحة التحكم

- [x] 3. إنشاء صفحة إدارة الكلمات المفتاحية

  - [x] 3.1 إنشاء app/admin/page-keywords/page.tsx
    - عرض جميع الصفحات وكلماتها المفتاحية في جدول
    - إمكانية البحث والفلترة حسب نوع الصفحة
    - إمكانية الإضافة والتعديل والحذف
    - تصميم أنيق ومتجاوب
    - _Requirements: 5.1_

- [x] 4. Checkpoint - التأكد من عمل قاعدة البيانات والـ APIs
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: تحسين API للمقالات العشوائية

- [x] 5. تحديث API المقالات العشوائية

  - [x] 5.1 تحديث app/api/random-articles/route.ts

    - جلب مقالات عشوائية من قاعدة البيانات
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 5.2 كتابة اختبار خاصية لملاءمة المقالات
    - **Property 4: Random Articles Relevance**
    - **Validates: Requirements 4.1, 4.2**

## Phase 5: تحسين تصميم صفحة الأدوات الرئيسية

- [x] 6. تحسين الهيدر والتصميم العام

  - [x] 6.1 تحديث ToolsPageClient.tsx بتصميم أكثر أناقة

    - تحسين Hero Section مع أنيميشن أفضل
    - تحسين عرض الإحصائيات
    - تحسين تصميم البحث والفلاتر
    - تحسين بطاقات الأدوات
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3_

  - [x] 6.2 كتابة اختبار خاصية لدقة الإحصائيات

    - **Property 1: Statistics Display Accuracy**
    - **Validates: Requirements 1.3**

  - [x] 6.3 كتابة اختبار خاصية لترتيب الأدوات المميزة
    - **Property 2: Featured Tools Ordering**
    - **Validates: Requirements 3.4**

- [x] 7. Checkpoint - التأكد من عمل صفحة الأدوات الرئيسية
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: تحسين مكون المقالات العشوائية

- [x] 8. تحديث مكون ToolRandomArticles

  - [x] 8.1 تحديث components/tools/ToolRandomArticles.tsx

    - جلب المقالات من API
    - تصميم أنيق لبطاقات المقالات
    - عرض العنوان والمقتطف والصورة ووقت القراءة
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 كتابة اختبار خاصية لاكتمال بطاقة المقال

    - **Property 5: Article Card Completeness**
    - **Validates: Requirements 4.3**

  - [x] 8.3 كتابة اختبار خاصية لصحة روابط المقالات
    - **Property 6: Article Link Correctness**
    - **Validates: Requirements 4.4**

## Phase 7: تحسين مكون الكلمات المفتاحية

- [x] 9. تحديث مكون KeywordsSection

  - [x] 9.1 تحديث components/tools/KeywordsSection.tsx
    - جلب الكلمات المفتاحية من API الجديد
    - تصميم سحابة كلمات أنيقة
    - أحجام متفاوتة للكلمات
    - تأثيرات hover جميلة
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

## Phase 8: تحسين تخطيط صفحات الأدوات الفردية

- [x] 10. تحديث ToolPageLayout

  - [x] 10.1 تحديث components/tools/ToolPageLayout.tsx

    - تحسين Hero Section للأدوات الفردية
    - تحسين تصميم قسم الحاسبة
    - تحسين قسم المقالات العشوائية
    - تحسين قسم الكلمات المفتاحية
    - تحسين قسم الروابط السريعة
    - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.2, 7.3, 7.4_

  - [x] 10.2 كتابة اختبار خاصية لهيكل الصفحة
    - **Property 9: Page Structure Consistency**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 11. Checkpoint - التأكد من عمل التخطيط الموحد
  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: تحسين SEO

- [x] 12. تحسين SEO لجميع صفحات الأدوات

  - [x] 12.1 تحديث components/tools/ToolStructuredData.tsx

    - إضافة WebApplication schema
    - إضافة HowTo schema
    - تضمين اسم "ميلادك" في جميع البيانات
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [x] 12.2 كتابة اختبار خاصية لاكتمال SEO

    - **Property 7: SEO Meta Tags Completeness**
    - **Validates: Requirements 6.1, 6.3, 6.5**

  - [x] 12.3 كتابة اختبار خاصية لصحة Structured Data
    - **Property 8: Structured Data Validity**
    - **Validates: Requirements 6.2**

## Phase 10: تحسين الثيمات والأداء

- [x] 13. تحسين دعم الثيمات

  - [x] 13.1 تحديث CSS للثيمات في globals.css
    - تحسين ألوان الوضع الداكن
    - تحسين ألوان الوضع الفاتح
    - تحسين ثيم ميلادك
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 14. تحسين الأداء

  - [x] 14.1 إضافة lazy loading للأقسام

    - lazy load للمقالات العشوائية
    - lazy load للكلمات المفتاحية
    - _Requirements: 10.2_

  - [x] 14.2 كتابة اختبار خاصية لأداء التحميل
    - **Property 10: Lazy Loading Effectiveness**
    - **Property 11: Bundle Size Optimization**
    - **Validates: Requirements 8.1, 8.2, 8.3**

## Phase 11: تحديث صفحات الأدوات الفردية

- [x] 15. تحديث جميع صفحات الأدوات لاستخدام البيانات من قاعدة البيانات

  - [x] 15.1 تحديث صفحات الأدوات لجلب الكلمات المفتاحية من DB
    - تحديث جميع صفحات الأدوات الـ 21
    - استخدام API الجديد للكلمات المفتاحية
    - _Requirements: 5.1, 7.1_

- [x] 16. Final Checkpoint - التأكد من عمل جميع الاختبارات

  - Ensure all tests pass, ask the user if questions arise.
  - ✅ جميع الاختبارات تمر بنجاح (123 اختبار، 16 ملف)
