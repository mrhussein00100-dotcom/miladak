# Implementation Plan

## Tools Page Beautification - خطة التنفيذ

- [x] 1. إزالة التبعيات الثقيلة وتحسين الأداء

  - [x] 1.1 إزالة framer-motion من ToolsPageClient

    - إزالة جميع imports الخاصة بـ framer-motion
    - استبدال motion.div بـ div عادي
    - استبدال الأنيميشن بـ CSS classes
    - _Requirements: 5.2, 5.5_

  - [x] 1.2 كتابة property test للتحقق من عدم وجود مكتبات أنيميشن ثقيلة
    - **Property 9: No External Image Icons**
    - **Validates: Requirements 5.4**

- [x] 2. تحسين Hero Section

  - [x] 2.1 إنشاء Hero Section خفيف بـ CSS فقط

    - تصميم بسيط مع gradient text
    - إحصائيات بدون أنيميشن JavaScript
    - دعم الوضع الداكن
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 كتابة property test لـ reduced motion
    - **Property 1: Reduced Motion Preference Respected**
    - **Validates: Requirements 1.5**

- [x] 3. تحسين بطاقات الأدوات

  - [x] 3.1 إعادة تصميم Tool Card بـ CSS فقط

    - تصميم بسيط مع hover effects خفيفة
    - تدرجات لونية للأيقونات حسب التصنيف
    - دعم featured tools
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.2 كتابة property test لتطابق التدرج مع التصنيف

    - **Property 2: Tool Icon Gradient Matches Category**
    - **Validates: Requirements 2.3**

  - [x] 3.3 كتابة property test للأدوات المميزة
    - **Property 3: Featured Tools Display Special Styling**
    - **Validates: Requirements 2.6**

- [x] 4. تحسين فلتر التصنيفات والبحث

  - [x] 4.1 تحسين Category Filter

    - أزرار بسيطة مع أيقونات
    - عرض عدد الأدوات لكل تصنيف
    - تأثيرات hover خفيفة
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 تحسين شريط البحث

    - تصميم بسيط مع أيقونة
    - debounce للبحث
    - رسالة عند عدم وجود نتائج
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 4.3 كتابة property test لفلترة التصنيفات

    - **Property 4: Category Selection Filters Tools**
    - **Validates: Requirements 3.2, 3.4**

  - [x] 4.4 كتابة property test لعدادات التصنيفات

    - **Property 5: Category Buttons Show Counts**
    - **Validates: Requirements 3.3, 3.5**

  - [x] 4.5 كتابة property test للبحث

    - **Property 6: Search Filters Tools Correctly**
    - **Validates: Requirements 4.2**

  - [x] 4.6 كتابة property test لرسالة النتائج الفارغة

    - **Property 7: Empty Search Shows Message**
    - **Validates: Requirements 4.4**

  - [x] 4.7 كتابة property test لمسح البحث
    - **Property 8: Clear Search Shows All Tools**
    - **Validates: Requirements 4.5**

- [x] 5. Checkpoint - التأكد من عمل الاختبارات

  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. إضافة مواقع AdSense

  - [x] 6.1 إضافة AdSense Top Banner

    - بعد Hero Section مباشرة
    - حجم 728x90 responsive
    - placeholder بأبعاد ثابتة لمنع CLS
    - _Requirements: 5.3_

  - [x] 6.2 إضافة AdSense In-Content

    - بعد 6 أدوات
    - حجم 336x280
    - lazy loading
    - _Requirements: 5.3_

  - [x] 6.3 إضافة AdSense Footer
    - قبل Footer مباشرة
    - حجم 728x90
    - _Requirements: 5.3_

- [x] 7. تحسين الوضع الداكن

  - [x] 7.1 تحسين ألوان Dark Mode
    - تدرجات مناسبة للوضع الداكن
    - تباين كافٍ للنصوص
    - _Requirements: 6.1, 6.2, 6.4_

- [x] 8. تحسين التجاوب

  - [x] 8.1 تحسين Mobile Layout

    - عمود واحد للبطاقات
    - فلتر قابل للتمرير أفقياً
    - أحجام أزرار مناسبة للمس
    - _Requirements: 7.1, 7.2, 7.5_

  - [x] 8.2 تحسين Tablet و Desktop Layout
    - 2 أعمدة للتابلت، 3 للديسكتوب
    - max-width للحاوية
    - _Requirements: 7.3, 7.4_

- [x] 9. تحسين قسم SEO

  - [x] 9.1 تحسين SEO Content Section

    - محتوى ثابت بدون أنيميشن
    - عناوين دلالية (h2, h3)
    - بطاقات معلومات بسيطة
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [x] 9.2 كتابة property test للعناوين الدلالية
    - **Property 10: SEO Section Uses Semantic Headings**
    - **Validates: Requirements 8.3**

- [x] 10. Final Checkpoint - التأكد من عمل كل شيء
  - Ensure all tests pass, ask the user if questions arise.
