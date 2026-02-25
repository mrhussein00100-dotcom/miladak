# Requirements Document

## Introduction

إصلاح جذري لمشاكل جودة توليد المقالات في نظام SONA. المشاكل الحالية المُبلغ عنها:

1. **النصوص غير محدودة الطول** - المقالات قد تكون قصيرة جداً أو طويلة جداً
2. **المحتوى يختلف عن الموضوع** - المقال المولد لا يرتبط بالموضوع المطلوب
3. **المقالات ناقصة** - أقسام مفقودة أو محتوى غير مكتمل
4. **جودة رديئة** - محتوى عام وغير مفيد

الهدف من هذا الإصلاح هو ضمان أن كل مقال يُولد يكون:

- مرتبطاً 100% بالموضوع المطلوب
- مكتملاً بجميع الأقسام
- ضمن حدود الطول المحددة
- ذو جودة عالية ومحتوى مفيد ومحدد

## Glossary

- **SONA**: Smart Offline Native AI - نظام توليد المقالات المحلي
- **Topic Binding**: ربط المحتوى بالموضوع - ضمان أن كل فقرة تذكر الموضوع
- **Strict Validation**: التحقق الصارم - رفض المحتوى الذي لا يستوفي المعايير
- **Content Anchoring**: تثبيت المحتوى - ربط كل قسم بالموضوع الرئيسي
- **Quality Gate**: بوابة الجودة - نقطة تحقق لا يمر منها إلا المحتوى الجيد
- **Fallback Content**: محتوى احتياطي - محتوى مُعد مسبقاً للحالات الصعبة

## Requirements

### Requirement 1: ربط المحتوى بالموضوع إجبارياً (Topic Binding)

**User Story:** كمدير محتوى، أريد أن يكون كل جزء من المقال مرتبطاً بالموضوع المطلوب، حتى لا أحصل على محتوى عام غير مفيد.

#### Acceptance Criteria

1. WHEN توليد مقدمة THEN THE SONA_System SHALL تضمين الموضوع الكامل في الجملة الأولى
2. WHEN توليد أي قسم H2 THEN THE SONA_System SHALL تضمين كلمة مفتاحية من الموضوع في العنوان
3. WHEN توليد فقرة THEN THE SONA_System SHALL تضمين إشارة للموضوع كل 100 كلمة على الأقل
4. WHEN توليد خاتمة THEN THE SONA_System SHALL إعادة ذكر الموضوع الرئيسي
5. IF المحتوى لا يذكر الموضوع بشكل كافٍ THEN THE SONA_System SHALL إعادة صياغة المحتوى مع إضافة إشارات للموضوع

### Requirement 2: استخراج وتحليل الموضوع بدقة

**User Story:** كمدير محتوى، أريد أن يفهم النظام الموضوع بشكل صحيح ودقيق، حتى يولد محتوى مناسب.

#### Acceptance Criteria

1. WHEN تحليل موضوع يحتوي على اسم شخص THEN THE SONA_System SHALL استخراج الاسم واستخدامه في كل قسم
2. WHEN تحليل موضوع يحتوي على عمر THEN THE SONA_System SHALL استخراج العمر وتخصيص المحتوى له
3. WHEN تحليل موضوع يحتوي على برج THEN THE SONA_System SHALL استخراج البرج وتضمين معلوماته الخاصة
4. WHEN تحليل موضوع THEN THE SONA_System SHALL إنشاء قائمة "كلمات مفتاحية إجبارية" يجب أن تظهر في المحتوى
5. IF الموضوع غير واضح THEN THE SONA_System SHALL طلب توضيح أو إرجاع خطأ واضح

### Requirement 3: التحكم الصارم في طول المقال

**User Story:** كمدير محتوى، أريد أن يكون طول المقال ضمن الحدود المطلوبة بدقة، حتى أحصل على محتوى مناسب.

#### Acceptance Criteria

1. WHEN طلب مقال قصير THEN THE SONA_System SHALL توليد محتوى بين 450-550 كلمة (لا أقل ولا أكثر)
2. WHEN طلب مقال متوسط THEN THE SONA_System SHALL توليد محتوى بين 900-1100 كلمة
3. WHEN طلب مقال طويل THEN THE SONA_System SHALL توليد محتوى بين 1800-2200 كلمة
4. WHEN المحتوى أقل من الحد الأدنى THEN THE SONA_System SHALL إضافة محتوى مرتبط بالموضوع (ليس حشو عام)
5. WHEN المحتوى أكثر من الحد الأقصى THEN THE SONA_System SHALL حذف المحتوى الأقل أهمية مع الحفاظ على الارتباط بالموضوع
6. IF فشل الوصول للطول المطلوب بعد 3 محاولات THEN THE SONA_System SHALL إرجاع أفضل نتيجة مع تحذير

