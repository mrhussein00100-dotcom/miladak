# Implementation Tasks

## Task 1: إنشاء جداول قاعدة البيانات الجديدة

### Description

إنشاء جداول تتبع الصور المستخدمة والقوالب المستخدمة لمنع التكرار.

### Files to Create/Modify

- `lib/db/used-images.ts` - عمليات الصور المستخدمة
- `lib/db/used-templates.ts` - عمليات القوالب المستخدمة

### Acceptance Criteria

- [ ] جدول used_images يتتبع جميع الصور المستخدمة
- [ ] جدول used_templates يتتبع القوالب المستخدمة
- [ ] دوال CRUD لكلا الجدولين
- [ ] فهارس للبحث السريع

---

## Task 2: إنشاء خدمة الكلمات المفتاحية

### Description

إنشاء خدمة للوصول لجدول page_keywords واستخدامه في التوليد والبحث عن الصور.

### Files to Create/Modify

- `lib/db/keywords-service.ts` - خدمة الكلمات المفتاحية

### Acceptance Criteria

- [ ] جلب الكلمات المفتاحية حسب الفئة
- [ ] جلب الكلمات المفتاحية حسب الموضوع
- [ ] ترجمة الكلمات العربية للإنجليزية
- [ ] جلب كلمات عشوائية للتنوع

---

## Task 3: إنشاء نظام القوالب الديناميكية

### Description

إنشاء نظام قوالب ديناميكي مع 1000+ مقدمة، 5000+ قسم، 1000+ خاتمة.

### Files to Create/Modify

- `lib/ai/dynamic-templates.ts` - نظام القوالب الديناميكية
- `data/templates/intros/birthday.json` - قوالب مقدمات عيد الميلاد
- `data/templates/intros/zodiac.json` - قوالب مقدمات الأبراج
- `data/templates/intros/health.json` - قوالب مقدمات الصحة
- `data/templates/intros/pregnancy.json` - قوالب مقدمات الحمل
- `data/templates/intros/general.json` - قوالب مقدمات عامة
- `data/templates/sections/birthday.json` - قوالب أقسام عيد الميلاد
- `data/templates/sections/zodiac.json` - قوالب أقسام الأبراج
- `data/templates/sections/health.json` - قوالب أقسام الصحة
- `data/templates/sections/pregnancy.json` - قوالب أقسام الحمل
- `data/templates/sections/general.json` - قوالب أقسام عامة
- `data/templates/faqs/all-categories.json` - قوالب الأسئلة الشائعة
- `data/templates/conclusions/all-categories.json` - قوالب الخواتيم

### Acceptance Criteria

- [ ] 200+ قالب مقدمة لكل فئة (1000+ إجمالي)
- [ ] 1000+ قالب قسم لكل فئة (5000+ إجمالي)
- [ ] 500+ قالب سؤال شائع
- [ ] 200+ قالب خاتمة لكل فئة (1000+ إجمالي)
- [ ] دعم المتغيرات الديناميكية
- [ ] تتبع القوالب المستخدمة لمنع التكرار

---

## Task 4: إنشاء بوابة الجودة

### Description

إنشاء نظام للتحقق من اكتمال المحتوى وجودته.

### Files to Create/Modify

- `lib/ai/quality-gate.ts` - بوابة الجودة

### Acceptance Criteria

- [ ] التحقق من عدد الكلمات (800-6000 حسب الطول)
- [ ] التحقق من وجود جميع الأقسام
- [ ] التحقق من كثافة الكلمات المفتاحية
- [ ] التحقق من بنية HTML
- [ ] توسيع المحتوى تلقائياً إذا كان ناقصاً
- [ ] إرجاع تقرير جودة مفصل

---

## Task 5: إنشاء مدير الصور الذكي

### Description

إنشاء نظام ذكي لإدارة الصور مع منع التكرار والبحث بالكلمات المفتاحية.

### Files to Create/Modify

- `lib/images/smart-images.ts` - مدير الصور الذكي
- `lib/images/image-tracker.ts` - تتبع الصور المستخدمة

### Acceptance Criteria

