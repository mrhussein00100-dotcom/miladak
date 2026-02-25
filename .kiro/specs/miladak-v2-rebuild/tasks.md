# Implementation Plan - Miladak V2 Rebuild

## Phase 1: Project Setup and Core Infrastructure

- [x] 1. Initialize Next.js 15 project with TypeScript

  - [-] 1.1 Create new Next.js 15 project with App Router

    - Run `npx create-next-app@latest miladak-v2 --typescript --tailwind --app --src-dir=false`

    - Configure TypeScript strict mode
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Configure Tailwind CSS with RTL support

    - Install tailwindcss-rtl plugin

    - Add Arabic font families (Tajawal, Cairo)

    - Configure custom colors and gradients

    - _Requirements: 7.1, 13.1, 13.5_

  - [x] 1.3 Set up project structure

    - Create directories: components/, lib/, types/, hooks/, **tests**/

    - Create subdirectories for organization
    - _Requirements: 1.4_

  - [x] 1.4 Configure testing framework

    - Install Vitest and fast-check

    - Create vitest.config.ts

    - Set up test utilities
    - _Requirements: Testing Strategy_

- [x] 2. Set up database layer

  - [x] 2.1 Install and configure better-sqlite3
    - Create lib/db/database.ts with connection management
    - Configure WAL mode and cache settings
    - _Requirements: 8.1, 8.2_
  - [x] 2.2 Create database schema

    - Write schema.sql with all tables

    - Create migration script
    - Add indexes for performance
    - _Requirements: 8.4, 16.1, 16.2_

  - [ ] 2.3 Write property test for database JSON fields
    - **Property 15: Database JSON Fields Round-Trip**
    - **Validates: Requirements 8.5**
  - [x] 2.4 Create database initialization script

    - Seed initial data (categories, tools, zodiac info)
    - Import historical data from miladak_base
    - _Requirements: 8.3, 16.3_

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Core Types and Utilities

- [x] 4. Define TypeScript interfaces

  - [x] 4.1 Create core type definitions

    - Define AgeData, LifeStats, Tool, Article interfaces

    - Define ThemeConfig and error types
    - _Requirements: 2.1, 3.1, 4.1_

  - [x] 4.2 Create Arabic formatting utilities

    - Implement formatArabicNumber, formatArabicDate
    - Implement formatArabicDuration, formatArabicOrdinal
    - _Requirements: 7.1, Arabic Support_

  - [ ] 4.3 Write property test for Arabic number formatting

    - Test that formatting preserves numeric value

    - **Validates: Arabic Support**

- [x] 5. Implement age calculation logic

  - [x] 5.1 Create ageCalculations.ts
    - Implement calculateAge function
    - Calculate years, months, days, hours, minutes, seconds
    - _Requirements: 2.1_
  - [x] 5.2 Write property test for age calculation
    - **Property 1: Age Calculation Accuracy**
    - **Validates: Requirements 2.1**
  - [x] 5.3 Implement Hijri date conversion

    - Create hijriConversion.ts

    - Use established algorithm for Gregorian to Hijri
    - _Requirements: 2.2_

  - [ ] 5.4 Write property test for Hijri conversion

    - **Property 2: Hijri Date Conversion Round-Trip**
    - **Validates: Requirements 2.2**

  - [x] 5.5 Implement life statistics calculations
    - Create lifeStats.ts with heartbeats, breaths, etc.
    - _Requirements: 2.3_
  - [ ] 5.6 Write property test for life statistics

    - **Property 3: Life Statistics Consistency**
    - **Validates: Requirements 2.3**

  - [x] 5.7 Implement zodiac sign determination

    - Create zodiacCalculations.ts
    - Western and Chinese zodiac logic
    - _Requirements: 2.4_

  - [x] 5.8 Write property test for zodiac determination
    - **Property 4: Zodiac Sign Determination**
    - **Validates: Requirements 2.4**

- [x] 6. Implement date validation

  - [x] 6.1 Create dateValidation.ts

    - Validate date format and range
    - Check for future dates

    - _Requirements: 2.5_

  - [ ] 6.2 Write property test for invalid date rejection
    - **Property 5: Invalid Date Rejection**
    - **Validates: Requirements 2.5**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Theme System

