# Implementation Plan

## Phase 1: تنظيف صفحة الأدوات الرئيسية

- [x] 1. إزالة العناصر المكررة من صفحة الأدوات

  - [x] 1.1 تحديث app/tools/page.tsx لإزالة الهيدر المكرر

    - إزالة badge "🧮أكثر من 21 أداة مجانية"
    - إزالة النص المكرر في الوصف
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 تحديث ToolsPageClient.tsx لإزالة الهيدر المكرر
    - إزالة Hero Section المكرر من المكون
    - الاحتفاظ فقط بالبحث والفلاتر وعرض الأدوات
    - _Requirements: 1.2, 1.3_

## Phase 2: إنشاء المكونات المشتركة الجديدة

- [x] 2. إنشاء مكون DualDateInput

  - [x] 2.1 إنشاء components/ui/DualDateInput.tsx

    - حقل نصي بسيط للإدخال السريع
    - كاليندر مرئي للاختيار البصري
    - تزامن تلقائي بين الاثنين

    - دعم التقويم الهجري والميلادي
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 2.2 كتابة اختبار خاصية لتزامن إدخال التاريخ

    - **Property 12: Dual date input synchronization**
    - **Validates: Requirements 9.2, 9.3**

- [x] 3. إنشاء مكون KeywordsSection

  - [x] 3.1 إنشاء components/tools/KeywordsSection.tsx
    - عرض 100 كلمة مفتاحية في مجموعات
    - تصميم جذاب مع hover effects
    - دعم النقر للبحث/الفلترة
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 3.2 كتابة اختبار خاصية لتجميع الكلمات المفتاحية

    - **Property 8: Keywords grouping completeness**

    - **Validates: Requirements 5.2**

  - [x] 3.3 كتابة اختبار خاصية لمعالج النقر
    - **Property 9: Keyword click handler**
    - **Validates: Requirements 5.4**

- [x] 4. إنشاء مكون RandomArticlesSection

  - [x] 4.1 إنشاء components/tools/ToolRandomArticles.tsx
    - جلب 6 مقالات عشوائية مرتبطة
    - عرض بطاقات المقالات بتصميم جذاب
    - دعم الكلمات المفتاحية للفلترة
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 4.2 كتابة اختبار خاصية لملاءمة المقالات
    - **Property 4: Random articles relevance**
    - **Validates: Requirements 4.2**
  - [x] 4.3 كتابة اختبار خاصية لاكتمال بطاقة المقال
    - **Property 5: Article card completeness**
    - **Validates: Requirements 4.3**
  - [x] 4.4 كتابة اختبار خاصية لصحة روابط المقالات
    - **Property 6: Article link correctness**
    - **Validates: Requirements 4.4**

- [x] 5. Checkpoint - التأكد من عمل جميع الاختبارات
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: تحسين صفحة الأدوات الرئيسية

- [x] 6. تحسين الهيدر والتصميم العام

  - [x] 6.1 إنشاء هيدر موحد جديد في app/tools/page.tsx
    - تصميم عصري مع gradient background
    - عرض عدد الأدوات ديناميكياً
    - تصميم متجاوب للجوال
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 6.2 كتابة اختبار خاصية لدقة عرض عدد الأدوات
    - **Property 1: Tools count display accuracy**
    - **Validates: Requirements 2.4**

- [x] 7. تحسين عرض التصنيفات والأدوات

  - [x] 7.1 تحديث ToolsPageClient.tsx لتحسين العرض

    - أيقونات وألوان مميزة للتصنيفات

    - تأثيرات hover سلسة

    - ترتيب الأدوات المميزة في الأعلى
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 7.2 كتابة اختبار خاصية لترتيب الأدوات المميزة
    - **Property 2: Featured tools ordering**
    - **Validates: Requirements 3.4**
  - [x] 7.3 كتابة اختبار خاصية لصحة فلترة البحث
    - **Property 3: Search filter correctness**
    - **Validates: Requirements 3.6**

- [x] 8. دمج المكونات الجديدة في صفحة الأدوات

  - [x] 8.1 إضافة KeywordsSection إلى app/tools/page.tsx

    - 100 كلمة مفتاحية للصفحة الرئيسية
    - _Requirements: 5.1, 5.2_

  - [x] 8.2 إضافة ToolRandomArticles إلى app/tools/page.tsx
    - 6 مقالات عشوائية مرتبطة بالأدوات
    - _Requirements: 4.1, 4.2_

- [x] 9. Checkpoint - التأكد من عمل صفحة الأدوات الرئيسية
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: إنشاء تخطيط موحد لصفحات الأدوات الفرعية

- [x] 10. إنشاء مكون ToolPageLayout

  - [x] 10.1 إنشاء components/tools/ToolPageLayout.tsx
    - هيدر موحد لجميع صفحات الأدوات
    - قسم الحاسبة (children)
    - قسم المقالات العشوائية
    - قسم الكلمات المفتاحية
    - محتوى SEO
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 10.2 كتابة اختبار خاصية لعدد الكلمات المفتاحية
    - **Property 13: Tool-specific keywords count**
    - **Validates: Requirements 8.2**
  - [x] 10.3 كتابة اختبار خاصية للمقالات الخاصة بالأداة

    - **Property 16: Tool-specific random articles**

    - **Validates: Requirements 8.3**

- [x] 11. إنشاء مكون ToolSEOMetadata

  - [x] 11.1 إنشاء components/tools/ToolSEOMetadata.tsx

    - meta title مع اسم "ميلادك"

    - meta description محسن

    - Open Graph tags
    - JSON-LD structured data

    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 11.2 كتابة اختبار خاصية لاسم العلامة التجارية في SEO
    - **Property 14: Brand name in SEO**
    - **Validates: Requirements 8.5, 10.5**

