# Requirements Document

## Introduction

هذا المستند يحدد متطلبات إصلاح ثلاث مشاكل في واجهة المستخدم:

1. ألوان النصوص في الجزء الأيسر من النافبار (المستخدم والإشعارات وقائمة المستخدم)
2. تنسيق صفحة إعدادات الموبايل في لوحة الإدارة
3. عدم ظهور الأدوات في صفحة "أدوات سريعة" عند الضغط على "إضافة أداة"

## Glossary

- **Navbar**: شريط التنقل العلوي في الموقع
- **FinalNavbar**: مكون النافبار الرئيسي المستخدم حالياً
- **Quick Tools**: الأدوات السريعة التي تظهر في الزر العائم
- **Mobile Settings**: صفحة إعدادات الموبايل في لوحة الإدارة
- **Theme**: المظهر (فاتح/داكن/ميلادك)

## Requirements

### Requirement 1: إصلاح ألوان النصوص في النافبار

**User Story:** كمستخدم، أريد أن تكون النصوص في الجزء الأيسر من النافبار واضحة ومقروءة في جميع الأوضاع (فاتح/داكن/ميلادك)، حتى أتمكن من استخدام الموقع بسهولة.

#### Acceptance Criteria

1. WHEN the user views the navbar in light mode THEN the System SHALL display text in the left section (user menu, notifications) with dark readable colors (#1a202c or similar)
2. WHEN the user views the navbar in dark mode THEN the System SHALL display text in the left section with light readable colors (#f7fafc or similar)
3. WHEN the user views the navbar in miladak mode THEN the System SHALL display text in the left section with white color (#ffffff)
4. WHEN the user hovers over navbar buttons THEN the System SHALL provide visual feedback with appropriate color contrast

### Requirement 2: تنسيق صفحة إعدادات الموبايل

**User Story:** كمدير، أريد أن تكون صفحة إعدادات الموبايل متناسقة ومنظمة، حتى أتمكن من إدارة إعدادات الموبايل بسهولة.

#### Acceptance Criteria

1. WHEN the admin opens the mobile settings page THEN the System SHALL display all sections with consistent spacing and alignment
2. WHEN the admin views the settings cards THEN the System SHALL display them with proper padding and borders
3. WHEN the admin toggles settings THEN the System SHALL provide clear visual feedback for enabled/disabled states
4. WHEN the admin views the page in dark mode THEN the System SHALL maintain proper color contrast and readability

### Requirement 3: إصلاح عرض الأدوات في صفحة أدوات سريعة

**User Story:** كمدير، أريد أن تظهر جميع الأدوات المتاحة عند الضغط على "إضافة أداة"، حتى أتمكن من اختيار الأدوات وإضافتها للقائمة السريعة.

#### Acceptance Criteria

1. WHEN the admin clicks "إضافة أداة" button THEN the System SHALL display a modal with all available tools from the database
2. WHEN the tools are loading THEN the System SHALL display a loading indicator
3. IF the API returns an error THEN the System SHALL display an error message and allow retry
4. WHEN the admin searches for a tool THEN the System SHALL filter the displayed tools based on the search query
5. WHEN a tool is already added THEN the System SHALL mark it as "مضافة" and disable selection
