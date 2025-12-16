# Design Document: Festive Joy Theme

## Overview

إعادة تصميم شاملة لموقع "ميلادك" بثيم احتفالي جديد يتضمن ثلاثة أوضاع: فاتح، ليلي، وميلادك. التصميم يركز على البساطة والأناقة مع الحفاظ على روح الاحتفال والبهجة.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme System                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Light Mode  │  │ Dark Mode   │  │ Miladak Mode│         │
│  │ (فاتح)      │  │ (ليلي)      │  │ (ميلادك)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    CSS Variables Layer                       │
│  - Colors, Gradients, Shadows, Animations                   │
├─────────────────────────────────────────────────────────────┤
│                    Component Layer                           │
│  - Cards, Buttons, Inputs, Navigation                       │
├─────────────────────────────────────────────────────────────┤
│                    Effects Layer                             │
│  - Confetti, Sparkles, Floating Elements                    │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Theme Provider

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'miladak';
  colors: ColorPalette;
  effects: EffectsConfig;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
  muted: string;
}
```

### 2. Color System

#### Light Mode (الوضع الفاتح)
```css
--primary: #FF6B8A;        /* Coral Rose */
--secondary: #B794F6;      /* Soft Lavender */
--accent: #4FD1C5;         /* Aqua Mint */
--background: #FFF5F5;     /* Warm Cream */
--foreground: #2D3748;     /* Dark Gray */
--card: #FFFFFF;           /* Pure White */
--border: #FED7E2;         /* Light Pink */
--muted: #FFF0F5;          /* Lavender Blush */
```

#### Dark Mode (الوضع الليلي)
```css
--primary: #FF6B8A;        /* Neon Pink */
--secondary: #B794F6;      /* Neon Purple */
--accent: #4FD1C5;         /* Neon Cyan */
--background: #0D0D1A;     /* Deep Space */
--foreground: #F7FAFC;     /* Light Gray */
--card: #1A1A2E;           /* Dark Card */
--border: #2D2D44;         /* Dark Border */
--muted: #16213E;          /* Midnight */
--glow: rgba(255, 107, 138, 0.4);
```

#### Miladak Mode (وضع ميلادك)
```css
--primary: #FF0080;        /* Magenta */
--secondary: #00D4FF;      /* Electric Blue */
--accent: #ADFF2F;         /* Lime Green */
--background: #1A0A2E;     /* Rich Purple */
--foreground: #FFFFFF;     /* White */
--card: #2A1A4E;           /* Purple Card */
--border: transparent;     /* Rainbow Border */
--muted: #3A2A5E;          /* Light Purple */
--confetti: true;
```

### 3. Component Styles

#### Cards
```css
.card-festive {
  border-radius: 20px;
  background: var(--card);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card-festive:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}
```

#### Buttons
```css
.btn-festive {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  transition: all 0.3s ease;
}

.btn-festive:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 107, 138, 0.4);
}
```

#### Glass Effect
```css
.glass-festive {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass-festive {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(255, 107, 138, 0.2);
}
```

## Data Models

### Theme State
```typescript
interface ThemeState {
  currentTheme: 'light' | 'dark' | 'miladak';
  systemPreference: 'light' | 'dark';
  userPreference: 'light' | 'dark' | 'miladak' | 'system';
  reducedMotion: boolean;
}
```

### Animation Config
```typescript
interface AnimationConfig {
  confetti: {
    enabled: boolean;
    particleCount: number;
    colors: string[];
  };
  sparkles: {
    enabled: boolean;
    frequency: number;
  };
  floating: {
    enabled: boolean;
    duration: number;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: WCAG Contrast Compliance
*For any* text element and its background color combination in any theme mode, the contrast ratio SHALL be at least 4.5:1 for normal text and 3:1 for large text.
**Validates: Requirements 1.5**

### Property 2: Animation Performance
*For any* animation running in the theme, the frame rate SHALL maintain at least 60fps on devices with hardware acceleration support.
**Validates: Requirements 7.1**

### Property 3: Theme Transition Consistency
*For any* theme switch operation, all CSS variables SHALL update atomically within the specified 300ms transition duration.
**Validates: Requirements 1.4**

### Property 4: Reduced Motion Respect
*For any* user with prefers-reduced-motion enabled, all decorative animations SHALL be disabled or reduced to essential transitions only.
**Validates: Requirements 3.5**

## Error Handling

1. **Theme Loading Failure**: Fall back to light mode if theme preference cannot be loaded
2. **Animation Performance**: Automatically reduce animation complexity if frame rate drops below 30fps
3. **CSS Variable Fallback**: Provide fallback values for all CSS variables
4. **Backdrop Filter Support**: Use solid backgrounds as fallback for browsers without backdrop-filter support

## Testing Strategy

### Unit Tests
- Verify CSS variable values for each theme mode
- Test theme switching logic
- Validate color contrast calculations

### Property-Based Tests (using fast-check)
- **Property 1**: Generate random color combinations and verify WCAG compliance
- **Property 2**: Measure animation frame rates across different scenarios
- **Property 3**: Test theme transitions with various timing conditions
- **Property 4**: Verify reduced motion behavior with different user preferences

### Integration Tests
- Test theme persistence across page reloads
- Verify theme synchronization across components
- Test animation triggers on user interactions

---

## Visual Design Specifications

### Typography
```css
--font-primary: 'Cairo', sans-serif;
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
--font-size-4xl: 2.5rem;    /* 40px */
```

### Spacing System (4px base)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows
```css
/* Light Mode */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);

/* Dark/Miladak Mode - Glow Shadows */
--shadow-glow-pink: 0 0 20px rgba(255, 107, 138, 0.4);
--shadow-glow-purple: 0 0 20px rgba(183, 148, 246, 0.4);
--shadow-glow-cyan: 0 0 20px rgba(79, 209, 197, 0.4);
```

### Gradients
```css
/* Primary Gradients */
--gradient-primary: linear-gradient(135deg, #FF6B8A 0%, #B794F6 100%);
--gradient-secondary: linear-gradient(135deg, #B794F6 0%, #4FD1C5 100%);
--gradient-accent: linear-gradient(135deg, #4FD1C5 0%, #FF6B8A 100%);

/* Background Gradients */
--gradient-light-bg: linear-gradient(135deg, #FFF5F5 0%, #FFF0F5 50%, #F0FFF4 100%);
--gradient-dark-bg: radial-gradient(ellipse at top, #1A1A2E 0%, #0D0D1A 100%);
--gradient-miladak-bg: linear-gradient(135deg, #1A0A2E 0%, #2A1A4E 50%, #1A0A2E 100%);

/* Rainbow Gradient (for Miladak mode borders) */
--gradient-rainbow: linear-gradient(90deg, #FF0080, #FF8C00, #ADFF2F, #00D4FF, #B794F6, #FF0080);
```

### Animations
```css
/* Keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--glow); }
  50% { box-shadow: 0 0 40px var(--glow); }
}

@keyframes rainbow-border {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(720deg); }
}
```
