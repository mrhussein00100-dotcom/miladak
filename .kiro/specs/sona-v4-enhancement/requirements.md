# Requirements Document

## Introduction

تحسين جذري لنموذج SONA (Smart Offline Native AI) ليصبح نظام توليد مقالات عربية متكامل وقابل للتوسع غير المحدود. الهدف هو بناء نموذج يعتمد على:

- **بنية معيارية (Modular)** تسمح بتوليد ملايين التركيبات المختلفة
- **قاعدة بيانات خارجية** للمعرفة بدلاً من الكود الثابت
- **مكتبات لغوية عربية** لتحسين جودة النص
- **نظام قوالب قابل للتركيب** لإنتاج محتوى فريد دائماً

## Glossary

- **SONA**: Smart Offline Native AI - نموذج الذكاء الاصطناعي المحلي
- **قاعدة المعرفة**: ملفات JSON منفصلة تحتوي على البيانات والمعلومات
- **القوالب المعيارية**: أجزاء صغيرة قابلة للتركيب (مقدمات، فقرات، خاتمات)
- **التنويع اللغوي**: استخدام مرادفات وأساليب متنوعة عبر مكتبات خارجية
- **المحتوى السياقي**: محتوى يتكيف مع الموضوع المحدد
- **Lazy Loading**: تحميل البيانات عند الحاجة فقط لتقليل استهلاك الذاكرة

## Requirements

### Requirement 1: قاعدة معرفة موسعة ومتخصصة

**User Story:** كمدير محتوى، أريد أن يولد SONA مقالات تحتوي على معلومات حقيقية ومتخصصة، حتى تكون المقالات مفيدة للقراء.

#### Acceptance Criteria

1. WHEN توليد مقال عن موضوع معين THEN THE SONA_System SHALL استخدام قاعدة معرفة تحتوي على 50+ حقيقة متخصصة لكل فئة موضوع
2. WHEN توليد مقال عن الأبراج THEN THE SONA_System SHALL تضمين معلومات فلكية دقيقة وتفصيلية عن كل برج
3. WHEN توليد مقال عن الصحة THEN THE SONA_System SHALL تضمين إحصائيات ومعلومات طبية موثوقة
4. WHEN توليد مقال عن التواريخ THEN THE SONA_System SHALL تضمين أحداث تاريخية حقيقية ومعلومات تقويمية دقيقة
5. WHEN توليد مقال عن أعياد الميلاد THEN THE SONA_System SHALL تضمين تقاليد ثقافية متنوعة وأفكار إبداعية

### Requirement 2: نظام قوالب معيارية قابلة للتركيب (Modular Templates)

**User Story:** كمدير محتوى، أريد نظام قوالب يولد ملايين التركيبات المختلفة، حتى لا تتكرر المقالات أبداً.

#### Acceptance Criteria

1. WHEN توليد مقال THEN THE SONA_System SHALL تركيب المقال من أجزاء منفصلة (مقدمة + أقسام + خاتمة)
2. WHEN توليد مقدمة THEN THE SONA_System SHALL اختيار من 50+ قالب مقدمة قابل للتخصيص
3. WHEN توليد قسم THEN THE SONA_System SHALL اختيار من 100+ قالب فقرة حسب نوع المحتوى
4. WHEN توليد خاتمة THEN THE SONA_System SHALL اختيار من 30+ قالب خاتمة
5. WHEN توليد مقالين عن نفس الموضوع THEN THE SONA_System SHALL إنتاج محتوى مختلف بنسبة 90%+ بسبب التركيبات العشوائية
6. WHEN إضافة قوالب جديدة THEN THE SONA_System SHALL دعم إضافتها عبر ملفات JSON دون تعديل الكود

### Requirement 3: تنويع لغوي وأسلوبي

**User Story:** كمدير محتوى، أريد أن تكون اللغة المستخدمة متنوعة وطبيعية، حتى لا تبدو المقالات آلية.

#### Acceptance Criteria

