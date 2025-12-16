# Requirements Document

## Introduction

هذا المستند يحدد متطلبات إصلاح مشكلة عدم ظهور الصور البارزة في صفحات المقالات. المشكلة تحدث عندما يتم رفع صورة بارزة (featured_image) سواء كانت محلية أو من الإنترنت، حيث لا تظهر الصورة في صفحة المقال المنشور رغم حفظها بشكل صحيح في قاعدة البيانات.

## Glossary

- **Featured Image**: الصورة البارزة التي تظهر في أعلى المقال
- **Article System**: نظام المقالات في التطبيق
- **Image Component**: مكون Next.js Image المستخدم لعرض الصور
- **Public Directory**: مجلد public/uploads حيث يتم حفظ الصور المرفوعة
- **Database**: قاعدة البيانات SQLite التي تحفظ بيانات المقالات

## Requirements

### Requirement 1: عرض الصور البارزة المحلية

**User Story:** كمحرر محتوى، أريد أن تظهر الصور البارزة المرفوعة محلياً في صفحة المقال المنشور، حتى يتمكن القراء من رؤية الصورة المناسبة للمقال

#### Acceptance Criteria

1. WHEN المحرر يرفع صورة بارزة محلية في صفحة التحرير، THEN THE Article System SHALL عرض الصورة في صفحة المقال المنشور
2. WHEN الصورة البارزة محفوظة في مجلد public/uploads، THEN THE Image Component SHALL تحميل الصورة بشكل صحيح
3. WHEN المقال يحتوي على featured_image في قاعدة البيانات، THEN THE Article System SHALL استخدام هذه الصورة بدلاً من image العادية
4. WHEN الصورة المرفوعة تحتوي على أحرف عربية في المسار، THEN THE Image Component SHALL معالجة المسار بشكل صحيح

### Requirement 2: عرض الصور البارزة من الإنترنت

**User Story:** كمحرر محتوى، أريد أن تظهر الصور البارزة من مواقع خارجية (مثل Pexels) في صفحة المقال المنشور، حتى أتمكن من استخدام صور عالية الجودة

#### Acceptance Criteria

1. WHEN المحرر يختار صورة من Pexels كصورة بارزة، THEN THE Article System SHALL عرض الصورة في صفحة المقال المنشور
2. WHEN الصورة البارزة تحتوي على رابط خارجي (https://), THEN THE Image Component SHALL تحميل الصورة من الرابط الخارجي
3. WHEN الرابط الخارجي للصورة غير صالح، THEN THE Article System SHALL عرض صورة افتراضية أو إخفاء قسم الصورة
4. WHEN الصورة من مصدر خارجي، THEN THE Image Component SHALL استخدام إعدادات Next.js الصحيحة للصور الخارجية

### Requirement 3: التعامل مع حالات الصور المختلفة

**User Story:** كمطور، أريد أن يتعامل النظام مع جميع حالات الصور بشكل صحيح، حتى لا تحدث أخطاء في عرض المقالات

#### Acceptance Criteria

1. WHEN المقال يحتوي على featured_image و image، THEN THE Article System SHALL عرض featured_image بالأولوية
2. WHEN المقال يحتوي على featured_image فقط، THEN THE Article System SHALL عرض featured_image
3. WHEN المقال يحتوي على image فقط، THEN THE Article System SHALL عرض image
4. WHEN المقال لا يحتوي على أي صورة، THEN THE Article System SHALL إخفاء قسم الصورة البارزة
5. WHEN مسار الصورة يبدأ بـ /uploads/، THEN THE Image Component SHALL معالجته كصورة محلية

### Requirement 4: تحسين أداء تحميل الصور

**User Story:** كقارئ، أريد أن تحمل الصور البارزة بسرعة وبجودة عالية، حتى أحصل على تجربة قراءة ممتازة

#### Acceptance Criteria

1. WHEN المستخدم يفتح صفحة المقال، THEN THE Image Component SHALL تحميل الصورة البارزة بأولوية عالية (priority)
2. WHEN الصورة البارزة كبيرة الحجم، THEN THE Image Component SHALL تحسين حجم الصورة تلقائياً
3. WHEN المستخدم على جهاز محمول، THEN THE Image Component SHALL تحميل نسخة مناسبة لحجم الشاشة
4. WHEN الصورة تفشل في التحميل، THEN THE Article System SHALL عرض placeholder أو إخفاء قسم الصورة

### Requirement 5: إصلاح إعدادات Next.js للصور الخارجية

**User Story:** كمطور، أريد أن تكون إعدادات Next.js صحيحة للصور الخارجية، حتى لا تحدث أخطاء في التحميل

#### Acceptance Criteria

1. WHEN التطبيق يستخدم صور من Pexels، THEN THE Next.js Config SHALL تضمين images.pexels.com في remotePatterns
2. WHEN التطبيق يستخدم صور من مصادر خارجية أخرى، THEN THE Next.js Config SHALL السماح بتحميلها
3. WHEN المطور يضيف مصدر صور جديد، THEN THE Next.js Config SHALL دعم إضافة مصادر جديدة بسهولة
4. WHEN الصورة من مصدر غير مسموح، THEN THE Image Component SHALL عرض رسالة خطأ واضحة في console
