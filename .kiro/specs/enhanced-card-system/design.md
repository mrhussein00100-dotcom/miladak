# Design Document - Enhanced Card System

## Overview

This design document outlines the architecture and implementation details for enhancing the birthday card generation system in miladak_v2. The system will provide 25+ diverse templates, smart content generation, improved save functionality, and SEO optimization.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Cards Page                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Breadcrumbs │  │   Header    │  │  SEO Structured Data│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Template Selector                          ││
│  │  ┌─────────────────────────────────────────────────┐   ││
│  │  │           Category Filter Buttons                │   ││
│  │  └─────────────────────────────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────────────┐   ││
│  │  │           Template Grid (25+ templates)          │   ││
│  │  └─────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Card Editor                                ││
│  │  ┌──────────────────┐  ┌──────────────────────────┐    ││
│  │  │   Preview Panel  │  │   Customization Panel    │    ││
│  │  │                  │  │  - Text Editor           │    ││
│  │  │   [Card Preview] │  │  - Font Selector         │    ││
│  │  │                  │  │  - Size Controls         │    ││
│  │  │                  │  │  - Smart Content         │    ││
│  │  └──────────────────┘  └──────────────────────────────┘    ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Action Buttons                             ││
│  │  [Save] [Download] [Share]                              ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Related Articles Section                   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Keywords Section                           ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. CardTemplate Interface

```typescript
interface CardTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: 'classic' | 'modern' | 'playful' | 'elegant' | 'minimal';
  style: CardStyle;
  defaultContent: DefaultContent;
  thumbnail: string;
}

interface CardStyle {
  background: string;
  backgroundImage?: string;
  border: string;
  borderRadius: string;
  fontFamily: string;
  color: string;
  textAlign: 'center' | 'right' | 'left';
  padding: string;
  boxShadow?: string;
  decorations?: string[];
}

interface DefaultContent {
  greeting: string;
  message: string;
  signature: string;
  emojis: string[];
}
```

### 2. SmartContent Interface

```typescript
interface SmartContentContext {
  occasion: 'birthday' | 'graduation' | 'wedding' | 'newborn' | 'general';
  ageGroup: 'children' | 'teenagers' | 'young_adults' | 'adults' | 'seniors';
  relationship: 'family' | 'friends' | 'colleagues' | 'romantic';
  language: 'ar' | 'en';
}

interface SmartContentResult {
  greetings: string[];
  messages: string[];
  quotes: string[];
  emojis: string[];
}

class SmartContentGenerator {
  generateContent(context: SmartContentContext): SmartContentResult;
  getRandomGreeting(context: SmartContentContext): string;
  getRandomQuote(context: SmartContentContext): string;
  getAgeAppropriateEmojis(ageGroup: string): string[];
}
```

### 3. CardGenerator Component

```typescript
interface CardGeneratorProps {
  initialTemplate?: CardTemplate;
  onSave?: (cardData: CardData) => void;
}

interface CardData {
  templateId: string;
  content: {
    greeting: string;
    message: string;
    signature: string;
    name: string;
    age?: number;
    showAge: boolean;
  };
  customization: {
    fontFamily: string;
    fontSize: number;
    textColor?: string;
  };
}
```

## Data Models

### Template Categories

| Category | Arabic Name | Description                 | Count |
| -------- | ----------- | --------------------------- | ----- |
| classic  | كلاسيكي     | Traditional elegant designs | 5     |
| modern   | عصري        | Contemporary minimalist     | 5     |
| playful  | مرح         | Fun colorful designs        | 5     |
| elegant  | أنيق        | Sophisticated formal        | 5     |
| minimal  | بسيط        | Clean simple designs        | 5     |

### Age Groups for Smart Content

| Age Range | Group Key    | Content Style               |
| --------- | ------------ | --------------------------- |
| 0-12      | children     | Playful, simple, emoji-rich |
| 13-19     | teenagers    | Trendy, casual, modern      |
| 20-35     | young_adults | Inspirational, friendly     |
| 36-55     | adults       | Meaningful, warm            |
| 56+       | seniors      | Respectful, heartfelt       |

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Save operation state consistency

_For any_ card save operation, the UI state (loading indicator, button disabled state) SHALL correctly reflect the operation status throughout the entire save lifecycle.
**Validates: Requirements 1.3**

### Property 2: Template count minimum

_For any_ template selector state, the total number of available templates SHALL be greater than or equal to 25.
**Validates: Requirements 2.1**

