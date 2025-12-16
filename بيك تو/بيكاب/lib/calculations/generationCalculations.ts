// حسابات الأجيال - تحديد الجيل بناءً على سنة الميلاد

export interface Generation {
  name: string;
  nameEnglish: string;
  startYear: number;
  endYear: number;
  characteristics: string[];
  description: string;
  keyEvents: string[];
  technology: string[];
  icon: string;
  color: string;
}

export interface GenerationResult {
  generation: Generation;
  age: number;
  yearsSinceStart: number;
  yearsToEnd: number;
  isCurrentGeneration: boolean;
}

// تحويل الأرقام إلى العربية الهندية
export const toArabicNumerals = (num: number): string => {
  return String(num)
    .split("")
    .map((d) => (/[0-9]/.test(d) ? String.fromCharCode(0x0660 + parseInt(d)) : d))
    .join("");
};

// بيانات الأجيال المختلفة
export const generations: Generation[] = [
  {
    name: "الجيل الصامت",
    nameEnglish: "Silent Generation",
    startYear: 1928,
    endYear: 1945,
    characteristics: [
      "الانضباط والالتزام",
      "احترام السلطة والتقاليد",
      "العمل الجاد والمثابرة",
      "التوفير والاقتصاد",
      "الولاء للمؤسسات"
    ],
    description: "جيل نشأ خلال فترة الكساد الكبير والحرب العالمية الثانية، يتميز بالصبر والتحمل",
    keyEvents: [
      "الكساد الكبير (١٩٢٩)",
      "الحرب العالمية الثانية (١٩٣٩-١٩٤٥)",
      "تأسيس الأمم المتحدة (١٩٤٥)",
      "بداية الحرب الباردة"
    ],
    technology: [
      "الراديو",
      "التلفزيون الأبيض والأسود",
      "الهاتف الثابت",
      "السيارات الأولى"
    ],
    icon: "🤫",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  },
  {
    name: "جيل الطفرة السكانية",
    nameEnglish: "Baby Boomers",
    startYear: 1946,
    endYear: 1964,
    characteristics: [
      "التفاؤل والطموح",
      "الثقة في المؤسسات",
      "العمل الجماعي",
      "السعي للاستقرار المالي",
      "الولاء للعمل"
    ],
    description: "جيل ما بعد الحرب العالمية الثانية، شهد نمواً اقتصادياً وازدهاراً كبيراً",
    keyEvents: [
      "النمو الاقتصادي بعد الحرب",
      "حركة الحقوق المدنية",
      "الهبوط على القمر (١٩٦٩)",
      "حرب فيتنام",
      "ثورة الشباب في الستينات"
    ],
    technology: [
      "التلفزيون الملون",
      "الكاسيت",
      "الحاسوب الكبير",
      "الأقمار الصناعية"
    ],
    icon: "👶",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
  },
  {
    name: "الجيل X",
    nameEnglish: "Generation X",
    startYear: 1965,
    endYear: 1980,
    characteristics: [
      "الاستقلالية والاعتماد على الذات",
      "الشك في المؤسسات",
      "التوازن بين العمل والحياة",
      "التكيف مع التغيير",
      "الواقعية والبراغماتية"
    ],
    description: "جيل الحاسوب الشخصي والإنترنت المبكر، نشأ في فترة التغيرات التكنولوجية السريعة",
    keyEvents: [
      "سقوط جدار برلين (١٩٨٩)",
      "انتهاء الحرب الباردة",
      "ظهور الإنترنت",
      "أزمة النفط",
      "انتشار الحاسوب الشخصي"
    ],
    technology: [
      "الحاسوب الشخصي",
      "الإنترنت المبكر",
      "الهاتف المحمول الأول",
      "أجهزة الألعاب",
      "الأقراص المدمجة"
    ],
    icon: "💻",
    color: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
  },
  {
    name: "جيل الألفية",
    nameEnglish: "Millennials",
    startYear: 1981,
    endYear: 1996,
    characteristics: [
      "التفاؤل والثقة بالنفس",
      "التعاون والعمل الجماعي",
      "التنوع والشمولية",
      "البحث عن المعنى في العمل",
      "الاهتمام بالقضايا الاجتماعية"
    ],
    description: "جيل الإنترنت والهواتف الذكية، أول جيل رقمي حقيقي يتميز بالتواصل والتفاعل",
    keyEvents: [
      "أحداث ١١ سبتمبر (٢٠٠١)",
      "الأزمة المالية العالمية (٢٠٠٨)",
      "ظهور وسائل التواصل الاجتماعي",
      "الربيع العربي (٢٠١١)",
      "انتشار الهواتف الذكية"
    ],
    technology: [
      "الإنترنت عالي السرعة",
      "الهواتف الذكية",
      "وسائل التواصل الاجتماعي",
      "الألعاب الإلكترونية",
      "التجارة الإلكترونية"
    ],
    icon: "📱",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
  },
  {
    name: "الجيل Z",
    nameEnglish: "Generation Z",
    startYear: 1997,
    endYear: 2012,
    characteristics: [
      "الواقعية والبراغماتية",
      "التنوع والشمولية",
      "ريادة الأعمال",
      "الوعي البيئي والاجتماعي",
      "التعلم الذاتي"
    ],
    description: "جيل وسائل التواصل الاجتماعي والمحتوى الرقمي، نشأ مع التكنولوجيا منذ الطفولة",
    keyEvents: [
      "الأزمة المالية العالمية (٢٠٠٨)",
      "انتشار يوتيوب وتيك توك",
      "جائحة كوفيد-١٩ (٢٠٢٠)",
      "تغير المناخ",
      "الثورة الرقمية"
    ],
    technology: [
      "وسائل التواصل الاجتماعي",
      "المحتوى المرئي القصير",
      "الألعاب الإلكترونية المتقدمة",
      "التطبيقات المحمولة",
      "الواقع الافتراضي"
    ],
    icon: "🎮",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200"
  },
  {
    name: "جيل ألفا",
    nameEnglish: "Generation Alpha",
    startYear: 2013,
    endYear: 2025,
    characteristics: [
      "التكنولوجيا الفطرية",
      "التعلم التفاعلي",
      "الوعي العالمي",
      "التنوع الثقافي",
      "الإبداع الرقمي"
    ],
    description: "جيل الذكاء الاصطناعي والواقع الافتراضي، أول جيل يولد في عصر الهواتف الذكية",
    keyEvents: [
      "جائحة كوفيد-١٩ (٢٠٢٠)",
      "انتشار الذكاء الاصطناعي",
      "التعليم الرقمي",
      "تغير المناخ",
      "الثورة التكنولوجية"
    ],
    technology: [
      "الذكاء الاصطناعي",
      "الواقع الافتراضي والمعزز",
      "إنترنت الأشياء",
      "التعلم الآلي",
      "التكنولوجيا الصوتية"
    ],
    icon: "🤖",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
  }
];

