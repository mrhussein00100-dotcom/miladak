// Card Validation and Quality Checker

export interface CardValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  severity: number; // 1-5
}

export interface CardData {
  name?: string;
  age?: number;
  showAge?: boolean;
  greeting?: string;
  message?: string;
  signature?: string;
  fontSize?: number;
  fontFamily?: string;
  template?: {
    style: {
      background: string;
      textColor: string;
      accentColor: string;
    };
  };
}

// Validation rules
const VALIDATION_RULES = {
  name: {
    minLength: 1,
    maxLength: 50,
    required: true,
  },
  greeting: {
    minLength: 3,
    maxLength: 100,
    required: true,
  },
  message: {
    minLength: 5,
    maxLength: 300,
    required: false,
  },
  signature: {
    minLength: 2,
    maxLength: 50,
    required: false,
  },
  fontSize: {
    min: 10,
    max: 32,
    default: 18,
  },
  age: {
    min: 0,
    max: 150,
  },
};

// Arabic text patterns
const ARABIC_PATTERNS = {
  hasArabic:
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  onlyArabic:
    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u060C\u061B\u061F\u0640\u066A\u066B\u066C\u066D\u200C\u200D\u200E\u200F\u2010\u2011\u2012\u2013\u2014\u2015\u2016\u2017\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2020\u2021\u2022\u2023\u2024\u2025\u2026\u2027\u2030\u2031\u2032\u2033\u2034\u2035\u2036\u2037\u2038\u2039\u203A\u203B\u203C\u203D\u203E\u203F\u2040\u2041\u2042\u2043\u2044\u2045\u2046\u2047\u2048\u2049\u204A\u204B\u204C\u204D\u204E\u204F\u2050\u2051\u2052\u2053\u2054\u2055\u2056\u2057\u2058\u2059\u205A\u205B\u205C\u205D\u205E\u205F\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069\u206A\u206B\u206C\u206D\u206E\u206F\u0-9]+$/,
  commonGreetings: [
    'كل عام وأنت بخير',
    'عيد ميلاد سعيد',
    'أجمل التهاني',
    'بارك الله في عمرك',
    'عقبال مائة سنة',
  ],
};

// Quality scoring weights
const SCORING_WEIGHTS = {
  completeness: 30, // All required fields filled
  textQuality: 25, // Good Arabic text, appropriate length
  design: 20, // Font size, color contrast
  creativity: 15, // Unique content, not generic
  technical: 10, // No technical issues
};

