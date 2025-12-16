// دوال مساعدة لصفحة الألوان والأرقام

export interface LuckyColorData {
  color: string;
  colorEn: string;
  meaning: string;
  hex?: string;
}

export interface LuckyNumbersData {
  numbers: number[];
  zodiacAnimal: string;
  zodiacColors: string[];
  description: string;
}

export interface UserInput {
  day: number;
  month: number;
  year: number;
}

export interface ColorsNumbersResult {
  luckyColor: LuckyColorData;
  luckyNumbers: LuckyNumbersData;
  birthDate: UserInput;
}

export interface ValidationError {
  field: 'day' | 'month' | 'year';
  message: string;
}

// خريطة الألوان مع hex codes
export const COLOR_HEX_MAP: Record<string, string> = {
  الأبيض: '#FFFFFF',
  الأرجواني: '#8B5CF6',
  الأخضر: '#10B981',
  الوردي: '#EC4899',
  الأصفر: '#F59E0B',
  الأزرق: '#3B82F6',
  الأحمر: '#EF4444',
  البرتقالي: '#F97316',
  الذهبي: '#D4AF37',
  البني: '#92400E',
  الفضي: '#9CA3AF',
  'الأزرق الداكن': '#1E40AF',
  البنفسجي: '#8B5CF6',
  الزهري: '#EC4899',
  'الأخضر الفاتح': '#34D399',
  'الأزرق الفاتح': '#60A5FA',
};

// أسماء الأشهر بالعربية
export const MONTH_NAMES: Record<number, string> = {
  1: 'يناير',
  2: 'فبراير',
  3: 'مارس',
  4: 'أبريل',
  5: 'مايو',
  6: 'يونيو',
  7: 'يوليو',
  8: 'أغسطس',
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر',
};

/**
 * التحقق من صحة التاريخ المدخل
 */
export const validateDate = (
  day: number,
  month: number,
  year: number
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // التحقق من اليوم
  if (!day || day < 1 || day > 31) {
    errors.push({
      field: 'day',
      message: 'اليوم يجب أن يكون بين 1 و 31',
    });
  }

  // التحقق من الشهر
  if (!month || month < 1 || month > 12) {
    errors.push({
      field: 'month',
      message: 'الشهر يجب أن يكون بين 1 و 12',
    });
  }

  // التحقق من السنة
  if (!year || year < 1900 || year > 2100) {
    errors.push({
      field: 'year',
      message: 'السنة يجب أن تكون بين 1900 و 2100',
    });
  }

  // التحقق من صحة التاريخ (عدد الأيام في الشهر)
  if (month && day && year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      errors.push({
        field: 'day',
        message: `الشهر ${MONTH_NAMES[month]} يحتوي على ${daysInMonth} يوم فقط`,
      });
    }
  }

  return errors;
};

/**
 * الحصول على hex code للون
 */
export const getColorHex = (
  colorName: string,
  fallbackHex?: string
): string => {
  return COLOR_HEX_MAP[colorName] || fallbackHex || '#8B5CF6';
};

/**
 * الحصول على اسم الشهر بالعربية
 */
export const getMonthName = (month: number): string => {
  return MONTH_NAMES[month] || `الشهر ${month}`;
};

/**
 * تنسيق التاريخ للعرض
 */
export const formatDate = (
  day: number,
  month: number,
  year: number
): string => {
  return `${day} ${getMonthName(month)} ${year}`;
};

/**
 * إنشاء نص المشاركة للألوان والأرقام
 */
export const createShareText = (result: ColorsNumbersResult): string => {
  const { luckyColor, luckyNumbers, birthDate } = result;
  const dateStr = formatDate(birthDate.day, birthDate.month, birthDate.year);

  return `🎨 ألواني وأرقامي المحظوظة لتاريخ ${dateStr}:
  
🌈 اللون المحظوظ: ${luckyColor.color} (${luckyColor.colorEn})
${luckyColor.meaning}

🔢 الأرقام المحظوظة: ${luckyNumbers.numbers.join(', ')}
🐉 البرج الصيني: ${luckyNumbers.zodiacAnimal}

اكتشف ألوانك وأرقامك المحظوظة على موقع ميلادك!`;
};

