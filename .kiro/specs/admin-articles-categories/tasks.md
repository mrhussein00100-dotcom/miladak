# Implementation Plan

- [x] 1. إعداد قاعدة البيانات والجداول الأساسية

  - [x] 1.1 إنشاء جدول المقالات (articles) مع جميع الحقول المطلوبة

    - إنشاء ملف `lib/db/articles.ts` مع schema المقالات
    - إضافة حقول: id, title, slug, content, excerpt, featured_image, category_id, status, meta_title, meta_description, keywords, views, author, ai_provider, publish_date, created_at, updated_at
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 1.2 إنشاء جدول التصنيفات (categories) مع الهيكل الهرمي

    - إنشاء ملف `lib/db/categories.ts` مع schema التصنيفات

    - إضافة حقول: id, name, slug, description, color, icon, parent_id, sort_order, article_count

    - _Requirements: 6.1, 6.2_

  - [ ] 1.3 إنشاء جدول قوالب المولد المحلي (ai_templates)

    - إنشاء ملف `lib/db/templates.ts`

    - إضافة حقول: id, name, category, template_content, variables, min_words, max_words, is_active

    - _Requirements: 3.1.1, 3.1.2_

  - [ ] 1.4 إنشاء جدول قاموس الترجمة (image_translations)
    - إضافة حقول: id, arabic_term, english_terms, context, priority
    - تعبئة القاموس بـ 1000+ مصطلح أساسي
    - _Requirements: 5.1.1, 5.1.2, 5.1.3_
  - [ ] 1.5 إنشاء جداول النشر التلقائي (auto_publish_settings, auto_publish_log)
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 2. إنشاء APIs المقالات والتصنيفات

  - [x] 2.1 إنشاء API المقالات الأساسي

    - إنشاء `app/api/admin/articles/route.ts` (GET للقائمة، POST للإنشاء)
    - دعم الفلترة حسب الحالة والتصنيف والتاريخ
    - دعم البحث في العنوان والمحتوى
    - دعم Pagination
    - _Requirements: 1.1, 1.5, 1.6, 10.1, 10.2_

  - [x] 2.2 إنشاء API المقال الفردي

    - إنشاء `app/api/admin/articles/[id]/route.ts` (GET, PUT, DELETE)
    - دعم الحذف الناعم (soft delete)
    - _Requirements: 1.3, 1.4, 10.3, 10.4_

  - [ ] 2.3 إنشاء API التصنيفات

    - إنشاء `app/api/admin/categories/route.ts` (GET, POST)
    - إنشاء `app/api/admin/categories/[id]/route.ts` (GET, PUT, DELETE)

    - دعم الهيكل الهرمي
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 3. إنشاء مزودي الذكاء الاصطناعي

  - [ ] 3.1 إنشاء مزود Gemini API

    - إنشاء `lib/ai/providers/gemini.ts`
    - دعم توليد المحتوى العربي

    - دعم الأطوال المختلفة (500-5000+ كلمة)

    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 3.2 إنشاء مزود Cohere API (مجاني)
    - إنشاء `lib/ai/providers/cohere.ts`
    - _Requirements: 3.1_
  - [ ] 3.3 إنشاء مزود HuggingFace API (مجاني)

    - إنشاء `lib/ai/providers/huggingface.ts`

    - _Requirements: 3.1_

  - [x] 3.4 إنشاء المولد المحلي المخصص (Local AI)

    - إنشاء `lib/ai/providers/local.ts`
    - إنشاء قوالب عربية لمحتوى أعياد الميلاد والأبراج
    - دعم المتغيرات الديناميكية (التاريخ، العمر، البرج، الأحداث)

    - دمج القوالب لإنشاء مقالات طويلة
    - _Requirements: 3.1.1, 3.1.2, 3.1.3, 3.1.4, 3.9_

  - [ ] 3.5 إنشاء AI Generator الرئيسي مع Fallback
    - إنشاء `lib/ai/generator.ts`
    - تنفيذ سلسلة الـ fallback بين المزودين
    - _Requirements: 3.8_

- [ ] 4. إنشاء نظام إعادة الصياغة

  - [ ] 4.1 إنشاء Rewriter الرئيسي

    - إنشاء `lib/ai/rewriter.ts`

    - دعم الأنماط المختلفة (رسمي، عامي، SEO، مبسط، أكاديمي)
    - معالجة المحتوى الطويل على دفعات
    - _Requirements: 5.2.1, 5.2.2, 5.2.3_

  - [ ] 4.2 إنشاء Local Rewriter

    - استبدال المرادفات
    - إعادة هيكلة الجمل
    - الحفاظ على التنسيق والروابط

    - _Requirements: 5.2.4, 5.2.7_

  - [ ] 4.3 إنشاء API إعادة الصياغة
    - إنشاء `app/api/admin/ai/rewrite/route.ts`
    - _Requirements: 5.2.5, 5.2.6_

