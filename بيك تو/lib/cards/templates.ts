/**
 * Card Templates - 25 diverse birthday card templates
 * Enhanced with decorations and animations
 */

import {
  DecorationType,
  AnimationConfig,
  getDecorationsForCategory,
  getAnimationForCategory,
  CATEGORY_DECORATION_MAPPING,
  ANIMATION_CONFIGS,
} from './decorations';

export type TemplateCategory =
  | 'classic'
  | 'modern'
  | 'playful'
  | 'elegant'
  | 'minimal';

export interface CardStyle {
  background: string;
  backgroundImage?: string;
  border: string;
  borderRadius: string;
  fontFamily: string;
  color: string;
  textAlign: 'center' | 'right' | 'left';
  padding: string;
  boxShadow?: string;
  decorations?: DecorationType[];
  gradient?: string;
  backdropFilter?: string;
}

export interface DefaultContent {
  greeting: string;
  message: string;
  signature: string;
  emojis: string[];
}

export interface CardTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: TemplateCategory;
  style: CardStyle;
  defaultContent: DefaultContent;
  thumbnail?: string;
  decorations?: DecorationType[];
  animation?: AnimationConfig;
}

/**
 * Get decorations for a template based on its category
 */
export function getTemplateDecorations(
  template: CardTemplate
): DecorationType[] {
  if (template.decorations) return template.decorations;
  return CATEGORY_DECORATION_MAPPING[template.category] || ['stars'];
}

/**
 * Get animation config for a template based on its category
 */
export function getTemplateAnimation(template: CardTemplate): AnimationConfig {
  if (template.animation) return template.animation;
  return ANIMATION_CONFIGS[template.category] || ANIMATION_CONFIGS.minimal;
}

export const TEMPLATE_CATEGORIES: {
  id: TemplateCategory | 'all';
  name: string;
  nameAr: string;
}[] = [
  { id: 'all', name: 'All', nameAr: 'الكل' },
  { id: 'classic', name: 'Classic', nameAr: 'كلاسيكي' },
  { id: 'modern', name: 'Modern', nameAr: 'عصري' },
  { id: 'playful', name: 'Playful', nameAr: 'مرح' },
  { id: 'elegant', name: 'Elegant', nameAr: 'أنيق' },
  { id: 'minimal', name: 'Minimal', nameAr: 'بسيط' },
];

