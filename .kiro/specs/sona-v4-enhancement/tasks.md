# Implementation Plan: SONA v4 Enhancement

## Phase 1: Foundation & Data Structure

- [x] 1. إنشاء بنية الملفات الأساسية

  - [x] 1.1 إنشاء مجلد data/sona/ مع المجلدات الفرعية (knowledge, templates, synonyms, phrases, plugins, config)

    - إنشاء الهيكل الكامل للملفات
    - _Requirements: 9.1, 9.2_

  - [x] 1.2 إنشاء ملفات JSON الأساسية لقاعدة المعرفة

    - zodiac.json مع 50+ حقيقة لكل برج
    - birthday.json مع تقاليد وأفكار متنوعة
    - health.json مع معلومات صحية
    - dates.json مع معلومات تاريخية
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.3 إنشاء ملفات القوالب المعيارية

    - intros/ مع 50+ قالب مقدمة
    - paragraphs/ مع 100+ قالب فقرة
    - conclusions/ مع 30+ قالب خاتمة
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 1.4 إنشاء ملفات المرادفات والعبارات

    - synonyms/arabic.json مع 500+ مرادفة
    - phrases/transitions.json مع 40+ عبارة ربط
    - phrases/greetings.json مع 50+ تهنئة
    - phrases/ctas.json مع دعوات للعمل
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 1.5 كتابة property test للتحقق من بنية الملفات

    - **Property 1: Knowledge Base Completeness**
    - **Validates: Requirements 1.1**

## Phase 2: Core Components

- [x] 2. تطوير محلل الموضوع (Topic Analyzer)

  - [x] 2.1 إنشاء lib/sona/topicAnalyzer.ts

    - تحليل الموضوع واستخراج الكيانات (أسماء، تواريخ، أبراج، أعمار)
    - تحديد الفئة والفئة الفرعية
    - اقتراح الكلمات المفتاحية
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.2 كتابة property test لمحلل الموضوع
    - **Property 10: Contextual Personalization**
    - **Validates: Requirements 4.1**

- [x] 3. تطوير محرك القوالب (Template Engine)

  - [x] 3.1 إنشاء lib/sona/templateEngine.ts

    - تحميل القوالب من ملفات JSON
    - اختيار القوالب بناءً على التحليل
    - ملء القوالب بالمتغيرات
    - _Requirements: 2.1, 2.6_

  - [x] 3.2 كتابة property test لتنوع القوالب
    - **Property 2: Template Variety**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [x] 4. تطوير معيد الصياغة (Rephraser)

  - [x] 4.1 إنشاء lib/sona/rephraser.ts

    - استبدال المرادفات
    - تنويع طول الجمل
    - إضافة تنوع بلاغي
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 4.2 كتابة property test لإعادة الصياغة
    - **Property 8: Synonym Replacement**
    - **Property 9: Sentence Length Variety**
    - **Property 12: Rephrasing Variety**
    - **Validates: Requirements 3.1, 3.2, 11.1**

- [x] 5. Checkpoint - التأكد من عمل المكونات الأساسية
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Content Generation

- [x] 6. تطوير مولد المحتوى (Content Generator)

  - [x] 6.1 إنشاء lib/sona/contentGenerator.ts

    - توليد المقدمات
    - توليد الأقسام والفقرات
    - توليد الخاتمات
    - توليد FAQs والنصائح
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 كتابة property test للعناصر التفاعلية
    - **Property 5: Interactive Elements**
    - **Validates: Requirements 5.1, 5.2, 5.5**

- [x] 7. تطوير مدقق الجودة (Quality Checker)

  - [x] 7.1 إنشاء lib/sona/qualityChecker.ts

    - حساب درجة التنوع
    - حساب كثافة الكلمات المفتاحية
    - حساب قابلية القراءة
    - فحص البنية
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.2 كتابة property tests للجودة
    - **Property 3: Keyword Density**
    - **Property 4: Meta Description Length**
    - **Property 6: Quality Score Threshold**
    - **Validates: Requirements 6.1, 6.4, 8.4**

- [x] 8. Checkpoint - التأكد من عمل توليد المحتوى
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Database & Tracking

- [x] 9. إعداد جداول Postgres

  - [x] 9.1 إنشاء migration لجداول SONA

    - sona_settings
    - generated_content_hashes
    - generation_stats
    - template_versions
    - generation_logs
    - sona_plugins
    - _Requirements: 12.1, 12.4, 12.5_

  - [x] 9.2 إنشاء lib/sona/db/index.ts للتعامل مع قاعدة البيانات
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 10. تطوير متتبع المحتوى (Content Tracker)

  - [x] 10.1 إنشاء lib/sona/contentTracker.ts

    - حفظ بصمات المحتوى
    - فحص التشابه
    - تسجيل الإحصائيات
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 10.2 كتابة property test للتتبع
    - **Property 1: Content Diversity**
    - **Property 7: Content Hash Uniqueness**
    - **Validates: Requirements 2.5, 12.1, 12.2**

- [x] 11. Checkpoint - التأكد من عمل قاعدة البيانات
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Control & Management

- [x] 12. تطوير مدير الإعدادات (Settings Manager)

  - [x] 12.1 إنشاء lib/sona/settingsManager.ts

    - قراءة وكتابة الإعدادات
    - التحقق من صحة الإعدادات
    - الإعدادات الافتراضية
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 12.2 كتابة property test للإعدادات
    - **Property 13: Settings Persistence**
    - **Validates: Requirements 13.2**

