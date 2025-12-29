# Implementation Plan

- [x] 1. Create SEO utilities and types

  - [x] 1.1 Create `lib/seo/types.ts` with TypeScript interfaces for sitemap, robots, and JSON-LD schemas

    - Define SitemapEntry, RobotsConfig, AdsEntry interfaces
    - Define ArticleSchema, WebApplicationSchema, OrganizationSchema for JSON-LD
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.2 Create `lib/seo/config.ts` with SEO configuration constants

    - Define BASE_URL, priority values, change frequencies
    - Define default meta tags and structured data templates
    - _Requirements: 1.7_

- [x] 2. Implement Dynamic Sitemap Generator

  - [x] 2.1 Update `app/sitemap.ts` to fetch articles from database

    - Import database utilities
    - Query published articles with slug and updated_at

    - Generate article URLs with correct lastModified dates

    - _Requirements: 1.1, 1.3, 1.6_

  - [x] 2.2 Write property test for sitemap article inclusion

    - **Property 1: Sitemap Completeness**

    - **Validates: Requirements 1.1, 1.3, 1.6**

  - [x] 2.3 Update `app/sitemap.ts` to fetch tools from database

    - Query active tools from tools table

    - Generate tool URLs with appropriate priority (0.8)

    - _Requirements: 1.2, 1.4_

  - [x] 2.4 Write property test for sitemap tool inclusion

    - **Property 2: Tool Inclusion**

    - **Validates: Requirements 1.2, 1.4**

  - [x] 2.5 Add static pages to sitemap

    - Include home, about, privacy, terms, contact, categories, tools listing
    - Assign correct priorities based on page type
    - _Requirements: 1.5, 1.7_

  - [x] 2.6 Write property test for priority assignment

    - **Property 3: Priority Assignment**

    - **Validates: Requirements 1.7**

- [x] 3. Checkpoint - Make sure all tests are passing

  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Enhance Robots.txt Configuration

  - [x] 4.1 Update `app/robots.ts` with comprehensive rules
    - Add rules for Googlebot, Bingbot, and general crawlers
    - Add Disallow for /admin/, /api/, /\_next/, /test-\*
    - Add Allow for public assets and pages
    - Add Crawl-delay directive
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Implement Ads.txt Route

  - [x] 5.1 Create `app/ads.txt/route.ts` for dynamic ads.txt

    - Read ADSENSE_PUBLISHER_ID from environment variables
    - Generate IAB-compliant ads.txt format
    - Return plain text response with correct content-type

    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 5.2 Write property test for ads.txt format compliance
    - **Property 4: Ads.txt Format Compliance**
    - **Validates: Requirements 3.2**
  - [x] 5.3 Write property test for environment variable configuration

    - **Property 5: Environment Variable Configuration**

    - **Validates: Requirements 3.5**

- [x] 6. Checkpoint - Make sure all tests are passing

  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create JSON-LD Components

  - [x] 7.1 Create `lib/seo/jsonld.ts` with schema generators

    - Implement generateArticleSchema function
    - Implement generateWebApplicationSchema function

    - Implement generateOrganizationSchema function

    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 7.2 Create `components/seo/JsonLd.tsx` component

    - Create reusable component for injecting JSON-LD scripts

    - Support multiple schema types
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 8. Integrate JSON-LD into pages

  - [x] 8.1 Add Organization schema to layout.tsx

    - Add JSON-LD script to head section

    - Include site name, logo, and social links

    - _Requirements: 4.5_

  - [x] 8.2 Add Article schema to article pages

    - Update `app/articles/[slug]/page.tsx` with article JSON-LD
    - Include headline, description, dates, author, publisher
    - _Requirements: 4.3_

  - [x] 8.3 Add WebApplication schema to tool pages
    - Update tool page templates with WebApplication JSON-LD
    - Include name, description, category
    - _Requirements: 4.4_

- [x] 9. Add Sitemap Index Support (for large sites)

  - [x] 9.1 Create sitemap splitting logic

    - Check if URLs exceed 50,000 limit
    - Split into multiple sitemap files if needed
    - Generate sitemap index file
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 9.2 Write property test for sitemap size compliance
    - **Property 6: Sitemap Size Compliance**
    - **Validates: Requirements 5.1, 5.3**

- [x] 10. Update Environment Configuration

  - [x] 10.1 Update `.env.example` with new variables

    - Add ADSENSE_PUBLISHER_ID placeholder
    - Add SITE_URL for sitemap base URL
    - Document all SEO-related environment variables

    - _Requirements: 3.5_

- [x] 11. Final Checkpoint - Make sure all tests are passing

  - Ensure all tests pass, ask the user if questions arise.
