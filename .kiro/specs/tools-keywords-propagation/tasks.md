# Implementation Plan

## Phase 1: تحديث صفحات الأدوات الأساسية

- [x] 1. تحديث صفحات أدوات الصحة واللياقة

  - [x] 1.1 تحديث app/tools/bmi-calculator/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 1.2 تحديث app/tools/calorie-calculator/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 1.3 تحديث app/tools/child-growth/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

- [ ] 2. تحديث صفحات أدوات العمر والتواريخ

  - [ ] 2.1 تحديث app/tools/age-in-seconds/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

  - [x] 2.2 تحديث app/tools/basic-age-calculator/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

  - [x] 2.3 تحديث app/tools/relative-age/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 2.4 تحديث app/tools/generation-calculator/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 2.5 تحديث app/tools/life-statistics/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

- [ ] 3. تحديث صفحات أدوات التواريخ والأيام

  - [ ] 3.1 تحديث app/tools/day-of-week/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 3.2 تحديث app/tools/days-between/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

  - [x] 3.3 تحديث app/tools/timezone-calculator/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

## Phase 2: تحديث صفحات أدوات المناسبات والعد التنازلي

- [x] 4. تحديث صفحات أدوات العد التنازلي

  - [ ] 4.1 تحديث app/tools/birthday-countdown/page.tsx

    - إضافة `showKeywords={true}` لـ ToolPageLayout

    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 4.2 تحديث app/tools/event-countdown/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

- [ ] 5. تحديث صفحات أدوات المناسبات والأعياد
  - [ ] 5.1 تحديث app/tools/celebration-planner/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_
  - [ ] 5.2 تحديث app/tools/holidays-calculator/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_
  - [ ] 5.3 تحديث app/tools/islamic-holidays-dates/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

## Phase 3: تحديث صفحات أدوات الحمل والأطفال

- [ ] 6. تحديث صفحات أدوات الحمل والأطفال
  - [ ] 6.1 تحديث app/tools/pregnancy-stages/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_
  - [ ] 6.2 تحديث app/tools/child-age/page.tsx
    - إضافة `showKeywords={true}` لـ ToolPageLayout
    - _Requirements: 1.1, 2.1, 2.2_

## Phase 4: التحقق النهائي

- [ ] 7. Checkpoint - التأكد من عمل جميع الصفحات

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. كتابة اختبارات الخصائص
  - [ ] 8.1 كتابة اختبار Property 1: Keywords Section Renders
    - **Property 1: Keywords Section Renders on All Tool Pages**
    - **Validates: Requirements 1.1, 2.2**
  - [ ] 8.2 كتابة اختبار Property 4: Keyword Click Navigation
    - **Property 4: Keyword Click Navigates to Search**
    - **Validates: Requirements 3.2**
