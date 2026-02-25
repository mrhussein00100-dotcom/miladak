/**
 * Chinese Zodiac Calculations
 * Feature: frontend-database-integration
 * Requirements: 1.1, 3.2, 3.4
 */

export interface ChineseZodiacInfo {
  animal: string;
  animalEn: string;
  element: string;
  elementEn: string;
  traits: string[];
  description: string;
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
}

// Chinese zodiac animals in order (starting from Rat)
const ZODIAC_ANIMALS = [
  { ar: 'الفأر', en: 'Rat' },
  { ar: 'الثور', en: 'Ox' },
  { ar: 'النمر', en: 'Tiger' },
  { ar: 'الأرنب', en: 'Rabbit' },
  { ar: 'التنين', en: 'Dragon' },
  { ar: 'الأفعى', en: 'Snake' },
  { ar: 'الحصان', en: 'Horse' },
  { ar: 'الماعز', en: 'Goat' },
  { ar: 'القرد', en: 'Monkey' },
  { ar: 'الديك', en: 'Rooster' },
  { ar: 'الكلب', en: 'Dog' },
  { ar: 'الخنزير', en: 'Pig' },
];

// Five elements cycle
const ELEMENTS = [
  { ar: 'الخشب', en: 'Wood' },
  { ar: 'النار', en: 'Fire' },
  { ar: 'الأرض', en: 'Earth' },
  { ar: 'المعدن', en: 'Metal' },
  { ar: 'الماء', en: 'Water' },
];

// Zodiac traits
const ZODIAC_TRAITS: Record<string, string[]> = {
  الفأر: ['ذكي', 'سريع البديهة', 'طموح', 'مرن', 'اجتماعي'],
  الثور: ['صبور', 'موثوق', 'قوي', 'مثابر', 'عملي'],
  النمر: ['شجاع', 'واثق', 'تنافسي', 'غير متوقع', 'كريم'],
  الأرنب: ['لطيف', 'أنيق', 'حذر', 'مسؤول', 'رحيم'],
  التنين: ['واثق', 'ذكي', 'متحمس', 'طموح', 'قائد'],
  الأفعى: ['حكيم', 'غامض', 'أنيق', 'حدسي', 'متأمل'],
  الحصان: ['نشيط', 'مستقل', 'صبور', 'ودود', 'مغامر'],
  الماعز: ['هادئ', 'لطيف', 'متعاطف', 'مبدع', 'مثابر'],
  القرد: ['ذكي', 'فضولي', 'مرح', 'مبتكر', 'واسع الحيلة'],
  الديك: ['ملاحظ', 'مجتهد', 'شجاع', 'موهوب', 'واثق'],
  الكلب: ['مخلص', 'صادق', 'ودود', 'حذر', 'عادل'],
  الخنزير: ['كريم', 'رحيم', 'مجتهد', 'اجتماعي', 'متفائل'],
};

// Zodiac compatibility
const ZODIAC_COMPATIBILITY: Record<string, string[]> = {
  الفأر: ['التنين', 'القرد', 'الثور'],
  الثور: ['الفأر', 'الأفعى', 'الديك'],
  النمر: ['الحصان', 'الكلب', 'الخنزير'],
  الأرنب: ['الماعز', 'الخنزير', 'الكلب'],
  التنين: ['الفأر', 'القرد', 'الديك'],
  الأفعى: ['الثور', 'الديك', 'القرد'],
  الحصان: ['النمر', 'الماعز', 'الكلب'],
  الماعز: ['الأرنب', 'الحصان', 'الخنزير'],
  القرد: ['الفأر', 'التنين', 'الأفعى'],
  الديك: ['الثور', 'التنين', 'الأفعى'],
  الكلب: ['النمر', 'الأرنب', 'الحصان'],
  الخنزير: ['النمر', 'الأرنب', 'الماعز'],
};

// Lucky numbers for each zodiac
const LUCKY_NUMBERS: Record<string, number[]> = {
  الفأر: [2, 3],
  الثور: [1, 4],
  النمر: [1, 3, 4],
  الأرنب: [3, 4, 6],
  التنين: [1, 6, 7],
  الأفعى: [2, 8, 9],
  الحصان: [2, 3, 7],
  الماعز: [2, 7],
  القرد: [4, 9],
  الديك: [5, 7, 8],
  الكلب: [3, 4, 9],
  الخنزير: [2, 5, 8],
};

// Lucky colors for each zodiac
const LUCKY_COLORS: Record<string, string[]> = {
  الفأر: ['الأزرق', 'الذهبي', 'الأخضر'],
  الثور: ['الأبيض', 'الأصفر', 'الأخضر'],
  النمر: ['الأزرق', 'الرمادي', 'البرتقالي'],
  الأرنب: ['الوردي', 'الأرجواني', 'الأزرق'],
  التنين: ['الذهبي', 'الفضي', 'الأبيض'],
  الأفعى: ['الأسود', 'الأحمر', 'الأصفر'],
  الحصان: ['الأصفر', 'الأخضر'],
  الماعز: ['البني', 'الأحمر', 'الأرجواني'],
  القرد: ['الأبيض', 'الأزرق', 'الذهبي'],
  الديك: ['الذهبي', 'البني', 'الأصفر'],
  الكلب: ['الأحمر', 'الأخضر', 'الأرجواني'],
  الخنزير: ['الأصفر', 'الرمادي', 'البني'],
};

