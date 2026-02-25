
export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  dates: string;
  traits: string[];
  description: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'الحمل',
    symbol: '♈',
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'المريخ',
    dates: '21 مارس - 19 أبريل',
    traits: ['شجاع', 'واثق', 'متفائل', 'صادق', 'عاطفي'],
    description: 'الحمل هو أول برج في دائرة الأبراج، ويتميز بالطاقة العالية والحماس. مواليد الحمل قادة بالفطرة، يحبون التحديات والمغامرات.'
  },
  {
    id: 'taurus',
    name: 'الثور',
    symbol: '♉',
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'الزهرة',
    dates: '20 أبريل - 20 مايو',
    traits: ['موثوق', 'صبور', 'عملي', 'مخلص', 'مسؤول'],
    description: 'الثور برج ترابي يقدر الاستقرار والراحة. يتميز مواليده بالصبر والعناد الإيجابي لتحقيق أهدافهم.'
  },
  {
    id: 'gemini',
    name: 'الجوزاء',
    symbol: '♊',
    element: 'Air',
    quality: 'Mutable',
    ruler: 'عطارد',
    dates: '21 مايو - 20 يونيو',
    traits: ['متكيف', 'اجتماعي', 'ذكي', 'فضولي', 'مرح'],
    description: 'الجوزاء برج هوائي يتميز بالذكاء وسرعة البديهة. يحب التواصل والتعلم، لكنه قد يكون متردداً في بعض الأحيان.'
  },
  {
    id: 'cancer',
    name: 'السرطان',
    symbol: '♋',
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'القمر',
    dates: '21 يونيو - 22 يوليو',
    traits: ['عاطفي', 'خيالي', 'مخلص', 'حساس', 'متعاطف'],
    description: 'السرطان برج مائي عاطفي جداً، يرتبط بقوة بالأسرة والمنزل. يتميز بالحدس القوي والقدرة على رعاية الآخرين.'
  },
  {
    id: 'leo',
    name: 'الأسد',
    symbol: '♌',
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'الشمس',
    dates: '23 يوليو - 22 أغسطس',
    traits: ['كريم', 'دافئ القلب', 'مبدع', 'مرح', 'قيادي'],
    description: 'الأسد برج ناري يحب الأضواء والقيادة. يتميز بالكرم والثقة بالنفس، ويتمتع بشخصية جذابة وقوية.'
  },
  {
    id: 'virgo',
    name: 'العذراء',
    symbol: '♍',
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'عطارد',
    dates: '23 أغسطس - 22 سبتمبر',
    traits: ['محلل', 'مجتهد', 'عملي', 'دقيق', 'لطيف'],
    description: 'العذراء برج ترابي دقيق ومنظم. يهتم بالتفاصيل ويسعى للكمال، ويحب مساعدة الآخرين بطرق عملية.'
  },
  {
    id: 'libra',
    name: 'الميزان',
    symbol: '♎',
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'الزهرة',
    dates: '23 سبتمبر - 22 أكتوبر',
    traits: ['دبلوماسي', 'رومانسي', 'اجتماعي', 'عادل', 'متناغم'],
    description: 'الميزان برج هوائي يبحث دائماً عن التوازن والعدل. يكره النزاعات ويحب الجمال والفن والعلاقات الاجتماعية.'
  },
  {
    id: 'scorpio',
    name: 'العقرب',
    symbol: '♏',
    element: 'Water',
    quality: 'Fixed',
    ruler: 'بلوتو',
    dates: '23 أكتوبر - 21 نوفمبر',
    traits: ['شغوف', 'شجاع', 'صديق حقيقي', 'واسع الحيلة', 'كتوم'],
    description: 'العقرب برج مائي غامض وقوي. يتميز بالشغف والعمق العاطفي، ولديه قدرة كبيرة على التحليل وكشف الأسرار.'
  },
  {
    id: 'sagittarius',
    name: 'القوس',
    symbol: '♐',
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'المشتري',
    dates: '22 نوفمبر - 21 ديسمبر',
    traits: ['كريم', 'مثالي', 'مرح', 'يحب السفر', 'صريح'],
    description: 'القوس برج ناري يعشق الحرية والمغامرة. متفائل جداً ويحب استكشاف ثقافات وأفكار جديدة.'
  },
  {
    id: 'capricorn',
    name: 'الجدي',
    symbol: '♑',
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'زحل',
    dates: '22 ديسمبر - 19 يناير',
    traits: ['مسؤول', 'منضبط', 'مدير جيد', 'طموح', 'عملي'],
    description: 'الجدي برج ترابي طموح وجاد. يعمل بجد لتحقيق أهدافه ويقدر التقاليد والنظام والمسؤولية.'
  },
  {
    id: 'aquarius',
    name: 'الدلو',
    symbol: '♒',
    element: 'Air',
    quality: 'Fixed',
    ruler: 'أورانوس',
    dates: '20 يناير - 18 فبراير',
    traits: ['مبتكر', 'إنساني', 'مستقل', 'أصيل', 'ذكي'],
    description: 'الدلو برج هوائي مفكر ومبتكر. يحب الاستقلالية ويهتم بالقضايا الإنسانية، وغالباً ما يكون سابقاً لعصره.'
  },
  {
    id: 'pisces',
    name: 'الحوت',
    symbol: '♓',
    element: 'Water',
    quality: 'Mutable',
    ruler: 'نبتون',
    dates: '19 فبراير - 20 مارس',
    traits: ['حكيم', 'فني', 'حدسي', 'لطيف', 'موسيقي'],
    description: 'الحوت برج مائي حالم ورومانسي. يتميز بالتعاطف الكبير مع الآخرين والخيال الواسع والحس الفني المرهف.'
  }
];

