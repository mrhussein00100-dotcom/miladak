/**
 * Decorations Configuration for Beautiful Cards
 * Contains decoration types, positions, and mappings to template categories
 */

export type DecorationType =
  | 'balloons'
  | 'stars'
  | 'confetti'
  | 'hearts'
  | 'sparkles'
  | 'flowers'
  | 'ribbons'
  | 'gems';

export type TemplateCategory =
  | 'classic'
  | 'modern'
  | 'playful'
  | 'elegant'
  | 'minimal';

export interface Position {
  x: number; // percentage from left
  y: number; // percentage from top
  rotation?: number; // degrees
  scale?: number; // scale factor
}

export interface DecorationConfig {
  type: DecorationType;
  positions: Position[];
  colors: string[];
  animated: boolean;
  zIndex: number;
  opacity?: number;
  size?: 'small' | 'medium' | 'large';
}

export interface AnimationConfig {
  entrance: 'fade' | 'slide' | 'scale' | 'bounce';
  textEffect: 'shimmer' | 'glow' | 'pulse' | 'none';
  decorationEffect: 'float' | 'pulse' | 'rotate' | 'bounce';
  duration: number; // in seconds
}

/**
 * Decoration configurations for different types
 */
export const DECORATION_CONFIGS: Record<DecorationType, DecorationConfig> = {
  balloons: {
    type: 'balloons',
    positions: [
      { x: 10, y: 20, rotation: -15, scale: 0.8 },
      { x: 85, y: 15, rotation: 10, scale: 0.9 },
      { x: 5, y: 70, rotation: -10, scale: 0.7 },
      { x: 90, y: 75, rotation: 15, scale: 0.8 },
    ],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    animated: true,
    zIndex: 1,
    opacity: 0.8,
    size: 'medium',
  },

  stars: {
    type: 'stars',
    positions: [
      { x: 15, y: 10, rotation: 0, scale: 0.6 },
      { x: 80, y: 12, rotation: 45, scale: 0.8 },
      { x: 20, y: 85, rotation: -30, scale: 0.7 },
      { x: 85, y: 80, rotation: 60, scale: 0.5 },
      { x: 50, y: 5, rotation: 15, scale: 0.9 },
      { x: 5, y: 50, rotation: -45, scale: 0.6 },
    ],
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98'],
    animated: true,
    zIndex: 2,
    opacity: 0.7,
    size: 'small',
  },

  confetti: {
    type: 'confetti',
    positions: [
      { x: 20, y: 5, rotation: 45, scale: 0.5 },
      { x: 40, y: 8, rotation: -30, scale: 0.6 },
      { x: 60, y: 3, rotation: 60, scale: 0.4 },
      { x: 80, y: 7, rotation: -45, scale: 0.5 },
      { x: 25, y: 90, rotation: 30, scale: 0.6 },
      { x: 70, y: 88, rotation: -60, scale: 0.4 },
    ],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    animated: true,
    zIndex: 3,
    opacity: 0.9,
    size: 'small',
  },

  hearts: {
    type: 'hearts',
    positions: [
      { x: 12, y: 25, rotation: -10, scale: 0.7 },
      { x: 88, y: 20, rotation: 15, scale: 0.8 },
      { x: 8, y: 75, rotation: -20, scale: 0.6 },
      { x: 92, y: 70, rotation: 10, scale: 0.7 },
    ],
    colors: ['#FF69B4', '#FF1493', '#DC143C', '#B22222', '#FF6347'],
    animated: true,
    zIndex: 2,
    opacity: 0.8,
    size: 'medium',
  },

  sparkles: {
    type: 'sparkles',
    positions: [
      { x: 25, y: 15, rotation: 0, scale: 0.5 },
      { x: 75, y: 18, rotation: 90, scale: 0.6 },
      { x: 30, y: 80, rotation: 45, scale: 0.4 },
      { x: 70, y: 85, rotation: -45, scale: 0.5 },
      { x: 10, y: 40, rotation: 30, scale: 0.3 },
      { x: 90, y: 45, rotation: -30, scale: 0.4 },
    ],
    colors: ['#FFD700', '#FFFF00', '#FFA500', '#FF69B4', '#87CEEB'],
    animated: true,
    zIndex: 4,
    opacity: 0.6,
    size: 'small',
  },

  flowers: {
    type: 'flowers',
    positions: [
      { x: 5, y: 30, rotation: -15, scale: 0.8 },
      { x: 95, y: 25, rotation: 20, scale: 0.9 },
      { x: 10, y: 80, rotation: -25, scale: 0.7 },
      { x: 90, y: 85, rotation: 15, scale: 0.8 },
    ],
    colors: ['#FF69B4', '#DDA0DD', '#98FB98', '#FFB6C1', '#F0E68C'],
    animated: true,
    zIndex: 1,
    opacity: 0.7,
    size: 'medium',
  },

  ribbons: {
    type: 'ribbons',
    positions: [
      { x: 0, y: 10, rotation: 45, scale: 1.0 },
      { x: 100, y: 90, rotation: -45, scale: 1.0 },
    ],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    animated: false,
    zIndex: 0,
    opacity: 0.9,
    size: 'large',
  },

  gems: {
    type: 'gems',
    positions: [
      { x: 20, y: 20, rotation: 30, scale: 0.6 },
      { x: 80, y: 25, rotation: -30, scale: 0.7 },
      { x: 15, y: 75, rotation: 45, scale: 0.5 },
      { x: 85, y: 80, rotation: -45, scale: 0.6 },
    ],
    colors: ['#9B59B6', '#3498DB', '#E74C3C', '#F39C12', '#2ECC71'],
    animated: true,
    zIndex: 2,
    opacity: 0.8,
    size: 'small',
  },
};