/**
 * تحويل البيانات من API إلى تنسيق LuckyColorData
 */
export const transformApiColorData = (apiData: any): LuckyColorData => {
  return {
    color: apiData.color || apiData.color_name_ar || 'غير محدد',
    colorEn: apiData.colorEn || apiData.color_name || 'Unknown',
    meaning:
      apiData.meaning || apiData.description || 'لون جميل يجلب الحظ الجيد',
    hex: apiData.hex || apiData.hex_code,
  };
};

/**
 * إنشاء URL للمشاركة
 */
export const createShareUrl = (
  platform: 'whatsapp' | 'twitter' | 'facebook',
  text: string,
  url: string = window.location.href
): string => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    default:
      return url;
  }
};

/**
 * نسخ النص إلى الحافظة
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('فشل في نسخ النص:', error);
    return false;
  }
};

/**
 * جلب بيانات الألوان المحظوظة من API
 */
export const fetchLuckyColor = async (
  month: number
): Promise<LuckyColorData | null> => {
  try {
    const response = await fetch(`/api/monthly-info/${month}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data?.luckyColor) {
      throw new Error('Invalid API response structure');
    }

    const apiColor = result.data.luckyColor;

    return {
      color: apiColor.color,
      colorEn: apiColor.colorEn,
      meaning: apiColor.meaning,
      hex: getColorHex(apiColor.color),
    };
  } catch (error) {
    console.error('Error fetching lucky color:', error);

    // Fallback data في حالة فشل API
    return getFallbackColorData(month);
  }
};

/**
 * بيانات احتياطية للألوان في حالة فشل API
 */
const getFallbackColorData = (month: number): LuckyColorData => {
  const fallbackColors: Record<number, LuckyColorData> = {
    1: {
      color: 'الأبيض',
      colorEn: 'White',
      meaning: 'النقاء والبدايات الجديدة',
      hex: '#FFFFFF',
    },
    2: {
      color: 'الأرجواني',
      colorEn: 'Purple',
      meaning: 'الحكمة والروحانية',
      hex: '#8B5CF6',
    },
    3: {
      color: 'الأخضر',
      colorEn: 'Green',
      meaning: 'النمو والتجدد',
      hex: '#10B981',
    },
    4: {
      color: 'الوردي',
      colorEn: 'Pink',
      meaning: 'الحب والرومانسية',
      hex: '#EC4899',
    },
    5: {
      color: 'الأصفر',
      colorEn: 'Yellow',
      meaning: 'السعادة والتفاؤل',
      hex: '#F59E0B',
    },
    6: {
      color: 'الأزرق',
      colorEn: 'Blue',
      meaning: 'الهدوء والسلام',
      hex: '#3B82F6',
    },
    7: {
      color: 'الأحمر',
      colorEn: 'Red',
      meaning: 'الشغف والطاقة',
      hex: '#EF4444',
    },
    8: {
      color: 'البرتقالي',
      colorEn: 'Orange',
      meaning: 'الإبداع والحماس',
      hex: '#F97316',
    },
    9: {
      color: 'الذهبي',
      colorEn: 'Gold',
      meaning: 'النجاح والثروة',
      hex: '#D4AF37',
    },
    10: {
      color: 'البني',
      colorEn: 'Brown',
      meaning: 'الاستقرار والأمان',
      hex: '#92400E',
    },
    11: {
      color: 'الفضي',
      colorEn: 'Silver',
      meaning: 'الأناقة والحداثة',
      hex: '#9CA3AF',
    },
    12: {
      color: 'الأزرق الداكن',
      colorEn: 'Navy Blue',
      meaning: 'العمق والحكمة',
      hex: '#1E40AF',
    },
  };

  return fallbackColors[month] || fallbackColors[1];
};

/**
 * التحقق من صحة البيانات المستلمة من API
 */
export const validateApiResponse = (data: any): boolean => {
  return (
    data &&
    typeof data === 'object' &&
    data.success === true &&
    data.data &&
    data.data.luckyColor &&
    (data.data.luckyColor.color || data.data.luckyColor.color_name_ar) &&
    (data.data.luckyColor.colorEn || data.data.luckyColor.color_name)
  );
};
