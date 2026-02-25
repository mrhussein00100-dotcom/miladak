# Requirements Document

## Introduction

هذا المستند يحدد متطلبات نقل مكون الكلمات المفتاحية (KeywordsSection) إلى جميع صفحات الأدوات في موقع ميلادك. صفحة أداة تحويل التاريخ (date-converter) تم تحسينها وأصبحت نموذجية، والهدف هو تطبيق نفس النمط على جميع صفحات الأدوات الأخرى.

## Glossary

- **KeywordsSection**: مكون React يعرض الكلمات المفتاحية المجلوبة من قاعدة البيانات في شكل أقسام مصنفة
- **ToolPageLayout**: مكون التخطيط الموحد لصفحات الأدوات الذي يدعم عرض الكلمات المفتاحية عبر خاصية `showKeywords`
- **toolSlug**: المعرف الفريد للأداة المستخدم في الروابط وجلب البيانات من قاعدة البيانات
- **page_keywords**: جدول قاعدة البيانات الذي يحتوي على الكلمات المفتاحية لكل صفحة

## Requirements

### Requirement 1

**User Story:** كمستخدم، أريد رؤية كلمات مفتاحية ذات صلة في كل صفحة أداة، حتى أتمكن من اكتشاف مواضيع مشابهة والتنقل بسهولة.

#### Acceptance Criteria

1. WHEN a user visits any tool page THEN the system SHALL display a keywords section below the tool calculator
2. WHEN the keywords section loads THEN the system SHALL fetch keywords from the database using the tool's slug
3. WHEN keywords are fetched successfully THEN the system SHALL display them in categorized groups
4. IF no keywords exist in the database for a tool THEN the system SHALL display default keyword groups

### Requirement 2

**User Story:** كمطور، أريد تفعيل عرض الكلمات المفتاحية بإضافة خاصية واحدة فقط، حتى يكون التحديث سهلاً ومتسقاً.

#### Acceptance Criteria

1. WHEN updating a tool page THEN the developer SHALL add `showKeywords={true}` to the ToolPageLayout component
2. WHEN `showKeywords={true}` is set THEN the ToolPageLayout SHALL render the KeywordsSection component
3. WHEN KeywordsSection renders THEN the system SHALL pass the toolSlug to fetch relevant keywords

### Requirement 3

**User Story:** كمالك الموقع، أريد أن تكون جميع صفحات الأدوات متسقة في التصميم، حتى يحصل المستخدمون على تجربة موحدة.

#### Acceptance Criteria

1. WHEN the keywords section displays THEN the system SHALL use the same styling as the date-converter page
2. WHEN a user clicks on a keyword THEN the system SHALL navigate to the search page with that keyword
3. WHEN the keywords section loads THEN the system SHALL show a loading indicator until data is fetched

## Tools to Update

The following 18 tool pages need to be updated with `showKeywords={true}`:

1. age-in-seconds
2. basic-age-calculator
3. birthday-countdown
4. bmi-calculator
5. calorie-calculator
6. celebration-planner
7. child-age
8. child-growth
9. day-of-week
10. days-between
11. event-countdown
12. generation-calculator
13. holidays-calculator
14. islamic-holidays-dates
15. life-statistics
16. pregnancy-stages
17. relative-age
18. timezone-calculator

Note: date-converter already has `showKeywords={true}` and serves as the reference implementation.