/**
 * Animation configurations for different effects
 */
export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  playful: {
    entrance: 'bounce',
    textEffect: 'pulse',
    decorationEffect: 'float',
    duration: 2,
  },
  elegant: {
    entrance: 'fade',
    textEffect: 'shimmer',
    decorationEffect: 'pulse',
    duration: 3,
  },
  modern: {
    entrance: 'slide',
    textEffect: 'glow',
    decorationEffect: 'rotate',
    duration: 2.5,
  },
  classic: {
    entrance: 'scale',
    textEffect: 'none',
    decorationEffect: 'float',
    duration: 2,
  },
  minimal: {
    entrance: 'fade',
    textEffect: 'none',
    decorationEffect: 'pulse',
    duration: 1.5,
  },
};

/**
 * Mapping of template categories to their decoration types
 */
export const CATEGORY_DECORATION_MAPPING: Record<
  TemplateCategory,
  DecorationType[]
> = {
  playful: ['balloons', 'confetti', 'stars'],
  elegant: ['sparkles', 'flowers', 'gems'],
  modern: ['stars', 'sparkles', 'ribbons'],
  classic: ['flowers', 'hearts', 'ribbons'],
  minimal: ['stars', 'sparkles'],
};

/**
 * Get decorations for a specific template category
 */
export function getDecorationsForCategory(
  category: TemplateCategory
): DecorationConfig[] {
  const decorationTypes = CATEGORY_DECORATION_MAPPING[category] || ['stars'];
  return decorationTypes.map((type) => DECORATION_CONFIGS[type]);
}

/**
 * Get animation config for a template category
 */
export function getAnimationForCategory(
  category: TemplateCategory
): AnimationConfig {
  return ANIMATION_CONFIGS[category] || ANIMATION_CONFIGS.minimal;
}

/**
 * Get decoration emoji/symbol for rendering
 */
export function getDecorationSymbol(type: DecorationType): string {
  const symbols: Record<DecorationType, string> = {
    balloons: '🎈',
    stars: '⭐',
    confetti: '🎊',
    hearts: '💖',
    sparkles: '✨',
    flowers: '🌸',
    ribbons: '🎀',
    gems: '💎',
  };

  return symbols[type] || '✨';
}

/**
 * Get all decoration types
 */
export function getAllDecorationTypes(): DecorationType[] {
  return Object.keys(DECORATION_CONFIGS) as DecorationType[];
}