- [ ] 5. إنشاء نظام الصور الذكي

  - [ ] 5.1 إنشاء قاموس الترجمة العربي-الإنجليزي
    - إنشاء `lib/images/dictionary.ts`
    - إضافة 1000+ مصطلح متعلق بأعياد الميلاد والأبراج
    - دعم الترجمة السياقية
    - _Requirements: 5.1.1, 5.1.2, 5.1.3, 5.1.4_
  - [x] 5.2 إنشاء مترجم المصطلحات

    - إنشاء `lib/images/translator.ts`

    - ترجمة المصطلحات العربية مع السياق
    - اقتراح مصطلحات بديلة
    - _Requirements: 5.2, 5.3, 5.5, 5.6_

  - [ ] 5.3 إنشاء مزودي الصور

    - إنشاء `lib/images/providers/pexels.ts`
    - إنشاء `lib/images/providers/unsplash.ts`
    - إنشاء `lib/images/providers/pixabay.ts`

    - _Requirements: 5.1_

  - [x] 5.4 إنشاء Image Service الرئيسي

    - إنشاء `lib/images/service.ts`

    - ترتيب النتائج حسب الصلة

    - تحسين الصور

    - _Requirements: 5.4, 5.7_

  - [ ] 5.5 إنشاء API البحث عن الصور

    - إنشاء `app/api/admin/images/search/route.ts`

    - إنشاء `app/api/admin/images/translate/route.ts`
    - _Requirements: 5.1, 5.2_

- [ ] 6. إنشاء APIs توليد المحتوى

  - [ ] 6.1 إنشاء API توليد المقالات

    - إنشاء `app/api/admin/ai/generate/route.ts`

    - دعم اختيار المزود والطول والنمط

    - _Requirements: 3.1, 3.2, 3.3, 10.5_

  - [x] 6.2 إنشاء API توليد الميتا والكلمات المفتاحية

    - إنشاء `app/api/admin/ai/meta/route.ts`

    - توليد meta title و description
    - استخراج الكلمات المفتاحية

    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 6.3 إنشاء API توليد العناوين

    - إنشاء `app/api/admin/ai/titles/route.ts`

    - توليد 10 عناوين محسنة للسيو
    - _Requirements: 3.7_

- [x] 7. إنشاء صفحة قائمة المقالات

  - [ ] 7.1 إنشاء صفحة المقالات الرئيسية

    - إنشاء `app/admin/articles/page.tsx`
    - عرض جدول المقالات مع الأعمدة المطلوبة
    - _Requirements: 1.1_

  - [ ] 7.2 إنشاء مكون قائمة المقالات

    - إنشاء `components/admin/articles/ArticlesList.tsx`
    - دعم الفلترة والبحث
    - دعم Pagination

    - _Requirements: 1.5, 1.6_

  - [ ] 7.3 إضافة أزرار الإجراءات

    - إضافة، تعديل، حذف، معاينة
    - تأكيد الحذف

    - _Requirements: 1.2, 1.3, 1.4_

- [ ] 8. إنشاء محرر المقالات

  - [ ] 8.1 إنشاء صفحة إنشاء مقال جديد
    - إنشاء `app/admin/articles/new/page.tsx`
    - _Requirements: 1.2_
  - [ ] 8.2 إنشاء صفحة تعديل المقال
    - إنشاء `app/admin/articles/[id]/page.tsx`
    - _Requirements: 1.3_
  - [ ] 8.3 إنشاء مكون المحرر الرئيسي
    - إنشاء `components/admin/articles/ArticleEditor.tsx`
    - محرر WYSIWYG مع toolbar كامل
    - _Requirements: 2.1_
  - [ ] 8.4 إنشاء نموذج المقال
    - إنشاء `components/admin/articles/ArticleForm.tsx`
    - حقول: العنوان، المحتوى، التصنيف، الحالة، تاريخ النشر
    - _Requirements: 2.1, 2.5_
  - [ ] 8.5 إضافة الحفظ التلقائي
    - حفظ المسودة كل 30 ثانية
    - _Requirements: 2.3_
  - [ ] 8.6 إنشاء مكون المعاينة

    - إنشاء `components/admin/articles/ArticlePreview.tsx`

    - _Requirements: 2.4_

