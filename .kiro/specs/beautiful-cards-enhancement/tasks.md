# Implementation Plan

- [x] 1. Add Arabic Fonts Configuration

  - [x] 1.1 Create font configuration file with 8 Arabic fonts

    - Create `lib/cards/fonts.ts` with FontConfig interface and ARABIC_FONTS array
    - Include Cairo, Tajawal, Amiri, Almarai, Changa, Lateef, Scheherazade, Harmattan
    - _Requirements: 1.1_

  - [ ] 1.2 Write property test for font configuration completeness

    - **Property 1: Font Configuration Completeness**

    - **Validates: Requirements 1.1, 1.4**

  - [ ] 1.3 Update layout.tsx to load Google Fonts

    - Add Google Fonts link with Arabic subset for all 8 fonts

    - _Requirements: 1.3_

- [x] 2. Create Font Selector Component

  - [ ] 2.1 Create FontSelector component

    - Create `components/cards/FontSelector.tsx`

    - Display font options with Arabic preview text
    - Apply selected font to preview immediately

    - _Requirements: 1.2, 1.4_

  - [x] 2.2 Write property test for font application

    - **Property 2: Font Application Consistency**
    - **Validates: Requirements 1.2**

- [ ] 3. Enhance Card Templates with Decorations

  - [ ] 3.1 Create decorations configuration

    - Create `lib/cards/decorations.ts` with decoration types and positions
    - Map decoration types to template categories

    - _Requirements: 2.1, 2.2_

  - [ ] 3.2 Update templates with enhanced styling

    - Add gradient backgrounds, border decorations, shadow effects

    - Add animation configurations to each template
    - _Requirements: 2.3, 2.4, 4.2_

  - [ ] 3.3 Write property test for template decorations

    - **Property 3: Template Decoration Mapping**

    - **Property 4: Template Visual Properties**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 4.2**

- [x] 4. Create Decoration Components

  - [ ] 4.1 Create animated decoration components

    - Create `components/cards/decorations/Balloons.tsx`

    - Create `components/cards/decorations/Stars.tsx`

    - Create `components/cards/decorations/Confetti.tsx`

    - Create `components/cards/decorations/Sparkles.tsx`
    - _Requirements: 2.1, 2.5_

  - [ ] 4.2 Create decoration layer component

    - Create `components/cards/DecorationLayer.tsx`
    - Render decorations based on template config

    - Ensure decorations don't block content (z-index)
    - _Requirements: 2.5_

- [ ] 5. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Fix Card Save Functionality

  - [x] 6.1 Update validation with better error messages

    - Update `lib/cards/validation.ts` with clearer Arabic error messages
    - Add field-specific error handling
    - _Requirements: 3.1, 3.2_

  - [x] 6.2 Write property test for validation errors

    - **Property 5: Validation Error Specificity**
    - **Validates: Requirements 3.1, 3.2**

  - [ ] 6.3 Update save API with proper response format

    - Update `app/api/cards/save/route.ts`

    - Return consistent success/error response format
    - _Requirements: 3.4, 3.5_

  - [ ] 6.4 Write property test for save response

    - **Property 6: Save Response Format**

    - **Validates: Requirements 3.4, 3.5**

- [ ] 7. Create Enhanced Card Preview

  - [ ] 7.1 Create age badge component

    - Create `components/cards/AgeBadge.tsx`
    - Display age in decorative circle/badge
    - _Requirements: 4.3_

  - [ ] 7.2 Create animated greeting component

    - Create `components/cards/AnimatedGreeting.tsx`

    - Add shimmer/glow effects to greeting text
    - _Requirements: 4.4_

  - [ ] 7.3 Create ribbon/banner component
    - Create `components/cards/RibbonBanner.tsx`
    - Display special messages in decorative ribbon
    - _Requirements: 4.5_
  - [ ] 7.4 Write property test for card content elements
    - **Property 7: Card Content Elements**
    - **Validates: Requirements 4.1, 4.3**

- [ ] 8. Add Animations and Transitions

  - [ ] 8.1 Add CSS animations for decorations
    - Create floating, pulsing, bouncing keyframes
    - Apply to decoration components
    - _Requirements: 5.3_
  - [ ] 8.2 Add template transition animations
    - Add smooth transitions when switching templates
    - Add hover scale effects on template options
    - _Requirements: 5.1, 5.2_
  - [ ] 8.3 Add text fade animations
    - Add fade effect when text content changes
    - _Requirements: 5.4_
  - [ ] 8.4 Write property test for animations
    - **Property 8: Animation Configuration**
    - **Validates: Requirements 5.3, 5.4**

- [ ] 9. Update Card Generator Component

  - [ ] 9.1 Integrate font selector into card generator
    - Add font selection to EnhancedCardGenerator
    - Pass selected font to preview
    - _Requirements: 1.2_
  - [ ] 9.2 Integrate decorations into card preview
    - Add decoration layer to CardPreview
    - Toggle decorations based on template
    - _Requirements: 2.1, 2.2_
  - [ ] 9.3 Update save handler with loading state
    - Add loading indicator during save
    - Show success/error messages
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 10. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
