import { AgeData, LifeStats } from '@/types';

export function calculateAge(birthDate: Date): AgeData {
  const now = new Date();
  const diff = now.getTime() - birthDate.getTime();

  // Calculate age components
  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Calculate years, months, days
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate hours, minutes, seconds
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Day of week
  const daysOfWeek = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ];
  const dayOfWeek = daysOfWeek[birthDate.getDay()];

  // Zodiac sign
  const zodiacSign = getZodiacSign(birthDate);

  // Next birthday
  const nextBirthday = new Date(
    now.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Approximate Hijri age (civil) using average lengths
  const HIJRI_YEAR_DAYS = 354.367;
  const HIJRI_MONTH_DAYS = 29.53059;
  const hijriYearsFloat = totalDays / HIJRI_YEAR_DAYS;
  const hijriYears = Math.floor(hijriYearsFloat);
  let hijriRemainingDays = Math.max(
    0,
    Math.round(totalDays - hijriYears * HIJRI_YEAR_DAYS)
  );
  const hijriMonths = Math.floor(hijriRemainingDays / HIJRI_MONTH_DAYS);
  hijriRemainingDays = Math.max(
    0,
    Math.round(hijriRemainingDays - hijriMonths * HIJRI_MONTH_DAYS)
  );

  return {
    birthDate,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    dayOfWeek,
    zodiacSign,
    nextBirthday: {
      date: nextBirthday.toISOString(),
      daysUntil: daysUntilBirthday,
      age: years + 1,
    },
    hijri: {
      years: hijriYears,
      months: hijriMonths,
      days: hijriRemainingDays,
      date: `${hijriRemainingDays}/${hijriMonths}/${hijriYears}`,
    },
  };
}

export function calculateLifeStats(ageData: AgeData): LifeStats {
  const { totalDays, totalHours, totalMinutes } = ageData;

  // Average heartbeats: 70-80 bpm, using 75 as average
  const heartbeats = Math.floor(totalMinutes * 75);

  // Average breaths: 12-20 per minute, using 16 as average
  const breaths = Math.floor(totalMinutes * 16);

  // Average sleep: 8 hours per day
  const sleepDays = Math.floor((totalDays * 8) / 24);

  // Average food consumption: ~2kg per day
  const foodKg = Math.floor(totalDays * 2);

  // Movies watched if 10% of life in cinema (2 hour movies)
  const moviesWatched = Math.floor((totalHours * 0.1) / 2);

  // Steps walked: average 5000 steps per day
  const stepsWalked = totalDays * 5000;

  // Words spoken: average 16,000 words per day
  const wordsSpoken = totalDays * 16000;

  // Water consumed: average 2 liters per day
  const waterLiters = totalDays * 2;

  // Meals: average 3 meals per day
  const meals = totalDays * 3;

  // Blinks: average 17 per minute
  const blinks = Math.floor(totalMinutes * 17);

  // Laughs: average 15 per day
  const laughs = totalDays * 15;

  // Dreams: average 4-6 per night
  const dreams = totalDays * 5;

  return {
    heartbeats,
    breaths,
    sleepDays,
    meals,
    stepsWalked,
    blinks,
    laughs,
    waterLiters,
    foodKg,
    moviesWatched,
    dreams,
    wordsSpoken,
  };
}

// إحصاءات إضافية ممتعة
export function getExtraFunStats(ageData: AgeData) {
  const { totalDays, totalHours, totalMinutes, years } = ageData;

  return {
    // عدد مرات الغمز بالعين (15-20 مرة في الدقيقة)
    blinks: Math.floor(totalMinutes * 17),

    // عدد مرات الضحك (17 مرة في اليوم في المتوسط)
    laughs: totalDays * 17,

    // عدد الوجبات (3 وجبات يومياً)
    meals: totalDays * 3,

    // عدد ساعات الإنترنت (4 ساعات يومياً في المتوسط)
    internetHours: totalDays * 4,

    // عدد الصور الملتقطة (10 صور في اليوم)
    photosTaken: totalDays * 10,

    // عدد مرات تنظيف الأسنان (2 مرة يومياً)
    toothBrushing: totalDays * 2,

    // عدد الأحلام (4-6 أحلام كل ليلة)
    dreams: totalDays * 5,

    // عدد الكتب التي يمكن قراءتها (كتاب كل شهرين)
    booksCouldRead: Math.floor(totalDays / 60),

    // المسافة المقطوعة مشياً (متوسط 5 كم يومياً)
    kmWalked: totalDays * 5,

    // نبضات القلب لو كنت في حالة حب (20% أسرع)
    heartbeatsInLove: Math.floor(totalMinutes * 90),

    // عدد الأغاني التي يمكن الاستماع لها (أغنية كل يوم)
    songsListened: totalDays * 1,

    // عدد فناجين القهوة/الشاي (2 فنجان يومياً)
    cupsDrank: totalDays * 2,

    // عدد الابتسامات (400 ابتسامة يومياً)
    smiles: totalDays * 400,

    // عدد الثواني التي قضيتها في الانتظار (30 دقيقة يومياً)
    waitingMinutes: totalDays * 30,

    // نمو الشعر بالسنتيمتر (1.25 سم شهرياً)
    hairGrowthCm: Math.floor((totalDays / 30) * 1.25),

    // نمو الأظافر (3.5 ملم شهرياً)
    nailGrowthMm: Math.floor((totalDays / 30) * 3.5),

    // عدد خلايا الجلد المتجددة (30-40 ألف خلية في الدقيقة)
    skinCellsRenewed: Math.floor(totalMinutes * 35000),
  };
}

