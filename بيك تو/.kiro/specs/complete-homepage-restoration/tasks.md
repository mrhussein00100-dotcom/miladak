# Implementation Plan

## Phase 1: Library Migration

- [ ] 1. Migrate personality insights library

  - [ ] 1.1 Copy personalityInsights.ts from miladak_base/lib to miladak_v2/lib/calculations
    - Include all helper functions (getSeason, getAgeStage, getGeneration, chronotypeForStage)
    - Include all data pools (quotes, traits, etc.)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]\* 1.2 Write property test for personality insights
    - **Property 1: Personality insights consistency**
    - **Validates: Requirements 1.1**
  - [ ]\* 1.3 Write property test for age stage mapping
    - **Property 2: Age stage mapping completeness**
    - **Validates: Requirements 1.2**
  - [ ]\* 1.4 Write property test for generation identification
    - **Property 3: Generation identification accuracy**
    - **Validates: Requirements 1.5**

- [ ] 2. Migrate extra statistics calculations

  - [ ] 2.1 Add getExtraFunStats function to lib/calculations/ageCalculations.ts
    - Calculate all 16 fun statistics
    - Include formatNumber enhancements for مليون/مليار
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]\* 2.2 Write property test for extra stats
    - **Property 4: Extra stats calculation positivity**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 3. Migrate birthday facts calculations

  - [ ] 3.1 Add getBirthDayInterestingFacts function to lib/calculations/ageCalculations.ts
    - Include Chinese zodiac, birthstone, birth flower calculations
    - Include lucky color and number calculations
    - _Requirements: 4.1, 4.2_
  - [ ]\* 3.2 Write property test for birthday facts
    - **Property 5: Birthday facts completeness**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 4. Migrate year and world facts libraries

  - [ ] 4.1 Copy yearFacts.ts to lib/data/yearFacts.ts
    - Include getYearFacts function
    - _Requirements: 5.1_
  - [ ] 4.2 Copy personalStats.ts to lib/calculations/personalStats.ts
    - Include calculatePersonalJourney and getWorldWhenBorn functions
    - _Requirements: 5.2, 5.3_
  - [ ] 4.3 Copy worldFacts.ts to lib/data/worldFacts.ts
    - Include getYearMajorEvents and getYearTopSongs functions
    - _Requirements: 5.4, 5.5_

- [ ] 5. Checkpoint - Ensure all library tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Component Migration

- [ ] 6. Create PersonalityInsights component

  - [ ] 6.1 Create components/sections/PersonalityInsights.tsx
    - Display 6 insight cards (season, chronotype, generation, strengths, work, wellbeing)
    - Use framer-motion for animations
    - Use lucide-react icons
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 7. Create StatsSection component

  - [ ] 7.1 Create components/sections/StatsSection.tsx
    - Display main age stats (Gregorian and Hijri)
    - Display life stats grid (8 statistics)
    - Include PersonalityInsights component
    - Display year facts, events, and songs sections
    - Include next birthday countdown with progress bar
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8. Create ExtraStatsSection component

  - [ ] 8.1 Create components/sections/ExtraStatsSection.tsx
    - Display 16 fun statistics in a grid
    - Format large numbers appropriately
    - Add hover animations
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 9. Create BirthdayFacts component

  - [ ] 9.1 Create components/sections/BirthdayFacts.tsx
    - Display 8 fact cards
    - Fetch birthday info from API
    - Display famous birthdays and historical events
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 10. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Integration

- [ ] 11. Update AgeCalculator to show new sections

  - [ ] 11.1 Modify components/AgeCalculator.tsx
    - Import and render StatsSection when results are available
    - Import and render ExtraStatsSection
    - Import and render BirthdayFacts
    - Add quotes section (ومضات)
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1, 6.2, 6.3_

- [ ] 12. Wire up API calls

  - [ ] 12.1 Ensure /api/birthday-info endpoint works correctly
    - Verify it returns chineseZodiac, birthstone, birthFlower, season, luckyColor
    - Verify it returns dailyBirthdays and dailyEvents
    - _Requirements: 4.5_

- [ ] 13. Add age messages and quotes
  - [ ] 13.1 Copy ageMessages.ts to lib/data/ageMessages.ts
    - Include getAgeMessageLine function
    - _Requirements: 6.1, 6.2, 6.3_

## Phase 4: Additional Components

