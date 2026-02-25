# Implementation Plan

- [x] 1. Create SmartCategoriesFilter component

  - [x] 1.1 Create the SmartCategoriesFilter component with props interface

    - Create `components/articles/SmartCategoriesFilter.tsx`
    - Define props: categories, selectedCategory, onCategorySelect, totalArticles
    - Implement sorting logic to order categories by article count descending
    - Filter out categories with zero articles
    - _Requirements: 1.1, 1.3_

  - [x] 1.2 Implement responsive visible count logic

    - Use useMediaQuery hook to detect viewport width
    - Show 3 categories on mobile (< 768px), 5 on desktop
    - Split categories into visible and overflow arrays
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Write property test for category sorting

    - **Property 1: Top categories by article count**
    - **Validates: Requirements 1.1**

  - [x] 1.4 Write property test for zero-count exclusion

    - **Property 2: Zero-count categories exclusion**
    - **Validates: Requirements 1.3, 4.2**

- [-] 2. Implement CategoryChip and OverflowDropdown

  - [x] 2.1 Create CategoryChip component

    - Display category name with color styling
    - Show article count badge
    - Handle selected state with visual highlight
    - _Requirements: 4.1, 5.1_

  - [x] 2.2 Create OverflowDropdown component

    - "المزيد" button that opens dropdown
    - List all overflow categories with counts
    - Close on outside click
    - _Requirements: 3.1, 3.3, 4.3_

  - [ ] 2.3 Write property test for responsive visible count
    - **Property 3: Responsive visible count**
    - **Validates: Requirements 2.1, 2.2**

- [ ] 3. Integrate with ArticlesPageClient

  - [ ] 3.1 Replace current category buttons with SmartCategoriesFilter

    - Import SmartCategoriesFilter in ArticlesPageClient
    - Pass categories sorted by article count
    - Connect selectedCategory state
    - _Requirements: 1.1, 1.2_

  - [ ] 3.2 Implement "جميع المقالات" option

    - Add "All" option at the beginning
    - Clear filter when selected
    - _Requirements: 5.3_

  - [ ] 3.3 Write property test for category filtering

    - **Property 4: Category filtering correctness**
    - **Validates: Requirements 3.2**

  - [ ] 3.4 Write property test for filter reset
    - **Property 5: All articles filter reset**
    - **Validates: Requirements 5.3**

- [ ] 4. Add animations and polish

  - [ ] 4.1 Add smooth transitions

    - Animate dropdown open/close
    - Animate category selection change
    - _Requirements: 5.2_

  - [ ] 4.2 Style refinements
    - Ensure consistent styling with site theme
    - Add hover effects
    - _Requirements: 5.1_

- [ ] 5. Checkpoint - Make sure all tests are passing
  - Ensure all tests pass, ask the user if questions arise.
