# Design Document - تطوير ميلادك v2 المتقدم

## Overview

هذا المستند يصف التصميم التقني لتطوير موقع ميلادك v2 بشكل متقدم واحترافي. يشمل التصميم:
- إصلاح المشاكل الحالية (النافبار، صفحات الأدوات والمقالات)
- تصميم عصري فاخر مع تأثيرات متقدمة
- نظام ذكاء اصطناعي متكامل لإنشاء المحتوى
- لوحة تحكم شاملة ومتقدمة
- أداء فائق السرعة

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 15)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Pages   │  │Components│  │  Hooks   │  │  State (Zustand) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        API Layer (Route Handlers)                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Tools API│  │Articles  │  │ Admin API│  │    AI Service    │ │
│  │          │  │   API    │  │          │  │                  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        Services Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Database │  │   Auth   │  │  Cache   │  │   AI Providers   │ │
│  │ (SQLite) │  │ Service  │  │ (Memory) │  │ (Gemini/Groq/..) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
miladak_v2/
├── app/
│   ├── (public)/              # Public pages
│   │   ├── page.tsx           # Homepage
│   │   ├── tools/             # Tools pages
│   │   ├── articles/          # Articles pages
│   │   ├── friends/           # Friends calculator
│   │   ├── cards/             # Birthday cards
│   │   └── ...
│   ├── admin/                 # Admin panel
│   │   ├── page.tsx           # Dashboard
│   │   ├── articles/          # Articles management
│   │   ├── tools/             # Tools management
│   │   ├── categories/        # Categories management
│   │   ├── ai/                # AI content generation
│   │   ├── users/             # Users management
│   │   ├── settings/          # Site settings
│   │   └── ...
│   ├── api/                   # API routes
│   │   ├── tools/
│   │   ├── articles/
│   │   ├── categories/
│   │   ├── ai/
│   │   ├── auth/
│   │   └── admin/
│   └── layout.tsx
├── components/
│   ├── ui/                    # Base UI components
│   ├── layout/                # Layout components
│   ├── features/              # Feature components
│   ├── admin/                 # Admin components
│   └── animations/            # Animation components
├── lib/
│   ├── db/                    # Database utilities
│   ├── ai/                    # AI service providers
│   ├── utils/                 # Utility functions
│   └── hooks/                 # Custom hooks
├── styles/
│   └── globals.css            # Global styles
└── types/
    └── index.ts               # TypeScript types
```

---

## Components and Interfaces

### 1. Advanced Navbar Component

```typescript
interface NavbarProps {
  transparent?: boolean;
  showSearch?: boolean;
}

interface NavMenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavMenuChild[];
}

interface NavMenuChild {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

interface ToolCategory {
  id: number;
  name: string;
  title: string;
  icon: string;
  tools: Tool[];
}
```

### 2. AI Service Interface

```typescript
interface AIProvider {
  name: string;
  generateArticle(params: ArticleGenerationParams): Promise<GeneratedArticle>;
  rewriteContent(content: string, style: RewriteStyle): Promise<string>;
  generateSEO(content: string): Promise<SEOMetadata>;
  generateImage(prompt: string): Promise<GeneratedImage>;
}

interface ArticleGenerationParams {
  topic: string;
  keywords: string[];
  targetWordCount: number;
  style: 'formal' | 'casual' | 'educational';
  language: 'ar' | 'en';
}

interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  suggestedCategory: string;
  suggestedTags: string[];
}

type RewriteStyle = 'formal' | 'casual' | 'simplified' | 'expanded';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  structuredData: object;
}

interface GeneratedImage {
  url: string;
  altText: string;
  caption: string;
}
```

### 3. Admin Dashboard Interface

```typescript
interface DashboardStats {
  articlesCount: number;
  toolsCount: number;
  visitorsToday: number;
  messagesCount: number;
  aiUsage: AIUsageStats;
}

interface AIUsageStats {
  geminiCalls: number;
  groqCalls: number;
  imagesGenerated: number;
  tokensUsed: number;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  lastLogin: Date;
  isActive: boolean;
}

type UserRole = 'admin' | 'content_manager' | 'editor' | 'writer' | 'support';
```

---

## Data Models

### Database Schema

```sql
-- Tool Categories
CREATE TABLE tool_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🔧',
  color TEXT DEFAULT '#8B5CF6',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tools
CREATE TABLE tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🔧',
  category_id INTEGER NOT NULL,
  href TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES tool_categories(id)
);

