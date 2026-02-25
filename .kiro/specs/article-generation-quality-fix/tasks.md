# Implementation Plan

## 1. إنشاء Quality Validator

- [x] 1.1 إنشاء ملف lib/sona/qualityValidator.ts

  - إنشاء interface QualityValidationResult
  - إنشاء interface QualityIssue
  - تنفيذ دالة validate الرئيسية
  - _Requirements: 5.1, 5.2_

- [x] 1.2 تنفيذ دالة checkTopicRelevance

  - استخراج الكلمات المفتاحية من المحتوى
  - حساب نسبة الكلمات المفتاحية الموجودة
  - إرجاع درجة الارتباط (0-100)
  - _Requirements: 1.1, 1.2_

- [x] 1.3 تنفيذ دالة checkCompleteness

  - التحقق من وجود المقدمة
  - عد عناوين H2
  - التحقق من وجود الخاتمة
  - التحقق من وجود FAQ للمقالات الطويلة
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 1.4 تنفيذ دالة checkWordCount

  - عد الكلمات في المحتوى
  - مقارنة مع الحدود المطلوبة
  - إرجاع درجة (0-100)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 1.5 تنفيذ دالة checkRepetition

  - تحليل الجمل والفقرات
  - حساب نسبة التكرار
  - إرجاع درجة (0-100)
  - _Requirements: 4.2, 4.4_

- [x] 1.6 كتابة property test للـ Quality Validator
  - **Property 4: Quality Score Threshold**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**

## 2. تحسين Topic Analyzer

- [x] 2.1 تحديث lib/sona/topicAnalyzer.ts

  - إضافة استخراج الكلمات المفتاحية المطلوبة
  - تحسين اكتشاف الفئة
  - إضافة قائمة الأقسام المطلوبة
  - _Requirements: 1.1, 6.5_

- [x] 2.2 تحسين استخراج الكيانات

  - تحسين استخراج الأسماء العربية
  - تحسين استخراج الأعمار
  - تحسين استخراج الأبراج
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2.3 كتابة property test لـ Topic Analyzer
  - **Property 10: Category Detection Accuracy**
  - **Validates: Requirements 6.5**

## 3. إنشاء Word Count Manager

- [x] 3.1 إنشاء ملف lib/sona/wordCountManager.ts

  - تعريف حدود الكلمات لكل طول
  - تنفيذ دالة countWords
  - تنفيذ دالة isWithinLimits
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3.2 تنفيذ دالة expandContent

  - إضافة محتوى إضافي مرتبط بالموضوع
  - استخدام قاعدة المعرفة لإضافة معلومات
  - _Requirements: 3.5_

- [x] 3.3 تنفيذ دالة trimContent

  - تقليص المحتوى مع الحفاظ على الجودة
  - إزالة الفقرات الأقل أهمية
  - _Requirements: 3.6_

- [x] 3.4 كتابة property test لـ Word Count Manager
  - **Property 3: Word Count Within Limits**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## 4. إنشاء Section Manager

- [x] 4.1 إنشاء ملف lib/sona/sectionManager.ts

  - تعريف الأقسام المطلوبة لكل طول
  - تنفيذ دالة checkSections
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4.2 تنفيذ دالة addMissingSection

  - إضافة المقدمة إذا كانت مفقودة
  - إضافة الخاتمة إذا كانت مفقودة
  - إضافة FAQ للمقالات الطويلة
  - _Requirements: 2.5, 2.6_

- [x] 4.3 كتابة property test لـ Section Manager

  - **Property 2: Article Completeness**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6**

- [x] 4.4 كتابة property test لـ FAQ
  - **Property 7: FAQ for Long Articles**
  - **Validates: Requirements 2.4**

## 5. Checkpoint - التأكد من عمل المكونات الأساسية

- [x] 5. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 6. تحديث Content Generator

- [x] 6.1 تحديث lib/sona/contentGenerator.ts

  - دمج Quality Validator
  - دمج Word Count Manager
  - دمج Section Manager
  - _Requirements: 5.1, 5.3_

- [x] 6.2 تنفيذ نظام إعادة المحاولة

  - إعادة التوليد إذا فشل فحص الجودة
  - الحد الأقصى 3 محاولات
  - إرجاع أفضل نتيجة مع تحذير
  - _Requirements: 5.3, 5.4, 8.4_

- [x] 6.3 تحسين توليد المقدمة

  - التأكد من ذكر الموضوع
  - التأكد من ذكر الكيانات المستخرجة
  - _Requirements: 1.4, 6.1, 6.2, 6.3_

- [x] 6.4 تحسين توليد العنوان

  - التأكد من تضمين الموضوع في العنوان
  - التأكد من تضمين الكيانات المهمة
  - _Requirements: 1.4_

- [ ]\* 6.5 كتابة property test لـ Topic Relevance

  - **Property 1: Topic Relevance**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [ ]\* 6.6 كتابة property test لـ Entity Extraction

  - **Property 5: Entity Extraction and Usage**
  - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ]\* 6.7 كتابة property test لـ Title
  - **Property 9: Title Contains Topic**
  - **Validates: Requirements 1.4**

## 7. تحسين معالجة الأخطاء

- [x] 7.1 إضافة معالجة الأخطاء في Topic Analyzer

  - التعامل مع الموضوع الفارغ
  - التعامل مع الموضوع غير الصالح
  - _Requirements: 7.3_

- [x] 7.2 إضافة معالجة الأخطاء في Content Generator

  - التعامل مع فشل تحميل قاعدة المعرفة
  - التعامل مع فشل توليد قسم
  - _Requirements: 7.1, 7.2_

- [x] 7.3 إضافة رسائل خطأ واضحة
  - رسائل خطأ بالعربية
  - تفاصيل كافية للتشخيص
  - _Requirements: 7.5_

## 8. تحسين الأداء

- [x] 8.1 إضافة caching لقاعدة المعرفة

  - تخزين مؤقت للملفات المحملة
  - تحديث عند الحاجة
  - _Requirements: 8.3_

- [x] 8.2 تحسين وقت التوليد

  - تقليل العمليات غير الضرورية
  - تحسين خوارزميات البحث
  - _Requirements: 8.1, 8.2_

- [ ]\* 8.3 كتابة property test للأداء
  - **Property 8: Generation Performance**
  - **Validates: Requirements 8.1, 8.2, 8.4**

## 9. تحديث SONA Provider

- [x] 9.1 تحديث lib/ai/providers/sona.ts

  - استخدام Content Generator المحسّن
  - إرجاع تقرير الجودة
  - _Requirements: 5.5_

- [x] 9.2 تحديث API endpoint
  - إضافة تقرير الجودة في الاستجابة
  - إضافة التحذيرات إذا وجدت
  - _Requirements: 5.5_

## 10. Checkpoint - التأكد من عمل النظام الكامل

- [x] 10. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 11. اختبار التكامل

- [ ]\* 11.1 كتابة property test لـ Repetition

  - **Property 6: No Excessive Repetition**
  - **Validates: Requirements 4.2, 4.4**

- [ ]\* 11.2 كتابة اختبارات تكامل شاملة
  - اختبار توليد مقال كامل
  - اختبار جميع أطوال المقالات
  - اختبار جميع الفئات
  - _Requirements: All_

## 12. Final Checkpoint

- [x] 12. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