// Classic Templates (5)
const classicTemplates: CardTemplate[] = [
  {
    id: 'golden-elegant',
    name: 'Golden Elegant',
    nameAr: 'الذهبي الأنيق',
    category: 'classic',
    style: {
      background: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%)',
      border: '3px solid #D4AF37',
      borderRadius: '16px',
      fontFamily: 'Amiri, serif',
      color: '#5D4E37',
      textAlign: 'center',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
    },
    defaultContent: {
      greeting: 'كل عام وأنت بخير',
      message: 'أتمنى لك عاماً مليئاً بالسعادة والنجاح',
      signature: 'مع أطيب التمنيات',
      emojis: ['🎂', '✨', '🌟'],
    },
  },
  {
    id: 'classic-roses',
    name: 'Classic Roses',
    nameAr: 'الورود الكلاسيكية',
    category: 'classic',
    style: {
      background: 'linear-gradient(180deg, #FFF5F5 0%, #FFE4E6 100%)',
      border: '2px solid #F9A8D4',
      borderRadius: '20px',
      fontFamily: 'Tajawal, sans-serif',
      color: '#831843',
      textAlign: 'center',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(249, 168, 212, 0.4)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد سعيد',
      message: 'أتمنى لك يوماً مليئاً بالفرح والورود',
      signature: 'بكل الحب',
      emojis: ['🌹', '💕', '🎀'],
    },
  },
  {
    id: 'arabic-calligraphy',
    name: 'Arabic Calligraphy',
    nameAr: 'الخط العربي',
    category: 'classic',
    style: {
      background: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
      border: '4px double #C9A227',
      borderRadius: '12px',
      fontFamily: 'Aref Ruqaa, serif',
      color: '#F7FAFC',
      textAlign: 'center',
      padding: '36px',
      boxShadow: '0 10px 40px rgba(30, 58, 95, 0.5)',
    },
    defaultContent: {
      greeting: 'كل عام وأنتم بألف خير',
      message: 'عام جديد مليء بالبركات والخيرات',
      signature: 'دمتم بود',
      emojis: ['🌙', '⭐', '✨'],
    },
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    nameAr: 'ليلة النجوم',
    category: 'classic',
    style: {
      background:
        'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      border: '2px solid #FCD34D',
      borderRadius: '16px',
      fontFamily: 'Cairo, sans-serif',
      color: '#FEF3C7',
      textAlign: 'center',
      padding: '32px',
      boxShadow: '0 0 30px rgba(252, 211, 77, 0.2)',
    },
    defaultContent: {
      greeting: 'أسعد الله أيامك',
      message: 'كالنجوم في السماء، تضيء حياتنا بوجودك',
      signature: 'مع تمنياتي',
      emojis: ['🌟', '🌙', '💫'],
    },
  },
  {
    id: 'nature-calm',
    name: 'Nature Calm',
    nameAr: 'هدوء الطبيعة',
    category: 'classic',
    style: {
      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      border: '2px solid #10B981',
      borderRadius: '24px',
      fontFamily: 'Noto Sans Arabic, sans-serif',
      color: '#065F46',
      textAlign: 'center',
      padding: '30px',
      boxShadow: '0 6px 24px rgba(16, 185, 129, 0.2)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد مبارك',
      message: 'أتمنى لك حياة خضراء مليئة بالأمل والتفاؤل',
      signature: 'مع خالص الود',
      emojis: ['🌿', '🌸', '🦋'],
    },
  },
];

// Modern Templates (5)
const modernTemplates: CardTemplate[] = [
  {
    id: 'geometric-modern',
    name: 'Geometric Modern',
    nameAr: 'الهندسي العصري',
    category: 'modern',
    style: {
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      border: 'none',
      borderRadius: '0px',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
    },
    defaultContent: {
      greeting: 'Happy Birthday',
      message: 'عام جديد من الإنجازات والنجاحات',
      signature: 'Best Wishes',
      emojis: ['🎯', '🚀', '💎'],
    },
  },
  {
    id: 'gradient-flow',
    name: 'Gradient Flow',
    nameAr: 'التدرج المتدفق',
    category: 'modern',
    style: {
      background:
        'linear-gradient(45deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
      border: 'none',
      borderRadius: '30px',
      fontFamily: 'Rubik, sans-serif',
      color: '#1A1A2E',
      textAlign: 'center',
      padding: '36px',
      boxShadow: '0 15px 50px rgba(255, 107, 107, 0.3)',
    },
    defaultContent: {
      greeting: 'يوم سعيد',
      message: 'كل الألوان الجميلة تجتمع في يومك',
      signature: 'مع الحب',
      emojis: ['🌈', '🎨', '✨'],
    },
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    nameAr: 'الأناقة البسيطة',
    category: 'modern',
    style: {
      background: '#FAFAFA',
      border: '1px solid #E5E5E5',
      borderRadius: '8px',
      fontFamily: 'Inter, sans-serif',
      color: '#171717',
      textAlign: 'center',
      padding: '48px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد سعيد',
      message: 'البساطة هي قمة الأناقة',
      signature: 'مع التقدير',
      emojis: ['🤍', '✨', '🎂'],
    },
  },
  {
    id: 'bold-lines',
    name: 'Bold Lines',
    nameAr: 'الخطوط الجريئة',
    category: 'modern',
    style: {
      background: '#000000',
      border: '4px solid #FFFFFF',
      borderRadius: '0px',
      fontFamily: 'Montserrat, sans-serif',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '44px',
      boxShadow: 'none',
    },
    defaultContent: {
      greeting: 'HAPPY BIRTHDAY',
      message: 'اجعل هذا العام مميزاً',
      signature: 'GO BIG',
      emojis: ['⚡', '🔥', '💪'],
    },
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    nameAr: 'توهج النيون',
    category: 'modern',
    style: {
      background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 100%)',
      border: '2px solid #00FF88',
      borderRadius: '16px',
      fontFamily: 'Orbitron, sans-serif',
      color: '#00FF88',
      textAlign: 'center',
      padding: '36px',
      boxShadow:
        '0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 40px rgba(0, 255, 136, 0.1)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد مشرق',
      message: 'أضئ العالم بابتسامتك',
      signature: 'SHINE ON',
      emojis: ['💚', '✨', '🌟'],
    },
  },
];

