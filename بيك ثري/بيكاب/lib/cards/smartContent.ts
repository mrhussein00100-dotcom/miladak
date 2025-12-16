/**
 * Smart Content Generator for Birthday Cards
 * Generates age-appropriate greetings, messages, and emojis
 */

export type AgeGroup =
  | 'children'
  | 'teenagers'
  | 'young_adults'
  | 'adults'
  | 'seniors';

export interface SmartContentContext {
  ageGroup: AgeGroup;
  occasion: 'birthday' | 'graduation' | 'wedding' | 'newborn' | 'general';
  language: 'ar' | 'en';
}

export interface SmartContentResult {
  greetings: string[];
  messages: string[];
  quotes: string[];
  emojis: string[];
}

/**
 * Classifies age into age groups
 * Property 5: Age group classification consistency
 */
export function classifyAgeGroup(age: number): AgeGroup {
  if (age < 0) return 'children';
  if (age <= 12) return 'children';
  if (age <= 19) return 'teenagers';
  if (age <= 35) return 'young_adults';
  if (age <= 55) return 'adults';
  return 'seniors';
}

// Content library by age group
const CONTENT_LIBRARY: Record<AgeGroup, SmartContentResult> = {
  children: {
    greetings: [
      'عيد ميلاد سعيد يا بطل! 🎈',
      'كل سنة وأنت طيب يا حبيبي! 🎂',
      'يوم سعيد يا نجم! ⭐',
      'عيد ميلاد مليء بالمرح! 🎉',
      'أحلى عيد ميلاد لأحلى طفل! 🌟',
    ],
    messages: [
      'أتمنى لك يوماً مليئاً بالألعاب والحلوى والمرح!',
      'كبرت سنة وأصبحت أجمل وأذكى!',
      'أتمنى أن تتحقق كل أحلامك الجميلة!',
      'يوم مليء بالبالونات والكيك والهدايا!',
      'أنت أجمل هدية في حياتنا!',
    ],
    quotes: [
      'الأطفال هم زينة الحياة',
      'ابتسامتك تضيء العالم',
      'أنت نجمنا الصغير',
      'كل يوم معك هو عيد',
      'أنت سعادتنا الكبرى',
    ],
    emojis: ['🎈', '🎂', '🎁', '🍰', '🌈', '⭐', '🦋', '🎪', '🍭', '🎠'],
  },
  teenagers: {
    greetings: [
      'عيد ميلاد سعيد! 🎉',
      'كل عام وأنت بألف خير! ✨',
      'Happy Birthday! 🎂',
      'يوم مميز لشخص مميز! 🌟',
      'أحلى عيد ميلاد! 💫',
    ],
    messages: [
      'أتمنى لك عاماً مليئاً بالنجاح والتفوق!',
      'استمتع بيومك واحتفل كما تحب!',
      'أنت رائع وتستحق كل السعادة!',
      'عام جديد من الإنجازات والأحلام!',
      'كن دائماً كما أنت، مميز وفريد!',
    ],
    quotes: [
      'المستقبل ملك لمن يؤمن بجمال أحلامه',
      'كن أنت التغيير الذي تريد رؤيته',
      'الحياة مغامرة جميلة',
      'أحلامك بلا حدود',
      'أنت قادر على كل شيء',
    ],
    emojis: ['🎉', '✨', '🔥', '💪', '🎮', '🎧', '📱', '🌟', '💫', '🚀'],
  },
  young_adults: {
    greetings: [
      'كل عام وأنت بخير! 🎂',
      'عيد ميلاد سعيد ومبارك! ✨',
      'أجمل التهاني بعيد ميلادك! 🌹',
      'يوم سعيد مليء بالفرح! 🎉',
      'عام جديد من النجاح والتألق! 💫',
    ],
    messages: [
      'أتمنى لك عاماً مليئاً بالإنجازات والسعادة!',
      'كل الأمنيات الجميلة في يومك المميز!',
      'أتمنى أن يحمل لك هذا العام كل ما تتمناه!',
      'استمر في التألق والنجاح!',
      'أنت تستحق كل الخير والسعادة!',
    ],
    quotes: [
      'النجاح رحلة وليس وجهة',
      'كل يوم هو فرصة جديدة',
      'أحلامك تستحق المحاولة',
      'الحياة جميلة مع من نحب',
      'كن شجاعاً واتبع قلبك',
    ],
    emojis: ['🎂', '✨', '🌹', '💐', '🎁', '🥂', '💫', '🌟', '❤️', '🎊'],
  },
  adults: {
    greetings: [
      'كل عام وأنت بألف خير! 🌹',
      'أطيب التهاني بعيد ميلادك! ✨',
      'عام سعيد مليء بالبركات! 🎂',
      'أجمل الأمنيات في يومك! 💐',
      'تهانينا الحارة! 🎉',
    ],
    messages: [
      'أتمنى لك عاماً مليئاً بالصحة والسعادة والنجاح!',
      'كل عام وأنت أقرب إلى تحقيق أحلامك!',
      'أتمنى أن يكون هذا العام الأفضل في حياتك!',
      'دمت بخير وعافية وسعادة!',
      'أتمنى لك حياة مليئة بالحب والسلام!',
    ],
    quotes: [
      'الحكمة تأتي مع السنين',
      'كل عام يحمل حكمة جديدة',
      'الحياة أجمل مع الخبرة',
      'النضج هو أن تعرف ما يهم حقاً',
      'السعادة في الأشياء البسيطة',
    ],
    emojis: ['🌹', '✨', '🎂', '💐', '🥂', '🎁', '💝', '🌺', '🍾', '🎊'],
  },
  seniors: {
    greetings: [
      'كل عام وأنت بخير وعافية! 🌹',
      'أطيب التهاني وأحرها! ✨',
      'عام مبارك مليء بالصحة! 🎂',
      'دمت لنا ودام عطاؤك! 💐',
      'أجمل التهاني من القلب! ❤️',
    ],
    messages: [
      'أتمنى لك عاماً مليئاً بالصحة والعافية والسعادة!',
      'دمت لنا نوراً وبركة في حياتنا!',
      'أطال الله في عمرك وأدام عليك الصحة والعافية!',
      'أنت قدوتنا ومصدر إلهامنا!',
      'كل عام وأنت بخير يا غالي/غالية!',
    ],
    quotes: [
      'الحكمة تاج على رؤوس الكبار',
      'العمر ليس بالسنين بل بالذكريات الجميلة',
      'أنت كنز لا يقدر بثمن',
      'خبرتك نور يضيء طريقنا',
      'دعواتك سر نجاحنا',
    ],
    emojis: ['🌹', '❤️', '💐', '🎂', '✨', '🕊️', '🌺', '💝', '🙏', '🌸'],
  },
};