// مقارنات ممتعة
export function getFunComparisons(ageData: AgeData) {
  const { totalDays, totalHours } = ageData;

  return [
    {
      title: 'السفر حول العالم',
      description: `لو قضيت ${totalDays.toLocaleString(
        'ar-SA'
      )} يوماً في السفر، كنت ستدور حول الأرض ${Math.floor(
        totalDays / 80
      )} مرة!`,
      icon: '🌍',
    },
    {
      title: 'مشاهدة الأفلام',
      description: `يمكنك مشاهدة ${Math.floor(totalHours / 2).toLocaleString(
        'ar-SA'
      )} فيلم بطول ساعتين!`,
      icon: '🎬',
    },
    {
      title: 'قراءة الكتب',
      description: `كان بإمكانك قراءة ${Math.floor(
        totalDays / 7
      ).toLocaleString('ar-SA')} كتاب (كتاب كل أسبوع)!`,
      icon: '📚',
    },
    {
      title: 'تعلم اللغات',
      description: `كنت ستتقن ${Math.floor(
        totalDays / 365
      )} لغة جديدة (لغة كل سنة)!`,
      icon: '🗣️',
    },
    {
      title: 'ماراثون الحياة',
      description: `مشيت مسافة تعادل ${Math.floor(
        (totalDays * 5) / 42
      ).toLocaleString('ar-SA')} ماراثون!`,
      icon: '🏃',
    },
    {
      title: 'رحلة إلى القمر',
      description: `المسافة التي مشيتها تعادل ${(
        (totalDays * 5) /
        384400
      ).toFixed(2)} من المسافة إلى القمر!`,
      icon: '🌙',
    },
  ];
}

// إنجازات وأوسمة
export function getAchievements(ageData: AgeData) {
  const { years, totalDays } = ageData;
  const achievements = [];

  if (totalDays >= 1000)
    achievements.push({
      title: 'ألف يوم',
      icon: '🏅',
      color: 'from-yellow-500 to-amber-500',
    });
  if (totalDays >= 5000)
    achievements.push({
      title: '5 آلاف يوم',
      icon: '🎖️',
      color: 'from-orange-500 to-red-500',
    });
  if (totalDays >= 10000)
    achievements.push({
      title: '10 آلاف يوم',
      icon: '🏆',
      color: 'from-purple-500 to-pink-500',
    });
  if (years >= 18)
    achievements.push({
      title: 'بلوغ سن الرشد',
      icon: '🎓',
      color: 'from-blue-500 to-cyan-500',
    });
  if (years >= 25)
    achievements.push({
      title: 'ربع قرن',
      icon: '💎',
      color: 'from-indigo-500 to-purple-500',
    });
  if (years >= 30)
    achievements.push({
      title: 'الثلاثينات',
      icon: '⭐',
      color: 'from-green-500 to-teal-500',
    });
  if (years >= 40)
    achievements.push({
      title: 'أربعة عقود',
      icon: '👑',
      color: 'from-red-500 to-pink-500',
    });
  if (years >= 50)
    achievements.push({
      title: 'نصف قرن',
      icon: '🌟',
      color: 'from-yellow-500 to-orange-500',
    });

  return achievements;
}

// معلومات مشوقة عن يوم الميلاد
export function getBirthDayInterestingFacts(ageData: AgeData) {
  const { birthDate, zodiacSign } = ageData;
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const chineseZodiac = getChineseZodiac(year);
  const season = getSeason(birthDate);
  const birthstone = getBirthstone(month);
  const birthFlower = getBirthFlower(month);
  const luckyColor = getLuckyColor(season, zodiacSign);
  const luckyNumber = getLuckyNumber(birthDate);
  const dayOfYear = getDayOfYear(birthDate);
  const daysInYear = isLeapYear(birthDate.getFullYear()) ? 366 : 365;
  const remainingInYear = daysInYear - dayOfYear;
  const events = getFamousEvents(birthDate);

  return {
    chineseZodiac,
    season,
    birthstone,
    birthFlower,
    luckyColor,
    luckyNumber,
    dayOfYear,
    remainingInYear,
    events,
  };
}