// Playful Templates (5)
const playfulTemplates: CardTemplate[] = [
  {
    id: 'cartoon-fun',
    name: 'Cartoon Fun',
    nameAr: 'المرح الكرتوني',
    category: 'playful',
    style: {
      background: 'linear-gradient(180deg, #FFE5B4 0%, #FFCBA4 100%)',
      border: '4px dashed #FF6B35',
      borderRadius: '32px',
      fontFamily: 'Comic Neue, cursive',
      color: '#D63031',
      textAlign: 'center',
      padding: '28px',
      boxShadow: '8px 8px 0px #FF6B35',
    },
    defaultContent: {
      greeting: 'يوووم سعيييد!',
      message: 'وقت الاحتفال والمرح والكيك!',
      signature: 'صديقك المرح',
      emojis: ['🎉', '🎈', '🎁', '🍰'],
    },
  },
  {
    id: 'cute-animals',
    name: 'Cute Animals',
    nameAr: 'الحيوانات اللطيفة',
    category: 'playful',
    style: {
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
      border: '3px solid #FF69B4',
      borderRadius: '40px',
      fontFamily: 'Nunito, sans-serif',
      color: '#C71585',
      textAlign: 'center',
      padding: '32px',
      boxShadow: '0 10px 30px rgba(255, 105, 180, 0.3)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد حلو!',
      message: 'أنت ألطف شخص في العالم',
      signature: 'مع حضن كبير',
      emojis: ['🐻', '🐰', '🦊', '💖'],
    },
  },
  {
    id: 'fireworks',
    name: 'Fireworks',
    nameAr: 'الألعاب النارية',
    category: 'playful',
    style: {
      background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
      border: '3px solid #FFD700',
      borderRadius: '20px',
      fontFamily: 'Baloo Bhaijaan 2, cursive',
      color: '#FFD700',
      textAlign: 'center',
      padding: '36px',
      boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)',
    },
    defaultContent: {
      greeting: 'بووووم! عيد ميلاد سعيد!',
      message: 'فلتشتعل السماء احتفالاً بك!',
      signature: 'مع الكثير من الحب',
      emojis: ['🎆', '🎇', '✨', '🎊'],
    },
  },
  {
    id: 'colorful-bubbles',
    name: 'Colorful Bubbles',
    nameAr: 'الفقاعات الملونة',
    category: 'playful',
    style: {
      background:
        'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
      border: '3px solid #00BCD4',
      borderRadius: '50px',
      fontFamily: 'Quicksand, sans-serif',
      color: '#006064',
      textAlign: 'center',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 188, 212, 0.3)',
    },
    defaultContent: {
      greeting: 'بلوب بلوب! عيد سعيد!',
      message: 'فقاعات من السعادة تحيط بك',
      signature: 'مع فرح كبير',
      emojis: ['🫧', '🎈', '💙', '🌊'],
    },
  },
  {
    id: 'emoji-party',
    name: 'Emoji Party',
    nameAr: 'حفلة الإيموجي',
    category: 'playful',
    style: {
      background:
        'linear-gradient(45deg, #FFEB3B 0%, #FFC107 50%, #FF9800 100%)',
      border: '4px solid #FF5722',
      borderRadius: '24px',
      fontFamily: 'Poppins, sans-serif',
      color: '#BF360C',
      textAlign: 'center',
      padding: '28px',
      boxShadow: '0 12px 40px rgba(255, 152, 0, 0.4)',
    },
    defaultContent: {
      greeting: '🎂 عيد ميلاد سعيد! 🎂',
      message: '🎉🎈🎁 يوم مليء بالمفاجآت! 🎁🎈🎉',
      signature: '😍 مع كل الحب 😍',
      emojis: ['🥳', '🎊', '🎁', '🍰', '🎈'],
    },
  },
];

