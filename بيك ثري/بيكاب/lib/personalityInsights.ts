import { AgeData } from '@/types';
import { getDayOfYear } from '@/lib/ageCalculations';

export type InsightCard = {
  title: string;
  tag?: string;
  color?: string;
  summary: string;
  bullets: string[];
};

export type PersonalityInsights = {
  season: InsightCard;
  chronotype: InsightCard;
  generation: InsightCard;
  strengths: InsightCard;
  work: InsightCard;
  wellbeing: InsightCard;
};

function getSeason(date: Date): 'الربيع' | 'الصيف' | 'الخريف' | 'الشتاء' {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'الربيع';
  if (m >= 6 && m <= 8) return 'الصيف';
  if (m >= 9 && m <= 11) return 'الخريف';
  return 'الشتاء';
}

function getAgeStage(
  age: AgeData
):
  | 'رضيع'
  | 'طفل مبكر'
  | 'طفل'
  | 'مراهق'
  | 'شباب'
  | 'راشد'
  | 'ناضج'
  | 'كبير سنًا'
  | 'مسن' {
  const y = age.years;
  if (y === 0 && age.totalDays < 60) return 'رضيع';
  if (y === 0) return 'طفل مبكر';
  if (y >= 1 && y < 5) return 'طفل مبكر';
  if (y < 13) return 'طفل';
  if (y < 18) return 'مراهق';
  if (y < 30) return 'شباب';
  if (y < 45) return 'راشد';
  if (y < 60) return 'ناضج';
  if (y < 75) return 'كبير سنًا';
  return 'مسن';
}

function getGeneration(year: number): { name: string; range: string } {
  if (year >= 2013) return { name: 'جيل ألفا', range: '2013–الآن' };
  if (year >= 1997) return { name: 'جيل زد', range: '1997–2012' };
  if (year >= 1981) return { name: 'جيل الألفية', range: '1981–1996' };
  if (year >= 1965) return { name: 'جيل إكس', range: '1965–1980' };
  if (year >= 1946) return { name: 'جيل الطفرة', range: '1946–1964' };
  return { name: 'جيل ما قبل الطفرة', range: 'قبل 1946' };
}

function chronotypeForStage(stage: ReturnType<typeof getAgeStage>): {
  label: string;
  window: string;
  notes: string[];
} {
  switch (stage) {
    case 'مراهق':
      return {
        label: 'يميل إلى المسائية',
        window: 'ذروة تركيز متأخرة: 7–11 مساءً',
        notes: [
          'الأبحاث تشير لانزياح الساعة البيولوجية للمساء في المراهقة',
          'يفيد دمج مهام عميقة بعد العصر وتقليل الشاشات قبل النوم',
        ],
      };
    case 'شباب':
      return {
        label: 'متوسّط (قريب للمساء)',
        window: 'ذروات 11ص–1م و6–9م',
        notes: [
          'تباين فردي مرتفع — جرّب نوافذ التركيز واعتمد ما ينجح',
          'انضباط نوم ثابت يرفع الأداء',
        ],
      };
    case 'راشد':
      return {
        label: 'متوسّط (مائل للصباح)',
        window: 'ذروات 9–12ص و4–7م',
        notes: [
          'انتظام الروتين يحسّن الطاقة الإدراكية',
          'اجتماعات صباحية ومهام عميقة قبل الظهيرة',
        ],
      };
    case 'ناضج':
    case 'كبير سنًا':
    case 'مسن':
      return {
        label: 'يميل إلى الصباحية',
        window: 'ذروة مبكرة: 8–11 صباحًا',
        notes: [
          'تظهر أدلة على تقدّم توقيت الذروة مع العمر',
          'نم مبكرًا واجعل القرارّات الثقيلة صباحًا',
        ],
      };
    default:
      return {
        label: 'متغيّر طبيعي',
        window: 'جرّب فترات مختلفة خلال اليوم',
        notes: ['ثبّت الروتين وابحث عن نافذتك الذهبية'],
      };
  }
}