function getChineseZodiac(year: number): string {
  const animals = [
    'الفأر 🐭',
    'الثور 🐂',
    'النمر 🐅',
    'الأرنب 🐇',
    'التنين 🐉',
    'الثعبان 🐍',
    'الحصان 🐎',
    'الماعز 🐐',
    'القرد 🐒',
    'الديك 🐓',
    'الكلب 🐕',
    'الخنزير 🐖',
  ];
  const idx = (((year - 4) % 12) + 12) % 12;
  return animals[idx];
}

function getSeason(date: Date): string {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'الربيع';
  if (m >= 6 && m <= 8) return 'الصيف';
  if (m >= 9 && m <= 11) return 'الخريف';
  return 'الشتاء';
}

function getBirthstone(month: number): string {
  const stones = [
    'العقيق (Garnet)',
    'الأميثيست (Amethyst)',
    'الأكوامارين (Aquamarine)',
    'الألماس (Diamond)',
    'الزمرد (Emerald)',
    'اللؤلؤ (Pearl)',
    'الياقوت (Ruby)',
    'الزبرجد (Peridot)',
    'الزفير (Sapphire)',
    'الأوبال (Opal)',
    'التوباز (Topaz)',
    'الفيروز (Turquoise)',
  ];
  return stones[month - 1];
}

function getBirthFlower(month: number): string {
  const flowers = [
    'القرنفل (Carnation)',
    'البنفسج (Violet)',
    'النرجس (Daffodil)',
    'الأقحوان (Daisy)',
    'الزنبق (Lily)',
    'الورد (Rose)',
    'الدلفيونيوم (Larkspur)',
    'السوسن (Gladiolus)',
    'النجمية (Aster)',
    'القطيفة (Marigold)',
    'الأقحوان (Chrysanthemum)',
    'النرجس الشتوي (Narcissus)',
  ];
  return flowers[month - 1];
}

function getLuckyColor(season: string, zodiac: string): string {
  // تلوين بسيط بناءً على الفصل مع لمسة من البرج الغربي
  const base =
    season === 'الربيع'
      ? 'الأخضر'
      : season === 'الصيف'
      ? 'الأصفر'
      : season === 'الخريف'
      ? 'البرتقالي'
      : 'الأزرق';
  if (zodiac.includes('♈') || zodiac.includes('♌'))
    return `${base} مع لمسة من الأحمر`;
  if (zodiac.includes('♉') || zodiac.includes('♑'))
    return `${base} مع لمسة من البني`;
  if (zodiac.includes('♊') || zodiac.includes('♎'))
    return `${base} مع لمسة من البنفسجي`;
  if (zodiac.includes('♋') || zodiac.includes('♓'))
    return `${base} مع لمسة من التركوازي`;
  return base;
}

function getLuckyNumber(date: Date): number {
  const digits = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
    .split('')
    .map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum === 0 ? 1 : sum;
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getFamousEvents(date: Date): string[] {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfYear = getDayOfYear(date);
  const daysInYear = isLeapYear(date.getFullYear()) ? 366 : 365;
  const remaining = daysInYear - dayOfYear;
  return [
    `هذا هو اليوم رقم ${formatNumber(
      dayOfYear
    )} من السنة، ويتبقى ${formatNumber(remaining)} يوماً.`,
    `في مثل هذا التاريخ (${day}/${month}) عبر التاريخ، شهد العالم أحداثاً مميزة - اكتشفها بالبحث!`,
  ];
}

function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return 'الحمل ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return 'الثور ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return 'الجوزاء ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return 'السرطان ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return 'الأسد ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return 'العذراء ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return 'الميزان ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return 'العقرب ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return 'القوس ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return 'الجدي ♑';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return 'الدلو ♒';
  return 'الحوت ♓';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num);
}

export function generatePersonalizedMessage(ageData: AgeData): string {
  const { years, totalDays } = ageData;

  const messages = [
    `رائع! لقد عشت ${formatNumber(
      totalDays
    )} يوماً مليئاً بالذكريات والإنجازات!`,
    `يا له من رقم مذهل! ${formatNumber(
      years
    )} عاماً من الخبرات والتجارب الفريدة.`,
    `هل تعلم أنك تنفست أكثر من مليارات المرات منذ ولادتك؟ حياتك معجزة حقيقية!`,
    `في كل يوم من الـ ${formatNumber(
      totalDays
    )} يوم التي عشتها، كانت هناك لحظات جميلة لا تُنسى.`,
    `لقد شهدت ${formatNumber(years)} عاماً من التطور والنمو. كم أنت محظوظ!`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