- [x] 13. تطوير نظام الـ Plugins

  - [x] 13.1 إنشاء lib/sona/pluginManager.ts

    - تسجيل وإلغاء تسجيل الـ plugins
    - تفعيل وتعطيل الـ plugins
    - تنفيذ الـ hooks
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 13.2 إنشاء plugins افتراضية (birthday, zodiac, health)

    - _Requirements: 14.5_

  - [x] 13.3 كتابة property test للـ plugins
    - **Property 14: Plugin Isolation**
    - **Property 20: Category Extension**
    - **Validates: Requirements 14.4, 14.5**

- [x] 14. تطوير مدير إصدارات القوالب

  - [x] 14.1 إنشاء lib/sona/versionManager.ts

    - حفظ الإصدارات
    - استرجاع الإصدارات
    - التراجع
    - المقارنة
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 14.2 كتابة property test للإصدارات
    - **Property 15: Template Version Integrity**
    - **Validates: Requirements 15.3**

- [x] 15. Checkpoint - التأكد من عمل نظام التحكم
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Advanced Features

- [x] 16. تطوير نظام التصدير والاستيراد

  - [x] 16.1 إنشاء lib/sona/exportImportManager.ts

    - تصدير البيانات كـ ZIP
    - استيراد البيانات
    - التحقق من صحة الملفات
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 16.2 كتابة property test للتصدير/الاستيراد
    - **Property 16: Export/Import Round Trip**
    - **Validates: Requirements 16.1, 16.2**

- [x] 17. تطوير نظام Sandbox

  - [x] 17.1 إنشاء lib/sona/sandboxManager.ts

    - إنشاء جلسات sandbox
    - التوليد في sandbox
    - المقارنة مع الإنتاج
    - الترقية للإنتاج
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 17.2 كتابة property test للـ sandbox
    - **Property 17: Sandbox Isolation**
    - **Validates: Requirements 17.2**

- [x] 18. تطوير نظام التحليلات والتسجيل

  - [x] 18.1 إنشاء lib/sona/analytics.ts

    - إحصائيات التوليد
    - تحليل الأداء
    - تحليل الجودة
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [x] 18.2 كتابة property test للتسجيل
    - **Property 19: Logging Completeness**
    - **Validates: Requirements 18.1**

- [x] 19. Checkpoint - التأكد من عمل الميزات المتقدمة
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: API & Integration

- [x] 20. تطوير API endpoints

  - [x] 20.1 إنشاء app/api/sona/generate/route.ts

    - POST /api/sona/generate
    - _Requirements: 19.1, 19.2_

  - [x] 20.2 إنشاء app/api/sona/categories/route.ts

    - GET /api/sona/categories
    - _Requirements: 19.3_

  - [x] 20.3 إنشاء app/api/sona/settings/route.ts

    - GET/PUT /api/sona/settings
    - _Requirements: 19.1, 19.2_

  - [x] 20.4 إنشاء app/api/sona/stats/route.ts

    - GET /api/sona/stats
    - GET /api/sona/analytics
    - _Requirements: 19.4_

  - [x] 20.5 إنشاء app/api/sona/plugins/route.ts

    - GET /api/sona/plugins
    - PUT /api/sona/plugins/:name/toggle
    - _Requirements: 19.1_

  - [x] 20.6 إنشاء app/api/sona/export/route.ts و import/route.ts

    - POST /api/sona/export
    - POST /api/sona/import
    - _Requirements: 16.1, 16.2_

  - [x] 20.7 إنشاء app/api/sona/sandbox/route.ts

    - POST /api/sona/sandbox/create
    - POST /api/sona/sandbox/:id/generate
    - POST /api/sona/sandbox/:id/promote
    - _Requirements: 17.1, 17.2, 17.5_

  - [x] 20.8 كتابة property test للـ API
    - **Property 18: API Response Consistency**
    - **Validates: Requirements 19.5**

- [x] 21. Checkpoint - التأكد من عمل الـ API
  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: Admin UI

- [x] 22. تطوير لوحة تحكم SONA

  - [x] 22.1 إنشاء app/admin/sona/page.tsx

    - لوحة التحكم الرئيسية
    - _Requirements: 13.1_

  - [x] 22.2 إنشاء app/admin/sona/settings/page.tsx

    - صفحة الإعدادات
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 22.3 إنشاء app/admin/sona/templates/page.tsx

    - إدارة القوالب
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 22.4 إنشاء app/admin/sona/plugins/page.tsx

    - إدارة الـ plugins
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 22.5 إنشاء app/admin/sona/analytics/page.tsx

    - لوحة التحليلات
    - _Requirements: 18.3, 18.4, 18.5_

  - [x] 22.6 إنشاء app/admin/sona/sandbox/page.tsx
    - بيئة الاختبار
    - _Requirements: 17.1, 17.3, 17.4, 17.5_

## Phase 9: Integration & Testing

- [x] 23. دمج SONA v4 مع النظام الحالي

  - [x] 23.1 تحديث lib/ai/generator.ts لاستخدام SONA v4

    - استبدال SONA القديم بالجديد
    - _Requirements: All_

  - [x] 23.2 تحديث صفحة إنشاء المقالات لاستخدام الإعدادات الجديدة
    - _Requirements: 13.1_

- [x] 24. اختبارات التكامل النهائية

  - [x] 24.1 اختبار pipeline التوليد الكامل

    - _Requirements: All_

  - [x] 24.2 اختبار تكامل Postgres

    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 24.3 اختبار نظام الـ plugins
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 25. Final Checkpoint - التأكد من عمل النظام بالكامل
  - Ensure all tests pass, ask the user if questions arise.
