# Design Document: Frontend Database Integration

## Overview

هذا التصميم يوضح كيفية تكامل الواجهة الأمامية لموقع ميلادك مع قاعدة البيانات الجديدة التي تحتوي على 4,115 سجل في 15 جدول. يشمل التصميم إنشاء صفحات جديدة، تحسين حاسبة العمر، إضافة APIs، ونظام SEO شامل.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Pages                    │  Components                      │
│  ├── /                    │  ├── EnhancedAgeCalculator      │
│  ├── /chinese-zodiac      │  ├── ChineseZodiacCard          │
│  ├── /historical-events   │  ├── HistoricalEventCard        │
│  ├── /celebrities         │  ├── CelebrityCard              │
│  ├── /birthstones-flowers │  ├── BirthstoneCard             │
│  └── /date/[month]/[day]  │  ├── RandomArticlesSection      │
│                           │  └── SEO/KeywordsManager        │
├─────────────────────────────────────────────────────────────┤
│                        API Layer                             │
│  ├── /api/chinese-zodiac                                    │
│  ├── /api/daily-events/[month]/[day]                        │
│  ├── /api/daily-birthdays/[month]/[day]                     │
│  ├── /api/monthly-info/[month]                              │
│  ├── /api/search                                            │
│  └── /api/random-articles                                   │
├─────────────────────────────────────────────────────────────┤
│                    Database (SQLite)                         │
│  ├── chinese_zodiac (201 records)                           │
│  ├── daily_events (1,830 records)                           │
│  ├── daily_birthdays (1,830 records)                        │
│  ├── birthstones (12 records)                               │
│  ├── birth_flowers (12 records)                             │
│  ├── lucky_colors (12 records)                              │
│  └── articles (47 records)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Enhanced Age Calculator Component

```typescript
interface EnhancedBirthInfo {
  chineseZodiac: {
    animal: string;
    element: string;
    traits: string[];
    description: string;
  };
  birthstone: {
    name: string;
    properties: string;
    color: string;
  };
  birthFlower: {
    name: string;
    meaning: string;
  };
  luckyColor: {
    color: string;
    meaning: string;
  };
  historicalEvents: Array<{
    title: string;
    description: string;
    year: number;
  }>;
  celebrities: Array<{
    name: string;
    profession: string;
    birthYear: number;
  }>;
}
```

### 2. Chinese Zodiac Component

```typescript
interface ChineseZodiacInfo {
  id: number;
  animal: string;
  element: string;
  years: number[];
  traits: string[];
  compatibility: string[];
  description: string;
}

function calculateZodiac(year: number): string {
  const animals = [
    'الفأر',
    'الثور',
    'النمر',
    'الأرنب',
    'التنين',
    'الأفعى',
    'الحصان',
    'الماعز',
    'القرد',
    'الديك',
    'الكلب',
    'الخنزير',
  ];
  return animals[(year - 4) % 12];
}
```

### 3. SEO Keywords Manager

```typescript
interface SEOKeywords {
  pageSpecific: string[];
  coreKeywords: string[];
  websiteName: string;
  arabicKeywords: string[];
  englishKeywords: string[];
  longTailKeywords: string[];
}

interface PageSEOConfig {
  pageName: string;
  keywords: SEOKeywords;
  totalKeywordsCount: number; // Must be >= 100
}
```

## Data Models

### Chinese Zodiac Model

```typescript
interface ChineseZodiac {
  id: number;
  animal: string;
  animal_en: string;
  element: string;
  year: number;
  traits: string;
  description: string;
}
```

### Daily Event Model

```typescript
interface DailyEvent {
  id: number;
  month: number;
  day: number;
  title: string;
  description: string;
  year: number;
  category: string;
}
```

### Daily Birthday Model

```typescript
interface DailyBirthday {
  id: number;
  month: number;
  day: number;
  name: string;
  profession: string;
  birth_year: number;
  description: string;
}
```

### Monthly Info Model

