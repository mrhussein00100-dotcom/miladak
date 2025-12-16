# Complete Homepage Restoration - Design Document

## Overview

هذا التصميم يوضح كيفية نقل جميع المكونات والمكتبات من الموقع القديم (miladak_base) إلى الموقع الجديد (miladak_v2) مع الحفاظ على نفس الوظائف والتجربة.

## Architecture

### Component Hierarchy

```
app/page.tsx
├── EnhancedHero (NEW)
├── FeaturedToolsSection (NEW)
├── AgeCalculator (existing - needs enhancement)
│   └── Results Display (when calculated)
│       ├── StatsSection (NEW)
│       │   ├── Main Age Stats (Gregorian)
│       │   ├── Hijri Age Stats
│       │   ├── Life Stats Grid (8 stats)
│       │   ├── PersonalityInsights (NEW - 6 cards)
│       │   ├── Year Facts Section
│       │   └── Quotes Section (ومضات)
│       ├── BirthdayFacts (NEW - 8 facts)
│       ├── AchievementsSection (NEW)
│       ├── ExtraStatsSection (NEW - 16 stats)
│       ├── ComparisonsSection (NEW)
│       └── CompareWithFriends (NEW - if friends exist)
├── FriendCalculator (NEW)
├── FriendsSection (NEW - if friends exist)
├── RichContentSection (NEW)
├── FAQSection (existing)
├── RandomArticlesSection (existing)
└── Footer (existing)
```

## Components

### 1. PersonalityInsights Component

**Source:** `miladak_base/components/PersonalityInsights.tsx`
**Target:** `miladak_v2/components/sections/PersonalityInsights.tsx`

```typescript
interface Props {
  ageData: AgeData;
}

// 6 Insight Cards:
const cards = [
  { key: 'season', icon: Sun }, // موسم الميلاد (مؤشر ضوئي)
  { key: 'chronotype', icon: Clock }, // الإيقاع اليومي المتوقع
  { key: 'generation', icon: Users }, // ملف الجيل
  { key: 'strengths', icon: Brain }, // نقاط قوة مرجّحة
  { key: 'work', icon: Briefcase }, // بيئات عمل مناسبة
  { key: 'wellbeing', icon: Heart }, // عادات رفاه مناسبة
];
```

### 2. StatsSection Component

**Source:** `miladak_base/components/StatsSection.tsx`
**Target:** `miladak_v2/components/sections/StatsSection.tsx`

**Features:**

- Main age stats (years, months, days) - Gregorian
- Hijri age stats with official date
- Life stats grid (8 statistics): heartbeats, breaths, sleep days, food, movies, steps, words, water
- PersonalityInsights integration (6 cards)
- Year facts (حقائق عن سنة ميلادك, العالم عندما ولدت, رحلتك عبر الزمن)
- Events and songs sections (أهم الأحداث, أشهر الأغاني)
- Quotes section (ومضات)
- Next birthday countdown with progress bar
- Share and export functionality

### 3. ExtraStatsSection Component

**Source:** `miladak_base/components/ExtraStatsSection.tsx`
**Target:** `miladak_v2/components/sections/ExtraStatsSection.tsx`

**16 Statistics:**

```typescript
const stats = [
  { icon: Eye, label: 'مرات الغمز', key: 'blinks' },
  { icon: Smile, label: 'مرات الضحك', key: 'laughs' },
  { icon: Utensils, label: 'الوجبات', key: 'meals' },
  { icon: Wifi, label: 'ساعات الإنترنت', key: 'internetHours' },
  { icon: Camera, label: 'الصور الملتقطة', key: 'photosTaken' },
  { icon: Brush, label: 'تنظيف الأسنان', key: 'toothBrushing' },
  { icon: Dream, label: 'الأحلام', key: 'dreams' },
  { icon: BookOpen, label: 'كتب يمكن قراءتها', key: 'booksCouldRead' },
  { icon: Footprints, label: 'كيلومترات مشي', key: 'kmWalked' },
  { icon: Heart, label: 'نبضات في الحب', key: 'heartbeatsInLove' },
  { icon: Music, label: 'أغاني', key: 'songsListened' },
  { icon: Coffee, label: 'فناجين القهوة', key: 'cupsDrank' },
  { icon: SmilePlus, label: 'الابتسامات', key: 'smiles' },
  { icon: Clock, label: 'دقائق الانتظار', key: 'waitingMinutes' },
  { icon: Scissors, label: 'نمو الشعر', key: 'hairGrowthCm' },
  { icon: Sparkles, label: 'خلايا متجددة', key: 'skinCellsRenewed' },
];
```

