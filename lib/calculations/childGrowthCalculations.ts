export interface ChildGrowthInput {
  birthDate: Date;
  gender: 'male' | 'female';
  currentWeight?: number;
  currentHeight?: number;
  birthWeight?: number;
  birthHeight?: number;
}

export interface GrowthMilestone {
  ageMonths: number;
  title: string;
  description: string;
  category: 'physical' | 'cognitive' | 'social' | 'language';
  icon: string;
}

export interface ChildGrowthResult {
  ageInMonths: number;
  ageInWeeks: number;
  ageInDays: number;
  ageDisplay: string;
  developmentStage: string;
  upcomingMilestones: GrowthMilestone[];
  recentMilestones: GrowthMilestone[];
  growthPercentiles?: {
    weight?: number;
    height?: number;
  };
  recommendations: string[];
  nextCheckup: string;
  nutritionTips: string[];
  safetyTips: string[];
}

const growthMilestones: GrowthMilestone[] = [
  // 0-3 أشهر
  { ageMonths: 0, title: 'الولادة', description: 'يبكي للتعبير عن احتياجاته', category: 'physical', icon: '👶' },
  { ageMonths: 1, title: 'رفع الرأس', description: 'يرفع رأسه لفترات قصيرة عند الاستلقاء على البطن', category: 'physical', icon: '💪' },
  { ageMonths: 2, title: 'الابتسامة الاجتماعية', description: 'يبتسم استجابة للآخرين', category: 'social', icon: '😊' },
  { ageMonths: 3, title: 'تتبع الأشياء بالعين', description: 'يتابع الأشياء المتحركة بعينيه', category: 'cognitive', icon: '👀' },
  
  // 4-6 أشهر
  { ageMonths: 4, title: 'التحكم في الرأس', description: 'يتحكم في رأسه بثبات', category: 'physical', icon: '🎯' },
  { ageMonths: 5, title: 'الانقلاب', description: 'ينقلب من البطن إلى الظهر', category: 'physical', icon: '🔄' },
  { ageMonths: 6, title: 'الجلوس بمساعدة', description: 'يجلس بمساعدة ويبدأ الأطعمة الصلبة', category: 'physical', icon: '🪑' },
  
  // 7-12 شهر
  { ageMonths: 7, title: 'الجلوس بدون مساعدة', description: 'يجلس بدون دعم', category: 'physical', icon: '🧘' },
  { ageMonths: 8, title: 'الحبو', description: 'يبدأ في الحبو أو الزحف', category: 'physical', icon: '🐛' },
  { ageMonths: 9, title: 'الوقوف بمساعدة', description: 'يقف بمساعدة الأثاث', category: 'physical', icon: '🚶' },
  { ageMonths: 10, title: 'المشي بمساعدة', description: 'يمشي ممسكاً بالأثاث', category: 'physical', icon: '👣' },
  { ageMonths: 12, title: 'الكلمات الأولى', description: 'ينطق كلماته الأولى مثل "ماما" و "بابا"', category: 'language', icon: '🗣️' },
  
  // السنة الثانية
  { ageMonths: 15, title: 'المشي المستقل', description: 'يمشي بدون مساعدة', category: 'physical', icon: '🚶‍♂️' },
  { ageMonths: 18, title: 'الجري والتسلق', description: 'يجري ويتسلق الدرج', category: 'physical', icon: '🏃' },
  { ageMonths: 24, title: 'الجمل البسيطة', description: 'يكون جملاً من كلمتين', category: 'language', icon: '💬' },
  
  // السنة الثالثة
  { ageMonths: 30, title: 'القفز', description: 'يقفز بكلا القدمين', category: 'physical', icon: '🦘' },
  { ageMonths: 36, title: 'استخدام المرحاض', description: 'يبدأ في التدريب على استخدام المرحاض', category: 'physical', icon: '🚽' },
  
  // السنة الرابعة والخامسة
  { ageMonths: 48, title: 'الرسم والكتابة', description: 'يرسم دوائر ويبدأ في كتابة بعض الحروف', category: 'cognitive', icon: '✏️' },
  { ageMonths: 60, title: 'اللعب التعاوني', description: 'يلعب مع الأطفال الآخرين بشكل تعاوني', category: 'social', icon: '🤝' },
];