### Requirement 4: ضمان اكتمال الأقسام الإجبارية

**User Story:** كمدير محتوى، أريد أن تكون المقالات مكتملة بجميع أقسامها الأساسية، حتى لا أحصل على مقالات ناقصة.

#### Acceptance Criteria

1. WHEN توليد أي مقال THEN THE SONA_System SHALL تضمين: مقدمة + 3 أقسام H2 على الأقل + خاتمة
2. WHEN توليد مقال طويل THEN THE SONA_System SHALL تضمين قسم أسئلة شائعة (3 أسئلة على الأقل)
3. WHEN توليد مقال THEN THE SONA_System SHALL التحقق من وجود جميع الأقسام قبل الإرجاع
4. IF قسم مفقود THEN THE SONA_System SHALL إضافته تلقائياً بمحتوى مرتبط بالموضوع
5. WHEN إضافة قسم مفقود THEN THE SONA_System SHALL استخدام الموضوع والكيانات المستخرجة في المحتوى

### Requirement 5: بوابة جودة صارمة (Quality Gate)

**User Story:** كمدير محتوى، أريد أن يتم رفض المحتوى الرديء تلقائياً، حتى لا أحصل على مقالات غير مقبولة.

#### Acceptance Criteria

1. WHEN اكتمال توليد المقال THEN THE SONA_System SHALL تشغيل فحص جودة شامل
2. WHEN فحص الجودة THEN THE SONA_System SHALL التحقق من: وجود الكلمات المفتاحية الإجبارية، اكتمال الأقسام، طول المحتوى
3. WHEN درجة ارتباط الموضوع أقل من 80% THEN THE SONA_System SHALL رفض المحتوى وإعادة التوليد
4. WHEN درجة الجودة الإجمالية أقل من 75% THEN THE SONA_System SHALL رفض المحتوى وإعادة التوليد
5. IF فشل التوليد 3 مرات THEN THE SONA_System SHALL استخدام محتوى احتياطي مُعد مسبقاً للموضوع

### Requirement 6: محتوى احتياطي مضمون الجودة (Fallback Content)

**User Story:** كمدير محتوى، أريد أن يكون هناك محتوى احتياطي جيد، حتى لا أحصل على نتائج فارغة أو رديئة.

#### Acceptance Criteria

1. WHEN فشل التوليد العادي THEN THE SONA_System SHALL استخدام قوالب محتوى احتياطية مُعدة مسبقاً
2. WHEN استخدام محتوى احتياطي THEN THE SONA_System SHALL تخصيصه بالاسم والعمر والموضوع المستخرج
3. WHEN استخدام محتوى احتياطي THEN THE SONA_System SHALL إضافة علامة تحذير للمستخدم
4. WHEN توليد محتوى احتياطي THEN THE SONA_System SHALL ضمان أنه يحتوي على الأقسام الأساسية كاملة
5. IF لا يوجد قالب احتياطي مناسب THEN THE SONA_System SHALL إرجاع رسالة خطأ واضحة مع اقتراحات

### Requirement 7: تحسين جودة المحتوى المولد

**User Story:** كمدير محتوى، أريد أن يكون المحتوى مفيداً وغنياً بالمعلومات، حتى يحقق قيمة للقارئ.

#### Acceptance Criteria

1. WHEN توليد فقرة THEN THE SONA_System SHALL التأكد من أنها تحتوي على معلومة مفيدة واحدة على الأقل
2. WHEN توليد قائمة THEN THE SONA_System SHALL التأكد من أن كل عنصر فريد وغير مكرر
3. WHEN توليد محتوى THEN THE SONA_System SHALL تجنب العبارات العامة مثل "هذا الموضوع مهم"
4. WHEN توليد محتوى عن شخص THEN THE SONA_System SHALL استخدام اسمه في كل قسم
5. WHEN توليد محتوى عن عمر THEN THE SONA_System SHALL تضمين معلومات خاصة بهذا العمر

### Requirement 8: تسجيل وتتبع الأخطاء

**User Story:** كمطور، أريد تتبع أسباب فشل التوليد، حتى أتمكن من تحسين النظام.

#### Acceptance Criteria

1. WHEN فشل التوليد THEN THE SONA_System SHALL تسجيل سبب الفشل بالتفصيل
2. WHEN إعادة التوليد THEN THE SONA_System SHALL تسجيل رقم المحاولة وسبب الرفض
3. WHEN استخدام محتوى احتياطي THEN THE SONA_System SHALL تسجيل ذلك مع السبب
4. WHEN نجاح التوليد THEN THE SONA_System SHALL تسجيل درجات الجودة للتحليل
5. WHEN طلب تقرير THEN THE SONA_System SHALL إرجاع إحصائيات عن نسب النجاح والفشل