### 4. BirthdayFacts Component

**Source:** `miladak_base/components/BirthdayFacts.tsx`
**Target:** `miladak_v2/components/sections/BirthdayFacts.tsx`

**8 Fact Cards:**

- البرج الصيني (Chinese Zodiac)
- الفصل (Season)
- حجر الميلاد (Birthstone)
- زهرة الميلاد (Birth Flower)
- لون الحظ (Lucky Color)
- رقم الحظ (Lucky Number)
- ترتيب اليوم في السنة (Day of Year)
- المتبقي من السنة (Remaining Days)

**Additional Sections:**

- مواليد مشهورة في هذا اليوم
- أحداث في هذا اليوم

### 5. AchievementsSection Component

**Source:** `miladak_base/components/AchievementsSection.tsx`
**Target:** `miladak_v2/components/sections/AchievementsSection.tsx`

**Features:**

- Display earned achievement badges based on age
- Animated badges with sparkle effects on hover
- Motivational message at the bottom
- Hide section if no achievements earned

### 6. ComparisonsSection Component

**Source:** `miladak_base/components/ComparisonsSection.tsx`
**Target:** `miladak_v2/components/sections/ComparisonsSection.tsx`

**Features:**

- Display fun comparisons (تخيل لو...)
- Icon, title, and description for each comparison
- Animated cards with hover effects
- At least 6 comparison cards

### 7. Friends Components

**Components:**

- `FriendCalculator.tsx` - حاسبة عمر الصديق
- `CompareWithFriends.tsx` - مقارنة مع الأصدقاء
- `FriendsSection.tsx` - قسم الأصدقاء

**Features:**

- Add friend with name and birth date
- Store friends in localStorage
- Compare ages and show differences
- Remove friends from list

### 8. Homepage Enhancement Components

**Components:**

- `EnhancedHero.tsx` - القسم الرئيسي المحسّن
- `FeaturedToolsSection.tsx` - الأدوات المميزة
- `RichContentSection.tsx` - المحتوى الغني للـ SEO

## Libraries

### 1. personalityInsights.ts

**Source:** `miladak_base/lib/personalityInsights.ts`
**Target:** `miladak_v2/lib/calculations/personalityInsights.ts`

```typescript
export type InsightCard = {
  title: string;
  tag?: string;
  color?: string;
  summary: string;
  bullets: string[];
};

export type PersonalityInsights = {
  season: InsightCard;
  chronotype: InsightCard;
  generation: InsightCard;
  strengths: InsightCard;
  work: InsightCard;
  wellbeing: InsightCard;
};

// Helper functions:
function getSeason(date: Date): 'الربيع' | 'الصيف' | 'الخريف' | 'الشتاء';
function getAgeStage(age: AgeData): string; // 9 stages
function getGeneration(year: number): { name: string; range: string }; // 6 generations
function chronotypeForStage(stage: string): {
  label: string;
  window: string;
  notes: string[];
};

export function getPersonalityInsights(age: AgeData): PersonalityInsights;
```

### 2. Enhanced ageCalculations.ts

**Functions to add:**

```typescript
export function getExtraFunStats(ageData: AgeData): ExtraStats; // 16 stats
export function calculateLifeStats(ageData: AgeData): LifeStats; // 8 stats
export function getBirthDayInterestingFacts(ageData: AgeData): BirthdayFacts; // 8 facts
export function getAchievements(ageData: AgeData): Achievement[]; // badges
export function getFunComparisons(ageData: AgeData): Comparison[]; // comparisons
```

### 3. Supporting Libraries

- **lib/yearFacts.ts** - `getYearFacts(year: number): string[]`
- **lib/personalStats.ts** - `calculatePersonalJourney()`, `getWorldWhenBorn()`
- **lib/worldFacts.ts** - `getYearMajorEvents()`, `getYearTopSongs()`
- **lib/ageMessages.ts** - `getAgeMessageLine()`, quotes pools

## Data Models

### ExtraStats

```typescript
interface ExtraStats {
  blinks: number;
  laughs: number;
  meals: number;
  internetHours: number;
  photosTaken: number;
  toothBrushing: number;
  dreams: number;
  booksCouldRead: number;
  kmWalked: number;
  heartbeatsInLove: number;
  songsListened: number;
  cupsDrank: number;
  smiles: number;
  waitingMinutes: number;
  hairGrowthCm: number;
  skinCellsRenewed: number;
}
```