- [x] 8. Implement 4-theme system

  - [x] 8.1 Create ThemeProvider component
    - Support system, light, dark, miladak themes
    - Persist preference in localStorage
    - _Requirements: 7.2, 13.3.1-13.3.11_
  - [x] 8.2 Write property test for theme preference

    - **Property 14: Theme Preference Round-Trip**
    - **Validates: Requirements 7.5, 7.6, 13.3.9**

  - [ ] 8.3 Create theme CSS variables

    - Define colors for each theme

    - Implement Miladak theme with glassmorphism
    - _Requirements: 13.3.3-13.3.8, 13.4.1-13.4.9_

  - [x] 8.4 Create ThemeToggle component

    - 4-option selector with icons

    - Smooth transition animations
    - _Requirements: 13.3.1, 13.3.2_

## Phase 4: Layout Components

- [x] 9. Create layout components

  - [x] 9.1 Create RootLayout with RTL support

    - Set lang="ar" dir="rtl"
    - Include Arabic fonts
    - _Requirements: 7.1, Arabic Support_

  - [x] 9.2 Create Navbar component
    - Desktop navigation with links
    - Theme toggle integration
    - _Requirements: 15.2_
  - [x] 9.3 Create BottomNav for mobile

    - 5 main navigation items
    - Active state highlighting
    - Hide/show on scroll
    - _Requirements: 14.1.1-14.1.7, 14.5_

  - [x] 9.4 Create Footer component

    - Links to all sections
    - Social media links

    - Copyright info
    - _Requirements: 5.3.4_

## Phase 5: UI Components

- [x] 10. Create base UI components

  - [x] 10.1 Create Button component

    - Gradient backgrounds
    - Hover and press states

    - RTL icon positioning
    - _Requirements: 13.1.7, 13.4.7_

  - [x] 10.2 Create Card component
    - Glassmorphism effect
    - Hover lift animation
    - _Requirements: 13.1.4, 13.2.1-13.2.5_
  - [x] 10.3 Create Input component
    - Arabic placeholder support
    - Validation states
    - _Requirements: 14.9_
  - [x] 10.4 Create Modal component
    - Backdrop blur
    - Slide-up animation for mobile
    - _Requirements: 13.1.6, 14.10_
  - [x] 10.5 Create Skeleton loader
    - Shimmer animation
    - Match content layout
    - _Requirements: 11.3, 13.1.3_

## Phase 6: Homepage and Calculator

- [x] 11. Build homepage

  - [x] 11.1 Create Hero section
    - Animated gradient background
    - Floating particles effect
    - Main headline and tagline
    - _Requirements: 13.1.6, 13.4.4_
  - [x] 11.2 Create AgeCalculator component

    - Date input with validation
    - Calculate button
    - Error display in Arabic

    - _Requirements: 2.1-2.5_

  - [x] 11.3 Create ResultsDisplay component

    - Age breakdown cards
    - Animated counters
    - _Requirements: 2.1, 13.1.9_

  - [x] 11.4 Create LifeStats section
    - Fun statistics display
    - Animated numbers
    - _Requirements: 2.3_
  - [x] 11.5 Create ZodiacSection

    - Western and Chinese zodiac

    - Icons and descriptions
    - _Requirements: 2.4_

  - [x] 11.6 Create FeaturedTools section

    - Display popular tools
    - Link to tools page
    - _Requirements: 15.1, 15.4_

  - [x] 11.7 Create rich content section
    - 1500+ words of Arabic content
    - SEO-optimized text
    - _Requirements: 5.2.1_

- [x] 12. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: API Routes

- [ ] 13. Create API routes

  - [x] 13.1 Create /api/birthday-info route

    - Accept birth date
    - Return age data, zodiac, historical events
    - _Requirements: 2.1-2.4, 19.1-19.3_

  - [x] 13.2 Create /api/tools route

    - List all tools by category
    - Support filtering

    - _Requirements: 3.1_

  - [x] 13.3 Write property test for tools categorization
    - **Property 7: Tools Categorization Completeness**
    - **Validates: Requirements 3.1**
  - [x] 13.4 Create /api/articles route

    - List articles with pagination
    - Category filtering
    - _Requirements: 4.1_

  - [x] 13.5 Write property test for article pagination

    - **Property 10: Article Pagination Consistency**
    - **Validates: Requirements 4.1**

  - [x] 13.6 Create /api/articles/[slug] route

    - Get single article
    - Increment view counter
    - _Requirements: 4.2, 4.4_

## Phase 8: Tools Implementation