## Phase 5: إنشاء ملفات الكلمات المفتاحية

- [x] 12. إنشاء ملفات الكلمات المفتاحية لكل أداة

  - [x] 12.1 إنشاء lib/keywords/toolsKeywords.ts
    - 100 كلمة مفتاحية للصفحة الرئيسية
    - _Requirements: 5.1_
  - [x] 12.2 إنشاء lib/keywords/bmiKeywords.ts
    - 100 كلمة مفتاحية لحاسبة BMI
    - _Requirements: 8.2_
  - [x] 12.3 إنشاء lib/keywords/birthdayCountdownKeywords.ts
    - 100 كلمة مفتاحية للعد التنازلي
    - _Requirements: 8.2_
  - [x] 12.4 إنشاء lib/keywords/calorieKeywords.ts
    - 100 كلمة مفتاحية لحاسبة السعرات
    - _Requirements: 8.2_
  - [x] 12.5 إنشاء lib/keywords/pregnancyKeywords.ts
    - 100 كلمة مفتاحية لحاسبة الحمل
    - _Requirements: 8.2_
  - [x] 12.6 إنشاء lib/keywords/ageKeywords.ts
    - 100 كلمة مفتاحية لحاسبات العمر
    - _Requirements: 8.2_
  - [x] 12.7 إنشاء lib/keywords/datesKeywords.ts
    - 100 كلمة مفتاحية لحاسبات التواريخ
    - _Requirements: 8.2_

- [x] 13. Checkpoint - التأكد من اكتمال الكلمات المفتاحية
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: تحديث صفحات الأدوات الفرعية

- [x] 14. تحديث صفحات الأدوات لاستخدام التخطيط الموحد

  - [x] 14.1 تحديث app/tools/bmi-calculator/page.tsx

    - استخدام ToolPageLayout

    - إضافة DualDateInput إذا لزم

    - إضافة الكلمات المفتاحية الخاصة

    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 14.2 تحديث app/tools/birthday-countdown/page.tsx

    - استخدام ToolPageLayout

    - إضافة DualDateInput

    - إضافة الكلمات المفتاحية الخاصة
    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 14.3 تحديث app/tools/calorie-calculator/page.tsx
    - استخدام ToolPageLayout
    - إضافة الكلمات المفتاحية الخاصة
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 14.4 تحديث app/tools/days-between/page.tsx

    - استخدام ToolPageLayout
    - إضافة DualDateInput

    - إضافة الكلمات المفتاحية الخاصة
    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 14.5 تحديث app/tools/pregnancy-stages/page.tsx

    - استخدام ToolPageLayout
    - إضافة DualDateInput

    - إضافة الكلمات المفتاحية الخاصة
    - _Requirements: 8.1, 8.2, 8.3, 9.1_

- [x] 15. تحديث باقي صفحات الأدوات

  - [x] 15.1 تحديث app/tools/age-in-seconds/page.tsx
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  - [x] 15.2 تحديث app/tools/day-of-week/page.tsx

    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 15.3 تحديث app/tools/event-countdown/page.tsx

    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 15.4 تحديث app/tools/life-statistics/page.tsx
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  - [x] 15.5 تحديث app/tools/relative-age/page.tsx

    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 15.6 تحديث app/tools/child-age/page.tsx
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  - [x] 15.7 تحديث app/tools/child-growth/page.tsx
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 15.8 تحديث app/tools/generation-calculator/page.tsx

    - _Requirements: 8.1, 8.2, 8.3, 9.1_

  - [x] 15.9 تحديث app/tools/timezone-calculator/page.tsx
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 15.10 تحديث app/tools/holidays-calculator/page.tsx
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 15.11 تحديث app/tools/islamic-holidays-dates/page.tsx
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 15.12 تحديث app/tools/celebration-planner/page.tsx
    - _Requirements: 8.1, 8.2, 8.3, 9.1_

- [x] 16. Checkpoint - التأكد من عمل جميع صفحات الأدوات
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: تحسين الثيمات والأداء

- [x] 17. تحسين دعم الثيمات

  - [x] 17.1 تحديث CSS variables للثيمات في globals.css
    - ألوان متناسقة للوضع الفاتح والداكن
    - تباين مناسب للقراءة
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  - [x] 17.2 كتابة اختبار خاصية لاتساق الثيمات
    - **Property 15: Theme consistency**
    - **Validates: Requirements 11.3**

- [x] 18. تحسين الأداء

  - [x] 18.1 إضافة lazy loading للأقسام أسفل الصفحة
    - _Requirements: 7.1, 7.2_
  - [x] 18.2 تحسين الصور والأصول
    - _Requirements: 7.4_
  - [x] 18.3 كتابة اختبار خاصية لاحترام تقليل الحركة
    - **Property 11: Reduced motion respect**
    - **Validates: Requirements 7.3**

- [x] 19. تحسين SEO العام

  - [x] 19.1 تحديث sitemap.ts لتضمين جميع صفحات الأدوات
    - _Requirements: 10.4_
  - [x] 19.2 تحديث robots.ts للسماح بفهرسة صفحات الأدوات
    - _Requirements: 10.4_
  - [x] 19.3 إضافة structured data لجميع صفحات الأدوات
    - _Requirements: 10.2_

- [x] 20. Final Checkpoint - التأكد من عمل جميع الاختبارات
  - Ensure all tests pass, ask the user if questions arise.