export function getPersonalityInsights(age: AgeData): PersonalityInsights {
  const season = getSeason(age.birthDate);
  const stage = getAgeStage(age);
  const gen = getGeneration(age.birthDate.getFullYear());
  const chrono = chronotypeForStage(stage);
  const doy = getDayOfYear(age.birthDate);
  const year = age.birthDate.getFullYear();
  const month = age.birthDate.getMonth() + 1;
  const q = doy <= 91 ? 1 : doy <= 182 ? 2 : doy <= 273 ? 3 : 4;
  const seed = (year % 100) * 10000 + month * 100 + doy;
  const rng = (() => {
    let s = seed >>> 0;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  })();
  const pick = <T>(arr: T[], n: number) => {
    const a = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && a.length > 0; i++) {
      const idx = Math.floor(rng() * a.length);
      out.push(a.splice(idx, 1)[0]);
    }
    return out;
  };
  const daylightHours = (() => {
    const angle = (2 * Math.PI * (doy - 80)) / 365;
    const hours = 12 + 4 * Math.sin(angle);
    const f = new Intl.NumberFormat('ar-SA', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
    return f.format(Math.max(8, Math.min(16, hours)));
  })();

  const seasonSummary =
    season === 'الربيع'
      ? 'ولدت خلال زيادة الإضاءة الطبيعية بعد الشتاء (فرضية التأثير الضوئي).'
      : season === 'الصيف'
      ? 'ولدت في أطول أيام السنة نسبيًا (تعّرض أعلى للضوء في الطفولة المبكرة).'
      : season === 'الخريف'
      ? 'ولدت مع اعتدال الضوء وتحوّل الفصول (فوتوبيولوجيا انتقالية).'
      : 'ولدت في أقصر أيام السنة نسبيًا (تعرض ضوئي أقل في الشهور الأولى).';
  const monthHints: Record<number, string[]> = {
    1: ['بدايات هادئة', 'تنظيم مبكر'],
    2: ['إيقاع ثابت', 'تركيز لطيف'],
    3: ['انطلاقة ربيعية', 'تجديد طاقة'],
    4: ['إضاءة متزايدة', 'مزاج متفائل'],
    5: ['اعتدال جميل', 'حضور اجتماعي'],
    6: ['أطول نهار', 'نشاط أعلى'],
    7: ['وتيرة صيفية', 'حركة وخفّة'],
    8: ['دفء واستمرارية', 'توازن لطيف'],
    9: ['انتقال هادئ', 'تركيز دراسي/عملي'],
    10: ['اعتدال خريفي', 'تنظيم واضح'],
    11: ['وتيرة أهدأ', 'تأمل ومراجعة'],
    12: ['خلاصة العام', 'دفء عائلي'],
  };
  const seasonBulletsBase = [
    'الفروقات موسمية واحتمالية وليست حتمية',
    'الروتين المنتظم والنوم الجيد أهم من الموسم',
  ];
  const monthPick = monthHints[month] ?? [];
  const seasonBullets = [
    ...pick(seasonBulletsBase, 1),
    ...pick(monthPick, Math.min(1, monthPick.length)),
    `مؤشر ضوئي تقريبي عند الميلاد: نحو ${daylightHours} ساعة نهار`,
  ];

  const chronoExtraByQuarter: Record<number, string[]> = {
    1: ['نافذة صباحية أطول نسبيًا', 'استفد من ضوء الصباح'],
    2: ['ذروة منتصف النهار واضحة', 'وازن بين مهام قبل/بعد الظهر'],
    3: ['ميل لنشاط مسائي لطيف', 'خفّف الشاشات ليلًا'],
    4: ['صباحية أقوى نسبيًا', 'جدول مهام عميقة مبكرًا'],
  };
  const chronotypeBullets = [
    ...pick(chrono.notes, Math.min(2, chrono.notes.length)),
    ...pick(chronoExtraByQuarter[q], 1),
  ];

  const genSummary = `${gen.name} — ${gen.range}`;
  const genBank: Record<string, string[]> = {
    'جيل زد': [
      'راحة مع التقنية والتعلّم الذاتي',
      'يميل لتقدير الأصالة والمعنى',
      'تفاعل بصري سريع ومحتوى قصير',
      'تعلم بالممارسة والمجتمع',
      'تفكير نقدي تجاه المعلومات',
    ],
    'جيل الألفية': [
      'تعلّم مرن ومهارات متعددة',
      'توازن عمل/حياة كقيمة أساسية',
      'تفاعل رقمي/اجتماعي متكامل',
      'تعاون ومشاريع جانبية',
      'تقدير للتجربة العملية',
    ],
    'جيل إكس': [
      'اعتمادية عالية وحلول عملية',
      'قيمة للاستقلالية والخبرة',
      'تقدير للكفاءة والوضوح',
      'تركيز على النتائج',
      'تنفيذ هادئ وثابت',
    ],
    'جيل الطفرة': [
      'خبرة تراكمية وثبات',
      'تقدير للعلاقات طويلة الأمد',
      'واقعية عملية',
      'نقل خبرة وإرشاد',
      'مسؤولية عالية',
    ],
    'جيل ألفا': [
      'تعلّم رقمي مبكّر',
      'ميل لتجارب تفاعلية',
      'حس بصري وألعاب تعليمية',
      'سرعة تكيف تقنية',
      'تعلم قائم على المشاريع',
    ],
    'جيل ما قبل الطفرة': [
      'صبر وخبرة عميقة',
      'قيمة للتقاليد والعلاقات',
      'حكمة عملية',
      'إيقاع حياة أهدأ',
      'واقعية عالية',
    ],
  };
  const eraMicro = (() => {
    if (year >= 2007) return 'نشأت مع الهواتف الذكية المبكرة';
    if (year >= 1995) return 'عاصرت الإنترنت المبكر ثم الشبكات الاجتماعية';
    if (year >= 1985) return 'انتقلت من الأجهزة التقليدية إلى الرقمية';
    if (year >= 1975) return 'شهدت موجات تقنية متتابعة في العمل والحياة';
    return 'خبرة ممتدة عبر تحولات تقنية واجتماعية';
  })();
  const genBullets = [
    ...pick(genBank[gen.name] ?? ['سمات جيلية عامة'], 3),
    eraMicro,
  ];

  const strengthsStageBank: Record<string, string[]> = {
    مراهق: [
      'فضول مرتفع',
      'قابلية تعلم سريعة',
      'تجريب آمن يولّد خبرة',
      'تعدد محاولات',
    ],
    شباب: [
      'قابلية نمو عالية',
      'تحمّل تعلم مكثّف',
      'مرونة في الاتجاه',
      'قابلية بناء شبكة',
    ],
    راشد: [
      'استقرار وعادات',
      'قدرة على تنفيذ مركّز',
      'موازنة أولويات',
      'انضباط يومي',
    ],
    ناضج: ['حكمة عملية', 'نقل خبرة', 'قرارات أكثر هدوءًا', 'بُعد نظر'],
    'كبير سنًا': [
      'خبرة تراكمية',
      'نظرة كلية',
      'اتصال إنساني أعمق',
      'استقرار عاطفي',
    ],
    مسن: ['خبرة تراكمية', 'نظرة كلية', 'اتصال إنساني أعمق', 'اتزان يومي'],
    طفل: ['قابلية تكوين عادات', 'تعلّم عبر اللعب', 'خيال نشط', 'فضول طبيعي'],
    'طفل مبكر': [
      'إشارات نمو لطيفة',
      'تشكّل عادات أساسية',
      'بيئة داعمة',
      'تماس إنساني دافئ',
    ],
    رضيع: ['نمو سريع', 'استجابة للرعاية', 'احتياج لروتين هادئ', 'تشكّل مبكّر'],
  };
  const strengthsBullets = pick(strengthsStageBank[stage] ?? ['نمو يومي'], 3);

  const workStageBank: Record<string, string[]> = {
    مراهق: [
      'مشاريع قصيرة بأهداف واضحة',
      'تعلم مرئي وتطبيقي',
      'تغذية راجعة سريعة',
      'رفيق تعلم',
    ],
    شباب: [
      'جلسات تركيز 60–90 دقيقة',
      'مشروع قابل للعرض أسبوعيًا',
      'مجتمع تعلم صغير',
      'قياس تقدّم دوري',
    ],
    راشد: [
      'أولويات محددة يوميًا',
      'ساعة عميقة صباحًا',
      'اجتماعات مركزة قصيرة',
      'مراجعة أسبوعية',
    ],
    ناضج: [
      'توزيع جهد مستقر',
      'إرشاد الأصغر سنًا',
      'مهام عالية القيمة',
      'نقل معرفة',
    ],
    'كبير سنًا': [
      'مهام واضحة منخفضة التشتيت',
      'مواعيد صباحية',
      'إيقاع هادئ مستدام',
      'فواصل راحة',
    ],
    مسن: [
      'مهام واضحة منخفضة التشتيت',
      'مواعيد صباحية',
      'إيقاع هادئ مستدام',
      'دعم اجتماعي',
    ],
    طفل: ['لعب موجّه', 'مهام قصيرة ممتعة', 'قصص تعليمية', 'ألغاز بسيطة'],
    'طفل مبكر': [
      'جولات استكشاف قصيرة',
      'تسمية الأشياء',
      'تكرار لطيف',
      'روتين واضح',
    ],
    رضيع: ['روتين ثابت', 'إشارات مريحة', 'وتيرة هادئة', 'تناغم يومي'],
  };
  const workBullets = pick(workStageBank[stage] ?? ['روتين بسيط'], 3);

  const wellbeingStageBank: Record<string, string[]> = {
    مراهق: [
      'تقليل الشاشات ليلاً',
      'نوم 8–9 ساعات',
      'نشاط بدني لطيف',
      'ماء كافٍ',
    ],
    شباب: ['نوم منتظم', 'تغذية متوازنة', 'تمارين مقاومة خفيفة', 'تنفس عميق'],
    راشد: [
      'فحوصات دورية أساسية',
      'روتين تعافٍ أسبوعي',
      'حضور اجتماعي دافئ',
      'ساعتان بلا شاشة',
    ],
    ناضج: [
      'مشي يومي 20–30 دقيقة',
      'تمارين مرونة',
      'وقت عائلة منتظم',
      'ترطيب جيد',
    ],
    'كبير سنًا': [
      'نمط صباحي هادئ',
      'تواصل اجتماعي دافئ',
      'شمس خفيفة صباحًا',
      'نوم مبكر',
    ],
    مسن: [
      'نمط صباحي هادئ',
      'تواصل اجتماعي دافئ',
      'شمس خفيفة صباحًا',
      'موسيقى هادئة',
    ],
    طفل: ['لعب نشط قصير', 'روتين نوم ثابت', 'أطعمة بسيطة', 'خروج صباحي'],
    'طفل مبكر': ['بيئة هادئة', 'هواء نقي', 'حضن دافئ', 'أغنية قصيرة'],
    رضيع: ['نوم كافٍ', 'تناغم روتين', 'إضاءة لطيفة', 'هدوء'],
  };
  const wellbeingBullets = pick(
    wellbeingStageBank[stage] ?? ['روتين نوم هادئ'],
    3
  );

  return {
    season: {
      title: 'موسم الميلاد (مؤشر ضوئي)',
      tag: season,
      color:
        season === 'الربيع'
          ? 'from-green-500/10 to-emerald-500/10'
          : season === 'الصيف'
          ? 'from-yellow-500/10 to-orange-500/10'
          : season === 'الخريف'
          ? 'from-amber-500/10 to-orange-600/10'
          : 'from-blue-500/10 to-indigo-500/10',
      summary: `${seasonSummary} — مؤشرات ترابطية من أبحاث فوتوبيولوجيا؛ ليست تشخيصًا فرديًا.`,
      bullets: seasonBullets,
    },
    chronotype: {
      title: 'الإيقاع اليومي المتوقع',
      tag: chrono.label,
      color: 'from-purple-500/10 to-fuchsia-500/10',
      summary: chrono.window,
      bullets: chronotypeBullets,
    },
    generation: {
      title: 'ملف الجيل',
      tag: gen.name,
      color: 'from-cyan-500/10 to-blue-500/10',
      summary: genSummary,
      bullets: genBullets,
    },
    strengths: {
      title: 'نقاط قوة مرجّحة',
      color: 'from-emerald-500/10 to-teal-500/10',
      summary: 'مؤشرات احتمالية تستند إلى مرحلة العمر الحالية',
      bullets: strengthsBullets,
    },
    work: {
      title: 'بيئات عمل مناسبة',
      color: 'from-indigo-500/10 to-sky-500/10',
      summary: 'إرشادات عملية قابلة للتجربة والقياس',
      bullets: workBullets,
    },
    wellbeing: {
      title: 'نصائح للصحة والحيوية',
      color: 'from-rose-500/10 to-orange-500/10',
      summary: 'عادات يومية بسيطة لحياة أفضل',
      bullets: wellbeingBullets,
    },
  };
}
