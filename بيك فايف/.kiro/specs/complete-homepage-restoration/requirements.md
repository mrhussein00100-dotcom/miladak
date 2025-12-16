# Requirements Document

## Introduction

استعادة جميع الميزات المفقودة من الموقع القديم (miladak_base) إلى الموقع الجديد (miladak_v2) لمطابقة الوظائف الأصلية وثراء المحتوى. يشمل ذلك نظام تحليل الشخصية الكامل، الإحصائيات التفصيلية، حقائق يوم الميلاد، والـ SEO المحسّن.

## Glossary

- **PersonalityInsights**: نظام تحليل الشخصية المبني على تاريخ الميلاد والعمر
- **StatsSection**: قسم الإحصائيات الرئيسي الذي يعرض نتائج حساب العمر
- **ExtraStatsSection**: قسم الإحصائيات الإضافية الممتعة (16 إحصائية)
- **BirthdayFacts**: حقائق مشوقة عن يوم الميلاد (البرج الصيني، حجر الميلاد، إلخ)
- **AgeData**: هيكل البيانات الذي يحتوي على معلومات العمر المحسوبة
- **InsightCard**: بطاقة عرض معلومات تحليل الشخصية

## Requirements

### Requirement 1

**User Story:** As a user, I want to see comprehensive personality analysis based on my birth date, so that I can learn about my character traits and life insights.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display a PersonalityInsights section with 6 insight cards (season, chronotype, generation, strengths, work, wellbeing)
2. WHEN displaying personality insights THEN the System SHALL calculate insights based on birth date, age stage, and generation
3. WHEN showing season insights THEN the System SHALL display birth season (الربيع/الصيف/الخريف/الشتاء) with photobiological indicators
4. WHEN showing chronotype insights THEN the System SHALL display expected daily rhythm based on age stage (صباحي/مسائي/متوسط)
5. WHEN showing generation insights THEN the System SHALL identify user's generation (جيل زد/الألفية/إكس/الطفرة/ألفا) with characteristics
6. WHEN showing strengths insights THEN the System SHALL display age-appropriate strength indicators
7. WHEN showing work insights THEN the System SHALL provide suitable work environment suggestions based on age stage
8. WHEN showing wellbeing insights THEN the System SHALL provide evidence-based wellness practices for the age stage

### Requirement 2

**User Story:** As a user, I want to see detailed life statistics after calculating my age, so that I get fascinating insights about my life journey.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display a StatsSection with main age stats (years, months, days) in both Gregorian and Hijri calendars
2. WHEN displaying life stats THEN the System SHALL show heartbeats, breaths, sleep days, food consumed, movies watched, steps walked, words spoken, and water consumed
3. WHEN displaying stats THEN the System SHALL format large numbers appropriately (مليون/مليار)
4. WHEN showing Hijri date THEN the System SHALL display the official Hijri birth date using the hijri library
5. WHEN displaying next birthday THEN the System SHALL show days remaining and year progress percentage

### Requirement 3

**User Story:** As a user, I want to see extra fun statistics about my life, so that I can discover more amazing numbers.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display an ExtraStatsSection with 16 fun statistics
2. WHEN displaying extra stats THEN the System SHALL include: blinks, laughs, meals, internet hours, photos taken, tooth brushing, dreams, books could read, km walked, heartbeats in love, songs listened, cups drank, smiles, waiting minutes, hair growth, skin cells renewed
3. WHEN displaying large numbers THEN the System SHALL format them as مليون or مليار appropriately

### Requirement 4

**User Story:** As a user, I want to see interesting facts about my birthday, so that I can discover unique things related to my birth date.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display a BirthdayFacts section
2. WHEN displaying birthday facts THEN the System SHALL show: Chinese zodiac, season, birthstone, birth flower, lucky color, lucky number, day of year, remaining days in year
3. WHEN birthday info is available THEN the System SHALL display famous people born on the same day
4. WHEN birthday info is available THEN the System SHALL display historical events on that day
5. WHEN fetching birthday info THEN the System SHALL call the /api/birthday-info endpoint with year, month, and day parameters

### Requirement 5

**User Story:** As a user, I want to see world facts from my birth year, so that I can understand the context of when I was born.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display year facts section
2. WHEN displaying world facts THEN the System SHALL show: world population, Egypt population, life expectancy, internet users, mobile phones, earth rotations, moon cycles
3. WHEN displaying personal journey THEN the System SHALL show: heartbeats, breaths, steps, sleep hours/years, meals, blinks
4. WHEN displaying year events THEN the System SHALL fetch and show major events from the birth year
5. WHEN displaying year songs THEN the System SHALL fetch and show popular songs from the birth year

### Requirement 6

**User Story:** As a user, I want to see inspirational quotes based on my age stage, so that I receive relevant motivation.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display a quotes section (ومضات)
2. WHEN selecting quotes THEN the System SHALL choose age-appropriate quotes based on stage (newborn/toddler/kid/teen/youth/adult/senior)
3. WHEN displaying quotes THEN the System SHALL show 4 randomly selected quotes from the appropriate pool

### Requirement 7

**User Story:** As a developer, I want to migrate the personality insights calculation library, so that the new site has the same analysis capabilities.

#### Acceptance Criteria