1. WHEN توليد فقرة THEN THE SONA_System SHALL استخدام مرادفات متنوعة للكلمات الشائعة
2. WHEN توليد جمل THEN THE SONA_System SHALL تنويع طول الجمل بين قصيرة ومتوسطة وطويلة
3. WHEN توليد محتوى THEN THE SONA_System SHALL استخدام أساليب بلاغية متنوعة (استفهام، تعجب، سرد)
4. WHEN توليد قوائم THEN THE SONA_System SHALL تنويع بين القوائم المرقمة والنقطية والوصفية
5. WHEN توليد انتقالات THEN THE SONA_System SHALL استخدام عبارات ربط متنوعة بين الفقرات

### Requirement 4: محتوى سياقي ذكي

**User Story:** كمدير محتوى، أريد أن يفهم SONA سياق الموضوع ويولد محتوى مناسب، حتى تكون المقالات ذات صلة.

#### Acceptance Criteria

1. WHEN تحليل موضوع يحتوي على اسم شخص THEN THE SONA_System SHALL تخصيص المحتوى لهذا الشخص
2. WHEN تحليل موضوع يحتوي على تاريخ THEN THE SONA_System SHALL تضمين معلومات مرتبطة بهذا التاريخ
3. WHEN تحليل موضوع يحتوي على برج معين THEN THE SONA_System SHALL تضمين تفاصيل خاصة بهذا البرج
4. WHEN تحليل موضوع يحتوي على عمر THEN THE SONA_System SHALL تضمين معلومات مناسبة لهذه المرحلة العمرية
5. WHEN تحليل موضوع غير واضح THEN THE SONA_System SHALL توليد محتوى عام شامل ومفيد

### Requirement 5: إثراء المحتوى بعناصر تفاعلية

**User Story:** كمدير محتوى، أريد أن تحتوي المقالات على عناصر تفاعلية ومثيرة، حتى تجذب القراء.

#### Acceptance Criteria

1. WHEN توليد مقال طويل THEN THE SONA_System SHALL تضمين 3+ أسئلة شائعة مع إجاباتها
2. WHEN توليد مقال THEN THE SONA_System SHALL تضمين 5+ نصائح عملية قابلة للتطبيق
3. WHEN توليد مقال THEN THE SONA_System SHALL تضمين إحصائيات ومعلومات مثيرة للاهتمام
4. WHEN توليد مقال THEN THE SONA_System SHALL تضمين روابط داخلية لأدوات ميلادك ذات الصلة
5. WHEN توليد مقال THEN THE SONA_System SHALL تضمين دعوات للعمل (CTA) مناسبة

### Requirement 6: جودة المحتوى وتحسين SEO

**User Story:** كمدير محتوى، أريد أن تكون المقالات محسنة لمحركات البحث، حتى تحصل على ترتيب جيد.

#### Acceptance Criteria

1. WHEN توليد مقال THEN THE SONA_System SHALL تضمين الكلمة المفتاحية الرئيسية 3-5 مرات بشكل طبيعي
2. WHEN توليد مقال THEN THE SONA_System SHALL تضمين كلمات مفتاحية ثانوية ذات صلة
3. WHEN توليد عناوين THEN THE SONA_System SHALL جعل العناوين جذابة ومحسنة للـ SEO
4. WHEN توليد وصف ميتا THEN THE SONA_System SHALL إنشاء وصف فريد وجذاب بين 150-160 حرف
5. WHEN توليد مقال THEN THE SONA_System SHALL تنظيم المحتوى بعناوين H2 و H3 بشكل منطقي

### Requirement 7: مكتبة عبارات وتعبيرات غنية

**User Story:** كمدير محتوى، أريد أن يستخدم SONA تعبيرات عربية غنية ومتنوعة، حتى تكون المقالات أكثر جاذبية.

#### Acceptance Criteria

1. WHEN توليد محتوى THEN THE SONA_System SHALL استخدام مكتبة تحتوي على 500+ تعبير وعبارة عربية
2. WHEN توليد تهنئة THEN THE SONA_System SHALL استخدام 50+ صيغة تهنئة مختلفة
3. WHEN توليد نصيحة THEN THE SONA_System SHALL استخدام 30+ أسلوب لتقديم النصائح
4. WHEN توليد سؤال THEN THE SONA_System SHALL استخدام 20+ صيغة سؤال مختلفة
5. WHEN توليد انتقال THEN THE SONA_System SHALL استخدام 40+ عبارة ربط وانتقال