### Property 3: Category filter correctness

_For any_ category filter selection, all displayed templates SHALL belong to the selected category, or all templates SHALL be displayed when "All" is selected.
**Validates: Requirements 3.2, 3.3**

### Property 4: Smart content variety

_For any_ two consecutive content generation requests with the same context, the returned content SHALL differ from the previous result.
**Validates: Requirements 4.5**

### Property 5: Age group classification consistency

_For any_ valid age value, the age group classification SHALL be deterministic and fall within exactly one defined age group.
**Validates: Requirements 6.2**

### Property 6: Customization preservation

_For any_ customization applied to a card, switching between preview and edit modes SHALL preserve all customization values.
**Validates: Requirements 5.5**

### Property 7: Template application performance

_For any_ template selection, the template styling SHALL be applied to the preview within 500 milliseconds.
**Validates: Requirements 2.4**

### Property 8: Keywords database retrieval

_For any_ cards page load, the keywords displayed SHALL match the keywords stored in the database.
**Validates: Requirements 8.3, 8.4**

## Error Handling

### Save Operation Errors

```typescript
interface SaveError {
  code: 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT';
  message: string;
  details?: Record<string, string>;
  retryable: boolean;
}

const handleSaveError = (error: SaveError) => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      // Display field-specific validation messages
      break;
    case 'SERVER_ERROR':
      // Display generic error with retry option
      break;
    case 'NETWORK_ERROR':
      // Display network error with retry option
      break;
    case 'TIMEOUT':
      // Display timeout message with retry option
      break;
  }
};
```

### Validation Rules

```typescript
const validateCardData = (data: CardData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.templateId) {
    errors.push({ field: 'template', message: 'يجب اختيار تصميم للبطاقة' });
  }

  if (!data.content.name?.trim()) {
    errors.push({ field: 'name', message: 'يجب إدخال اسم المحتفى به' });
  }

  if (data.content.showAge && !data.content.age) {
    errors.push({ field: 'age', message: 'يجب إدخال العمر أو إلغاء عرضه' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## Testing Strategy

### Unit Testing

- Test SmartContentGenerator for all age groups and occasions
- Test age group classification function
- Test validation functions
- Test template filtering logic

### Property-Based Testing

Using fast-check library for property-based tests:

1. **Template count property test**: Verify minimum 25 templates exist
2. **Category filter property test**: Verify filtered results match category
3. **Age classification property test**: Verify deterministic age group assignment
4. **Content variety property test**: Verify consecutive generations differ
5. **Customization preservation test**: Verify state persistence across mode switches

### Integration Testing

- Test save operation flow end-to-end
- Test template selection and preview update
- Test smart content generation integration
- Test keywords retrieval from database

## Template Designs (25 Templates)

### Classic Category (5)

1. **golden-elegant** - خلفية كريمية مع إطار ذهبي
2. **classic-roses** - تصميم بورود وردية ناعمة
3. **arabic-calligraphy** - تصميم يبرز الخط العربي
4. **starry-night** - خلفية ليلية مع نجوم
5. **nature-calm** - ألوان الطبيعة الهادئة

### Modern Category (5)

6. **geometric-modern** - أشكال هندسية عصرية
7. **gradient-flow** - تدرجات ألوان حديثة
8. **minimal-elegance** - تصميم بسيط وأنيق
9. **bold-lines** - خطوط عريضة وجريئة
10. **neon-glow** - ألوان نيون جذابة

### Playful Category (5)

11. **cartoon-fun** - تصميم كرتوني ملون
12. **cute-animals** - رسومات حيوانات لطيفة
13. **fireworks** - تصميم احتفالي بألعاب نارية
14. **colorful-bubbles** - فقاعات ملونة مرحة
15. **emoji-party** - تصميم مليء بالإيموجي

### Elegant Category (5)

16. **royal-purple** - تصميم ملكي بنفسجي
17. **silver-shine** - لمعان فضي أنيق
18. **floral-frame** - إطار زهور راقي
19. **marble-luxury** - تصميم رخامي فاخر
20. **vintage-charm** - سحر كلاسيكي عتيق

### Minimal Category (5)

21. **clean-white** - أبيض نظيف وبسيط
22. **soft-pastel** - ألوان باستيل ناعمة
23. **single-accent** - لون واحد مميز
24. **line-art** - فن الخطوط البسيطة
25. **zen-simple** - بساطة هادئة
