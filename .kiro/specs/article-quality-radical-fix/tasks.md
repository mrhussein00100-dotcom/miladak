# Implementation Plan

- [x] 1. إنشاء مكون TopicBinder لربط المحتوى بالموضوع

  - [x] 1.1 إنشاء ملف lib/sona/topicBinder.ts مع الواجهات والأنواع

    - إنشاء TopicBinderConfig و TopicBinderResult interfaces
    - إنشاء class TopicBinder مع الدوال الأساسية
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 كتابة اختبار خاصية: ذكر الموضوع في المقدمة والخاتمة

    - **Property 1: Topic Mention in Introduction and Conclusion**
    - **Validates: Requirements 1.1, 1.4**

  - [x] 1.3 كتابة اختبار خاصية: عناوين H2 تحتوي كلمات الموضوع

    - **Property 2: H2 Sections Contain Topic Keywords**
    - **Validates: Requirements 1.2**

  - [x] 1.4 كتابة اختبار خاصية: تكرار ذكر الموضوع
    - **Property 3: Topic Mention Frequency**
    - **Validates: Requirements 1.3**

- [x] 2. تحسين TopicAnalyzer لاستخراج الكيانات بدقة

  - [x] 2.1 تحسين دالة extractNames لاستخراج الأسماء العربية بدقة أكبر
    - تحسين regex patterns للأسماء العربية
    - إضافة قائمة أسماء عربية شائعة
    - _Requirements: 2.1_
  - [x] 2.2 تحسين دالة extractAges لاستخراج الأعمار من سياقات مختلفة
    - إضافة patterns جديدة للأعمار
    - التعامل مع الأرقام العربية والإنجليزية
    - _Requirements: 2.2_
  - [x] 2.3 إضافة دالة extractRequiredKeywords لإنشاء قائمة الكلمات الإجبارية
    - استخراج الكلمات المهمة من الموضوع
    - إضافة كلمات حسب الفئة
    - _Requirements: 2.4_
  - [x] 2.4 كتابة اختبار خاصية: استخدام الاسم في كل قسم
    - **Property 4: Entity Extraction and Usage**
    - **Validates: Requirements 2.1, 7.4**
  - [x] 2.5 كتابة اختبار خاصية: تضمين معلومات العمر
    - **Property 5: Age-Specific Content**
    - **Validates: Requirements 2.2, 7.5**

- [x] 3. Checkpoint - التأكد من نجاح الاختبارات

  - Ensure all tests pass, ask the user if questions arise.
  - ✅ جميع اختبارات TopicBinder (7/7) نجحت
  - ✅ جميع اختبارات TopicAnalyzer (8/8) نجحت

- [x] 4. إنشاء StrictQualityGate لبوابة الجودة الصارمة

  - [x] 4.1 إنشاء ملف lib/sona/strictQualityGate.ts

    - إنشاء QualityGateConfig و QualityGateResult interfaces
    - إنشاء class StrictQualityGate
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.2 تنفيذ دالة checkTopicRelevance للتحقق من ارتباط الموضوع

    - حساب نسبة وجود الكلمات المفتاحية
    - التحقق من الحد الأدنى 80%
    - _Requirements: 5.3_

  - [x] 4.3 تنفيذ دالة checkRequiredSections للتحقق من الأقسام

    - التحقق من وجود المقدمة والخاتمة
    - التحقق من عدد أقسام H2
    - التحقق من وجود FAQ للمقالات الطويلة

    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.4 تنفيذ دالة checkWordCount للتحقق من عدد الكلمات
    - التحقق من الحدود الصارمة الجديدة
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 4.5 كتابة اختبار خاصية: وجود الكلمات المفتاحية الإجبارية

    - **Property 6: Required Keywords Presence**
    - **Validates: Requirements 2.4, 5.2**

  - [x] 4.6 كتابة اختبار خاصية: عدد الكلمات ضمن الحدود

    - **Property 7: Word Count Within Limits**

    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 4.7 كتابة اختبار خاصية: اكتمال الأقسام المطلوبة
    - **Property 8: Required Sections Completeness**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [x] 4.8 كتابة اختبار خاصية: درجة الجودة فوق الحد الأدنى

    - **Property 9: Quality Score Threshold**
    - **Validates: Requirements 5.3, 5.4**