- [ ] 9. إنشاء لوحة أدوات الذكاء الاصطناعي

  - [x] 9.1 إنشاء لوحة التوليد الرئيسية

    - إنشاء `components/admin/ai/AIGeneratorPanel.tsx`
    - اختيار المزود، الموضوع، الطول، النمط

    - _Requirements: 3.1, 3.2_

  - [x] 9.2 إنشاء مكون اختيار المزود

    - إنشاء `components/admin/ai/ProviderSelector.tsx`

    - عرض المزودين مع حالة (مجاني/مدفوع)
    - _Requirements: 3.1_

  - [ ] 9.3 إنشاء لوحة إعادة الصياغة

    - إنشاء `components/admin/ai/RewritePanel.tsx`

    - عرض النص الأصلي والمعاد صياغته جنباً لجنب
    - _Requirements: 5.2.5_

  - [ ] 9.4 إنشاء مكون توليد الميتا

    - إنشاء `components/admin/ai/MetaGenerator.tsx`
    - توليد وتعديل الميتا والكلمات المفتاحية

    - _Requirements: 4.1, 4.2, 4.5_

- [ ] 10. إنشاء مكونات الصور

  - [ ] 10.1 إنشاء مكون البحث عن الصور
    - إنشاء `components/admin/images/ImageSearch.tsx`
    - بحث بالعربية مع ترجمة تلقائية
    - _Requirements: 5.2, 5.5_
  - [ ] 10.2 إنشاء مكون اختيار الصورة

    - إنشاء `components/admin/images/ImagePicker.tsx`
    - عرض النتائج مع خيارات الاستخدام

    - _Requirements: 5.7_

  - [ ] 10.3 إنشاء مساعد الترجمة
    - إنشاء `components/admin/images/TranslationHelper.tsx`
    - اقتراح مصطلحات إنجليزية بديلة
    - _Requirements: 5.5, 5.6_

- [ ] 11. إنشاء صفحة إدارة التصنيفات

  - [ ] 11.1 إنشاء صفحة التصنيفات
    - إنشاء `app/admin/categories/page.tsx`
    - _Requirements: 6.1_
  - [ ] 11.2 إنشاء مكون شجرة التصنيفات
    - إنشاء `components/admin/categories/CategoryTree.tsx`
    - دعم السحب والإفلات
    - عرض عدد المقالات
    - _Requirements: 6.1, 6.5_
  - [ ] 11.3 إنشاء نموذج التصنيف

    - إنشاء `components/admin/categories/CategoryForm.tsx`

    - حقول: الاسم، الوصف، اللون، الأيقونة، التصنيف الأب

    - _Requirements: 6.2, 6.6_

  - [ ] 11.4 إضافة Color Picker و Icon Picker
    - _Requirements: 6.6_

- [ ] 12. إنشاء نظام النشر التلقائي

  - [ ] 12.1 إنشاء API إعدادات النشر التلقائي
    - إنشاء `app/api/admin/auto-publish/route.ts`
    - _Requirements: 7.2_
  - [ ] 12.2 إنشاء API تشغيل النشر التلقائي
    - إنشاء `app/api/admin/auto-publish/run/route.ts`
    - _Requirements: 7.1, 7.3_
  - [ ] 12.3 إنشاء صفحة إعدادات النشر التلقائي
    - إنشاء `app/admin/auto-publish/page.tsx`
    - إعدادات: الوقت، التكرار، المواضيع، التصنيف، المزود
    - _Requirements: 7.2_
  - [ ] 12.4 إنشاء سجل النشر التلقائي
    - عرض آخر 30 يوم من المقالات المنشورة تلقائياً
    - _Requirements: 7.5_

- [ ] 13. إنشاء نظام الجدولة

  - [ ] 13.1 إضافة دعم الجدولة في نموذج المقال
    - اختيار تاريخ ووقت النشر المستقبلي
    - _Requirements: 8.1_
  - [ ] 13.2 إنشاء عرض التقويم للمقالات المجدولة
    - _Requirements: 8.3_
  - [ ] 13.3 إنشاء Cron Job للنشر المجدول
    - تغيير الحالة تلقائياً عند الوقت المحدد
    - _Requirements: 8.2_

- [ ] 14. تحديث لوحة التحكم الرئيسية

  - [ ] 14.1 إضافة روابط المقالات والتصنيفات
    - تحديث `app/admin/page.tsx`
    - إضافة: إدارة المقالات، إدارة التصنيفات، النشر التلقائي
    - _Requirements: 1.1, 6.1_
  - [ ] 14.2 إضافة إحصائيات سريعة
    - عدد المقالات، التصنيفات، المشاهدات
    - _Requirements: 9.2_

- [ ] 15. اختبارات وتحسينات
  - [ ] 15.1 كتابة اختبارات للـ APIs
    - اختبار CRUD للمقالات والتصنيفات
  - [ ] 15.2 اختبار مزودي الذكاء الاصطناعي
    - اختبار التوليد وإعادة الصياغة
  - [ ] 15.3 اختبار نظام الصور
    - اختبار الترجمة والبحث
