# Implementation Plan: نظام إعادة الصياغة المتقدم

- [x] 1. إعداد البنية الأساسية والأنواع

  - [x] 1.1 إنشاء ملف الأنواع `types/rewriter.ts` مع جميع الـ interfaces المطلوبة

    - تعريف RewriteSettings, RewriteResult, ExtractedContent, GeneratedImage
    - تعريف أنواع WritingStyle, TargetAudience, ImageStyle
    - _Requirements: 1.1, 3.1, 7.1, 7.2_

  - [ ] 1.2 إنشاء جدول قاعدة البيانات `rewrite_history` في `lib/db/rewriter.ts`
    - إنشاء الجدول مع الفهارس
    - دوال CRUD للسجل (create, getAll, getById, delete)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. إنشاء خدمة استخلاص المحتوى من الروابط

  - [x] 2.1 تثبيت المكتبات المطلوبة (cheerio, @mozilla/readability)

    - _Requirements: 2.1_

  - [ ] 2.2 إنشاء `lib/services/contentExtractor.ts`

    - دالة extractFromUrl لجلب وتحليل HTML
    - دالة cleanHtml لإزالة الإعلانات والعناصر غير المرغوبة

    - دالة extractMetadata لاستخراج البيانات الوصفية

    - معالجة الأخطاء للروابط غير الصالحة
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. إنشاء خدمة إعادة الصياغة المتعددة

  - [ ] 3.1 إنشاء `lib/services/multiModelRewriter.ts`

    - دالة rewriteWithModels للمعالجة المتوازية
    - دالة buildPrompt لبناء prompts مخصصة حسب النمط والجمهور
    - دعم جميع النماذج (Gemini, Groq, Cohere, HuggingFace, Local)

    - _Requirements: 1.2, 1.4, 3.1, 3.2, 7.3, 7.4_

  - [ ] 3.2 إنشاء `lib/services/qualityAnalyzer.ts`

    - دالة calculateReadability لحساب قابلية القراءة
    - دالة calculateUniqueness لحساب نسبة التفرد

    - دالة calculateSEOScore لحساب درجة SEO

    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4. إنشاء APIs الخلفية

  - [ ] 4.1 إنشاء `/api/admin/ai/extract-content/route.ts`

    - استقبال الرابط واستخلاص المحتوى

    - إرجاع المحتوى المنظف مع البيانات الوصفية

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 4.2 إنشاء `/api/admin/ai/rewrite-advanced/route.ts`

    - استقبال النص والإعدادات

    - معالجة متوازية مع جميع النماذج المختارة

    - حساب درجات الجودة
    - حفظ في السجل
    - _Requirements: 1.3, 1.4, 3.2, 3.3, 6.1, 6.2_

  - [ ] 4.3 إنشاء `/api/admin/ai/generate-titles/route.ts`

    - توليد عناوين بديلة للمحتوى

    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 4.4 إنشاء `/api/admin/ai/extract-keywords/route.ts`
    - استخراج الكلمات المفتاحية من المحتوى
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 5. إنشاء مكونات الواجهة الأساسية

  - [ ] 5.1 إنشاء صفحة `/app/admin/rewriter/page.tsx`
    - هيكل الصفحة مع Tabs (نص / رابط / سجل)
    - إدارة الحالة المشتركة
    - _Requirements: 1.1, 2.4_
  - [ ] 5.2 إنشاء `components/admin/rewriter/RewriteSettings.tsx`

    - اختيار النماذج (checkboxes)
    - تحديد عدد الكلمات (slider)

    - اختيار النمط والجمهور (selects)

    - خيارات توليد الصور
    - _Requirements: 1.2, 1.3, 4.1, 4.2, 7.1, 7.2_

- [ ] 6. إنشاء مكون إعادة الصياغة من النص

  - [ ] 6.1 إنشاء `components/admin/rewriter/TextRewriter.tsx`

    - حقل إدخال العنوان
    - حقل إدخال المحتوى (textarea كبير)
    - عداد الكلمات والحروف في الوقت الفعلي

    - زر إعادة الصياغة مع حالة التحميل

    - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ] 7. إنشاء مكون إعادة الصياغة من الرابط

  - [ ] 7.1 إنشاء `components/admin/rewriter/UrlRewriter.tsx`

    - حقل إدخال الرابط
    - زر استخلاص المحتوى
    - معاينة المحتوى المستخلص
    - خيار تعديل المحتوى قبل إعادة الصياغة

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8. إنشاء مكون مقارنة النتائج

  - [-] 8.1 إنشاء `components/admin/rewriter/ResultsComparison.tsx`

    - عرض النتائج جنباً إلى جنب
    - عرض درجات الجودة لكل نتيجة

    - تمييز الاختلافات عن النص الأصلي

    - أزرار (نسخ، نقل للمحرر، إعادة توليد)
    - _Requirements: 3.2, 3.3, 3.4, 6.1, 6.2, 6.3_

  - [x] 8.2 إنشاء `components/admin/rewriter/QualityMetrics.tsx`

    - عرض درجة الجودة الإجمالية

    - عرض قابلية القراءة

    - عرض نسبة التفرد

    - عرض درجة SEO

    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9. إنشاء مكون توليد الصور

  - [ ] 9.1 إنشاء `components/admin/rewriter/ImageGenerator.tsx`
    - اختيار عدد الصور
    - اختيار نمط الصور
    - عرض الصور المولدة كـ thumbnails
    - خيار إعادة توليد صورة معينة
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. إنشاء مكون سجل العمليات

  - [ ] 10.1 إنشاء `components/admin/rewriter/RewriteHistory.tsx`
    - قائمة بآخر 100 عملية
    - فلترة حسب نوع المصدر (نص/رابط)
    - استعادة عملية سابقة
    - حذف عملية
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 11. تنفيذ النقل إلى صفحة إنشاء المقال

  - [ ] 11.1 إنشاء `lib/utils/articleTransfer.ts`
    - دالة لتحويل RewriteResult إلى بيانات المقال
    - حفظ البيانات في sessionStorage
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ] 11.2 تعديل `/app/admin/articles/new/page.tsx` لاستقبال البيانات المنقولة
    - قراءة البيانات من sessionStorage
    - ملء الحقول تلقائياً
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 12. إضافة رابط في لوحة التحكم

  - [ ] 12.1 تحديث قائمة التنقل في لوحة التحكم لإضافة رابط "إعادة الصياغة"
    - _Requirements: 1.1_

- [ ] 13. اختبارات الوحدة
  - [ ] 13.1 اختبارات ContentExtractor
  - [ ] 13.2 اختبارات MultiModelRewriter
  - [ ] 13.3 اختبارات QualityAnalyzer