export interface CompatibilityResult {
  score: number;
  label: string;
  description: string;
  tips: string[];
}

export function getCompatibility(sign1Id: string, sign2Id: string): CompatibilityResult {
  const sign1 = zodiacSigns.find(s => s.id === sign1Id);
  const sign2 = zodiacSigns.find(s => s.id === sign2Id);

  if (!sign1 || !sign2) {
    return {
      score: 0,
      label: 'غير معروف',
      description: 'الرجاء اختيار الأبراج بشكل صحيح.',
      tips: []
    };
  }

  // Basic element compatibility logic
  // Fire: Aries, Leo, Sagittarius
  // Earth: Taurus, Virgo, Capricorn
  // Air: Gemini, Libra, Aquarius
  // Water: Cancer, Scorpio, Pisces

  let score = 50;
  let label = 'متوسط';
  let description = '';
  let tips = [];

  // Same Element (Very High Compatibility)
  if (sign1.element === sign2.element) {
    score = 90 + Math.floor(Math.random() * 10); // 90-99
    label = 'توافق ممتاز';
    description = `يجمعكما عنصر ${sign1.element === 'Fire' ? 'النار' : sign1.element === 'Earth' ? 'الأرض' : sign1.element === 'Air' ? 'الهواء' : 'الماء'}، مما يعني تفاهماً عميقاً وطاقة مشتركة. أنتما تتحدثان نفس اللغة العاطفية والفكرية.`;
    tips = ['استغلا هذا التناغم لبناء مشاريع مشتركة.', 'حافظا على التجديد لتجنب الملل.', 'دعمكما لبعضكما البعض سيكون سر نجاحكما.'];
  }
  // Compatible Elements (Fire & Air, Earth & Water)
  else if (
    (sign1.element === 'Fire' && sign2.element === 'Air') ||
    (sign1.element === 'Air' && sign2.element === 'Fire') ||
    (sign1.element === 'Earth' && sign2.element === 'Water') ||
    (sign1.element === 'Water' && sign2.element === 'Earth')
  ) {
    score = 80 + Math.floor(Math.random() * 10); // 80-89
    label = 'توافق جيد جداً';
    description = 'علاقتكما متكاملة بشكل رائع. العناصر المختلفة تغذي بعضها البعض؛ فالنار تحتاج الهواء لتشتعل، والأرض تحتاج الماء لتزهر.';
    tips = ['تعلم من اختلافاتكما لتكميل بعضكما.', 'التواصل الصريح سيزيد من عمق العلاقة.', 'قدر وجهة نظر الشريك المختلفة.'];
  }
  // Opposing Elements (Fire & Water, Earth & Air) - Challenging
  else if (
    (sign1.element === 'Fire' && sign2.element === 'Water') ||
    (sign1.element === 'Water' && sign2.element === 'Fire') ||
    (sign1.element === 'Earth' && sign2.element === 'Air') ||
    (sign1.element === 'Air' && sign2.element === 'Earth')
  ) {
    score = 40 + Math.floor(Math.random() * 20); // 40-59
    label = 'تحدي مثير';
    description = 'هناك اختلافات جوهرية في الطباع، لكن هذا التباين قد يخلق جاذبية قوية إذا تم فهمه. أنتما تريان العالم بمنظورين مختلفين تماماً.';
    tips = ['الصبر هو مفتاح نجاح هذه العلاقة.', 'حاول فهم احتياجات الشريك العاطفية.', 'لا تحاول تغيير الشريك، بل تقبله كما هو.'];
  }
  // Other combinations
  else {
    score = 60 + Math.floor(Math.random() * 20); // 60-79
    label = 'توافق جيد';
    description = 'علاقة تحمل الكثير من الإمكانات. قد تحتاجان لبعض الجهد لفهم طباع بعضكما في البداية، لكن الاحترام المتبادل سيخلق رابطاً قوياً.';
    tips = ['ابحثا عن الاهتمامات المشتركة.', 'المرونة والتنازلات ضرورية من الطرفين.', 'ركزا على الصداقة كأساس للعلاقة.'];
  }
  
  // Specific famous matches adjustments (optional flavor)
  if ((sign1.id === 'leo' && sign2.id === 'aquarius') || (sign1.id === 'aquarius' && sign2.id === 'leo')) {
    description += ' (هذه علاقة تجاذب الأضداد الكلاسيكية!)';
  }

  return { score, label, description, tips };
}

export function getZodiacSign(day: number, month: number): ZodiacSign | undefined {
  // Logic to determine zodiac sign based on date
  // Aries: Mar 21 - Apr 19
  // Taurus: Apr 20 - May 20
  // Gemini: May 21 - Jun 20
  // Cancer: Jun 21 - Jul 22
  // Leo: Jul 23 - Aug 22
  // Virgo: Aug 23 - Sep 22
  // Libra: Sep 23 - Oct 22
  // Scorpio: Oct 23 - Nov 21
  // Sagittarius: Nov 22 - Dec 21
  // Capricorn: Dec 22 - Jan 19
  // Aquarius: Jan 20 - Feb 18
  // Pisces: Feb 19 - Mar 20

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns.find(s => s.id === 'aries');
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns.find(s => s.id === 'taurus');
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns.find(s => s.id === 'gemini');
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns.find(s => s.id === 'cancer');
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns.find(s => s.id === 'leo');
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns.find(s => s.id === 'virgo');
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns.find(s => s.id === 'libra');
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns.find(s => s.id === 'scorpio');
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns.find(s => s.id === 'sagittarius');
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns.find(s => s.id === 'capricorn');
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns.find(s => s.id === 'aquarius');
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns.find(s => s.id === 'pisces');
  
  return undefined;
}