// Zodiac descriptions
const ZODIAC_DESCRIPTIONS: Record<string, string> = {
  الفأر:
    'يتميز مواليد برج الفأر بالذكاء الحاد وسرعة البديهة. هم أشخاص طموحون ومرنون، يتكيفون بسهولة مع المواقف المختلفة.',
  الثور:
    'يتميز مواليد برج الثور بالصبر والمثابرة. هم أشخاص موثوقون وعمليون، يعملون بجد لتحقيق أهدافهم.',
  النمر:
    'يتميز مواليد برج النمر بالشجاعة والثقة بالنفس. هم قادة بالفطرة، يحبون المغامرة والتحديات.',
  الأرنب:
    'يتميز مواليد برج الأرنب باللطف والأناقة. هم أشخاص حذرون ومسؤولون، يهتمون بمشاعر الآخرين.',
  التنين:
    'يتميز مواليد برج التنين بالثقة والذكاء. هم أشخاص طموحون ومتحمسون، يسعون دائماً للتميز.',
  الأفعى:
    'يتميز مواليد برج الأفعى بالحكمة والغموض. هم أشخاص حدسيون ومتأملون، يفكرون بعمق قبل اتخاذ القرارات.',
  الحصان:
    'يتميز مواليد برج الحصان بالنشاط والاستقلالية. هم أشخاص ودودون ومغامرون، يحبون الحرية.',
  الماعز:
    'يتميز مواليد برج الماعز بالهدوء واللطف. هم أشخاص مبدعون ومتعاطفون، يقدرون الجمال والفن.',
  القرد:
    'يتميز مواليد برج القرد بالذكاء والفضول. هم أشخاص مرحون ومبتكرون، يجدون حلولاً إبداعية للمشاكل.',
  الديك:
    'يتميز مواليد برج الديك بالملاحظة والاجتهاد. هم أشخاص شجعان وموهوبون، يهتمون بالتفاصيل.',
  الكلب:
    'يتميز مواليد برج الكلب بالإخلاص والصدق. هم أشخاص ودودون وعادلون، يدافعون عن الحق.',
  الخنزير:
    'يتميز مواليد برج الخنزير بالكرم والرحمة. هم أشخاص اجتماعيون ومتفائلون، يحبون مساعدة الآخرين.',
};

/**
 * Calculate Chinese zodiac animal for a given year
 * The cycle starts from year 4 (Rat year)
 */
export function calculateZodiac(year: number): string {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12].ar;
}

/**
 * Calculate Chinese zodiac animal in English
 */
export function calculateZodiacEn(year: number): string {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12].en;
}

/**
 * Calculate the element for a given year
 * Elements cycle every 2 years within a 10-year cycle
 */
export function calculateElement(year: number): string {
  const index = Math.floor(((year - 4) % 10) / 2);
  return ELEMENTS[index >= 0 ? index : index + 5].ar;
}

/**
 * Calculate the element in English
 */
export function calculateElementEn(year: number): string {
  const index = Math.floor(((year - 4) % 10) / 2);
  return ELEMENTS[index >= 0 ? index : index + 5].en;
}

/**
 * Get complete zodiac information for a year
 */
export function getZodiacInfo(year: number): ChineseZodiacInfo {
  const animal = calculateZodiac(year);
  const animalEn = calculateZodiacEn(year);
  const element = calculateElement(year);
  const elementEn = calculateElementEn(year);

  return {
    animal,
    animalEn,
    element,
    elementEn,
    traits: ZODIAC_TRAITS[animal] || [],
    description: ZODIAC_DESCRIPTIONS[animal] || '',
    compatibility: ZODIAC_COMPATIBILITY[animal] || [],
    luckyNumbers: LUCKY_NUMBERS[animal] || [],
    luckyColors: LUCKY_COLORS[animal] || [],
  };
}

/**
 * Get years for a specific zodiac animal within a range
 */
export function getZodiacYears(
  animal: string,
  startYear = 1900,
  endYear = 2100
): number[] {
  const years: number[] = [];
  const animalIndex = ZODIAC_ANIMALS.findIndex(
    (z) => z.ar === animal || z.en === animal
  );

  if (animalIndex === -1) return years;

  for (let year = startYear; year <= endYear; year++) {
    const index = (year - 4) % 12;
    if ((index >= 0 ? index : index + 12) === animalIndex) {
      years.push(year);
    }
  }

  return years;
}

/**
 * Get all zodiac animals with their info
 */
export function getAllZodiacAnimals(): Array<{
  ar: string;
  en: string;
  traits: string[];
  description: string;
}> {
  return ZODIAC_ANIMALS.map((animal) => ({
    ar: animal.ar,
    en: animal.en,
    traits: ZODIAC_TRAITS[animal.ar] || [],
    description: ZODIAC_DESCRIPTIONS[animal.ar] || '',
  }));
}

/**
 * Validate year is within reasonable range
 */
export function isValidYear(year: number): boolean {
  return year >= 1900 && year <= 2100 && Number.isInteger(year);
}
