// Arabic Fonts Configuration for Card Generator

export interface ArabicFont {
  id: string;
  name: string;
  nameAr: string;
  family: string;
  weight: string[];
  preview: string;
  googleFontsUrl?: string;
  fallback: string;
  characteristics: {
    readability: number; // 1-5 scale
    elegance: number; // 1-5 scale
    modernity: number; // 1-5 scale
    versatility: number; // 1-5 scale
  };
  bestFor: string[];
}

export const ARABIC_FONTS: ArabicFont[] = [
  {
    id: 'cairo',
    name: 'Cairo',
    nameAr: 'القاهرة',
    family: 'Cairo',
    weight: ['400', '500', '600', '700', '800'],
    preview: 'كل عام وأنتم بخير وسعادة',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap',
    fallback: 'system-ui, -apple-system, sans-serif',
    characteristics: {
      readability: 5,
      elegance: 4,
      modernity: 5,
      versatility: 5,
    },
    bestFor: ['modern', 'digital', 'headings', 'body-text'],
  },
  {
    id: 'amiri',
    name: 'Amiri',
    nameAr: 'أميري',
    family: 'Amiri',
    weight: ['400', '700'],
    preview: 'بارك الله في عمركم الجديد',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
    fallback: 'Times, serif',
    characteristics: {
      readability: 4,
      elegance: 5,
      modernity: 2,
      versatility: 3,
    },
    bestFor: ['traditional', 'formal', 'elegant', 'calligraphy'],
  },
  {
    id: 'noto-sans-arabic',
    name: 'Noto Sans Arabic',
    nameAr: 'نوتو سانس العربية',
    family: 'Noto Sans Arabic',
    weight: ['400', '500', '600', '700'],
    preview: 'أجمل التهاني بمناسبة عيدكم',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap',
    fallback: 'Arial, sans-serif',
    characteristics: {
      readability: 5,
      elegance: 3,
      modernity: 4,
      versatility: 5,
    },
    bestFor: ['universal', 'clean', 'professional', 'body-text'],
  },
  {
    id: 'tajawal',
    name: 'Tajawal',
    nameAr: 'تجوال',
    family: 'Tajawal',
    weight: ['400', '500', '700', '800'],
    preview: 'عسى أن تكونوا بخير دائماً',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    fallback: 'Arial, sans-serif',
    characteristics: {
      readability: 4,
      elegance: 4,
      modernity: 4,
      versatility: 4,
    },
    bestFor: ['balanced', 'friendly', 'approachable', 'headings'],
  },
  {
    id: 'ibm-plex-arabic',
    name: 'IBM Plex Arabic',
    nameAr: 'آي بي إم بلكس العربية',
    family: 'IBM Plex Arabic',
    weight: ['400', '500', '600', '700'],
    preview: 'تهانينا الحارة لكم جميعاً',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
    fallback: 'system-ui, sans-serif',
    characteristics: {
      readability: 5,
      elegance: 3,
      modernity: 5,
      versatility: 4,
    },
    bestFor: ['tech', 'corporate', 'modern', 'professional'],
  },
  {
    id: 'almarai',
    name: 'Almarai',
    nameAr: 'المرعي',
    family: 'Almarai',
    weight: ['400', '700', '800'],
    preview: 'أدام الله عليكم الصحة والعافية',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap',
    fallback: 'Arial, sans-serif',
    characteristics: {
      readability: 4,
      elegance: 3,
      modernity: 4,
      versatility: 4,
    },
    bestFor: ['simple', 'clean', 'minimalist', 'body-text'],
  },
  {
    id: 'harmattan',
    name: 'Harmattan',
    nameAr: 'هرمتان',
    family: 'Harmattan',
    weight: ['400', '500', '600', '700'],
    preview: 'كل عام وأنتم إلى الله أقرب',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Harmattan:wght@400;500;600;700&display=swap',
    fallback: 'Arial, sans-serif',
    characteristics: {
      readability: 4,
      elegance: 4,
      modernity: 3,
      versatility: 3,
    },
    bestFor: ['traditional', 'cultural', 'authentic', 'religious'],
  },
  {
    id: 'changa',
    name: 'Changa',
    nameAr: 'تشانجا',
    family: 'Changa',
    weight: ['400', '500', '600', '700', '800'],
    preview: 'عيد ميلاد سعيد ومبارك',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Changa:wght@400;500;600;700;800&display=swap',
    fallback: 'Arial, sans-serif',
    characteristics: {
      readability: 4,
      elegance: 3,
      modernity: 4,
      versatility: 4,
    },
    bestFor: ['bold', 'impactful', 'headings', 'display'],
  },
];

export const DEFAULT_FONT = ARABIC_FONTS[0]; // Cairo as default

// Font utility functions
export function getFontById(id: string): ArabicFont | undefined {
  return ARABIC_FONTS.find((font) => font.id === id);
}

export function getFontFamily(id: string): string {
  const font = getFontById(id);
  return font
    ? `${font.family}, ${font.fallback}`
    : `${DEFAULT_FONT.family}, ${DEFAULT_FONT.fallback}`;
}

export function getFontsByCategory(
  category: keyof ArabicFont['characteristics']
): ArabicFont[] {
  return ARABIC_FONTS.filter(
    (font) => font.characteristics[category] >= 4
  ).sort((a, b) => b.characteristics[category] - a.characteristics[category]);
}

export function getRecommendedFonts(purpose: string): ArabicFont[] {
  return ARABIC_FONTS.filter((font) => font.bestFor.includes(purpose));
}

// Font loading utilities
export function loadGoogleFont(font: ArabicFont): void {
  if (!font.googleFontsUrl) return;

  const existingLink = document.querySelector(
    `link[href="${font.googleFontsUrl}"]`
  );
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = font.googleFontsUrl;
  document.head.appendChild(link);
}

export function loadAllFonts(): void {
  ARABIC_FONTS.forEach((font) => {
    if (font.googleFontsUrl) {
      loadGoogleFont(font);
    }
  });
}

// Font pairing suggestions
export const FONT_PAIRINGS = [
  {
    heading: 'cairo',
    body: 'noto-sans-arabic',
    description: 'حديث ومتوازن',
  },
  {
    heading: 'amiri',
    body: 'noto-sans-arabic',
    description: 'أنيق وكلاسيكي',
  },
  {
    heading: 'changa',
    body: 'tajawal',
    description: 'جريء وودود',
  },
  {
    heading: 'ibm-plex-arabic',
    body: 'almarai',
    description: 'تقني ونظيف',
  },
];

// Font size recommendations based on card size and content
export const FONT_SIZE_RECOMMENDATIONS = {
  mobile: {
    greeting: { min: 14, max: 18, default: 16 },
    name: { min: 12, max: 16, default: 14 },
    message: { min: 10, max: 14, default: 12 },
    signature: { min: 8, max: 12, default: 10 },
  },
  tablet: {
    greeting: { min: 16, max: 22, default: 18 },
    name: { min: 14, max: 18, default: 16 },
    message: { min: 12, max: 16, default: 14 },
    signature: { min: 10, max: 14, default: 12 },
  },
  desktop: {
    greeting: { min: 18, max: 28, default: 22 },
    name: { min: 16, max: 22, default: 18 },
    message: { min: 14, max: 18, default: 16 },
    signature: { min: 12, max: 16, default: 14 },
  },
};

export type DeviceType = keyof typeof FONT_SIZE_RECOMMENDATIONS;
export type TextType = keyof typeof FONT_SIZE_RECOMMENDATIONS.desktop;