// حساب الجيل بناءً على سنة الميلاد
export function calculateGeneration(birthYear: number): GenerationResult | null {
  // التحقق من صحة السنة
  if (!birthYear || birthYear < 1900 || birthYear > 2025) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  // البحث عن الجيل المناسب
  const generation = generations.find(gen => 
    birthYear >= gen.startYear && birthYear <= gen.endYear
  );
  
  if (!generation) return null;
  
  return {
    generation,
    age,
    yearsSinceStart: birthYear - generation.startYear,
    yearsToEnd: generation.endYear - birthYear,
    isCurrentGeneration: currentYear >= generation.startYear && currentYear <= generation.endYear
  };
}

// الحصول على جميع الأجيال
export function getAllGenerations(): Generation[] {
  return generations;
}

// الحصول على الجيل بالاسم
export function getGenerationByName(name: string): Generation | null {
  return generations.find(gen => gen.name === name || gen.nameEnglish === name) || null;
}

// الحصول على إحصائيات الأجيال
export function getGenerationStats() {
  const currentYear = new Date().getFullYear();
  
  return generations.map(gen => ({
    ...gen,
    totalYears: gen.endYear - gen.startYear + 1,
    isActive: currentYear >= gen.startYear && currentYear <= gen.endYear,
    yearsAgo: gen.endYear < currentYear ? currentYear - gen.endYear : 0
  }));
}

// التحقق من صحة سنة الميلاد
export function validateBirthYear(year: number): { isValid: boolean; error?: string } {
  if (!year) {
    return { isValid: false, error: "يرجى إدخال سنة الميلاد" };
  }
  
  if (year < 1900) {
    return { isValid: false, error: "السنة يجب أن تكون أكبر من ١٩٠٠" };
  }
  
  if (year > 2025) {
    return { isValid: false, error: "السنة يجب أن تكون أقل من ٢٠٢٥" };
  }
  
  const currentYear = new Date().getFullYear();
  if (year > currentYear) {
    return { isValid: false, error: "لا يمكن أن تكون سنة الميلاد في المستقبل" };
  }
  
  return { isValid: true };
}

// Additional helper functions

// مقارنة الأجيال
export function compareGenerations(gen1: Generation, gen2: Generation) {
  return {
    ageDifference: Math.abs(gen1.startYear - gen2.startYear),
    overlapYears: Math.max(0, Math.min(gen1.endYear, gen2.endYear) - Math.max(gen1.startYear, gen2.startYear) + 1),
    isConsecutive: gen1.endYear + 1 === gen2.startYear || gen2.endYear + 1 === gen1.startYear
  };
}

// الحصول على الجيل التالي
export function getNextGeneration(currentGen: Generation): Generation | null {
  const currentIndex = generations.findIndex(gen => gen.name === currentGen.name);
  return currentIndex < generations.length - 1 ? generations[currentIndex + 1] : null;
}

// الحصول على الجيل السابق
export function getPreviousGeneration(currentGen: Generation): Generation | null {
  const currentIndex = generations.findIndex(gen => gen.name === currentGen.name);
  return currentIndex > 0 ? generations[currentIndex - 1] : null;
}

// حساب النسبة المئوية للعمر في الجيل
export function getAgePercentageInGeneration(birthYear: number): number {
  const result = calculateGeneration(birthYear);
  if (!result) return 0;
  
  const totalYears = result.generation.endYear - result.generation.startYear + 1;
  const yearsPassed = birthYear - result.generation.startYear;
  
  return Math.round((yearsPassed / totalYears) * 100);
}