// Elegant Templates (5)
const elegantTemplates: CardTemplate[] = [
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    nameAr: 'البنفسجي الملكي',
    category: 'elegant',
    style: {
      background:
        'linear-gradient(135deg, #4A0E4E 0%, #7B1FA2 50%, #9C27B0 100%)',
      border: '3px solid #E1BEE7',
      borderRadius: '16px',
      fontFamily: 'Playfair Display, serif',
      color: '#F3E5F5',
      textAlign: 'center',
      padding: '40px',
      boxShadow: '0 15px 50px rgba(156, 39, 176, 0.4)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد ملكي',
      message: 'تستحق كل الفخامة والتميز',
      signature: 'مع أسمى التهاني',
      emojis: ['👑', '💜', '✨'],
    },
  },
  {
    id: 'silver-shine',
    name: 'Silver Shine',
    nameAr: 'اللمعان الفضي',
    category: 'elegant',
    style: {
      background:
        'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #A8A8A8 100%)',
      border: '2px solid #FFFFFF',
      borderRadius: '12px',
      fontFamily: 'Cormorant Garamond, serif',
      color: '#2C2C2C',
      textAlign: 'center',
      padding: '36px',
      boxShadow: '0 10px 40px rgba(192, 192, 192, 0.5)',
    },
    defaultContent: {
      greeting: 'أطيب التهاني',
      message: 'كالفضة النقية، قلبك يلمع بالطيبة',
      signature: 'مع الاحترام',
      emojis: ['🤍', '💎', '✨'],
    },
  },
  {
    id: 'floral-frame',
    name: 'Floral Frame',
    nameAr: 'إطار الزهور',
    category: 'elegant',
    style: {
      background: 'linear-gradient(180deg, #FFFBF0 0%, #FFF5E6 100%)',
      border: '3px solid #D4A574',
      borderRadius: '20px',
      fontFamily: 'Lora, serif',
      color: '#5D4037',
      textAlign: 'center',
      padding: '38px',
      boxShadow: '0 8px 30px rgba(212, 165, 116, 0.3)',
    },
    defaultContent: {
      greeting: 'أجمل التهاني',
      message: 'كالزهور في الربيع، تنشر الجمال أينما كنت',
      signature: 'بكل المودة',
      emojis: ['🌺', '🌸', '🌷'],
    },
  },
  {
    id: 'marble-luxury',
    name: 'Marble Luxury',
    nameAr: 'الرخام الفاخر',
    category: 'elegant',
    style: {
      background:
        'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 50%, #EEEEEE 100%)',
      border: '2px solid #B8860B',
      borderRadius: '8px',
      fontFamily: 'Cinzel, serif',
      color: '#1A1A1A',
      textAlign: 'center',
      padding: '44px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    },
    defaultContent: {
      greeting: 'تهانينا الحارة',
      message: 'عام جديد من التألق والنجاح',
      signature: 'مع فائق التقدير',
      emojis: ['🏛️', '💫', '🎖️'],
    },
  },
  {
    id: 'vintage-charm',
    name: 'Vintage Charm',
    nameAr: 'السحر العتيق',
    category: 'elegant',
    style: {
      background: 'linear-gradient(180deg, #F5E6D3 0%, #E8D5C4 100%)',
      border: '4px double #8B4513',
      borderRadius: '16px',
      fontFamily: 'EB Garamond, serif',
      color: '#5D4037',
      textAlign: 'center',
      padding: '36px',
      boxShadow: '0 6px 24px rgba(139, 69, 19, 0.2)',
    },
    defaultContent: {
      greeting: 'أحر التهاني',
      message: 'كالذكريات الجميلة، تبقى في القلب',
      signature: 'مع الود العميق',
      emojis: ['📜', '🕰️', '🌹'],
    },
  },
];