1. WHEN migrating personality library THEN the System SHALL include getPersonalityInsights function from lib/personalityInsights.ts
2. WHEN calculating insights THEN the System SHALL use getSeason, getAgeStage, getGeneration, and chronotypeForStage helper functions
3. WHEN generating insights THEN the System SHALL use deterministic random selection based on birth date seed
4. WHEN returning insights THEN the System SHALL provide InsightCard objects with title, tag, color, summary, and bullets

### Requirement 8

**User Story:** As a developer, I want to migrate the extra statistics calculation functions, so that the new site displays all fun statistics.

#### Acceptance Criteria

1. WHEN migrating calculations THEN the System SHALL include getExtraFunStats function from lib/ageCalculations.ts
2. WHEN calculating extra stats THEN the System SHALL compute all 16 statistics based on total days lived
3. WHEN formatting numbers THEN the System SHALL use formatNumber function for Arabic number formatting

### Requirement 9

**User Story:** As a user, I want the site to be well-optimized for search engines, so that it ranks better in search results.

#### Acceptance Criteria

1. WHEN optimizing SEO THEN the System SHALL include 200+ keywords from the old site
2. WHEN generating meta tags THEN the System SHALL include comprehensive title, description, and keywords
3. WHEN implementing structured data THEN the System SHALL add Schema.org markup for WebApplication
4. WHEN adding social tags THEN the System SHALL include Open Graph and Twitter Card meta tags

### Requirement 10

**User Story:** As a user, I want to see my life achievements based on my age, so that I can celebrate my milestones.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display an AchievementsSection with earned badges
2. WHEN displaying achievements THEN the System SHALL show achievement icon, title, and color
3. WHEN user hovers over achievement THEN the System SHALL animate the badge with sparkle effects
4. WHEN no achievements are earned THEN the System SHALL hide the section

### Requirement 11

**User Story:** As a user, I want to see fun comparisons about my age, so that I can put my life in perspective.

#### Acceptance Criteria

1. WHEN a user calculates their age THEN the System SHALL display a ComparisonsSection with fun comparisons
2. WHEN displaying comparisons THEN the System SHALL show icon, title, and description for each comparison
3. WHEN displaying comparisons THEN the System SHALL include at least 6 different comparison cards

### Requirement 12

**User Story:** As a user, I want to compare my age with friends, so that I can see interesting differences.

#### Acceptance Criteria

1. WHEN a user adds a friend THEN the System SHALL store friend's name and age data
2. WHEN friends are added THEN the System SHALL display CompareWithFriends section
3. WHEN displaying comparison THEN the System SHALL show age differences and interesting facts
4. WHEN user removes a friend THEN the System SHALL update the friends list

### Requirement 13

**User Story:** As a user, I want to see enhanced hero section and featured tools, so that I can discover more features.

#### Acceptance Criteria

1. WHEN user visits homepage THEN the System SHALL display EnhancedHero section
2. WHEN user visits homepage THEN the System SHALL display FeaturedToolsSection with popular tools
3. WHEN user visits homepage THEN the System SHALL display RichContentSection for SEO

## Technical Requirements

### Components to Migrate

1. **PersonalityInsights.tsx** - تحليل الشخصية (6 بطاقات)
2. **StatsSection.tsx** - الإحصائيات الرئيسية والتفصيلية (يتضمن PersonalityInsights)
3. **ExtraStatsSection.tsx** - 16 إحصائية ممتعة
4. **BirthdayFacts.tsx** - حقائق يوم الميلاد
5. **AchievementsSection.tsx** - الإنجازات والشارات
6. **ComparisonsSection.tsx** - المقارنات الممتعة
7. **CompareWithFriends.tsx** - مقارنة مع الأصدقاء
8. **FriendCalculator.tsx** - حاسبة عمر الصديق
9. **FriendsSection.tsx** - قسم الأصدقاء
10. **EnhancedHero.tsx** - القسم الرئيسي المحسّن
11. **FeaturedToolsSection.tsx** - الأدوات المميزة
12. **RichContentSection.tsx** - المحتوى الغني للـ SEO

### Libraries to Migrate

1. **lib/personalityInsights.ts** - منطق تحليل الشخصية
2. **lib/ageCalculations.ts** - دوال الحساب الإضافية:
   - getExtraFunStats - 16 إحصائية ممتعة
   - calculateLifeStats - إحصائيات الحياة
   - getAchievements - الإنجازات
   - getFunComparisons - المقارنات الممتعة
   - getBirthDayInterestingFacts - حقائق يوم الميلاد
3. **lib/yearFacts.ts** - حقائق السنة
4. **lib/personalStats.ts** - الإحصائيات الشخصية
5. **lib/worldFacts.ts** - حقائق العالم
6. **lib/ageMessages.ts** - رسائل العمر والاقتباسات

## Success Metrics

- جميع ميزات الموقع القديم مستعادة (12 مكون)
- تحليل الشخصية يعمل بشكل كامل (6 بطاقات)
- جميع الإحصائيات تُعرض بشكل صحيح (16 إحصائية ممتعة + 8 إحصائيات حياة)
- الإنجازات والمقارنات تعمل
- مقارنة الأصدقاء تعمل
- SEO محسّن مع 200+ كلمة مفتاحية