### Requirement 8: نظام تقييم جودة المحتوى

**User Story:** كمدير محتوى، أريد أن يقيم SONA جودة المحتوى المولد، حتى أضمن مستوى عالي من الجودة.

#### Acceptance Criteria

1. WHEN توليد مقال THEN THE SONA_System SHALL حساب درجة تنوع المحتوى
2. WHEN توليد مقال THEN THE SONA_System SHALL حساب درجة كثافة الكلمات المفتاحية
3. WHEN توليد مقال THEN THE SONA_System SHALL حساب درجة قابلية القراءة
4. WHEN درجة الجودة أقل من 70% THEN THE SONA_System SHALL إعادة توليد المحتوى تلقائياً
5. WHEN توليد مقال THEN THE SONA_System SHALL إرجاع تقرير جودة مع المحتوى

### Requirement 9: بنية ملفات قابلة للتوسع (متوافقة مع Vercel)

**User Story:** كمطور، أريد أن تكون بنية SONA متوافقة مع Vercel وقابلة للتوسع، حتى أتمكن من إضافة محتوى غير محدود.

#### Acceptance Criteria

1. WHEN تخزين قاعدة المعرفة THEN THE SONA_System SHALL استخدام ملفات JSON ثابتة في مجلد data/sona/knowledge/
2. WHEN تخزين القوالب THEN THE SONA_System SHALL استخدام ملفات JSON ثابتة في مجلد data/sona/templates/
3. WHEN تحميل البيانات THEN THE SONA_System SHALL استخدام dynamic import لتحميل الملف المطلوب فقط
4. WHEN حجم ملف واحد يتجاوز 100KB THEN THE SONA_System SHALL تقسيمه إلى ملفات أصغر
5. WHEN إضافة فئة جديدة THEN THE SONA_System SHALL دعم إضافتها بإنشاء ملف JSON جديد ورفعه مع الكود
6. WHEN نشر التحديثات THEN THE SONA_System SHALL تحديث الملفات عبر git push فقط (لا تعديل runtime)

### Requirement 10: استخدام مكتبات لغوية عربية

**User Story:** كمدير محتوى، أريد أن يستخدم SONA مكتبات لغوية متخصصة، حتى يكون المحتوى أكثر طبيعية وتنوعاً.

#### Acceptance Criteria

1. WHEN توليد نص THEN THE SONA_System SHALL استخدام قاموس مرادفات عربي لتنويع الكلمات
2. WHEN توليد جمل THEN THE SONA_System SHALL التحقق من صحة القواعد النحوية الأساسية
3. WHEN توليد أرقام THEN THE SONA_System SHALL تحويلها للصيغة العربية المناسبة
4. WHEN توليد تواريخ THEN THE SONA_System SHALL تنسيقها بالشكل العربي الصحيح
5. WHEN توليد نص THEN THE SONA_System SHALL دعم التشكيل الاختياري للكلمات المهمة

### Requirement 11: نظام إعادة الصياغة الذكي

**User Story:** كمدير محتوى، أريد أن يعيد SONA صياغة أي نص بطرق متعددة، حتى أحصل على محتوى فريد دائماً.

#### Acceptance Criteria

1. WHEN إعادة صياغة جملة THEN THE SONA_System SHALL إنتاج 5+ صياغات مختلفة للجملة الواحدة
2. WHEN إعادة صياغة فقرة THEN THE SONA_System SHALL تغيير ترتيب الأفكار مع الحفاظ على المعنى
3. WHEN إعادة صياغة THEN THE SONA_System SHALL استبدال الكلمات بمرادفاتها المناسبة للسياق
4. WHEN إعادة صياغة THEN THE SONA_System SHALL تغيير صيغة الجمل (من مبني للمعلوم لمبني للمجهول والعكس)
5. WHEN إعادة صياغة THEN THE SONA_System SHALL دمج أو تقسيم الجمل حسب الحاجة

### Requirement 12: تتبع المحتوى المولد (عبر Vercel Postgres)

**User Story:** كمدير محتوى، أريد تتبع المحتوى المولد سابقاً، حتى أتجنب التكرار.

#### Acceptance Criteria

