/**
 * Arabic Fonts Configuration for Beautiful Cards
 * Contains 8 carefully selected Arabic fonts from Google Fonts
 */

export interface FontConfig {
  id: string;
  name: string;
  nameAr: string;
  family: string;
  weights: number[];
  preview: string;
  googleFontsUrl: string;
}

export const ARABIC_FONTS: FontConfig[] = [
  {
    id: 'cairo',
    name: 'Cairo',
    nameAr: 'القاهرة',
    family: 'Cairo',
    weights: [400, 600, 700],
    preview: 'عيد ميلاد سعيد 🎉',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&subset=arabic&display=swap',
  },
  {
    id: 'tajawal',
    name: 'Tajawal',
    nameAr: 'تجوال',
    family: 'Tajawal',
    weights: [400, 500, 700],
    preview: 'كل عام وأنت بخير ✨',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&subset=arabic&display=swap',
  },
  {
    id: 'amiri',
    name: 'Amiri',
    nameAr: 'أميري',
    family: 'Amiri',
    weights: [400, 700],
    preview: 'أطيب التمنيات 🌟',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&subset=arabic&display=swap',
  },
  {
    id: 'almarai',
    name: 'Almarai',
    nameAr: 'المراعي',
    family: 'Almarai',
    weights: [400, 700, 800],
    preview: 'مبارك عليك 🎊',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&subset=arabic&display=swap',
  },
  {
    id: 'changa',
    name: 'Changa',
    nameAr: 'شانجا',
    family: 'Changa',
    weights: [400, 600, 700],
    preview: 'يوم سعيد 🎈',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Changa:wght@400;600;700&subset=arabic&display=swap',
  },
  {
    id: 'lateef',
    name: 'Lateef',
    nameAr: 'لطيف',
    family: 'Lateef',
    weights: [400, 700],
    preview: 'تهانينا القلبية 💖',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&subset=arabic&display=swap',
  },
  {
    id: 'scheherazade',
    name: 'Scheherazade',
    nameAr: 'شهرزاد',
    family: 'Scheherazade New',
    weights: [400, 700],
    preview: 'أجمل الأمنيات 🌹',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&subset=arabic&display=swap',
  },
  {
    id: 'harmattan',
    name: 'Harmattan',
    nameAr: 'هرمتان',
    family: 'Harmattan',
    weights: [400, 600, 700],
    preview: 'عام جديد سعيد 🎆',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Harmattan:wght@400;600;700&subset=arabic&display=swap',
  },
];

/**
 * Get font configuration by ID
 */
export function getFontById(id: string): FontConfig | undefined {
  return ARABIC_FONTS.find((font) => font.id === id);
}

/**
 * Get all Google Fonts URLs for preloading
 */
export function getAllFontUrls(): string[] {
  return ARABIC_FONTS.map((font) => font.googleFontsUrl);
}

/**
 * Get font family CSS value
 * Returns Cairo as fallback if fontId is undefined or not found
 */
export function getFontFamily(fontId?: string | null): string {
  if (!fontId) {
    return "'Cairo', sans-serif";
  }
  const font = getFontById(fontId);
  if (!font || !font.family) {
    return "'Cairo', sans-serif";
  }
  return `'${font.family}', sans-serif`;
}

/**
 * Default font configuration
 */
export const DEFAULT_FONT = ARABIC_FONTS[0]; // Cairo