- [x] 14. Implement calculator tools

  - [x] 14.1 Create BMI Calculator

    - Height and weight inputs
    - BMI calculation and category

    - _Requirements: 18.3_

  - [ ] 14.2 Write property test for BMI calculation
    - **Property 16: BMI Calculation Accuracy**
    - **Validates: Requirements 18.3**
  - [x] 14.3 Create Calorie Calculator
    - User parameters input
    - Daily calorie calculation
    - _Requirements: 18.4_
  - [ ] 14.4 Write property test for calorie calculation
    - **Property 17: Calorie Calculation Consistency**
    - **Validates: Requirements 18.4**
  - [x] 14.5 Create Days Between Calculator

    - Two date inputs
    - Calculate difference

    - _Requirements: 18.9_

  - [x] 14.6 Write property test for days between

    - **Property 18: Days Between Dates Symmetry**
    - **Validates: Requirements 18.9**

  - [x] 14.7 Create Day of Week Calculator

    - Date input

    - Return day name in Arabic

    - _Requirements: 18.8_

  - [x] 14.8 Write property test for day of week

    - **Property 19: Day of Week Consistency**

    - **Validates: Requirements 18.8**

  - [x] 14.9 Create Birthday Countdown

    - Next birthday calculation

    - Live countdown display
    - _Requirements: 18.2_

  - [x] 14.10 Write property test for countdown

    - **Property 20: Countdown Timer Accuracy**
    - **Validates: Requirements 18.2, 18.10**

- [x] 15. Implement remaining tools

  - [x] 15.1 Create Age in Seconds tool
    - _Requirements: 18.1_
  - [x] 15.2 Create Event Countdown tool
    - _Requirements: 18.10_
  - [x] 15.3 Create Celebration Planner tool
    - _Requirements: 18.5_
  - [x] 15.4 Create Child Age tool

    - _Requirements: 18.6_

  - [x] 15.5 Create Child Growth tool
    - _Requirements: 18.7_
  - [x] 15.6 Create Generation Calculator tool
    - _Requirements: 18.11_
  - [x] 15.7 Create Holidays Calculator tool
    - _Requirements: 18.12_
  - [x] 15.8 Create Islamic Holidays tool
    - _Requirements: 18.13_
  - [x] 15.9 Create Life Statistics tool
    - _Requirements: 18.14_
  - [x] 15.10 Create Pregnancy Stages tool

    - _Requirements: 18.15_

  - [x] 15.11 Create Relative Age tool
    - _Requirements: 18.16_
  - [x] 15.12 Create Timezone Calculator tool

    - _Requirements: 18.17_

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: Tools and Articles Pages

- [x] 17. Create Tools listing page

  - [x] 17.1 Create /tools page with SSG

    - Display tools by category
    - Search and filter functionality
    - _Requirements: 3.1, 5.8_

  - [x] 17.2 Create tool page template

    - Dynamic [slug] route
    - SEO metadata

    - Related tools section
    - _Requirements: 3.2, 5.2.2_

- [x] 18. Create Articles system

  - [x] 18.1 Create /articles page with SSG

    - Article cards with images

    - Category filtering
    - Pagination
    - _Requirements: 4.1, 5.8_

  - [x] 18.2 Create article page template

    - Dynamic [slug] route
    - Full article display

    - Related articles
    - _Requirements: 4.2, 4.3, 5.2.3_

## Phase 10: SEO Implementation

- [x] 19. Implement SEO features

  - [x] 19.1 Create StructuredData component
    - WebSite, Organization schemas
    - WebApplication, FAQPage schemas
    - BreadcrumbList schema
    - _Requirements: 5.2_
  - [ ] 19.2 Write property test for structured data
    - **Property 12: Structured Data JSON-LD Validity**
    - **Property 13: Structured Data Round-Trip**
    - **Validates: Requirements 5.6, 5.7**
  - [x] 19.3 Create MetaTags component
    - Title, description, keywords
    - Open Graph, Twitter Cards
    - _Requirements: 5.1_
  - [x] 19.4 Create Breadcrumbs component

    - Navigation breadcrumbs
    - Structured data integration

    - _Requirements: 5.3.1_

  - [x] 19.5 Generate sitemaps
    - Main sitemap
    - Tools sitemap
    - Articles sitemap
    - _Requirements: 5.3_
  - [x] 19.6 Create robots.txt
    - Crawling directives
    - Sitemap references
    - _Requirements: 5.4_

