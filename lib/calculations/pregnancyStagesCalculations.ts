// حسابات مراحل الحمل التفصيلية
export interface PregnancyStage {
  week: number;
  trimester: number;
  babySize: string;
  babyWeight: string;
  babyLength: string;
  fruitComparison: string;
  motherChanges: string[];
  babyDevelopment: string[];
  tips: string[];
  tests: string[];
  symptoms: string[];
}

export interface PregnancyInfo {
  currentWeek: number;
  currentDay: number;
  trimester: number;
  daysPregnant: number;
  daysRemaining: number;
  dueDate: Date;
  conceptionDate: Date;
  currentStage: PregnancyStage;
  nextMilestone: string;
}

// بيانات مراحل الحمل أسبوعياً
const pregnancyStages: PregnancyStage[] = [
  {
    week: 4,
    trimester: 1,
    babySize: "2 مم",
    babyWeight: "أقل من 1 جرام",
    babyLength: "2 مم",
    fruitComparison: "بذرة الخشخاش",
    motherChanges: [
      "قد تشعرين بأعراض الحمل المبكرة",
      "تأخر الدورة الشهرية",
      "تغيرات في الثدي"
    ],
    babyDevelopment: [
      "تكوين الأنبوب العصبي",
      "بداية تكوين القلب",
      "تطور الطبقات الأساسية للجنين"
    ],
    tips: [
      "ابدئي بتناول حمض الفوليك",
      "تجنبي التدخين والكحول",
      "احجزي موعداً مع الطبيب"
    ],
    tests: ["فحص الحمل المنزلي", "فحص الدم لتأكيد الحمل"],
    symptoms: ["غثيان خفيف", "تعب", "حساسية في الثدي"]
  },
  {
    week: 8,
    trimester: 1,
    babySize: "1.6 سم",
    babyWeight: "1 جرام",
    babyLength: "1.6 سم",
    fruitComparison: "حبة التوت",
    motherChanges: [
      "زيادة في الغثيان الصباحي",
      "تغيرات في حاسة التذوق والشم",
      "تقلبات مزاجية"
    ],
    babyDevelopment: [
      "تكوين الأطراف الأساسية",
      "بداية تكوين الوجه",
      "تطور الجهاز العصبي"
    ],
    tips: [
      "تناولي وجبات صغيرة ومتكررة",
      "اشربي الكثير من الماء",
      "احصلي على قسط كافٍ من الراحة"
    ],
    tests: ["فحص الموجات فوق الصوتية الأول"],
    symptoms: ["غثيان شديد", "إرهاق", "كثرة التبول"]
  },
  {
    week: 12,
    trimester: 1,
    babySize: "5.4 سم",
    babyWeight: "14 جرام",
    babyLength: "5.4 سم",
    fruitComparison: "حبة الليمون",
    motherChanges: [
      "تحسن في الغثيان الصباحي",
      "زيادة في الطاقة",
      "بداية ظهور البطن"
    ],
    babyDevelopment: [
      "تكوين الأظافر",
      "بداية حركة الجنين",
      "تطور الكليتين"
    ],
    tips: [
      "يمكنك الإعلان عن الحمل الآن",
      "ابدئي بممارسة الرياضة الخفيفة",
      "تناولي الأطعمة الغنية بالكالسيوم"
    ],
    tests: ["فحص الشفافية القفوية", "فحوصات الدم الشاملة"],
    symptoms: ["تحسن عام", "زيادة الشهية", "تغيرات في الجلد"]
  },
  {
    week: 16,
    trimester: 2,
    babySize: "11.6 سم",
    babyWeight: "100 جرام",
    babyLength: "11.6 سم",
    fruitComparison: "حبة الأفوكادو",
    motherChanges: [
      "الشعور بحركة الجنين الأولى",
      "زيادة في حجم الثدي",
      "تحسن في المزاج"
    ],
    babyDevelopment: [
      "تطور العضلات والعظام",
      "بداية نمو الشعر",
      "تكوين بصمات الأصابع"
    ],
    tips: [
      "ابدئي بالتحدث مع الجنين",
      "احرصي على النوم على الجانب",
      "تناولي الأطعمة الغنية بالحديد"
    ],
    tests: ["فحص تشوهات الجنين", "فحص السائل الأمنيوسي (إذا لزم)"],
    symptoms: ["حركة الجنين", "زيادة الوزن", "تحسن عام"]
  },
  {
    week: 20,
    trimester: 2,
    babySize: "16.4 سم",
    babyWeight: "300 جرام",
    babyLength: "25.6 سم",
    fruitComparison: "حبة الموز",
    motherChanges: [
      "منتصف الحمل - نقطة تحول مهمة",
      "حركة الجنين أكثر وضوحاً",
      "زيادة في حجم البطن"
    ],
    babyDevelopment: [
      "تطور الحواس الخمس",
      "نمو الشعر والحواجب",
      "تكوين الطبقة الواقية للجلد"
    ],
    tips: [
      "هذا وقت مثالي لتصوير الحمل",
      "ابدئي بالتخطيط لغرفة الطفل",
      "احرصي على تمارين التنفس"
    ],
    tests: ["فحص الموجات فوق الصوتية التفصيلي", "فحص تحديد جنس الجنين"],
    symptoms: ["حركة جنين واضحة", "آلام الظهر الخفيفة", "تمدد الجلد"]
  },
  {
    week: 24,
    trimester: 2,
    babySize: "21 سم",
    babyWeight: "630 جرام",
    babyLength: "30 سم",
    fruitComparison: "كوز الذرة",
    motherChanges: [
      "زيادة ملحوظة في الوزن",
      "تغيرات في الجلد والشعر",
      "بداية تقلصات براكستون هيكس"
    ],
    babyDevelopment: [
      "تطور الرئتين",
      "استجابة للأصوات الخارجية",
      "تكوين دورة النوم والاستيقاظ"
    ],
    tips: [
      "ابدئي بحضور دروس الولادة",
      "تجنبي الوقوف لفترات طويلة",
      "احرصي على فحوصات السكري"
    ],
    tests: ["فحص سكري الحمل", "فحص ضغط الدم المنتظم"],
    symptoms: ["تقلصات خفيفة", "حرقة المعدة", "تورم القدمين"]
  },
  {
    week: 28,
    trimester: 3,
    babySize: "25 سم",
    babyWeight: "1 كيلوجرام",
    babyLength: "37.6 سم",
    fruitComparison: "حبة الباذنجان",
    motherChanges: [
      "بداية الثلث الأخير من الحمل",
      "صعوبة في النوم",
      "ضيق في التنفس"
    ],
    babyDevelopment: [
      "فتح وإغلاق العينين",
      "تطور الدماغ بسرعة",
      "تكوين الدهون تحت الجلد"
    ],
    tips: [
      "ابدئي بعد ركلات الجنين",
      "احرصي على النوم على الجانب الأيسر",
      "تجنبي الأطعمة الحارة"
    ],
    tests: ["فحص الأجسام المضادة", "مراقبة نمو الجنين"],
    symptoms: ["ضيق التنفس", "آلام الظهر", "تقلصات أقوى"]
  },
  {
    week: 32,
    trimester: 3,
    babySize: "28 سم",
    babyWeight: "1.7 كيلوجرام",
    babyLength: "42.4 سم",
    fruitComparison: "حبة الجوز الهندي",
    motherChanges: [
      "زيادة كبيرة في حجم البطن",
      "تكرار التبول",
      "تورم في اليدين والقدمين"
    ],
    babyDevelopment: [
      "تطور جهاز المناعة",
      "تكوين العظام (عدا الجمجمة)",
      "حركات تنفسية منتظمة"
    ],
    tips: [
      "ابدئي بتحضير حقيبة المستشفى",
      "تعلمي تقنيات الاسترخاء",
      "احرصي على الفحوصات المنتظمة"
    ],
    tests: ["فحص وضعية الجنين", "مراقبة ضغط الدم"],
    symptoms: ["صعوبة الحركة", "حرقة شديدة", "تقلصات منتظمة"]
  },
  {
    week: 36,
    trimester: 3,
    babySize: "32.2 سم",
    babyWeight: "2.6 كيلوجرام",
    babyLength: "47.4 سم",
    fruitComparison: "حبة الشمام الصغيرة",
    motherChanges: [
      "الجنين يستقر في الحوض",
      "تحسن في التنفس",
      "زيادة في الإفرازات"
    ],
    babyDevelopment: [
      "اكتمال نمو الرئتين تقريباً",
      "تطور ردود الأفعال",
      "تراكم الدهون للحفاظ على الحرارة"
    ],
    tips: [
      "الجنين يعتبر مكتمل النمو الآن",
      "راقبي علامات المخاض",
      "احرصي على الراحة التامة"
    ],
    tests: ["فحص البكتيريا العقدية", "مراقبة حركة الجنين"],
    symptoms: ["ضغط في الحوض", "تقلصات أقوى", "صعوبة النوم"]
  },
  {
    week: 40,
    trimester: 3,
    babySize: "36 سم",
    babyWeight: "3.3 كيلوجرام",
    babyLength: "51.2 سم",
    fruitComparison: "حبة البطيخ الصغيرة",
    motherChanges: [
      "موعد الولادة المتوقع",
      "تقلصات منتظمة وقوية",
      "نزول الماء المحيط بالجنين"
    ],
    babyDevelopment: [
      "اكتمال النمو بالكامل",
      "جاهز للحياة خارج الرحم",
      "تطور كامل لجميع الأعضاء"
    ],
    tips: [
      "كوني مستعدة للذهاب للمستشفى",
      "راقبي علامات المخاض الحقيقي",
      "تواصلي مع طبيبك فوراً عند بدء المخاض"
    ],
    tests: ["مراقبة الجنين المستمرة", "فحص عنق الرحم"],
    symptoms: ["تقلصات منتظمة", "نزول الماء", "ألم الظهر الشديد"]
  }
];