### Achievement

```typescript
interface Achievement {
  icon: string;
  title: string;
  color: string;
}
```

### Comparison

```typescript
interface Comparison {
  icon: string;
  title: string;
  description: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Personality insights completeness

_For any_ valid AgeData, calling getPersonalityInsights should return an object with all 6 required insight cards (season, chronotype, generation, strengths, work, wellbeing), each with non-empty title, summary, and bullets array
**Validates: Requirements 1.1, 1.2**

### Property 2: Age stage mapping completeness

_For any_ age from 0 to 120 years, getAgeStage should return one of the 9 valid stage strings (رضيع, طفل مبكر, طفل, مراهق, شباب, راشد, ناضج, كبير سنًا, مسن)
**Validates: Requirements 1.2**

### Property 3: Generation identification accuracy

_For any_ birth year from 1900 to current year, getGeneration should return a valid generation object with non-empty name and range
**Validates: Requirements 1.5**

### Property 4: Extra stats calculation positivity

_For any_ valid AgeData with totalDays > 0, all 16 extra statistics should be positive numbers
**Validates: Requirements 3.1, 3.2**

### Property 5: Birthday facts completeness

_For any_ valid birth date, getBirthDayInterestingFacts should return all 8 required facts (chineseZodiac, season, birthstone, birthFlower, luckyColor, luckyNumber, dayOfYear, remainingDays)
**Validates: Requirements 4.1, 4.2**

### Property 6: Number formatting consistency

_For any_ positive number, formatNumber should return a valid Arabic-formatted string
**Validates: Requirements 2.3, 3.3**

### Property 7: Life stats positivity

_For any_ valid AgeData with totalDays > 0, all 8 life statistics (heartbeats, breaths, sleepDays, foodKg, moviesWatched, stepsWalked, wordsSpoken, waterLiters) should be positive numbers
**Validates: Requirements 2.2**

### Property 8: Next birthday days range

_For any_ valid AgeData, nextBirthday.daysUntil should be between 0 and 365 (inclusive)
**Validates: Requirements 2.5**

### Property 9: Achievements based on age

_For any_ valid AgeData, getAchievements should return an array where each achievement has non-empty icon, title, and color
**Validates: Requirements 10.1, 10.2**

### Property 10: Comparisons minimum count

_For any_ valid AgeData, getFunComparisons should return at least 6 comparison objects, each with non-empty icon, title, and description
**Validates: Requirements 11.1, 11.2, 11.3**

### Property 11: Quotes age-appropriate selection

_For any_ valid AgeData, the quotes section should return exactly 4 quotes from the appropriate age stage pool
**Validates: Requirements 6.1, 6.2, 6.3**

## Error Handling

- Handle missing hijri library gracefully with fallback formatting
- Handle API failures for birthday info with cached/static data
- Handle missing year facts with empty array
- Validate AgeData before calculations
- Handle edge cases (leap years, boundary dates)

## Testing Strategy

### Unit Tests

- Test personality insights calculation for various ages
- Test extra stats calculations
- Test birthday facts generation
- Test number formatting
- Test achievements generation
- Test comparisons generation

### Property-Based Tests (using fast-check)

- Test with random valid dates (1900-2024)
- Test edge cases (leap years, boundary dates)
- Test all age stages (0-120 years)
- Minimum 100 iterations per property

### Integration Tests

- Test full calculation flow
- Test API integration for birthday info
- Test component rendering with various data
- Test friends comparison functionality

## Implementation Phases

### Phase 1: Library Migration (Week 1)

1. Copy personalityInsights.ts
2. Add getExtraFunStats, getAchievements, getFunComparisons to ageCalculations.ts
3. Copy yearFacts.ts, personalStats.ts, worldFacts.ts, ageMessages.ts

### Phase 2: Core Components (Week 2)

1. Create PersonalityInsights component
2. Create StatsSection component
3. Create ExtraStatsSection component
4. Create BirthdayFacts component

### Phase 3: Additional Components (Week 3)

1. Create AchievementsSection component
2. Create ComparisonsSection component
3. Create Friends components (FriendCalculator, CompareWithFriends, FriendsSection)

### Phase 4: Homepage Enhancement (Week 4)

1. Create EnhancedHero component
2. Create FeaturedToolsSection component
3. Create RichContentSection component
4. Update app/page.tsx to integrate all components

### Phase 5: Testing & Polish (Week 5)

1. Write property tests
2. Test all calculations
3. Optimize performance with lazy loading