## Phase 11: AdSense and Analytics

- [x] 20. Implement AdSense integration

  - [x] 20.1 Create AdSenseSlot component
    - Async loading
    - Responsive ad units
    - _Requirements: 6.1, 6.2_
  - [x] 20.2 Add ad placements
    - Header, sidebar, in-content positions
    - Clear separation from content
    - _Requirements: 6.3, 6.4_

- [x] 21. Implement Analytics
  - [x] 21.1 Create GoogleAnalytics component
    - Page view tracking
    - Event tracking
    - _Requirements: 10.2_
  - [ ] 21.2 Create WebVitals tracker
    - Track LCP, FID, CLS
    - Report to analytics
    - _Requirements: 10.1_

## Phase 12: Mobile Experience

- [x] 22. Optimize mobile experience

  - [x] 22.1 Implement touch gestures

    - Swipe navigation
    - Pull to refresh
    - _Requirements: 14.2.1-14.2.6_

  - [ ] 22.2 Create mobile-specific layouts

    - Full-width cards

    - Horizontal scroll sections

    - _Requirements: 14.1, 14.3.1-14.3.5_

  - [ ] 22.3 Implement loading indicators
    - Progress bar
    - Skeleton loaders
    - _Requirements: 11.1-11.5_
  - [x] 22.4 Create WelcomeScreen
    - First-visit animation
    - Skip for returning users
    - _Requirements: 12.1-12.6_

- [ ] 23. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 13: Admin Panel

- [ ] 24. Create admin panel
  - [ ] 24.1 Create admin layout
    - Sidebar navigation
    - Dashboard overview
    - _Requirements: 17.1_
  - [ ] 24.2 Create articles management
    - CRUD operations
    - Rich text editor
    - _Requirements: 17.2, 17.3_
  - [ ] 24.3 Create tools management
    - Enable/disable tools
    - Reorder tools
    - _Requirements: 17.6_
  - [ ] 24.4 Create categories management
    - CRUD for categories
    - _Requirements: 17.5_

## Phase 14: Serialization and Data Handling

- [ ] 25. Implement serialization utilities
  - [ ] 25.1 Create JSON serialization helpers
    - Age data serialization
    - Tool results serialization
    - _Requirements: 2.6, 3.5_
  - [ ] 25.2 Write property test for age data serialization
    - **Property 6: Age Data Serialization Round-Trip**
    - **Validates: Requirements 2.6, 2.7**
  - [ ] 25.3 Write property test for tool data serialization
    - **Property 9: Tool Data Serialization Round-Trip**
    - **Validates: Requirements 3.5**
  - [ ] 25.4 Write property test for article metadata
    - **Property 11: Article Metadata Round-Trip**
    - **Validates: Requirements 4.5**

## Phase 15: Performance Optimization

- [ ] 26. Optimize performance
  - [ ] 26.1 Implement code splitting
    - Dynamic imports for tools
    - Route-based splitting
    - _Requirements: 1.4, 5.1.6_
  - [ ] 26.2 Optimize images
    - next/image configuration
    - WebP/AVIF formats
    - _Requirements: 5.1.4_
  - [ ] 26.3 Configure caching
    - Static asset caching
    - API response caching
    - _Requirements: 1.5_
  - [ ] 26.4 Implement ISR
    - Revalidation for dynamic content
    - _Requirements: 5.9_

## Phase 16: Security and Final Testing

- [x] 27. Implement security measures

  - [x] 27.1 Add security headers
    - HSTS, X-Frame-Options, CSP
    - _Requirements: 9.1_
  - [ ] 27.2 Implement input sanitization
    - Validate all user inputs
    - _Requirements: 9.2_
  - [ ] 27.3 Add cookie consent
    - Privacy compliance
    - _Requirements: 9.3_

- [ ] 28. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 17: Deployment

- [x] 29. Prepare for deployment
  - [x] 29.1 Configure Vercel deployment
    - vercel.json settings
    - Environment variables
    - _Requirements: Deployment Strategy_
  - [ ] 29.2 Run final build
    - Verify SSG pages
    - Check bundle sizes
    - _Requirements: 1.4_
  - [ ] 29.3 Deploy to production
    - Verify all features
    - Monitor Core Web Vitals
    - _Requirements: 1.1-1.3, 5.1.1-5.1.3_