export function calculateChildGrowth(input: ChildGrowthInput): ChildGrowthResult {
  const now = new Date();
  const birthDate = new Date(input.birthDate);
  
  // حساب العمر بالتفصيل
  const ageInMs = now.getTime() - birthDate.getTime();
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(ageInDays / 7);
  const ageInMonths = Math.floor(ageInDays / 30.44); // متوسط أيام الشهر
  
  // تحديد مرحلة النمو
  let developmentStage = '';
  if (ageInMonths < 3) {
    developmentStage = 'المولود الجديد (0-3 أشهر)';
  } else if (ageInMonths < 6) {
    developmentStage = 'الرضيع المبكر (3-6 أشهر)';
  } else if (ageInMonths < 12) {
    developmentStage = 'الرضيع المتأخر (6-12 شهر)';
  } else if (ageInMonths < 24) {
    developmentStage = 'الطفل الصغير (1-2 سنة)';
  } else if (ageInMonths < 36) {
    developmentStage = 'طفل ما قبل المدرسة المبكر (2-3 سنوات)';
  } else if (ageInMonths < 60) {
    developmentStage = 'طفل ما قبل المدرسة (3-5 سنوات)';
  } else {
    developmentStage = 'طفل المدرسة (5+ سنوات)';
  }
  
  // العثور على المعالم القريبة
  const recentMilestones = growthMilestones.filter(
    milestone => milestone.ageMonths <= ageInMonths && milestone.ageMonths >= ageInMonths - 3
  ).slice(-3);
  
  const upcomingMilestones = growthMilestones.filter(
    milestone => milestone.ageMonths > ageInMonths && milestone.ageMonths <= ageInMonths + 6
  ).slice(0, 3);
  
  // تنسيق عرض العمر
  const years = Math.floor(ageInMonths / 12);
  const remainingMonths = ageInMonths % 12;
  let ageDisplay = '';
  
  if (years > 0) {
    ageDisplay = `${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
    if (remainingMonths > 0) {
      ageDisplay += ` و ${remainingMonths} ${remainingMonths === 1 ? 'شهر' : 'أشهر'}`;
    }
  } else {
    ageDisplay = `${ageInMonths} ${ageInMonths === 1 ? 'شهر' : 'أشهر'}`;
  }
  
  // التوصيات حسب العمر
  const recommendations = getRecommendationsByAge(ageInMonths);
  const nutritionTips = getNutritionTipsByAge(ageInMonths);
  const safetyTips = getSafetyTipsByAge(ageInMonths);
  
  // موعد الفحص القادم
  const nextCheckup = getNextCheckupSchedule(ageInMonths);
  
  return {
    ageInMonths,
    ageInWeeks,
    ageInDays,
    ageDisplay,
    developmentStage,
    upcomingMilestones,
    recentMilestones,
    recommendations,
    nextCheckup,
    nutritionTips,
    safetyTips
  };
}

function getRecommendationsByAge(ageInMonths: number): string[] {
  if (ageInMonths < 6) {
    return [
      'الرضاعة الطبيعية حصرياً أو الحليب الصناعي',
      'النوم على الظهر لتجنب متلازمة الموت المفاجئ',
      'التحدث والغناء للطفل بانتظام',
      'وقت البطن اليومي لتقوية العضلات',
      'زيارات منتظمة لطبيب الأطفال'
    ];
  } else if (ageInMonths < 12) {
    return [
      'إدخال الأطعمة الصلبة تدريجياً',
      'تشجيع الاستكشاف الآمن للبيئة',
      'القراءة اليومية للطفل',
      'اللعب التفاعلي والألعاب التعليمية',
      'تأمين المنزل من المخاطر'
    ];
  } else if (ageInMonths < 24) {
    return [
      'تشجيع المشي والحركة',
      'تطوير المهارات اللغوية بالحديث المستمر',
      'وضع روتين يومي ثابت',
      'اللعب الخارجي والأنشطة الحركية',
      'تعليم الكلمات البسيطة والأغاني'
    ];
  } else if (ageInMonths < 36) {
    return [
      'تشجيع اللعب المستقل والإبداعي',
      'تعليم المهارات الاجتماعية الأساسية',
      'بداية التدريب على استخدام المرحاض',
      'تطوير المهارات الحركية الدقيقة',
      'وضع حدود واضحة ومتسقة'
    ];
  } else {
    return [
      'تحضير الطفل لدخول المدرسة',
      'تطوير مهارات القراءة والكتابة الأساسية',
      'تشجيع الأنشطة الجماعية والرياضة',
      'تعليم المسؤولية والاستقلالية',
      'تطوير المهارات الاجتماعية والعاطفية'
    ];
  }
}

function getNutritionTipsByAge(ageInMonths: number): string[] {
  if (ageInMonths < 6) {
    return [
      'الرضاعة الطبيعية كل 2-3 ساعات',
      'تجنب الماء والعصائر',
      'مراقبة علامات الجوع والشبع',
      'التأكد من زيادة الوزن المناسبة'
    ];
  } else if (ageInMonths < 12) {
    return [
      'إدخال الخضروات والفواكه المهروسة',
      'تجنب العسل والمكسرات الكاملة',
      'تقديم أطعمة متنوعة الألوان والقوام',
      'الاستمرار في الرضاعة الطبيعية'
    ];
  } else if (ageInMonths < 24) {
    return [
      'تقديم أطعمة الأسرة المقطعة قطع صغيرة',
      'تشجيع الأكل المستقل',
      'تقديم الحليب كامل الدسم',
      'تجنب الأطعمة المصنعة والسكريات'
    ];
  } else {
    return [
      'وجبات متوازنة من جميع المجموعات الغذائية',
      'تشجيع تناول الخضروات والفواكه',
      'تحديد أوقات الوجبات والوجبات الخفيفة',
      'تعليم عادات الأكل الصحية'
    ];
  }
}

function getSafetyTipsByAge(ageInMonths: number): string[] {
  if (ageInMonths < 6) {
    return [
      'النوم في سرير آمن بدون وسائد أو بطانيات',
      'عدم ترك الطفل وحيداً على الأسطح المرتفعة',
      'فحص درجة حرارة الحليب والطعام',
      'تجنب التدخين حول الطفل'
    ];
  } else if (ageInMonths < 12) {
    return [
      'تأمين الخزائن والأدراج',
      'تغطية المقابس الكهربائية',
      'إزالة الأشياء الصغيرة التي يمكن بلعها',
      'تأمين الدرج بحواجز الأمان'
    ];
  } else if (ageInMonths < 24) {
    return [
      'مراقبة الطفل باستمرار أثناء اللعب',
      'تأمين النوافذ والشرفات',
      'استخدام مقعد السيارة المناسب',
      'تعليم كلمة "لا" للمخاطر'
    ];
  } else {
    return [
      'تعليم قواعد الأمان الأساسية',
      'مراقبة اللعب مع الأطفال الآخرين',
      'تعليم عدم التحدث مع الغرباء',
      'تأمين المواد الكيميائية والأدوية'
    ];
  }
}

function getNextCheckupSchedule(ageInMonths: number): string {
  if (ageInMonths < 1) return 'خلال أسبوع من الولادة';
  if (ageInMonths < 2) return 'في عمر شهر واحد';
  if (ageInMonths < 4) return 'في عمر شهرين';
  if (ageInMonths < 6) return 'في عمر 4 أشهر';
  if (ageInMonths < 9) return 'في عمر 6 أشهر';
  if (ageInMonths < 12) return 'في عمر 9 أشهر';
  if (ageInMonths < 15) return 'في عمر 12 شهر';
  if (ageInMonths < 18) return 'في عمر 15 شهر';
  if (ageInMonths < 24) return 'في عمر 18 شهر';
  if (ageInMonths < 30) return 'في عمر سنتين';
  if (ageInMonths < 36) return 'في عمر سنتين ونصف';
  return 'فحص سنوي';
}

export function getGrowthChartData(gender: 'male' | 'female', ageInMonths: number) {
  // بيانات مبسطة لمخططات النمو (يجب استخدام بيانات WHO الفعلية في التطبيق الحقيقي)
  const weightPercentiles = {
    male: {
      3: [3.2, 4.4, 5.8, 7.5, 9.6],
      6: [6.4, 7.9, 9.8, 12.1, 14.9],
      12: [8.4, 10.2, 12.4, 15.1, 18.3],
      24: [10.5, 12.7, 15.3, 18.5, 22.3],
      36: [12.1, 14.6, 17.7, 21.3, 25.8]
    },
    female: {
      3: [2.9, 4.0, 5.4, 7.0, 9.0],
      6: [5.8, 7.2, 9.0, 11.1, 13.7],
      12: [7.8, 9.5, 11.7, 14.4, 17.7],
      24: [9.9, 12.0, 14.8, 18.1, 22.2],
      36: [11.3, 13.7, 16.9, 20.9, 25.8]
    }
  };
  
  return weightPercentiles[gender];
}