1. WHEN توليد مقال THEN THE SONA_System SHALL حفظ بصمة (hash) للمحتوى في جدول generated_content_hashes في Postgres
2. WHEN توليد مقال جديد THEN THE SONA_System SHALL التحقق من عدم تشابهه مع محتوى سابق بنسبة تزيد عن 50%
3. WHEN اكتشاف تشابه عالي THEN THE SONA_System SHALL إعادة التوليد تلقائياً بقوالب مختلفة
4. WHEN توليد مقال THEN THE SONA_System SHALL تسجيل الموضوع والتاريخ والقوالب المستخدمة في Postgres
5. WHEN طلب إحصائيات THEN THE SONA_System SHALL استعلام Postgres لعرض عدد المقالات ونسبة التنوع

### Requirement 13: نظام تحكم مركزي (Control Panel)

**User Story:** كمدير محتوى، أريد لوحة تحكم لإدارة جميع إعدادات SONA، حتى أتمكن من تخصيص سلوك النظام بسهولة.

#### Acceptance Criteria

1. WHEN فتح لوحة تحكم SONA THEN THE Admin_Panel SHALL عرض جميع الإعدادات القابلة للتعديل
2. WHEN تعديل إعداد THEN THE SONA_System SHALL تطبيق التغيير فوراً دون إعادة نشر
3. WHEN تعديل طول المقال THEN THE SONA_System SHALL قبول قيم (قصير: 500 كلمة، متوسط: 1000 كلمة، طويل: 2000 كلمة)
4. WHEN تعديل نسبة الكلمات المفتاحية THEN THE SONA_System SHALL قبول قيم بين 1% و 5%
5. WHEN تعديل مستوى التنوع THEN THE SONA_System SHALL قبول قيم (منخفض، متوسط، عالي، أقصى)

### Requirement 14: نظام Plugins قابل للتوسيع

**User Story:** كمطور، أريد إضافة وظائف جديدة لـ SONA عبر plugins، حتى أتمكن من توسيع النظام دون تعديل الكود الأساسي.

#### Acceptance Criteria

1. WHEN إنشاء plugin جديد THEN THE SONA_System SHALL توفير واجهة (interface) موحدة للـ plugins
2. WHEN تسجيل plugin THEN THE SONA_System SHALL إضافته تلقائياً لقائمة الـ plugins المتاحة
3. WHEN توليد محتوى THEN THE SONA_System SHALL تنفيذ جميع الـ plugins المفعلة بالترتيب
4. WHEN plugin يفشل THEN THE SONA_System SHALL تجاهله ومتابعة التوليد مع تسجيل الخطأ
5. WHEN إضافة فئة محتوى جديدة THEN THE SONA_System SHALL دعمها عبر plugin دون تعديل الكود الأساسي

### Requirement 15: نظام إصدارات للقوالب (Template Versioning)

**User Story:** كمدير محتوى، أريد إدارة إصدارات القوالب، حتى أتمكن من التراجع عن التغييرات إذا لزم الأمر.

#### Acceptance Criteria

1. WHEN تعديل قالب THEN THE SONA_System SHALL حفظ الإصدار السابق تلقائياً
2. WHEN عرض قالب THEN THE SONA_System SHALL إظهار رقم الإصدار وتاريخ آخر تعديل
3. WHEN طلب التراجع THEN THE SONA_System SHALL استعادة الإصدار السابق للقالب
4. WHEN مقارنة إصدارات THEN THE SONA_System SHALL عرض الفروقات بين الإصدارين
5. WHEN حذف قالب THEN THE SONA_System SHALL نقله للأرشيف بدلاً من الحذف النهائي

### Requirement 16: نظام تصدير واستيراد البيانات

**User Story:** كمدير محتوى، أريد تصدير واستيراد بيانات SONA، حتى أتمكن من النسخ الاحتياطي والنقل بين البيئات.

#### Acceptance Criteria