export function calculatePregnancyInfo(lastPeriodDate: Date): PregnancyInfo {
  const today = new Date();
  const lmpDate = new Date(lastPeriodDate);
  
  // حساب عدد الأيام منذ آخر دورة
  const daysSinceLMP = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // حساب الأسبوع الحالي (الحمل يحسب من آخر دورة)
  const currentWeek = Math.floor(daysSinceLMP / 7);
  const currentDay = daysSinceLMP % 7;
  
  // حساب الثلث الحالي
  let trimester = 1;
  if (currentWeek >= 13 && currentWeek < 27) trimester = 2;
  else if (currentWeek >= 27) trimester = 3;
  
  // حساب موعد الولادة (280 يوم من آخر دورة)
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);
  
  // حساب تاريخ الحمل التقريبي (14 يوم بعد آخر دورة)
  const conceptionDate = new Date(lmpDate);
  conceptionDate.setDate(conceptionDate.getDate() + 14);
  
  // حساب الأيام المتبقية
  const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // العثور على المرحلة الحالية
  let currentStage = pregnancyStages[0];
  for (let i = pregnancyStages.length - 1; i >= 0; i--) {
    if (currentWeek >= pregnancyStages[i].week) {
      currentStage = pregnancyStages[i];
      break;
    }
  }
  
  // تحديد المعلم التالي
  let nextMilestone = "اكتمال الحمل";
  for (let stage of pregnancyStages) {
    if (stage.week > currentWeek) {
      nextMilestone = `الأسبوع ${stage.week} - ${stage.fruitComparison}`;
      break;
    }
  }
  
  return {
    currentWeek,
    currentDay,
    trimester,
    daysPregnant: daysSinceLMP,
    daysRemaining,
    dueDate,
    conceptionDate,
    currentStage,
    nextMilestone
  };
}

