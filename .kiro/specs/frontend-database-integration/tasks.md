# Implementation Plan

## Phase 1: Core APIs

- [x] 1. Create Chinese Zodiac API

  - [x] 1.1 Create `/app/api/chinese-zodiac/route.ts` with GET handler

    - Implement zodiac calculation function using 12-year cycle formula
    - Support optional year query parameter for filtering
    - Return all zodiac animals when no year specified
    - _Requirements: 3.4, 10.1_

  - [x] 1.2 Write property test for zodiac calculation

    - **Property 1: Chinese Zodiac Calculation Correctness**

    - **Validates: Requirements 1.1, 3.4**

  - [x] 1.3 Create zodiac helper functions in `/lib/calculations/zodiacCalculations.ts`

    - Implement `calculateZodiac(year: number): string`

    - Implement `getZodiacYears(animal: string): number[]`
    - _Requirements: 1.1, 3.2, 3.4_

- [x] 2. Create Daily Events API

  - [x] 2.1 Create `/app/api/daily-events/[month]/[day]/route.ts`

    - Validate month (1-12) and day (1-31) parameters

    - Query database for matching events
    - Return sorted results by year

    - _Requirements: 4.1, 4.2, 10.2_

  - [x] 2.2 Write property test for date filtering

    - **Property 3: Date-Based Query Filtering**

    - **Validates: Requirements 1.5, 1.6, 2.1, 2.2, 4.2, 5.2**

- [ ] 3. Create Daily Birthdays API

  - [x] 3.1 Create `/app/api/daily-birthdays/[month]/[day]/route.ts`

    - Validate month and day parameters
    - Query database for matching celebrities
    - Return sorted results by birth year

    - _Requirements: 5.1, 5.2, 10.3_

- [x] 4. Create Monthly Info API

  - [x] 4.1 Create `/app/api/monthly-info/[month]/route.ts`

    - Validate month parameter (1-12)

    - Query birthstones, birth_flowers, and lucky_colors tables
    - Return combined monthly information

    - _Requirements: 2.3, 10.4_

  - [x] 4.2 Write property test for monthly info lookup
    - **Property 2: Monthly Info Lookup Correctness**
    - **Validates: Requirements 1.2, 1.3, 1.4, 2.3**

- [ ] 5. Create Search API

  - [x] 5.1 Create `/app/api/search/route.ts`

    - Accept query parameter for search term
    - Search across events, celebrities, and articles
    - Return categorized results
    - _Requirements: 4.3, 5.3, 10.5_

  - [x] 5.2 Write property test for search relevance

    - **Property 4: Search Results Relevance**
    - **Validates: Requirements 4.3, 5.3, 10.5**

- [x] 6. Create Random Articles API

  - [x] 6.1 Create `/app/api/random-articles/route.ts`

    - Query random articles from database

    - Return article title, excerpt, and image
    - _Requirements: 8.1, 8.4_

  - [x] 6.2 Write property test for random variability
    - **Property 8: Random Articles Variability**
    - **Validates: Requirements 8.1, 8.2**

- [ ] 7. Checkpoint - Ensure all API tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Enhanced Age Calculator

- [x] 8. Create Enhanced Birthday Info API

  - [ ] 8.1 Update `/app/api/birthday-info/enhanced/route.ts`

    - Accept birthDate parameter

    - Fetch Chinese zodiac for birth year

    - Fetch monthly info for birth month

    - Fetch events and celebrities for birth date
    - Return combined enhanced info
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 9. Create Enhanced Age Calculator Component

  - [x] 9.1 Create `/components/enhanced/EnhancedAgeCalculator.tsx`

    - Display Chinese zodiac with animal and element
    - Display birthstone with properties
    - Display birth flower with meaning
    - Display lucky color
    - Display historical events list
    - Display celebrities list
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ] 9.2 Write property test for data completeness
    - **Property 5: Data Completeness**
    - **Validates: Requirements 4.4, 5.4, 8.4**

- [x] 10. Create Supporting Card Components

  - [x] 10.1 Create `/components/enhanced/ChineseZodiacCard.tsx`

    - Display zodiac animal icon
    - Display element and traits
    - _Requirements: 1.1, 3.3_

  - [x] 10.2 Create `/components/enhanced/BirthstoneCard.tsx`

    - Display stone name and color

    - Display properties
    - _Requirements: 1.2, 6.4_

  - [x] 10.3 Create `/components/enhanced/BirthFlowerCard.tsx`
    - Display flower name
    - Display meaning
    - _Requirements: 1.3, 6.4_
  - [x] 10.4 Create `/components/enhanced/HistoricalEventCard.tsx`
    - Display event title and year
    - Display description
    - _Requirements: 4.4_
  - [x] 10.5 Create `/components/enhanced/CelebrityCard.tsx`
    - Display celebrity name and profession
    - Display birth year
    - _Requirements: 5.4_

## Phase 3: New Pages

- [x] 11. Create Chinese Zodiac Page

  - [x] 11.1 Create `/app/chinese-zodiac/page.tsx`
    - Display all 12 zodiac animals in grid
    - Include zodiac calculator input
    - Display years for each zodiac
    - Display traits and characteristics
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 11.2 Create `/components/pages/ChineseZodiacPage.tsx`

    - Implement zodiac grid layout

    - Implement year calculator

    - Add links to age calculator
    - _Requirements: 3.1, 3.4, 3.5_

- [x] 12. Create Historical Events Page

  - [x] 12.1 Create `/app/historical-events/page.tsx`

    - Display events sorted by date
    - Include month/day filter
    - Include search functionality

    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 12.2 Create `/components/pages/HistoricalEventsPage.tsx`

    - Implement event list with pagination

    - Implement filter controls
    - Implement search input
    - Add links to date detail pages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 12.3 Write property test for sorting
    - **Property 6: Sorting Correctness**
    - **Validates: Requirements 4.1, 5.1**

