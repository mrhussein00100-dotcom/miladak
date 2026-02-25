# Implementation Plan

## Smart Navbar Implementation

- [x] 1. Create Smart Navbar base structure and types

  - [x] 1.1 Create navbar types and interfaces in types/navbar.ts

    - Define NavItem, ToolCategory, SearchResult interfaces
    - _Requirements: 1.1, 2.1_

  - [x] 1.2 Create SmartNavbar component with scroll detection

    - Implement useScrollPosition hook
    - Add compact/expanded state management
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 1.3 Write property test for scroll state consistency

    - **Property 1: Scroll State Consistency**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 1.4 Write property test for navigation items completeness
    - **Property 2: Navigation Items Completeness**
    - **Validates: Requirements 1.4, 1.5**

- [x] 2. Implement Tools Dropdown

  - [x] 2.1 Create ToolsDropdown component with grid layout

    - Display categorized tools with icons
    - Highlight popular tools
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 2.2 Create tools data configuration

    - Define tool categories and items
    - _Requirements: 2.2, 2.3_

  - [x] 2.3 Write property test for tools dropdown content integrity
    - **Property 3: Tools Dropdown Content Integrity**
    - **Validates: Requirements 2.2, 2.3**

- [x] 3. Implement Mobile Navigation

  - [x] 3.1 Create MobileMenu component with full-screen overlay

    - Implement slide animation
    - Add swipe-to-close gesture
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 3.2 Create BottomNav component for mobile

    - Display main navigation sections
    - _Requirements: 3.5_

  - [x] 3.3 Write property test for mobile touch target accessibility
    - **Property 4: Mobile Touch Target Accessibility**
    - **Validates: Requirements 3.3**

- [x] 4. Implement Search Functionality

  - [x] 4.1 Create SearchBar component with expandable input

    - Implement search icon toggle
    - Add focus animation
    - _Requirements: 4.1_

  - [x] 4.2 Create SearchSuggestions component

    - Display categorized results
    - Implement keyboard navigation
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 4.3 Create search API route for live suggestions

    - Search tools, articles, and pages
    - Return categorized results
    - _Requirements: 4.2, 4.3_

  - [x] 4.4 Write property test for search results categorization
    - **Property 5: Search Results Categorization**
    - **Validates: Requirements 4.2, 4.3**

- [x] 5. Checkpoint - Navbar Complete
  - Ensure all tests pass, ask the user if questions arise.

## Cards Page Implementation

- [x] 6. Create Cards Page base structure

  - [x] 6.1 Create cards page with hero section

    - Add animated birthday elements
    - Display page title and description
    - _Requirements: 5.1, 5.4_

  - [x] 6.2 Create card templates data

    - Define 8+ templates with categories
    - Include preview images and styling
    - _Requirements: 10.1, 10.3_

  - [x] 6.3 Write property test for template count minimum

    - **Property 9: Template Count Minimum**
    - **Validates: Requirements 10.1**

  - [x] 6.4 Write property test for template category validity
    - **Property 10: Template Category Validity**
    - **Validates: Requirements 10.3**

- [x] 7. Implement Card Generator Wizard

  - [x] 7.1 Create CardGenerator component with wizard steps

    - Implement step navigation
    - Add progress indicator
    - _Requirements: 6.1_

  - [x] 7.2 Create Step 1: Name input with validation

    - Add character count
    - Implement validation feedback
    - _Requirements: 6.2_

  - [x] 7.3 Write property test for card input validation

    - **Property 6: Card Input Validation**
    - **Validates: Requirements 6.2**

  - [x] 7.4 Create Step 2: Template selection

    - Display templates in grid/carousel
    - Show live preview on selection
    - _Requirements: 6.3, 10.2_

  - [x] 7.5 Write property test for template selection preview sync

    - **Property 7: Template Selection Preview Sync**
    - **Validates: Requirements 6.3**

  - [x] 7.6 Create Step 3: Message customization

    - Add suggested messages
    - Implement custom message input
    - _Requirements: 6.4_

  - [x] 7.7 Implement form completion validation

    - Enable/disable generate button based on form state
    - _Requirements: 6.5_

  - [x] 7.8 Write property test for form completion button state
    - **Property 8: Form Completion Button State**
    - **Validates: Requirements 6.5**

- [x] 8. Implement Card Preview

  - [x] 8.1 Create CardPreview component

    - Display full-size card preview
    - Add zoom controls
    - _Requirements: 7.1, 7.3_

  - [x] 8.2 Implement mobile preview with gestures
    - Add pinch-to-zoom support
    - Use full-screen modal
    - _Requirements: 7.4, 9.5_

- [x] 9. Implement Share and Download

  - [x] 9.1 Create card image generation utility

    - Generate high-quality PNG
    - Optimize for sharing
    - _Requirements: 8.1_

  - [x] 9.2 Create ShareModal component
    - Add WhatsApp, Facebook, Twitter share buttons
    - Implement copy link functionality
    - _Requirements: 7.2, 8.2, 8.3, 8.4_

- [x] 10. Implement Mobile Responsiveness

  - [x] 10.1 Create mobile-optimized wizard layout

    - Single step display with swipe navigation
    - Prevent keyboard overlap
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 10.2 Create mobile template carousel
    - Horizontal swipeable carousel
    - Touch-friendly selection
    - _Requirements: 9.3_

- [x] 11. Checkpoint - Cards Page Complete
  - Ensure all tests pass, ask the user if questions arise.

## Integration and Polish

- [x] 12. Integrate Smart Navbar

  - [x] 12.1 Replace existing Navbar with SmartNavbar

    - Update layout.tsx
    - Ensure backward compatibility
    - _Requirements: 1.1, 1.5_

  - [x] 12.2 Add cards link to navigation
    - Update navigation items
    - _Requirements: 2.3_

- [x] 13. Final Testing and Polish

  - [x] 13.1 Test all features on desktop and mobile

    - Verify responsive behavior
    - Test all interactions
    - _Requirements: All_

  - [x] 13.2 Optimize performance
    - Lazy load components
    - Optimize animations
    - _Requirements: 1.1, 5.1_

- [x] 14. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