- [ ] البحث بالكلمات المفتاحية من قاعدة البيانات
- [ ] منع تكرار الصور (بالـ ID + URL + hash + photographer)
- [ ] تسجيل نقاط الصلة بالموضوع
- [ ] اختيار أفضل الصور تلقائياً
- [ ] حفظ الصور المستخدمة في قاعدة البيانات
- [ ] دعم Pexels + Unsplash

---

## Task 6: إنشاء محسن السيو

### Description

إنشاء نظام لتحسين العناوين والوصف للسيو.

### Files to Create/Modify

- `lib/ai/seo-optimizer.ts` - محسن السيو

### Acceptance Criteria

- [ ] توليد عناوين SEO (50-70 حرف)
- [ ] توليد وصف ميتا (150-160 حرف)
- [ ] استخراج الكلمات المفتاحية من قاعدة البيانات
- [ ] أنماط عناوين متنوعة لكل فئة
- [ ] تحسين للغة العربية

---

## Task 7: إنشاء المحرك المحلي المحسن

### Description

إنشاء محرك توليد محلي متفوق على Gemini و Groq.

### Files to Create/Modify

- `lib/ai/providers/local-enhanced.ts` - المحرك المحلي المحسن

### Acceptance Criteria

- [ ] توليد مقالات 800-6000 كلمة مكتملة
- [ ] استخدام نظام القوالب الديناميكية
- [ ] استخدام الكلمات المفتاحية من قاعدة البيانات
- [ ] توليد في أقل من 2 ثانية
- [ ] لا يفشل أبداً (بدون اعتماد على الشبكة)
- [ ] جودة أفضل من Gemini/Groq للعربية

---

## Task 8: إنشاء المولد الموحد

### Description

إنشاء المولد الموحد الذي يدير جميع المصادر.

### Files to Create/Modify

- `lib/ai/unified-generator.ts` - المولد الموحد

### Acceptance Criteria

- [ ] المحرك المحلي كمصدر أساسي
- [ ] Gemini و Groq كخيارات إضافية
- [ ] إضافة الصور تلقائياً
- [ ] التحقق من الجودة قبل الإرجاع
- [ ] التوافق مع الواجهة الحالية

---

## Task 9: تحديث API التوليد

### Description

تحديث API التوليد لاستخدام النظام الجديد.

### Files to Create/Modify

- `app/api/admin/ai/generate/route.ts` - تحديث API التوليد

### Acceptance Criteria

- [ ] استخدام المولد الموحد الجديد
- [ ] الحفاظ على نفس واجهة الاستجابة
- [ ] دعم جميع الخيارات الحالية
- [ ] إضافة خيارات جديدة (imageCount, category)

---

## Task 10: تحديث نظام النشر التلقائي

### Description

تحديث نظام النشر التلقائي لاستخدام النظام الجديد.

### Files to Create/Modify

- `app/api/admin/auto-publish/run/route.ts` - تحديث النشر التلقائي

### Acceptance Criteria

- [ ] استخدام المولد الموحد الجديد
- [ ] إضافة صور تلقائية غير مكررة
- [ ] تسجيل الصور المستخدمة
- [ ] تسجيل القوالب المستخدمة

---

## Task 11: اختبار النظام الشامل

### Description

إنشاء اختبارات شاملة للنظام الجديد.

### Files to Create/Modify

- `__tests__/ai/unified-generator.test.ts` - اختبارات المولد الموحد
- `__tests__/ai/dynamic-templates.test.ts` - اختبارات القوالب
- `__tests__/ai/quality-gate.test.ts` - اختبارات الجودة
- `__tests__/images/smart-images.test.ts` - اختبارات الصور
- `scripts/test-unified-generator.js` - سكريبت اختبار يدوي

### Acceptance Criteria

- [ ] اختبار توليد مقالات بجميع الأطوال
- [ ] اختبار عدم تكرار الصور
- [ ] اختبار عدم تكرار القوالب
- [ ] اختبار جودة المحتوى
- [ ] اختبار سرعة التوليد

---

## Task 12: توثيق النظام

### Description

إنشاء توثيق شامل للنظام الجديد.

### Files to Create/Modify

- `docs/UNIFIED_GENERATOR_GUIDE.md` - دليل المولد الموحد

### Acceptance Criteria

- [ ] شرح المكونات الرئيسية
- [ ] أمثلة الاستخدام
- [ ] شرح إضافة قوالب جديدة
- [ ] شرح تخصيص الإعدادات
