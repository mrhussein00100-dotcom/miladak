# Design Document: Celebrities Page Enhancement

## Overview

تحسين صفحة المشاهير لتكون مطابقة لصفحة الأحداث التاريخية المحسنة، مع Hero Section جذاب، SEO محسن، كلمات مفتاحية، مقالات ذات صلة، وتصميم عصري.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    app/celebrities/page.tsx                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Metadata + JSON-LD Structured Data                      ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ CelebritiesPageClient Component                         ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ Hero Section (gradient + animations)                │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Statistics Cards                                    │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Date Selector (month + day)                         │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Celebrity Cards Grid                                │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Category Filter                                     │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Facts Section                                       │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Related Articles Section                            │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │ Keywords Section                                    │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Page Component (app/celebrities/page.tsx)

```typescript
// Metadata configuration
export const metadata: Metadata = {
  title: string;           // SEO optimized title
  description: string;     // 150-160 characters
  keywords: string[];      // 25+ keywords
  openGraph: OpenGraph;    // Social sharing
  twitter: Twitter;        // Twitter cards
  alternates: Alternates;  // Canonical URL
};

// JSON-LD Structured Data
const structuredData = {
  '@type': 'WebApplication';
  name: string;
  description: string;
  // ... other schema properties
};
```

### 2. Client Component (components/pages/CelebritiesPage.tsx)

```typescript
interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_year: number;
  month: number;
  day: number;
  image_url?: string;
  nationality?: string;
}

interface CelebritiesPageState {
  month: number;
  day: number;
  celebrities: Celebrity[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
}
```

### 3. Celebrity Card Component

```typescript
interface CelebrityCardProps {
  celebrity: Celebrity;
  index: number; // For staggered animations
}
```

## Data Models

### API Response

```typescript
interface CelebritiesResponse {
  success: boolean;
  data: {
    celebrities: Celebrity[];
    total: number;
    categories: string[];
  };
}
```

### Keywords Data

```typescript
interface KeywordsData {
  toolSlug: string;
  pageType: string;
  keywords: string[];
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system._

### Property 1: Date Selection Updates Display

_For any_ valid month (1-12) and day (1-31) combination, selecting that date SHALL trigger an API call and update the displayed celebrities list.
**Validates: Requirements 1.2**

### Property 2: Celebrities Rendering Completeness

_For any_ API response containing N celebrities, the UI SHALL render exactly N celebrity cards.
**Validates: Requirements 1.3**

### Property 3: Keywords Grouping

_For any_ set of keywords returned from the database, the Keywords_Section SHALL group them by category and display all keywords.
**Validates: Requirements 3.3**

### Property 4: Articles Display Limit

_For any_ number of related articles returned from the API, the Related_Articles_Section SHALL display at most 6 articles.
**Validates: Requirements 4.3**

## Error Handling

1. **API Errors**: Display user-friendly error message with retry option
2. **Empty Results**: Show "لا يوجد مشاهير لهذا التاريخ" message
3. **Loading States**: Show skeleton loaders during data fetch
4. **Network Errors**: Graceful degradation with cached data if available

## Testing Strategy

### Unit Tests

- Test date selection logic
- Test search filtering
- Test category filtering
- Test error handling

### Property-Based Tests (Vitest + fast-check)

- Property 1: Date selection API calls
- Property 2: Celebrities rendering completeness
- Property 3: Keywords grouping
- Property 4: Articles limit

### Integration Tests

- Full page render with mock data
- API integration tests