-- Article Categories
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  icon TEXT,
  parent_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Articles
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id INTEGER NOT NULL,
  image TEXT,
  author TEXT DEFAULT 'ميلادك',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  ai_generated INTEGER DEFAULT 0,
  scheduled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tags
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0
);

-- Article Tags (Many-to-Many)
CREATE TABLE article_tags (
  article_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'writer',
  is_active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Topic Queue
CREATE TABLE ai_topic_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,
  keywords TEXT,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  article_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- AI Usage Log
CREATE TABLE ai_usage_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  action TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate REAL DEFAULT 0,
  success INTEGER DEFAULT 1,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  replied INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Age Calculation Accuracy
*For any* valid birthdate in the past, the calculated age in years, months, and days SHALL be mathematically correct when compared to the current date.
**Validates: Requirements 13.1**

### Property 2: Birthday Countdown Correctness
*For any* birthdate, the next birthday countdown SHALL always be a positive number of days less than or equal to 365.
**Validates: Requirements 13.2**

### Property 3: Tools Grouping by Category
*For any* set of tools with category assignments, displaying them on the tools page SHALL result in each tool appearing exactly once under its assigned category.
**Validates: Requirements 2.1**

### Property 4: Articles Filtering Consistency
*For any* filter criteria (category, search query), the filtered articles SHALL be a subset of all articles and SHALL all match the filter criteria.
**Validates: Requirements 3.1, 3.3**

### Property 5: Database Initialization Idempotency
*For any* number of initialization calls, the database SHALL contain the same set of default data without duplicates.
**Validates: Requirements 4.1**

### Property 6: Category Hierarchy Integrity
*For any* category tree, a category SHALL NOT be its own ancestor (no circular references).
**Validates: Requirements 17.1**

### Property 7: AI Provider Fallback
*For any* AI request, if the primary provider fails, the system SHALL attempt the fallback provider before returning an error.
**Validates: Requirements 22.1, 23.1**

### Property 8: Scheduled Article Publishing
*For any* article with a scheduled publish time in the past, the article SHALL be marked as published.
**Validates: Requirements 16.1**

---

## Error Handling

### API Error Responses

```typescript
interface ApiError {
  code: string;
  message: string;
  messageAr: string;
  details?: Record<string, unknown>;
}

const ErrorCodes = {
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  AI_PROVIDER_ERROR: 'AI_PROVIDER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;
```

### AI Error Handling

```typescript
class AIServiceError extends Error {
  constructor(
    public provider: string,
    public originalError: Error,
    public shouldFallback: boolean = true
  ) {
    super(`AI Provider ${provider} failed: ${originalError.message}`);
  }
}

async function executeWithFallback<T>(
  providers: AIProvider[],
  action: (provider: AIProvider) => Promise<T>
): Promise<T> {
  for (const provider of providers) {
    try {
      return await action(provider);
    } catch (error) {
      if (provider === providers[providers.length - 1]) {
        throw error;
      }
      // Log and continue to next provider
    }
  }
  throw new Error('All AI providers failed');
}
```

---

## Testing Strategy

### Dual Testing Approach

This project uses both unit tests and property-based tests for comprehensive coverage:

1. **Unit Tests**: Verify specific examples and edge cases
2. **Property-Based Tests**: Verify universal properties across all inputs

### Testing Framework

- **Test Runner**: Vitest
- **Property-Based Testing**: fast-check
- **Minimum Iterations**: 100 per property test

### Test Structure

```typescript
// Unit test example
describe('AgeCalculator', () => {
  it('should calculate age correctly for a specific date', () => {
    const birthdate = new Date('1990-01-15');
    const today = new Date('2024-01-15');
    const age = calculateAge(birthdate, today);
    expect(age.years).toBe(34);
    expect(age.months).toBe(0);
    expect(age.days).toBe(0);
  });
});

// Property-based test example
// **Feature: advanced-miladak-v2-development, Property 1: Age Calculation Accuracy**
describe('Age Calculation Properties', () => {
  it('should always calculate non-negative age for past dates', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('1900-01-01'), max: new Date() }),
        (birthdate) => {
          const age = calculateAge(birthdate, new Date());
          return age.years >= 0 && age.months >= 0 && age.days >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Categories

1. **Age Calculations**: Property tests for all age-related calculations
2. **Database Operations**: Tests for CRUD operations and data integrity
3. **API Endpoints**: Integration tests for all API routes
4. **AI Service**: Mock tests for AI provider interactions
5. **UI Components**: Component tests for critical UI elements

