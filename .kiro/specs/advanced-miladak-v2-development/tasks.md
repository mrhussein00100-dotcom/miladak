# Implementation Plan - تطوير ميلادك v2 المتقدم

## المرحلة الأولى: إصلاح الأساسيات وتهيئة قاعدة البيانات

- [x] 1. تهيئة قاعدة البيانات مع البيانات الافتراضية

  - [x] 1.1 إنشاء سكريبت تهيئة قاعدة البيانات الشامل

    - إنشاء جميع الجداول المطلوبة
    - إضافة فئات الأدوات الافتراضية (4 فئات)
    - إضافة الأدوات الـ 17 مع روابطها الصحيحة

    - إضافة فئات المقالات الافتراضية

    - إضافة مقالات نموذجية (10 مقالات)

    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 1.2 كتابة property test لـ Database Initialization Idempotency

    - **Property 5: Database Initialization Idempotency**

    - **Validates: Requirements 4.1**

- [x] 2. إصلاح صفحة الأدوات

  - [ ] 2.1 تحديث API الأدوات لإرجاع البيانات بشكل صحيح

    - إصلاح query لجلب الأدوات مع الفئات

    - إضافة دعم الفلترة والبحث
    - _Requirements: 2.1, 2.7_

  - [x] 2.2 تحديث مكون ToolsPageClient لعرض الأدوات

    - عرض الأدوات مجمعة حسب الفئة

    - إضافة قسم الأدوات المميزة
    - تحسين تصميم البطاقات
    - _Requirements: 2.1, 2.5, 2.6_

  - [ ] 2.3 كتابة property test لـ Tools Grouping
    - **Property 3: Tools Grouping by Category**
    - **Validates: Requirements 2.1**

- [x] 3. إصلاح صفحة المقالات

  - [x] 3.1 تحديث API المقالات لإرجاع البيانات بشكل صحيح
    - إصلاح query لجلب المقالات مع الفئات
    - إضافة دعم الفلترة والبحث والـ pagination
    - _Requirements: 3.1, 3.7_
  - [x] 3.2 تحديث مكون ArticlesPageClient لعرض المقالات
    - عرض المقالات مع الصور والبيانات الوصفية
    - إضافة قسم المقالات المميزة
    - تحسين تصميم البطاقات
    - _Requirements: 3.1, 3.5, 3.6_
  - [ ] 3.3 كتابة property test لـ Articles Filtering
    - **Property 4: Articles Filtering Consistency**
    - **Validates: Requirements 3.1, 3.3**

- [ ] 4. Checkpoint - التأكد من عمل الأساسيات
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة الثانية: تطوير النافبار المتقدم

- [x] 5. إنشاء النافبار المتقدم

  - [x] 5.1 إنشاء مكون AdvancedNavbar الأساسي
    - تصميم sticky مع glass morphism
    - شعار متحرك مع gradient
    - روابط التنقل الأساسية
    - _Requirements: 1.1_
  - [x] 5.2 إضافة القوائم المنسدلة للأدوات
    - جلب فئات الأدوات من API
    - عرض الأدوات المميزة تحت كل فئة
    - تأثيرات hover سلسة
    - _Requirements: 1.2, 1.7_
  - [x] 5.3 إضافة القوائم المنسدلة للمقالات
    - جلب فئات المقالات من API
    - عرض عدد المقالات لكل فئة
    - _Requirements: 1.3_
  - [x] 5.4 إضافة قائمة تبديل الثيم
    - أربعة خيارات: فاتح، مظلم، ميلادك، النظام
    - حفظ الاختيار في localStorage
    - _Requirements: 1.4, 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 5.5 إضافة قائمة الموبايل
    - hamburger menu متحرك
    - قائمة full-screen مع جميع العناصر
    - _Requirements: 1.5_
  - [x] 5.6 إضافة تأثير الظل عند التمرير
    - تغيير الشفافية والظل عند scroll
    - _Requirements: 1.6_

- [ ] 6. Checkpoint - التأكد من عمل النافبار
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة الثالثة: تحسين التصميم العام

- [ ] 7. إنشاء نظام التصميم المتقدم

  - [x] 7.1 إنشاء نظام الألوان والثيمات
    - تعريف ألوان الثيم الفاتح والمظلم وميلادك
    - إنشاء CSS variables للألوان
    - _Requirements: 5.2.1, 5.2.2, 5.2.3, 5.2.4, 5.2.5, 5.2.6_
  - [x] 7.2 إنشاء مكونات UI الأساسية المحسنة
    - Button مع تأثيرات hover متقدمة
    - Card مع 3D tilt effect
    - Input مع floating labels
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 7.3 إنشاء مكونات الأنيميشن
    - FadeIn, SlideUp, ScaleIn variants
    - Stagger animations للقوائم
    - Skeleton loaders
    - _Requirements: 5.6, 21.3.1, 21.3.7_

