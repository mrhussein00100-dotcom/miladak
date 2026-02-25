# Implementation Plan: Sona Quality Enhancement

## Overview

تحسين جذري لنظام Sona لتوليد محتوى عربي احترافي ومتخصص بمستوى يضاهي Groq و Gemini.

## Tasks

- [x] 1. إنشاء محلل الموضوع المحسّن (TopicAnalyzer)

  - [x] 1.1 إنشاء ملف `lib/sona/enhancedTopicAnalyzer.ts`

    - دالة `analyzeTopicDeep()` لتحليل الموضوع بعمق
    - دالة `extractEntities()` لاستخراج الأسماء والتواريخ والأرقام
    - دالة `detectContentType()` لتحديد نوع المحتوى
    - دالة `identifyAudience()` لتحديد الجمهور المستهدف
    - دالة `generateImplicitQuestions()` لاستخراج الأسئلة الضمنية
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]\* 1.2 كتابة property test لمحلل الموضوع
    - **Property 1: استخراج الكيانات**
    - **Validates: Requirements 1.1**

- [x] 2. إنشاء قاعدة المعرفة المتخصصة

  - [x] 2.1 إنشاء ملف `data/sona/knowledge/age-calculator.json`

    - حقائق علمية عن حساب العمر
    - إحصائيات موثقة
    - أمثلة عملية
    - نصائح متخصصة
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 إنشاء ملف `data/sona/knowledge/zodiac-detailed.json`

    - معلومات تفصيلية لكل برج
    - صفات، توافقات، حجر كريم، لون محظوظ
    - نصائح خاصة بكل برج
    - _Requirements: 2.5, 7.2_

  - [x] 2.3 إنشاء ملف `data/sona/knowledge/pregnancy-weeks.json`

    - معلومات طبية لكل أسبوع من الحمل
    - تطور الجنين
    - نصائح للحامل
    - _Requirements: 7.3_

  - [x] 2.4 إنشاء ملف `data/sona/knowledge/birthday-ideas.json`
    - أفكار إبداعية للاحتفال
    - هدايا حسب العمر
    - ديكورات وكعكات
    - _Requirements: 7.4_

- [x] 3. إنشاء باني المحتوى الديناميكي

  - [x] 3.1 إنشاء ملف `lib/sona/dynamicContentBuilder.ts`

    - دالة `buildDynamicStructure()` لبناء هيكل مخصص
    - دالة `generateDynamicIntro()` لمقدمات متنوعة
    - دالة `generateFactsSection()` لقسم الحقائق
    - دالة `generateHowToSection()` لقسم الخطوات
    - دالة `generateTipsSection()` لقسم النصائح
    - دالة `generateExamplesSection()` لقسم الأمثلة
    - دالة `generateFAQSection()` لقسم الأسئلة
    - دالة `generateConclusion()` لخاتمة متنوعة
    - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3_

  - [ ]\* 3.2 كتابة property test لتنوع المحتوى
    - **Property 2: تنوع المحتوى**
    - **Validates: Requirements 3.3**

- [x] 4. إنشاء منوع العبارات

  - [x] 4.1 إنشاء ملف `lib/sona/phraseVariator.ts`

    - قائمة مقدمات متنوعة (50+ مقدمة)
    - قائمة انتقالات متنوعة (30+ انتقال)
    - قائمة خواتيم متنوعة (30+ خاتمة)
    - دالة `getRandomIntro()` للحصول على مقدمة عشوائية
    - دالة `getRandomTransition()` للحصول على انتقال عشوائي
    - دالة `getRandomConclusion()` للحصول على خاتمة عشوائية
    - _Requirements: 3.4, 4.3_

  - [x] 4.2 إنشاء ملف `data/sona/phrases/arabic-expressions.json`
    - تعبيرات عربية أصيلة
    - بدائل للعبارات العامة
    - _Requirements: 4.3_

