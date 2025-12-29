# Requirements Document

## Introduction

تحسين واجهة صفحة إعادة الصياغة بنقل محتويات النافذة المنبثقة المتقدمة لتصبح هي الواجهة الأساسية للصفحة، مما يوفر تجربة مستخدم أفضل وأكثر سهولة.

## Glossary

- **Rewriter_Page**: صفحة إعادة الصياغة الرئيسية في `/admin/rewriter`
- **Modal_Interface**: النافذة المنبثقة الحالية في `ArticleRewriter.tsx`
- **Main_Interface**: الواجهة الأساسية الجديدة المحسنة
- **Content_Area**: منطقة عرض المحتوى الأصلي والمُعاد صياغته
- **Settings_Panel**: لوحة إعدادات إعادة الصياغة

## Requirements

### Requirement 1

**User Story:** كمستخدم، أريد الوصول إلى جميع خيارات إعادة الصياغة المتقدمة مباشرة في الصفحة الرئيسية، حتى لا أحتاج لفتح نافذة منبثقة.

#### Acceptance Criteria

1. WHEN المستخدم يزور صفحة `/admin/rewriter`، THE Rewriter_Page SHALL عرض واجهة متكاملة تحتوي على جميع الخيارات
2. THE Main_Interface SHALL تحتوي على تبويبات لإدخال المحتوى وجلب من الروابط
3. THE Main_Interface SHALL عرض منطقة المحتوى الأصلي والمُعاد صياغته جنباً إلى جنب
4. THE Settings_Panel SHALL تكون مدمجة في الواجهة الرئيسية وليس في نافذة منبثقة
5. THE Rewriter_Page SHALL الاحتفاظ بجميع الوظائف الموجودة في النافذة المنبثقة

### Requirement 2

**User Story:** كمستخدم، أريد واجهة أكثر تنظيماً وسهولة في الاستخدام، حتى أتمكن من إعادة صياغة المحتوى بكفاءة أكبر.

#### Acceptance Criteria

1. THE Content_Area SHALL عرض المحتوى الأصلي والمُعاد صياغته في أعمدة منفصلة
2. THE Main_Interface SHALL تحتوي على أزرار واضحة للنسخ والحفظ والبدء من جديد
3. WHEN المستخدم يدخل رابط خارجي، THE Rewriter_Page SHALL جلب المحتوى وعرضه في منطقة المعاينة
4. THE Settings_Panel SHALL تكون مرئية ومنظمة بشكل واضح
5. THE Main_Interface SHALL تحتوي على مؤشرات التقدم وحالة العمليات

### Requirement 3

**User Story:** كمستخدم، أريد الاحتفاظ بجميع الخيارات المتقدمة الموجودة حالياً، حتى لا أفقد أي وظيفة مهمة.

#### Acceptance Criteria

1. THE Rewriter_Page SHALL دعم جميع أنماط الكتابة (احترافي، بسيط، إبداعي، أكاديمي)
2. THE Rewriter_Page SHALL دعم جميع خيارات طول المحتوى (أقصر، نفس الطول، أطول)
3. THE Rewriter_Page SHALL دعم جميع نماذج الذكاء الاصطناعي المتاحة
4. THE Rewriter_Page SHALL دعم جلب المحتوى من الروابط الخارجية
5. THE Rewriter_Page SHALL الاحتفاظ بجميع رسائل الخطأ والتحقق من صحة البيانات

### Requirement 4

**User Story:** كمستخدم، أريد تجربة مستخدم محسنة مع تصميم عصري وسريع الاستجابة، حتى أتمكن من العمل براحة على جميع الأجهزة.

#### Acceptance Criteria

1. THE Main_Interface SHALL تكون متجاوبة مع جميع أحجام الشاشات
2. THE Rewriter_Page SHALL استخدام تصميم عصري ومتسق مع باقي النظام
3. WHEN المستخدم ينقر على أي زر، THE Main_Interface SHALL تقديم ردود فعل بصرية فورية
4. THE Content_Area SHALL دعم التمرير المستقل لكل منطقة محتوى
5. THE Main_Interface SHALL تحميل بسرعة وتكون سهلة الاستخدام

### Requirement 5

**User Story:** كمطور، أريد كود منظم وقابل للصيانة، حتى يمكن تطوير الميزات وإصلاح الأخطاء بسهولة.

#### Acceptance Criteria

1. THE Rewriter_Page SHALL استخدام مكونات React منفصلة ومعاد استخدامها
2. THE Main_Interface SHALL تطبيق أفضل الممارسات في TypeScript
3. THE Rewriter_Page SHALL تحتوي على معالجة شاملة للأخطاء
4. THE Main_Interface SHALL استخدام hooks مخصصة للحالة المعقدة
5. THE Rewriter_Page SHALL تكون متوافقة مع النظام الحالي للتصميم والألوان
