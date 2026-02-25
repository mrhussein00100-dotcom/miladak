// حسابات عمر الطفل
export interface ChildAgeInfo {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: Date;
  nextMonthBirthday: Date;
  daysToNextBirthday: number;
  daysToNextMonth: number;
}

export interface ChildStage {
  name: string;
  description: string;
  emoji: string;
  milestones: string[];
  tips: string[];
  averageHeight: string;
  averageWeight: string;
  sleepHours: string;
}

// دالة حساب عمر الطفل
export function calculateChildAge(birthDate: Date): ChildAgeInfo {
  const today = new Date();
  const birth = new Date(birthDate);
  
  // حساب الفرق الزمني
  const timeDiff = today.getTime() - birth.getTime();
  const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
  const totalMinutes = Math.floor(timeDiff / (1000 * 60));
  const totalSeconds = Math.floor(timeDiff / 1000);
  const totalWeeks = Math.floor(totalDays / 7);
  
  // حساب العمر بالسنوات والأشهر
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalMonths = years * 12 + months;
  const weeks = Math.floor(days / 7);
  days = days % 7;
  
  // حساب عيد الميلاد القادم
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  // حساب الشهر القادم
  const nextMonthBirthday = new Date(today.getFullYear(), today.getMonth() + 1, birth.getDate());
  
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysToNextMonth = Math.ceil((nextMonthBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    years,
    months,
    weeks,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthday,
    nextMonthBirthday,
    daysToNextBirthday,
    daysToNextMonth
  };
}

// بيانات مراحل نمو الطفل
const childStages: ChildStage[] = [
  {
    name: 'مولود جديد',
    description: 'الأسابيع الأولى من الحياة - مرحلة التكيف مع العالم الخارجي',
    emoji: '👶',
    milestones: [
      'النوم معظم الوقت (16-20 ساعة يومياً)',
      'الرضاعة كل 2-3 ساعات',
      'ردود أفعال طبيعية (المص، الإمساك)',
      'التركيز على الوجوه القريبة'
    ],
    tips: [
      'تأكدي من الرضاعة المنتظمة',
      'حافظي على النظافة والدفء',
      'تحدثي مع طفلك بصوت هادئ',
      'راقبي علامات الجوع والتعب'
    ],
    averageHeight: '45-55 سم',
    averageWeight: '2.5-4.5 كيلو',
    sleepHours: '16-20 ساعة'
  },
  {
    name: 'رضيع',
    description: 'مرحلة النمو السريع وتطور الحواس والحركة الأساسية',
    emoji: '🍼',
    milestones: [
      'الابتسامة الاجتماعية (2-3 أشهر)',
      'رفع الرأس أثناء الاستلقاء على البطن',
      'تتبع الأشياء بالعينين',
      'إصدار أصوات وغرغرة'
    ],
    tips: [
      'شجعي وقت البطن للتقوية',
      'تحدثي وغني لطفلك',
      'وفري ألعاب ملونة وآمنة',
      'حافظي على روتين النوم'
    ],
    averageHeight: '55-70 سم',
    averageWeight: '4-8 كيلو',
    sleepHours: '14-17 ساعة'
  },
  {
    name: 'رضيع متقدم',
    description: 'مرحلة الجلوس والحبو وبداية الاستكشاف',
    emoji: '👶🏻',
    milestones: [
      'الجلوس بدون مساعدة (6-8 أشهر)',
      'الحبو أو التنقل',
      'نقل الأشياء من يد لأخرى',
      'فهم كلمة "لا"'
    ],
    tips: [
      'أمني المنزل للطفل الزاحف',
      'وفري مساحة آمنة للاستكشاف',
      'اقرئي القصص البسيطة',
      'شجعي اللعب التفاعلي'
    ],
    averageHeight: '65-75 سم',
    averageWeight: '7-10 كيلو',
    sleepHours: '12-15 ساعة'
  },
  {
    name: 'طفل صغير',
    description: 'مرحلة المشي والكلام الأول والاستقلالية المبكرة',
    emoji: '🚼',
    milestones: [
      'المشي المستقل (12-18 شهر)',
      'قول الكلمات الأولى',
      'اللعب التقليدي البسيط',
      'فهم التعليمات البسيطة'
    ],
    tips: [
      'شجعي المشي والحركة',
      'تحدثي كثيراً مع طفلك',
      'وفري ألعاب تعليمية بسيطة',
      'ابدئي بوضع حدود لطيفة'
    ],
    averageHeight: '75-85 سم',
    averageWeight: '9-13 كيلو',
    sleepHours: '11-14 ساعة'
  },
  {
    name: 'طفل ما قبل المدرسة',
    description: 'مرحلة تطور اللغة والمهارات الاجتماعية والإبداع',
    emoji: '🧒',
    milestones: [
      'تكوين جمل من 3-4 كلمات',
      'اللعب التخيلي',
      'التدريب على استخدام الحمام',
      'اللعب مع الأطفال الآخرين'
    ],
    tips: [
      'اقرئي القصص يومياً',
      'شجعي اللعب الإبداعي',
      'علمي المهارات الاجتماعية',
      'ابدئي بالأنشطة التعليمية البسيطة'
    ],
    averageHeight: '85-105 سم',
    averageWeight: '12-18 كيلو',
    sleepHours: '10-13 ساعة'
  },
  {
    name: 'طفل المدرسة',
    description: 'مرحلة التعلم الأكاديمي وتطور المهارات المعقدة',
    emoji: '🎒',
    milestones: [
      'تعلم القراءة والكتابة',
      'المهارات الرياضية الأساسية',
      'تكوين صداقات مستقرة',
      'فهم القواعد والنظام'
    ],
    tips: [
      'ادعمي التعلم في المنزل',
      'شجعي الأنشطة الرياضية',
      'علمي المسؤولية',
      'وفري وقت للعب الحر'
    ],
    averageHeight: '105-130 سم',
    averageWeight: '18-30 كيلو',
    sleepHours: '9-11 ساعة'
  },
  {
    name: 'مراهق مبكر',
    description: 'بداية المراهقة والتغيرات الجسدية والنفسية',
    emoji: '🧑‍🎓',
    milestones: [
      'بداية البلوغ',
      'تطور التفكير المجرد',
      'البحث عن الهوية',
      'زيادة الاستقلالية'
    ],
    tips: [
      'كوني صبورة ومتفهمة',
      'احترمي حاجته للخصوصية',
      'حافظي على التواصل المفتوح',
      'ضعي حدود واضحة ومعقولة'
    ],
    averageHeight: '130-160 سم',
    averageWeight: '30-50 كيلو',
    sleepHours: '9-10 ساعات'
  }
];

// دالة الحصول على مرحلة الطفل حسب العمر بالأشهر
export function getChildStage(totalMonths: number): ChildStage {
  if (totalMonths < 1) return childStages[0]; // مولود جديد
  if (totalMonths < 6) return childStages[1]; // رضيع
  if (totalMonths < 12) return childStages[2]; // رضيع متقدم
  if (totalMonths < 36) return childStages[3]; // طفل صغير
  if (totalMonths < 72) return childStages[4]; // طفل ما قبل المدرسة
  if (totalMonths < 144) return childStages[5]; // طفل المدرسة
  return childStages[6]; // مراهق مبكر
}