```typescript
interface MonthlyInfo {
  month: number;
  birthstone: {
    name: string;
    properties: string;
    color: string;
  };
  birthFlower: {
    name: string;
    meaning: string;
  };
  luckyColor: {
    color: string;
    meaning: string;
  };
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Chinese Zodiac Calculation Correctness

_For any_ valid year between 1900 and 2100, the zodiac calculation function SHALL return the correct animal based on the 12-year cycle formula: `animals[(year - 4) % 12]`
**Validates: Requirements 1.1, 3.4**

### Property 2: Monthly Info Lookup Correctness

_For any_ month number between 1 and 12, the monthly info lookup SHALL return the correct birthstone, birth flower, and lucky color for that specific month
**Validates: Requirements 1.2, 1.3, 1.4, 2.3**

### Property 3: Date-Based Query Filtering

_For any_ date query with month M and day D, all returned events and celebrities SHALL have month equal to M and day equal to D
**Validates: Requirements 1.5, 1.6, 2.1, 2.2, 4.2, 5.2**

### Property 4: Search Results Relevance

_For any_ search query Q, all returned results (events, celebrities, articles) SHALL contain the search term Q in at least one searchable field (title, name, description, or profession)
**Validates: Requirements 4.3, 5.3, 10.5**

### Property 5: Data Completeness

_For any_ returned event object, it SHALL contain non-empty title, description, and year fields. _For any_ returned celebrity object, it SHALL contain non-empty name, profession, and birth date fields
**Validates: Requirements 4.4, 5.4, 8.4**

### Property 6: Sorting Correctness

_For any_ list of events or celebrities returned with sorting enabled, the list SHALL be ordered by date (month, then day) in ascending order
**Validates: Requirements 4.1, 5.1**

### Property 7: Homepage Current Date Relevance

_For any_ homepage request, the "Today in History" events and "Born Today" celebrities SHALL match the current system date's month and day
**Validates: Requirements 7.1, 7.2**

### Property 8: Random Articles Variability

_For any_ two consecutive requests for random articles, the probability of receiving identical article sets SHALL be less than 10% (assuming sufficient articles in database)
**Validates: Requirements 8.1, 8.2**

### Property 9: SEO Keywords Completeness

_For any_ rendered page, the meta keywords SHALL contain at least 100 keywords, including the website name "ميلادك", page-specific keywords, and both Arabic and English variations
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

### Property 10: API Response Round-Trip

_For any_ valid API response object, serializing to JSON and deserializing back SHALL produce an equivalent object
**Validates: Requirements 10.7**

### Property 11: API Error Handling

_For any_ invalid API request (invalid month > 12, invalid day > 31, empty search query), the API SHALL return an error response with appropriate HTTP status code (400 or 404) and error message
**Validates: Requirements 10.6**

## Error Handling

### API Error Responses

```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// Error codes
const ERROR_CODES = {
  INVALID_MONTH: 'INVALID_MONTH', // Month not 1-12
  INVALID_DAY: 'INVALID_DAY', // Day not 1-31
  INVALID_YEAR: 'INVALID_YEAR', // Year out of range
  NOT_FOUND: 'NOT_FOUND', // No data found
  EMPTY_QUERY: 'EMPTY_QUERY', // Search query empty
  DATABASE_ERROR: 'DATABASE_ERROR', // Database connection issue
};
```

### Frontend Error Handling

- Display user-friendly error messages in Arabic
- Provide fallback UI when data fails to load
- Log errors for debugging
- Retry failed requests with exponential backoff

## Testing Strategy

### Property-Based Testing Library

We will use **fast-check** for property-based testing in TypeScript/JavaScript.

### Unit Tests

- Test zodiac calculation function with known year-animal pairs
- Test monthly info lookup for all 12 months
- Test date filtering logic
- Test search functionality with various queries
- Test SEO keywords generation

### Property-Based Tests

Each correctness property will be implemented as a property-based test:

1. **Zodiac Calculation Test**: Generate random years, verify correct animal
2. **Monthly Info Test**: Generate random months (1-12), verify correct info
3. **Date Filtering Test**: Generate random dates, verify all results match
4. **Search Test**: Generate random queries, verify results contain query
5. **Sorting Test**: Generate random data, verify sorted order
6. **SEO Keywords Test**: Generate page configs, verify keyword count >= 100
7. **API Round-Trip Test**: Generate random objects, verify serialize/deserialize equality

### Integration Tests

- Test full page rendering with database data
- Test API endpoints with real database queries
- Test navigation between pages
- Test SEO meta tags in rendered HTML

### Test Configuration

```typescript
// Property test configuration
const PBT_CONFIG = {
  numRuns: 100, // Minimum 100 iterations per property
  seed: undefined, // Random seed for reproducibility
  verbose: true, // Log failing examples
};
```
