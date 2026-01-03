# Design Document: Historical Events Page Enhancement

## Overview

تحسين صفحة "أحداث تاريخية" لتكون مطابقة لباقي صفحات الأدوات في الموقع. يشمل التحسين إصلاح استدعاء البيانات، إضافة SEO شامل، قسم الكلمات المفتاحية، المقالات ذات الصلة، وتحسين التصميم العام.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Historical Events Page                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SEO Layer                              │   │
│  │  - Metadata (title, description, keywords)               │   │
│  │  - Open Graph tags                                        │   │
│  │  - JSON-LD Structured Data                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Hero Section                           │   │
│  │  - Animated gradient background                          │   │
│  │  - Title and description                                 │   │
│  │  - Statistics cards                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Date Selector Card                       │   │
│  │  - Month dropdown                                        │   │
│  │  - Day input                                             │   │
│  │  - Search filter                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Events Display                           │   │
│  │  - Event cards with year, title, description             │   │
│  │  - Category badges                                       │   │
│  │  - Timeline visualization                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Historical Facts Section                     │   │
│  │  - Interesting facts cards                               │   │
│  │  - Category breakdown                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Related Articles Section                     │   │
│  │  - Article cards (max 6)                                 │   │
│  │  - Link to articles page                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Keywords Section                             │   │
│  │  - Categorized keyword groups                            │   │
│  │  - Search functionality                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Page Component (app/historical-events/page.tsx)

```typescript
// Server component with metadata
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أحداث تاريخية | ميلادك - اكتشف ما حدث في يوم ميلادك',
  description: 'اكتشف الأحداث التاريخية المهمة التي وقعت في يوم ميلادك...',
  keywords: [...], // 20+ keywords
  openGraph: {...},
  alternates: { canonical: 'https://miladak.com/historical-events' }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'أحداث تاريخية - ميلادك',
  // ...
};
```

### 2. Client Component (components/pages/HistoricalEventsPage.tsx)

```typescript
interface HistoricalEventsPageProps {}

interface Event {
  id: number;
  title: string;
  description: string;
  year: number;
  month: number;
  day: number;
  category?: string;
}

interface PageState {
  month: number;
  day: number;
  events: Event[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}
```

### 3. Enhanced Event Card Component

```typescript
interface EnhancedEventCardProps {
  event: Event;
  index: number;
}
```

### 4. Related Articles Section

```typescript
interface RelatedArticlesSectionProps {
  category?: string;
  limit?: number;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}
```

## Data Models

### Event Model

```typescript
interface DailyEvent {
  id: number;
  day: number;
  month: number;
  year: number | null;
  title: string;
  description: string | null;
  category: string;
}
```

### Page Keywords Model

```typescript
interface PageKeywords {
  id: number;
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string[];
  meta_description: string;
}
```

### Article Model

```typescript
interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category_id: number;
  status: string;
  created_at: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Date Selection API Call

_For any_ valid month (1-12) and day (1-31) combination, when the user selects that date, the system SHALL call the Daily_Events_API with the exact month and day parameters.
**Validates: Requirements 1.2**

### Property 2: Events Rendering Completeness

_For any_ array of events returned from the API, the system SHALL render exactly the same number of event cards as events in the array.
**Validates: Requirements 1.3**

### Property 3: Keywords Grouping

_For any_ array of keywords fetched from the database, the system SHALL organize them into categorized groups where each group contains at most 20 keywords.
**Validates: Requirements 3.3**

### Property 4: Articles Display Limit

_For any_ number of related articles available, the system SHALL display at most 6 article cards.
**Validates: Requirements 4.3**

## Error Handling

### API Errors

- Network errors: Display "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى"
- Server errors (500): Display "حدث خطأ في الخادم، يرجى المحاولة لاحقاً"
- Invalid date: Display "التاريخ المحدد غير صالح"

### Empty States

- No events: Display "لا توجد أحداث تاريخية مسجلة لهذا التاريخ"
- No articles: Hide the related articles section
- No keywords: Use default keyword groups

### Loading States

- Initial load: Show skeleton loaders
- Date change: Show spinner in events section
- Articles load: Show skeleton cards

## Testing Strategy

### Unit Tests

- Test metadata generation
- Test date validation
- Test event filtering
- Test keyword grouping logic

### Property-Based Tests

Using Vitest with fast-check for property-based testing:

1. **Date Selection Property Test**

   - Generate random valid dates
   - Verify API is called with correct parameters
   - Minimum 100 iterations

2. **Events Rendering Property Test**

   - Generate random event arrays (0-100 events)
   - Verify correct number of cards rendered
   - Minimum 100 iterations

3. **Keywords Grouping Property Test**

   - Generate random keyword arrays (0-200 keywords)
   - Verify grouping logic (max 20 per group)
   - Minimum 100 iterations

4. **Articles Limit Property Test**
   - Generate random article arrays (0-20 articles)
   - Verify max 6 displayed
   - Minimum 100 iterations

### Integration Tests

- Test full page render with mock API
- Test date selection flow
- Test navigation to search page
- Test navigation to article page

### E2E Tests (Optional)

- Test full user flow from page load to event viewing
- Test responsive design on different viewports
