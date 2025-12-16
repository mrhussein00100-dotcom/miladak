# Requirements Document

## Introduction

هذا المستند يحدد متطلبات إصلاح مشاكل واجهة المستخدم في صفحة الأدوات وأداة محول التاريخ، بالإضافة إلى إضافة رابط صفحة الكلمات المفتاحية في لوحة التحكم.

## Glossary

- **ToolsPageClient**: مكون React الرئيسي لعرض صفحة الأدوات
- **ToolCard**: مكون بطاقة الأداة الفردية
- **DateConverter**: أداة تحويل التاريخ بين الهجري والميلادي
- **ToolPageLayout**: القالب الموحد لصفحات الأدوات
- **Admin Dashboard**: لوحة التحكم الإدارية

## Requirements

### Requirement 1: إصلاح أداة محول التاريخ

**User Story:** كمستخدم، أريد أن تعمل أداة محول التاريخ بشكل صحيح مع التصميم الموحد، حتى أتمكن من استخدامها بنفس جودة الأدوات الأخرى.

#### Acceptance Criteria

1. WHEN a user visits the date-converter page THEN the system SHALL display the tool using ToolPageLayout component with proper imports
2. WHEN the date-converter page loads THEN the system SHALL show Breadcrumbs navigation correctly imported from the components folder
3. WHEN the date-converter page renders THEN the system SHALL display consistent styling matching other tool pages

### Requirement 2: إصلاح عناوين تصنيفات الأدوات

**User Story:** كمستخدم، أريد رؤية أيقونات التصنيفات بشكل صحيح بدلاً من نص، حتى تكون الواجهة جذابة وواضحة.

#### Acceptance Criteria

1. WHEN displaying category headers THEN the system SHALL render proper icon components instead of text strings like "Hearthealth-tools2"
2. WHEN a category has an icon property THEN the system SHALL use the corresponding Lucide icon component
3. WHEN a category icon is missing THEN the system SHALL display a default icon from the getCategoryIcon function

### Requirement 3: توحيد حجم بطاقات الأدوات

**User Story:** كمستخدم، أريد أن تكون جميع بطاقات الأدوات بنفس الارتفاع، حتى تبدو الصفحة منظمة ومتناسقة.

#### Acceptance Criteria

1. WHEN displaying tool cards in grid view THEN the system SHALL render all cards with equal height
2. WHEN a card has longer description THEN the system SHALL truncate the text while maintaining consistent card height
3. WHEN cards are displayed THEN the system SHALL use CSS flex or grid properties to ensure uniform sizing

### Requirement 4: تغيير لون حد البطاقات المميزة

**User Story:** كمستخدم، أريد أن تكون البطاقات المميزة بلون حد مختلف عن الأصفر، حتى تكون أكثر تميزاً وجاذبية.

#### Acceptance Criteria

1. WHEN displaying featured tool cards THEN the system SHALL use a gradient border color instead of yellow
2. WHEN a featured card is rendered THEN the system SHALL apply a purple-to-pink gradient border
3. WHEN hovering over featured cards THEN the system SHALL maintain the distinctive border styling

### Requirement 5: إضافة رابط صفحة الكلمات المفتاحية في لوحة التحكم

**User Story:** كمدير، أريد الوصول لصفحة إدارة الكلمات المفتاحية من لوحة التحكم الرئيسية، حتى أتمكن من إدارتها بسهولة.

#### Acceptance Criteria

1. WHEN an admin visits the admin dashboard THEN the system SHALL display a link to the page-keywords management page
2. WHEN the keywords link is clicked THEN the system SHALL navigate to /admin/page-keywords
3. WHEN displaying the admin navigation THEN the system SHALL show the keywords link with an appropriate icon