// Track previous suggestions to ensure variety
let previousSuggestions: Map<string, number> = new Map();

/**
 * Generates smart content based on context
 */
export function generateSmartContent(
  context: SmartContentContext
): SmartContentResult {
  return CONTENT_LIBRARY[context.ageGroup];
}

/**
 * Gets a random greeting ensuring variety
 * Property 4: Smart content variety
 */
export function getRandomGreeting(ageGroup: AgeGroup): string {
  const greetings = CONTENT_LIBRARY[ageGroup].greetings;
  const key = `greeting_${ageGroup}`;
  let lastIndex = previousSuggestions.get(key) ?? -1;

  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * greetings.length);
  } while (newIndex === lastIndex && greetings.length > 1);

  previousSuggestions.set(key, newIndex);
  return greetings[newIndex];
}

/**
 * Gets a random message ensuring variety
 */
export function getRandomMessage(ageGroup: AgeGroup): string {
  const messages = CONTENT_LIBRARY[ageGroup].messages;
  const key = `message_${ageGroup}`;
  let lastIndex = previousSuggestions.get(key) ?? -1;

  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * messages.length);
  } while (newIndex === lastIndex && messages.length > 1);

  previousSuggestions.set(key, newIndex);
  return messages[newIndex];
}

/**
 * Gets a random quote
 */
export function getRandomQuote(ageGroup: AgeGroup): string {
  const quotes = CONTENT_LIBRARY[ageGroup].quotes;
  const key = `quote_${ageGroup}`;
  let lastIndex = previousSuggestions.get(key) ?? -1;

  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === lastIndex && quotes.length > 1);

  previousSuggestions.set(key, newIndex);
  return quotes[newIndex];
}

/**
 * Gets age-appropriate emojis
 */
export function getAgeAppropriateEmojis(ageGroup: AgeGroup): string[] {
  return CONTENT_LIBRARY[ageGroup].emojis;
}

/**
 * Resets suggestion history (for testing)
 */
export function resetSuggestionHistory(): void {
  previousSuggestions.clear();
}