export function validateCard(cardData: CardData): CardValidationResult {
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check required fields
  if (!cardData.name || cardData.name.trim().length === 0) {
    issues.push({
      type: 'error',
      field: 'name',
      message: 'اسم صاحب العيد مطلوب',
      severity: 5,
    });
    score -= 20;
  }

  if (!cardData.greeting || cardData.greeting.trim().length === 0) {
    issues.push({
      type: 'error',
      field: 'greeting',
      message: 'كلمة التهنئة مطلوبة',
      severity: 5,
    });
    score -= 20;
  }

  // Validate name
  if (cardData.name) {
    if (cardData.name.length < VALIDATION_RULES.name.minLength) {
      issues.push({
        type: 'warning',
        field: 'name',
        message: 'الاسم قصير جداً',
        severity: 3,
      });
      score -= 5;
    }

    if (cardData.name.length > VALIDATION_RULES.name.maxLength) {
      issues.push({
        type: 'warning',
        field: 'name',
        message: 'الاسم طويل جداً، قد لا يظهر بشكل جيد',
        severity: 3,
      });
      score -= 5;
    }

    // Check if name contains Arabic
    if (!ARABIC_PATTERNS.hasArabic.test(cardData.name)) {
      issues.push({
        type: 'info',
        field: 'name',
        message: 'يُفضل استخدام الأسماء العربية',
        severity: 1,
      });
      score -= 2;
    }
  }

  // Validate greeting
  if (cardData.greeting) {
    if (cardData.greeting.length < VALIDATION_RULES.greeting.minLength) {
      issues.push({
        type: 'warning',
        field: 'greeting',
        message: 'كلمة التهنئة قصيرة جداً',
        severity: 3,
      });
      score -= 5;
    }

    if (cardData.greeting.length > VALIDATION_RULES.greeting.maxLength) {
      issues.push({
        type: 'warning',
        field: 'greeting',
        message: 'كلمة التهنئة طويلة جداً',
        severity: 3,
      });
      score -= 5;
    }

    // Check for common greetings (creativity check)
    if (ARABIC_PATTERNS.commonGreetings.includes(cardData.greeting.trim())) {
      suggestions.push('جرب كلمة تهنئة أكثر إبداعاً وشخصية');
      score -= 3;
    }

    // Check Arabic content
    if (!ARABIC_PATTERNS.hasArabic.test(cardData.greeting)) {
      issues.push({
        type: 'warning',
        field: 'greeting',
        message: 'يُفضل استخدام التهاني باللغة العربية',
        severity: 2,
      });
      score -= 3;
    }
  }

  // Validate message
  if (cardData.message) {
    if (cardData.message.length > VALIDATION_RULES.message.maxLength) {
      issues.push({
        type: 'warning',
        field: 'message',
        message: 'الرسالة طويلة جداً، قد لا تظهر بشكل جيد',
        severity: 3,
      });
      score -= 5;
    }

    if (
      cardData.message.length < VALIDATION_RULES.message.minLength &&
      cardData.message.length > 0
    ) {
      issues.push({
        type: 'info',
        field: 'message',
        message: 'الرسالة قصيرة، يمكنك إضافة المزيد',
        severity: 1,
      });
      score -= 2;
    }
  } else {
    suggestions.push('أضف رسالة شخصية لجعل البطاقة أكثر تميزاً');
    score -= 5;
  }

  // Validate signature
  if (cardData.signature) {
    if (cardData.signature.length > VALIDATION_RULES.signature.maxLength) {
      issues.push({
        type: 'warning',
        field: 'signature',
        message: 'التوقيع طويل جداً',
        severity: 2,
      });
      score -= 3;
    }
  } else {
    suggestions.push('أضف توقيعك لإضفاء لمسة شخصية');
    score -= 3;
  }

  // Validate age
  if (cardData.age !== undefined) {
    if (
      cardData.age < VALIDATION_RULES.age.min ||
      cardData.age > VALIDATION_RULES.age.max
    ) {
      issues.push({
        type: 'error',
        field: 'age',
        message: 'العمر غير صحيح',
        severity: 4,
      });
      score -= 10;
    }

    if (cardData.age > 100) {
      issues.push({
        type: 'info',
        field: 'age',
        message: 'عمر مبارك! تأكد من صحة العمر المدخل',
        severity: 1,
      });
    }
  }

  // Validate font size
  if (cardData.fontSize) {
    if (cardData.fontSize < VALIDATION_RULES.fontSize.min) {
      issues.push({
        type: 'warning',
        field: 'fontSize',
        message: 'حجم الخط صغير جداً، قد يصعب قراءته',
        severity: 3,
      });
      score -= 5;
    }

    if (cardData.fontSize > VALIDATION_RULES.fontSize.max) {
      issues.push({
        type: 'warning',
        field: 'fontSize',
        message: 'حجم الخط كبير جداً، قد لا يتسع في البطاقة',
        severity: 3,
      });
      score -= 5;
    }
  }

  // Check color contrast (if template is provided)
  if (cardData.template) {
    const contrastIssue = checkColorContrast(
      cardData.template.style.textColor,
      cardData.template.style.background
    );
    if (contrastIssue) {
      issues.push(contrastIssue);
      score -= 8;
    }
  }

  // Add positive suggestions
  if (score >= 90) {
    suggestions.push('بطاقة ممتازة! جاهزة للمشاركة 🎉');
  } else if (score >= 80) {
    suggestions.push('بطاقة جيدة جداً، بعض التحسينات البسيطة ستجعلها مثالية');
  } else if (score >= 70) {
    suggestions.push('بطاقة جيدة، راجع الملاحظات للتحسين');
  } else if (score >= 60) {
    suggestions.push('البطاقة تحتاج بعض التحسينات المهمة');
  } else {
    suggestions.push('البطاقة تحتاج مراجعة شاملة قبل الاستخدام');
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    isValid: issues.filter((issue) => issue.type === 'error').length === 0,
    score,
    issues,
    suggestions,
  };
}

function checkColorContrast(
  textColor: string,
  backgroundColor: string
): ValidationIssue | null {
  // Simple contrast check - in a real implementation, you'd use a proper contrast ratio calculation
  const isLightText = textColor.includes('#fff') || textColor.includes('white');
  const isDarkBackground =
    backgroundColor.includes('#000') || backgroundColor.includes('dark');
  const isLightBackground =
    backgroundColor.includes('#fff') || backgroundColor.includes('light');
  const isDarkText = textColor.includes('#000') || textColor.includes('dark');

  if ((isLightText && isLightBackground) || (isDarkText && isDarkBackground)) {
    return {
      type: 'warning',
      field: 'design',
      message: 'تباين الألوان ضعيف، قد يصعب قراءة النص',
      severity: 3,
    };
  }

  return null;
}

// Helper function to get validation summary
export function getValidationSummary(result: CardValidationResult): string {
  const errorCount = result.issues.filter(
    (issue) => issue.type === 'error'
  ).length;
  const warningCount = result.issues.filter(
    (issue) => issue.type === 'warning'
  ).length;

  if (errorCount > 0) {
    return `❌ ${errorCount} خطأ يجب إصلاحه`;
  } else if (warningCount > 0) {
    return `⚠️ ${warningCount} تحذير يُنصح بمراجعته`;
  } else {
    return `✅ البطاقة جاهزة (${result.score}/100)`;
  }
}

// Helper function to get quality badge
export function getQualityBadge(score: number): {
  text: string;
  color: string;
  emoji: string;
} {
  if (score >= 90) {
    return { text: 'ممتاز', color: 'green', emoji: '🏆' };
  } else if (score >= 80) {
    return { text: 'جيد جداً', color: 'blue', emoji: '⭐' };
  } else if (score >= 70) {
    return { text: 'جيد', color: 'yellow', emoji: '👍' };
  } else if (score >= 60) {
    return { text: 'مقبول', color: 'orange', emoji: '⚠️' };
  } else {
    return { text: 'يحتاج تحسين', color: 'red', emoji: '❌' };
  }
}