- [x] 8. تطوير Hero Section المتقدم

  - [x] 8.1 إنشاء خلفية Gradient Mesh متحركة
    - تدرجات ألوان متحركة
    - تأثير Aurora للثيم المظلم
    - _Requirements: 21.1, 21.2.1, 21.2.2_
  - [x] 8.2 إضافة الأشكال العائمة والجزيئات
    - floating shapes مع parallax
    - particle effects خفيفة
    - _Requirements: 21.2, 21.3_
  - [x] 8.3 تصميم حاسبة العمر بـ glassmorphism
    - تصميم عائم في المنتصف
    - تأثيرات متقدمة
    - _Requirements: 21.4_

- [ ] 9. Checkpoint - التأكد من التصميم
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة الرابعة: حاسبة العمر المتطورة

- [x] 10. تطوير حاسبة العمر

  - [x] 10.1 تحسين حسابات العمر
    - حساب السنوات والشهور والأيام والساعات والدقائق والثواني
    - تحديث الثواني في الوقت الفعلي
    - _Requirements: 13.1, 13.2_
  - [ ] 10.2 كتابة property test لـ Age Calculation
    - **Property 1: Age Calculation Accuracy**
    - **Validates: Requirements 13.1**
  - [ ] 10.3 كتابة property test لـ Birthday Countdown
    - **Property 2: Birthday Countdown Correctness**
    - **Validates: Requirements 13.2**
  - [x] 10.4 إضافة معلومات البرج والجيل
    - حساب البرج الفلكي
    - حساب البرج الصيني
    - تحديد الجيل
    - _Requirements: 13.4, 13.5, 13.6_
  - [x] 10.5 إضافة إحصائيات الحياة
    - نبضات القلب، الأنفاس، ساعات النوم
    - عرض بأنيميشن عد
    - _Requirements: 13.7_
  - [-] 10.6 إضافة أزرار المشاركة

    - مشاركة على وسائل التواصل
    - توليد صورة للمشاركة
    - _Requirements: 13.8_

- [ ] 11. Checkpoint - التأكد من حاسبة العمر
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة الخامسة: لوحة التحكم الأساسية

- [ ] 12. إنشاء هيكل لوحة التحكم

  - [ ] 12.1 إنشاء تخطيط لوحة التحكم
    - Sidebar قابل للطي
    - Header مع معلومات المستخدم
    - تصميم dark theme
    - _Requirements: 14.3, 14.4, 14.7.1_
  - [ ] 12.2 إنشاء صفحة Dashboard الرئيسية
    - بطاقات الإحصائيات
    - رسوم بيانية للزوار
    - إجراءات سريعة
    - _Requirements: 14.1, 14.2_
  - [ ] 12.3 إنشاء نظام المصادقة
    - صفحة تسجيل الدخول
    - session-based authentication
    - role-based access control
    - _Requirements: 14.5, 14.6_

- [ ] 13. إدارة المقالات

  - [ ] 13.1 إنشاء صفحة قائمة المقالات
    - جدول بيانات مع بحث وفلترة
    - pagination
    - أزرار الإجراءات
    - _Requirements: 14.1.1_
  - [ ] 13.2 إنشاء صفحة إنشاء/تعديل المقال
    - محرر نصوص غني
    - رفع الصور
    - اختيار الفئة والوسوم
    - _Requirements: 14.1.2, 14.1.5_
  - [ ] 13.3 إضافة الحفظ التلقائي
    - حفظ المسودة كل 30 ثانية
    - _Requirements: 14.1.3_

- [ ] 14. إدارة التصنيفات

  - [ ] 14.1 إنشاء صفحة إدارة التصنيفات
    - عرض شجرة التصنيفات
    - إضافة/تعديل/حذف
    - سحب وإفلات لإعادة الترتيب
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  - [ ] 14.2 كتابة property test لـ Category Hierarchy
    - **Property 6: Category Hierarchy Integrity**
    - **Validates: Requirements 17.1**

- [ ] 15. Checkpoint - التأكد من لوحة التحكم الأساسية
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة السادسة: نظام الذكاء الاصطناعي

- [ ] 16. إنشاء خدمات AI

  - [ ] 16.1 إنشاء AI Provider Interface
    - تعريف الواجهة الموحدة
    - دعم multiple providers
    - _Requirements: 22.1_
  - [ ] 16.2 تنفيذ Gemini Provider
    - دعم Gemini 1.5 Flash و Pro
    - معالجة rate limits
    - _Requirements: 22.1.1, 22.1.2, 22.1.3, 22.1.4, 22.1.5_
  - [ ] 16.3 تنفيذ Groq Provider
    - دعم Llama 3.1 و Mixtral
    - _Requirements: 22.2.1, 22.2.2, 22.2.3, 22.2.4, 22.2.5_
  - [ ] 16.4 تنفيذ Fallback System
    - التبديل التلقائي بين المزودين
    - تسجيل الأخطاء
    - _Requirements: 23.1, 23.2, 23.3_
  - [ ] 16.5 كتابة property test لـ AI Fallback
    - **Property 7: AI Provider Fallback**
    - **Validates: Requirements 22.1, 23.1**