- [x] 5. Checkpoint - التأكد من نجاح الاختبارات

  - Ensure all tests pass, ask the user if questions arise.
  - ✅ جميع اختبارات TopicBinder (7/7) نجحت
  - ✅ جميع اختبارات TopicAnalyzer (8/8) نجحت
  - ✅ جميع اختبارات StrictQualityGate (11/11) نجحت

- [x] 6. إنشاء FallbackContentSystem للمحتوى الاحتياطي

  - [x] 6.1 إنشاء ملف lib/sona/fallbackSystem.ts

    - إنشاء FallbackTemplate و FallbackResult interfaces
    - إنشاء class FallbackContentSystem
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.2 إنشاء قوالب المحتوى الاحتياطي في data/sona/fallback/

    - قالب عيد ميلاد مع اسم
    - قالب عيد ميلاد مع اسم وعمر
    - قالب عيد ميلاد عام
    - قوالب للأبراج
    - قالب عام
    - _Requirements: 6.1_

  - [x] 6.3 تنفيذ دالة customize لتخصيص القوالب بالكيانات

    - استبدال {name} بالاسم المستخرج
    - استبدال {age} بالعمر المستخرج
    - استبدال {topic} بالموضوع

    - _Requirements: 6.2_

  - [x] 6.4 كتابة اختبار خاصية: تخصيص المحتوى الاحتياطي

    - **Property 10: Fallback Content Customization**
    - **Validates: Requirements 6.2**

  - [x] 6.5 كتابة اختبار خاصية: وجود علامة التحذير
    - **Property 11: Fallback Warning Presence**
    - **Validates: Requirements 6.3**

- [x] 7. تحديث ContentGenerator لدمج المكونات الجديدة

  - [x] 7.1 تحديث contentGenerator.ts لاستخدام TopicBinder

    - استدعاء TopicBinder بعد توليد كل قسم
    - التأكد من ربط المحتوى بالموضوع
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 7.2 تحديث contentGenerator.ts لاستخدام StrictQualityGate

    - استدعاء بوابة الجودة بعد التوليد
    - إعادة المحاولة إذا فشل الفحص
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 7.3 تحديث contentGenerator.ts لاستخدام FallbackSystem

    - استخدام المحتوى الاحتياطي بعد 3 محاولات فاشلة
    - إضافة علامة التحذير
    - _Requirements: 5.5, 6.1, 6.2, 6.3_

  - [x] 7.4 تحديث حدود عدد الكلمات للحدود الصارمة الجديدة

    - تحديث WORD_COUNT_LIMITS
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 8. Checkpoint - التأكد من نجاح الاختبارات

  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. إضافة اختبارات جودة المحتوى

  - [x] 9.1 كتابة اختبار خاصية: عدم تكرار عناصر القوائم
    - **Property 12: No Duplicate List Items**
    - **Validates: Requirements 7.2**
  - [x] 9.2 كتابة اختبار خاصية: عدم وجود عبارات عامة
    - **Property 13: No Generic Phrases**
    - **Validates: Requirements 7.3**
  - [x] 9.3 كتابة اختبار خاصية: وجود تقرير الجودة
    - **Property 14: Quality Report Presence**
    - **Validates: Requirements 8.4**

- [x] 10. اختبار التكامل الشامل

  - [x] 10.1 إنشاء اختبار تكامل لتوليد مقال عيد ميلاد مع اسم وعمر
    - التحقق من ذكر الاسم والعمر في المحتوى
    - التحقق من اكتمال الأقسام
    - التحقق من عدد الكلمات
    - _Requirements: 1.1, 2.1, 2.2, 4.1_
  - [x] 10.2 إنشاء اختبار تكامل لتوليد مقال عن برج
    - التحقق من ذكر البرج في المحتوى
    - التحقق من معلومات البرج
    - _Requirements: 2.3_
  - [x] 10.3 إنشاء اختبار تكامل للمحتوى الاحتياطي
    - محاكاة فشل التوليد
    - التحقق من استخدام المحتوى الاحتياطي
    - التحقق من التخصيص والتحذير
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 11. Final Checkpoint - التأكد من نجاح جميع الاختبارات
  - Ensure all tests pass, ask the user if questions arise.
  - ✅ جميع اختبارات SONA (488/488) نجحت
  - ✅ اختبارات جودة المحتوى (10/10) نجحت
  - ✅ اختبارات التكامل (24/24) نجحت
  - ✅ اختبارات الخصائص (62+) نجحت