- [ ] 14. Create AchievementsSection component

  - [ ] 14.1 Add getAchievements function to lib/calculations/ageCalculations.ts
    - Calculate earned badges based on age milestones
    - _Requirements: 10.1, 10.2_
  - [ ] 14.2 Create components/sections/AchievementsSection.tsx
    - Display earned achievement badges
    - Add sparkle animations on hover
    - Hide section if no achievements
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ]\* 14.3 Write property test for achievements
    - **Property 9: Achievements based on age**
    - **Validates: Requirements 10.1, 10.2**

- [ ] 15. Create ComparisonsSection component

  - [ ] 15.1 Add getFunComparisons function to lib/calculations/ageCalculations.ts
    - Generate fun comparisons based on age
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ] 15.2 Create components/sections/ComparisonsSection.tsx
    - Display at least 6 comparison cards
    - Add hover animations
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ]\* 15.3 Write property test for comparisons
    - **Property 10: Comparisons minimum count**
    - **Validates: Requirements 11.1, 11.2, 11.3**

- [ ] 16. Create Friends components

  - [ ] 16.1 Create components/FriendCalculator.tsx
    - Add friend with name and birth date
    - Store in localStorage
    - _Requirements: 12.1_
  - [ ] 16.2 Create components/CompareWithFriends.tsx
    - Compare ages and show differences
    - _Requirements: 12.2, 12.3_
  - [ ] 16.3 Create components/FriendsSection.tsx
    - Display friends list
    - Allow removing friends
    - _Requirements: 12.4_

- [ ] 17. Checkpoint - Ensure all additional components work
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: SEO Enhancement

- [ ] 18. Enhance SEO with comprehensive keywords
  - [ ] 18.1 Update lib/seo/keywords.ts with 200+ keywords
    - Add age calculation keywords
    - Add personality analysis keywords
    - Add zodiac and birthday keywords
    - _Requirements: 9.1_
  - [ ] 18.2 Update app/layout.tsx metadata
    - Add comprehensive title and description
    - Add all keywords
    - _Requirements: 9.2_
  - [ ] 18.3 Add structured data for WebApplication
    - _Requirements: 9.3_
  - [ ] 18.4 Add Open Graph and Twitter Card meta tags
    - _Requirements: 9.4_

## Phase 6: Homepage Enhancement

- [ ] 19. Create homepage enhancement components

  - [ ] 19.1 Create components/homepage/EnhancedHero.tsx
    - Enhanced hero section with better visuals
    - _Requirements: 13.1_
  - [ ] 19.2 Create components/homepage/FeaturedToolsSection.tsx
    - Display popular tools
    - _Requirements: 13.2_
  - [ ] 19.3 Create components/homepage/RichContentSection.tsx
    - SEO-friendly content section
    - _Requirements: 13.3_

- [ ] 20. Update homepage to integrate all components
  - [ ] 20.1 Update app/page.tsx
    - Add EnhancedHero
    - Add FeaturedToolsSection
    - Add RichContentSection
    - Integrate all new sections in AgeCalculator results
    - _Requirements: 13.1, 13.2, 13.3_

## Phase 7: Testing & Polish

- [ ] 21. Write integration tests

  - [ ]\* 21.1 Test full calculation flow
    - Test from date input to all sections display
  - [ ]\* 21.2 Test API integration
    - Test birthday info API responses
  - [ ]\* 21.3 Write property test for quotes
    - **Property 11: Quotes age-appropriate selection**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 22. Performance optimization

  - [ ] 22.1 Implement lazy loading for heavy components
    - Use React.lazy for PersonalityInsights, ExtraStatsSection, AchievementsSection
  - [ ] 22.2 Optimize animations
    - Reduce motion for users who prefer reduced motion

- [ ] 23. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Success Criteria

### Functionality ✅

- [ ] PersonalityInsights displays 6 insight cards correctly
- [ ] StatsSection displays all age statistics
- [ ] ExtraStatsSection displays 16 fun statistics
- [ ] BirthdayFacts displays all 8 facts
- [ ] AchievementsSection displays earned badges
- [ ] ComparisonsSection displays 6+ comparisons
- [ ] Friends components work correctly
- [ ] Quotes section displays age-appropriate quotes
- [ ] All calculations match the old site

### Performance 🚀

- [ ] Page load time < 3 seconds
- [ ] Lazy loading implemented for heavy components
- [ ] Animations respect reduced motion preference

### SEO 📈

- [ ] 200+ keywords implemented
- [ ] Structured data valid
- [ ] Meta tags comprehensive

### Homepage Enhancement 🏠

- [ ] EnhancedHero displays correctly
- [ ] FeaturedToolsSection shows popular tools
- [ ] RichContentSection provides SEO content