- [x] 13. Create Celebrities Page

  - [x] 13.1 Create `/app/celebrities/page.tsx`

    - Display celebrities sorted by birth date

    - Include month/day filter
    - Include search functionality

    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 13.2 Create `/components/pages/CelebritiesPage.tsx`

    - Implement celebrity list with pagination
    - Implement filter controls
    - Implement search input

    - Add links to date detail pages
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 14. Create Birthstones and Flowers Page

  - [x] 14.1 Create `/app/birthstones-flowers/page.tsx`
    - Display all 12 months with birthstones
    - Display all 12 months with birth flowers
    - Display lucky colors
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 14.2 Create `/components/pages/BirthstonesFlowersPage.tsx`
    - Implement monthly grid layout
    - Display stone properties and flower meanings
    - Add links to age calculator
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 15. Create Date Detail Page

  - [x] 15.1 Create `/app/date/[month]/[day]/page.tsx`
    - Display all events for the date
    - Display all celebrities for the date
    - Display monthly info
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 15.2 Create `/components/pages/DateDetailPage.tsx`

    - Implement events section
    - Implement celebrities section
    - Implement monthly info section
    - Add related articles links

    - Add age calculator CTA

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 16. Checkpoint - Ensure all page tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Homepage Enhancement

- [x] 17. Create Homepage Sections

  - [x] 17.1 Create `/components/sections/TodayInHistorySection.tsx`
    - Fetch events for current date
    - Display event cards
    - _Requirements: 7.1_
  - [x] 17.2 Create `/components/sections/BornTodaySection.tsx`
    - Fetch celebrities for current date
    - Display celebrity cards
    - _Requirements: 7.2_
  - [x] 17.3 Create `/components/sections/YourChineseZodiacSection.tsx`
    - Display current year zodiac
    - Link to zodiac page
    - _Requirements: 7.3_
  - [x] 17.4 Create `/components/sections/MonthlyGemsSection.tsx`
    - Display current month birthstone and flower
    - Link to birthstones page
    - _Requirements: 7.4_
  - [ ] 17.5 Write property test for homepage date relevance
    - **Property 7: Homepage Current Date Relevance**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 18. Update Random Articles Section

  - [x] 18.1 Update `/components/RandomArticlesSection.tsx`

    - Fetch random articles from API
    - Display article title, excerpt, and image
    - Link to full article
    - _Requirements: 8.1, 8.3, 8.4_

- [ ] 19. Update Homepage Layout

  - [ ] 19.1 Update `/app/page.tsx`

    - Add TodayInHistorySection
    - Add BornTodaySection
    - Add YourChineseZodiacSection
    - Add MonthlyGemsSection
    - Add RandomArticlesSection
    - Add quick links to new pages

    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1_

## Phase 5: SEO Keywords System

- [x] 20. Create SEO Keywords Manager

  - [x] 20.1 Create `/lib/seo/keywords.ts`

    - Define core website keywords (Arabic and English)
    - Define page-specific keywords for each page
    - Define long-tail keywords
    - Include website name "ميلادك"

    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 20.2 Create `/lib/seo/generateKeywords.ts`

    - Implement function to generate 100+ keywords per page
    - Combine core, page-specific, and long-tail keywords
    - _Requirements: 9.1_

  - [ ] 20.3 Write property test for SEO keywords
    - **Property 9: SEO Keywords Completeness**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

- [ ] 21. Apply SEO Keywords to All Pages
  - [ ] 21.1 Update homepage metadata with keywords
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ] 21.2 Update Chinese zodiac page metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.3 Update historical events page metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.4 Update celebrities page metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.5 Update birthstones-flowers page metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.6 Update date detail page metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.7 Update tools pages metadata
    - _Requirements: 9.1, 9.2_
  - [ ] 21.8 Update articles pages metadata
    - _Requirements: 9.1, 9.2_

## Phase 6: API Error Handling & Testing

- [x] 22. Implement API Error Handling

  - [x] 22.1 Create `/lib/api/errorHandler.ts`
    - Define error codes and messages
    - Implement error response formatter
    - _Requirements: 10.6_
  - [ ] 22.2 Update all APIs with error handling
    - Add validation for parameters
    - Return appropriate error responses
    - _Requirements: 10.6_
  - [ ] 22.3 Write property test for error handling
    - **Property 11: API Error Handling**
    - **Validates: Requirements 10.6**

- [x] 23. Implement API Response Serialization

  - [x] 23.1 Create `/lib/api/serializer.ts`
    - Implement JSON serialization helpers
    - Ensure consistent response format
    - _Requirements: 10.7_
  - [ ] 23.2 Write property test for round-trip serialization
    - **Property 10: API Response Round-Trip**
    - **Validates: Requirements 10.7**

- [ ] 24. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: Navigation & Polish

- [x] 25. Update Navigation

  - [x] 25.1 Update `/components/Navbar.tsx`
    - Add links to new pages
    - Add dropdown menu for explore section
    - _Requirements: 7.5_
  - [x] 25.2 Update `/components/Footer.tsx`
    - Add links to new pages
    - _Requirements: 7.5_

- [ ] 26. Final Integration

  - [ ] 26.1 Test all page navigation
    - Verify all links work correctly
    - _Requirements: 2.4, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5_
  - [ ] 26.2 Test responsive design
    - Verify all pages work on mobile
    - _Requirements: All_
  - [ ] 26.3 Performance optimization
    - Add lazy loading for images
    - Implement caching for API responses
    - _Requirements: All_

- [ ] 27. Final Checkpoint - All Tests Pass
  - Ensure all tests pass, ask the user if questions arise.