// Minimal Templates (5)
const minimalTemplates: CardTemplate[] = [
  {
    id: 'clean-white',
    name: 'Clean White',
    nameAr: 'الأبيض النظيف',
    category: 'minimal',
    style: {
      background: '#FFFFFF',
      border: '1px solid #E0E0E0',
      borderRadius: '4px',
      fontFamily: 'Roboto, sans-serif',
      color: '#212121',
      textAlign: 'center',
      padding: '48px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    defaultContent: {
      greeting: 'عيد ميلاد سعيد',
      message: 'أتمنى لك يوماً جميلاً',
      signature: 'مع التحية',
      emojis: ['🎂'],
    },
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    nameAr: 'الباستيل الناعم',
    category: 'minimal',
    style: {
      background: 'linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 100%)',
      border: 'none',
      borderRadius: '16px',
      fontFamily: 'Nunito Sans, sans-serif',
      color: '#9D174D',
      textAlign: 'center',
      padding: '40px',
      boxShadow: '0 4px 16px rgba(157, 23, 77, 0.1)',
    },
    defaultContent: {
      greeting: 'يوم سعيد',
      message: 'أتمنى لك السعادة',
      signature: 'مع الحب',
      emojis: ['🌸', '💕'],
    },
  },
  {
    id: 'single-accent',
    name: 'Single Accent',
    nameAr: 'اللون الواحد',
    category: 'minimal',
    style: {
      background: '#F8FAFC',
      border: '2px solid #3B82F6',
      borderRadius: '8px',
      fontFamily: 'Source Sans Pro, sans-serif',
      color: '#1E40AF',
      textAlign: 'center',
      padding: '44px',
      boxShadow: 'none',
    },
    defaultContent: {
      greeting: 'كل عام وأنت بخير',
      message: 'عام مليء بالخير',
      signature: 'تحياتي',
      emojis: ['💙'],
    },
  },
  {
    id: 'line-art',
    name: 'Line Art',
    nameAr: 'فن الخطوط',
    category: 'minimal',
    style: {
      background: '#FFFEF7',
      border: '1px solid #1A1A1A',
      borderRadius: '0px',
      fontFamily: 'Work Sans, sans-serif',
      color: '#1A1A1A',
      textAlign: 'center',
      padding: '40px',
      boxShadow: 'none',
    },
    defaultContent: {
      greeting: 'Happy Birthday',
      message: 'Wishing you the best',
      signature: 'With love',
      emojis: ['✏️'],
    },
  },
  {
    id: 'zen-simple',
    name: 'Zen Simple',
    nameAr: 'البساطة الهادئة',
    category: 'minimal',
    style: {
      background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)',
      border: 'none',
      borderRadius: '24px',
      fontFamily: 'Zen Kaku Gothic New, sans-serif',
      color: '#166534',
      textAlign: 'center',
      padding: '52px',
      boxShadow: '0 2px 8px rgba(22, 101, 52, 0.1)',
    },
    defaultContent: {
      greeting: 'سلام وسعادة',
      message: 'هدوء وراحة بال في عامك الجديد',
      signature: 'مع السلام',
      emojis: ['🍃', '☘️'],
    },
  },
];

// Export all templates
export const ALL_TEMPLATES: CardTemplate[] = [
  ...classicTemplates,
  ...modernTemplates,
  ...playfulTemplates,
  ...elegantTemplates,
  ...minimalTemplates,
];

// Helper functions
export function getTemplateById(id: string): CardTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: TemplateCategory | 'all'
): CardTemplate[] {
  if (category === 'all') return ALL_TEMPLATES;
  return ALL_TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateCount(): number {
  return ALL_TEMPLATES.length;
}

export function getCategoryCount(category: TemplateCategory): number {
  return ALL_TEMPLATES.filter((t) => t.category === category).length;
}