- [x] 5. إنشاء مدقق الجودة

  - [x] 5.1 إنشاء ملف `lib/sona/enhancedQualityValidator.ts`

    - دالة `checkRepetition()` للتحقق من التكرار
    - دالة `checkVocabularyDiversity()` للتحقق من تنوع المفردات
    - دالة `checkGenericPhrases()` للتحقق من العبارات العامة
    - دالة `checkCoherence()` للتحقق من الترابط
    - دالة `validateContent()` للتحقق الشامل
    - دالة `regenerateWeakSections()` لإعادة توليد الأجزاء الضعيفة
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]\* 5.2 كتابة property test لمدقق الجودة
    - **Property 3: جودة المحتوى**
    - **Validates: Requirements 6.1, 6.2, 6.5**

- [x] 6. تحديث المولد الرئيسي

  - [x] 6.1 إنشاء ملف `lib/sona/enhancedGenerator.ts` (بدلاً من تعديل sona.ts)

    - استخدام TopicAnalyzer المحسّن
    - استخدام قاعدة المعرفة المتخصصة
    - استخدام ContentBuilder الديناميكي
    - استخدام PhraseVariator
    - استخدام QualityValidator
    - _Requirements: جميع المتطلبات_

  - [ ]\* 6.2 كتابة property test للتخصص
    - **Property 4: تخصص المحتوى**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [x] 7. Checkpoint - اختبار شامل

  - ✅ All 502 tests passed successfully

- [x] 8. اختبار التكامل

  - [x] 8.1 اختبار توليد مقال عن حساب العمر

    - ✅ التحقق من جودة المحتوى
    - ✅ التحقق من التخصص
    - _Requirements: 7.1_

  - [x] 8.2 اختبار توليد مقال عن برج الحمل

    - ✅ التحقق من معلومات البرج
    - ✅ التحقق من التوافقات
    - _Requirements: 7.2_

  - [x] 8.3 اختبار توليد مقال عن الحمل

    - ✅ التحقق من المعلومات الطبية
    - _Requirements: 7.3_

  - [x] 8.4 اختبار توليد مقال عن عيد الميلاد
    - ✅ التحقق من الأفكار الإبداعية
    - _Requirements: 7.4_

- [x] 9. Final checkpoint - Ensure all tests pass

  - ✅ All 530 tests passed in 26 test files
  - ✅ Enhanced Generator tests: 14 passed
  - ✅ Enhanced Generator Integration tests: 28 passed
  - ✅ All Sona v4 tests: 530 passed

- [x] 10. إضافة SONA 4.01 إلى لوحة التحكم

  - [x] 10.1 تحديث `lib/ai/generator.ts`

    - ✅ إضافة نوع `sona-enhanced` إلى `AIProvider`
    - ✅ إضافة معلومات SONA 4.01 إلى `PROVIDERS_INFO`
    - ✅ إضافة حالة `sona-enhanced` في `generateArticle()`
    - ✅ إضافة حالة `sona-enhanced` في `rewriteContent()`

  - [x] 10.2 تحديث صفحة إنشاء المقالات

    - ✅ تحديث `app/admin/articles/new/page.tsx`
    - ✅ إضافة SONA 4.01 كخيار افتراضي في قائمة المزودين

  - [x] 10.3 تحديث إعدادات إعادة الصياغة

    - ✅ تحديث `components/admin/rewriter/RewriteSettings.tsx`
    - ✅ إضافة SONA 4.01 في قائمة المزودين

  - [x] 10.4 تحديث الأنواع

    - ✅ تحديث `types/rewriter.ts` لإضافة `sona-enhanced`
    - ✅ إضافة التسمية العربية في `AI_PROVIDER_LABELS`

  - [x] 10.5 تحديث API
    - ✅ تحديث `app/api/admin/ai/generate/route.ts`
    - ✅ إضافة حالة `sona-enhanced` في التحقق من التوفر

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