1. WHEN طلب تصدير THEN THE SONA_System SHALL إنشاء ملف ZIP يحتوي على جميع ملفات JSON
2. WHEN طلب استيراد THEN THE SONA_System SHALL قراءة ملف ZIP ودمج البيانات مع الموجودة
3. WHEN تصدير قوالب THEN THE SONA_System SHALL تضمين metadata (الإصدار، التاريخ، المؤلف)
4. WHEN استيراد بيانات متعارضة THEN THE SONA_System SHALL عرض خيارات (استبدال، دمج، تخطي)
5. WHEN تصدير إحصائيات THEN THE SONA_System SHALL إنشاء تقرير CSV بالمحتوى المولد

### Requirement 17: نظام اختبار وتجريب (Sandbox)

**User Story:** كمدير محتوى، أريد اختبار التغييرات قبل تطبيقها، حتى أتجنب المشاكل في الإنتاج.

#### Acceptance Criteria

1. WHEN فتح وضع الاختبار THEN THE SONA_System SHALL استخدام بيانات منفصلة عن الإنتاج
2. WHEN توليد مقال تجريبي THEN THE SONA_System SHALL عدم حفظه في قاعدة البيانات الرئيسية
3. WHEN اختبار قالب جديد THEN THE SONA_System SHALL عرض معاينة فورية للنتيجة
4. WHEN مقارنة نتائج THEN THE SONA_System SHALL عرض الفرق بين الإعدادات القديمة والجديدة
5. WHEN الموافقة على التغييرات THEN THE SONA_System SHALL نقلها للإنتاج بنقرة واحدة

### Requirement 18: نظام تسجيل وتتبع (Logging & Analytics)

**User Story:** كمدير محتوى، أريد تتبع أداء SONA وتحليل النتائج، حتى أتمكن من تحسين الجودة باستمرار.

#### Acceptance Criteria

1. WHEN توليد مقال THEN THE SONA_System SHALL تسجيل وقت التوليد والقوالب المستخدمة
2. WHEN حدوث خطأ THEN THE SONA_System SHALL تسجيل تفاصيل الخطأ مع stack trace
3. WHEN عرض لوحة التحليلات THEN THE SONA_System SHALL إظهار إحصائيات (عدد المقالات، متوسط الجودة، أكثر القوالب استخداماً)
4. WHEN تحليل الأداء THEN THE SONA_System SHALL تحديد القوالب الأقل جودة للتحسين
5. WHEN تصدير التقارير THEN THE SONA_System SHALL إنشاء تقرير PDF أو Excel بالإحصائيات

### Requirement 19: واجهة برمجة تطبيقات (API) موثقة

**User Story:** كمطور، أريد API موثقة لـ SONA، حتى أتمكن من دمجها مع أنظمة أخرى.

#### Acceptance Criteria

1. WHEN طلب توليد مقال عبر API THEN THE SONA_System SHALL قبول معاملات (الموضوع، الطول، الفئة، الإعدادات)
2. WHEN إرجاع النتيجة THEN THE SONA_System SHALL إرجاع JSON يحتوي على (المحتوى، العنوان، الوصف، الكلمات المفتاحية، درجة الجودة)
3. WHEN طلب قائمة الفئات THEN THE SONA_System SHALL إرجاع جميع الفئات المتاحة مع عدد القوالب لكل فئة
4. WHEN طلب إحصائيات THEN THE SONA_System SHALL إرجاع بيانات الأداء والاستخدام
5. WHEN حدوث خطأ THEN THE SONA_System SHALL إرجاع رسالة خطأ واضحة مع كود HTTP مناسب

### Requirement 20: نظام تحديث تلقائي للمحتوى

**User Story:** كمدير محتوى، أريد أن يحدث SONA قاعدة المعرفة تلقائياً، حتى يبقى المحتوى حديثاً.

#### Acceptance Criteria

1. WHEN إضافة معلومات جديدة THEN THE SONA_System SHALL دمجها مع قاعدة المعرفة الموجودة
2. WHEN اكتشاف معلومات قديمة THEN THE SONA_System SHALL تمييزها للمراجعة
3. WHEN تحديث قاعدة المعرفة THEN THE SONA_System SHALL الحفاظ على التوافق مع القوالب الموجودة
4. WHEN إضافة فئة جديدة THEN THE SONA_System SHALL إنشاء قوالب افتراضية لها تلقائياً
5. WHEN حذف معلومات THEN THE SONA_System SHALL التحقق من عدم استخدامها في قوالب نشطة