export function getPregnancyStageByWeek(week: number): PregnancyStage | null {
  for (let i = pregnancyStages.length - 1; i >= 0; i--) {
    if (week >= pregnancyStages[i].week) {
      return pregnancyStages[i];
    }
  }
  return null;
}

export function getAllPregnancyStages(): PregnancyStage[] {
  return pregnancyStages;
}

export function getTrimesterInfo(trimester: number) {
  const trimesters = {
    1: {
      name: "الثلث الأول",
      weeks: "1-12",
      description: "فترة تكوين الأعضاء الأساسية",
      commonSymptoms: ["غثيان صباحي", "إرهاق", "تغيرات في الثدي"],
      tips: ["تناول حمض الفوليك", "تجنب التدخين", "زيارة الطبيب"]
    },
    2: {
      name: "الثلث الثاني", 
      weeks: "13-26",
      description: "فترة الراحة والنمو السريع",
      commonSymptoms: ["حركة الجنين", "زيادة الطاقة", "نمو البطن"],
      tips: ["ممارسة الرياضة الخفيفة", "تناول الكالسيوم", "مراقبة الوزن"]
    },
    3: {
      name: "الثلث الثالث",
      weeks: "27-40",
      description: "فترة التحضير للولادة",
      commonSymptoms: ["ضيق التنفس", "آلام الظهر", "تقلصات"],
      tips: ["حضور دروس الولادة", "تحضير حقيبة المستشفى", "مراقبة حركة الجنين"]
    }
  };
  
  return trimesters[trimester as keyof typeof trimesters] || null;
}