- [ ] 17. إنشاء مقالات بالذكاء الاصطناعي

  - [ ] 17.1 إنشاء صفحة توليد المقالات
    - نموذج إدخال الموضوع والكلمات المفتاحية
    - اختيار عدد الكلمات والأسلوب
    - _Requirements: 15.1_
  - [ ] 17.2 تنفيذ توليد المقال
    - توليد العنوان والمحتوى
    - توليد SEO تلقائياً
    - اقتراح الفئة والوسوم
    - _Requirements: 15.2, 15.3, 15.4, 15.5, 15.7_
  - [ ] 17.3 إضافة معاينة وتعديل
    - عرض المقال المولد
    - السماح بالتعديل قبل النشر
    - _Requirements: 15.6_

- [ ] 18. إعادة الصياغة

  - [ ] 18.1 إنشاء أداة إعادة الصياغة
    - اختيار النص
    - اختيار الأسلوب
    - عرض المقارنة
    - _Requirements: 15.1.1, 15.1.2, 15.1.3, 15.1.4, 15.1.5_

- [ ] 19. توليد الصور

  - [ ] 19.1 تنفيذ خدمة توليد الصور
    - دعم Stable Diffusion (Hugging Face)
    - دعم Unsplash/Pexels كاحتياطي
    - _Requirements: 22.5.1, 22.5.5_
  - [ ] 19.2 إنشاء واجهة توليد الصور
    - تحليل المحتوى واقتراح prompts
    - عرض خيارات متعددة
    - توليد alt text تلقائياً
    - _Requirements: 15.2.1, 15.2.2, 15.2.3, 15.2.5_

- [ ] 20. Checkpoint - التأكد من نظام AI
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة السابعة: النشر التلقائي

- [ ] 21. نظام النشر التلقائي

  - [ ] 21.1 إنشاء قائمة المواضيع
    - صفحة إدارة المواضيع
    - إضافة/استيراد المواضيع
    - تحديد الأولويات
    - _Requirements: 18.1, 18.2, 18.5_
  - [ ] 21.2 تنفيذ النشر التلقائي اليومي
    - cron job أو scheduled function
    - اختيار الموضوع من القائمة
    - توليد المقال والصورة والSEO
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_
  - [ ] 21.3 إضافة الإشعارات
    - إشعار المدير بالمقال المنشور
    - إشعار في حالة الفشل
    - _Requirements: 16.7, 16.8_
  - [ ] 21.4 كتابة property test لـ Scheduled Publishing
    - **Property 8: Scheduled Article Publishing**
    - **Validates: Requirements 16.1**

- [ ] 22. جدولة المحتوى

  - [ ] 22.1 إضافة جدولة النشر للمقالات
    - اختيار تاريخ ووقت النشر
    - عرض تقويم المحتوى المجدول
    - _Requirements: 16.1.1, 16.1.2, 16.1.3, 16.1.4_

- [ ] 23. Checkpoint - التأكد من النشر التلقائي
  - Ensure all tests pass, ask the user if questions arise.

---

## المرحلة الثامنة: الصفحات الإضافية

- [ ] 24. إنشاء الصفحات الإضافية
  - [ ] 24.1 صفحة الأصدقاء
    - حاسبة أعمار متعددة
    - مقارنة الأعمار
    - _Requirements: 8.1_
  - [ ] 24.2 صفحة بطاقات التهنئة
    - قوالب بطاقات
    - تخصيص وتحميل
    - _Requirements: 8.2_
  - [ ] 24.3 صفحة حاسبة الحمل
    - حساب موعد الولادة
    - مراحل الحمل
    - _Requirements: 8.3_
  - [ ] 24.4 صفحة محول التاريخ
    - تحويل هجري-ميلادي
    - _Requirements: 8.4_

---

## المرحلة التاسعة: تحسين الأداء وSEO

- [ ] 25. تحسين الأداء

  - [ ] 25.1 تحسين تحميل الصور
    - استخدام next/image مع WebP
    - lazy loading
    - blur placeholders
    - _Requirements: 24.2_
  - [ ] 25.2 تحسين JavaScript
    - code splitting
    - dynamic imports
    - tree shaking
    - _Requirements: 24.3, 24.4_
  - [ ] 25.3 تحسين CSS
    - critical CSS inlining
    - purge unused CSS
    - _Requirements: 24.5_

- [ ] 26. تحسين SEO

  - [ ] 26.1 إضافة meta tags ديناميكية
    - title, description, keywords
    - Open Graph tags
    - _Requirements: 9.1, 9.5_
  - [ ] 26.2 إنشاء sitemap ديناميكي
    - تضمين جميع الأدوات والمقالات
    - _Requirements: 9.2_
  - [ ] 26.3 إضافة structured data
    - JSON-LD للأدوات والمقالات
    - _Requirements: 9.3_

- [ ] 27. Final Checkpoint - التأكد من كل شيء
  - Ensure all tests pass, ask the user if questions arise.
