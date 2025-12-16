// حسابات المناطق الزمنية - تحويل الأوقات بين المناطق الزمنية المختلفة

export interface Timezone {
  id: string;
  name: string;
  nameEnglish: string;
  offset: number;
  country: string;
  city: string;
  flag: string;
  region: 'arab' | 'world';
}

export interface TimeConversion {
  sourceTime: Date;
  targetTime: Date;
  sourceTimezone: Timezone;
  targetTimezone: Timezone;
  timeDifference: number;
  dayDifference: number;
}

export interface TimeDisplay {
  time: string;
  date: string;
  dayName: string;
  arabicTime: string;
  arabicDate: string;
}

// تحويل الأرقام إلى العربية الهندية
export const toArabicNumerals = (num: number): string => {
  return String(num)
    .split("")
    .map((d) => (/[0-9]/.test(d) ? String.fromCharCode(0x0660 + parseInt(d)) : d))
    .join("");
};

// أسماء الأيام بالعربية
const arabicDays = [
  'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

// أسماء الشهور بالعربية
const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// المناطق الزمنية المدعومة
export const timezones: Timezone[] = [
  // المناطق العربية
  {
    id: "mecca",
    name: "توقيت مكة المكرمة",
    nameEnglish: "Mecca Time (AST)",
    offset: 3,
    country: "السعودية",
    city: "مكة المكرمة",
    flag: "🇸🇦",
    region: 'arab'
  },
  {
    id: "riyadh",
    name: "توقيت الرياض",
    nameEnglish: "Riyadh Time (AST)",
    offset: 3,
    country: "السعودية",
    city: "الرياض",
    flag: "🇸🇦",
    region: 'arab'
  },
  {
    id: "cairo",
    name: "توقيت القاهرة",
    nameEnglish: "Cairo Time (EET)",
    offset: 2,
    country: "مصر",
    city: "القاهرة",
    flag: "🇪🇬",
    region: 'arab'
  },
  {
    id: "baghdad",
    name: "توقيت بغداد",
    nameEnglish: "Baghdad Time (AST)",
    offset: 3,
    country: "العراق",
    city: "بغداد",
    flag: "🇮🇶",
    region: 'arab'
  },
  {
    id: "dubai",
    name: "توقيت دبي",
    nameEnglish: "Dubai Time (GST)",
    offset: 4,
    country: "الإمارات",
    city: "دبي",
    flag: "🇦🇪",
    region: 'arab'
  },
  {
    id: "kuwait",
    name: "توقيت الكويت",
    nameEnglish: "Kuwait Time (AST)",
    offset: 3,
    country: "الكويت",
    city: "الكويت",
    flag: "🇰🇼",
    region: 'arab'
  },
  {
    id: "doha",
    name: "توقيت الدوحة",
    nameEnglish: "Doha Time (AST)",
    offset: 3,
    country: "قطر",
    city: "الدوحة",
    flag: "🇶🇦",
    region: 'arab'
  },
  {
    id: "beirut",
    name: "توقيت بيروت",
    nameEnglish: "Beirut Time (EET)",
    offset: 2,
    country: "لبنان",
    city: "بيروت",
    flag: "🇱🇧",
    region: 'arab'
  },
  {
    id: "damascus",
    name: "توقيت دمشق",
    nameEnglish: "Damascus Time (EET)",
    offset: 2,
    country: "سوريا",
    city: "دمشق",
    flag: "🇸🇾",
    region: 'arab'
  },
  {
    id: "amman",
    name: "توقيت عمان",
    nameEnglish: "Amman Time (EET)",
    offset: 2,
    country: "الأردن",
    city: "عمان",
    flag: "🇯🇴",
    region: 'arab'
  },
  {
    id: "rabat",
    name: "توقيت الرباط",
    nameEnglish: "Rabat Time (WET)",
    offset: 1,
    country: "المغرب",
    city: "الرباط",
    flag: "🇲🇦",
    region: 'arab'
  },
  {
    id: "tunis",
    name: "توقيت تونس",
    nameEnglish: "Tunis Time (CET)",
    offset: 1,
    country: "تونس",
    city: "تونس",
    flag: "🇹🇳",
    region: 'arab'
  },
  {
    id: "algiers",
    name: "توقيت الجزائر",
    nameEnglish: "Algiers Time (CET)",
    offset: 1,
    country: "الجزائر",
    city: "الجزائر",
    flag: "🇩🇿",
    region: 'arab'
  },
  
  // المناطق العالمية
  {
    id: "london",
    name: "توقيت لندن",
    nameEnglish: "London Time (GMT/BST)",
    offset: 0,
    country: "بريطانيا",
    city: "لندن",
    flag: "🇬🇧",
    region: 'world'
  },
  {
    id: "paris",
    name: "توقيت باريس",
    nameEnglish: "Paris Time (CET/CEST)",
    offset: 1,
    country: "فرنسا",
    city: "باريس",
    flag: "🇫🇷",
    region: 'world'
  },
  {
    id: "berlin",
    name: "توقيت برلين",
    nameEnglish: "Berlin Time (CET/CEST)",
    offset: 1,
    country: "ألمانيا",
    city: "برلين",
    flag: "🇩🇪",
    region: 'world'
  },
  {
    id: "moscow",
    name: "توقيت موسكو",
    nameEnglish: "Moscow Time (MSK)",
    offset: 3,
    country: "روسيا",
    city: "موسكو",
    flag: "🇷🇺",
    region: 'world'
  },
  {
    id: "istanbul",
    name: "توقيت إسطنبول",
    nameEnglish: "Istanbul Time (TRT)",
    offset: 3,
    country: "تركيا",
    city: "إسطنبول",
    flag: "🇹🇷",
    region: 'world'
  },
  {
    id: "new_york",
    name: "توقيت نيويورك",
    nameEnglish: "New York Time (EST/EDT)",
    offset: -5,
    country: "أمريكا",
    city: "نيويورك",
    flag: "🇺🇸",
    region: 'world'
  },
  {
    id: "los_angeles",
    name: "توقيت لوس أنجلوس",
    nameEnglish: "Los Angeles Time (PST/PDT)",
    offset: -8,
    country: "أمريكا",
    city: "لوس أنجلوس",
    flag: "🇺🇸",
    region: 'world'
  },
  {
    id: "tokyo",
    name: "توقيت طوكيو",
    nameEnglish: "Tokyo Time (JST)",
    offset: 9,
    country: "اليابان",
    city: "طوكيو",
    flag: "🇯🇵",
    region: 'world'
  },
  {
    id: "sydney",
    name: "توقيت سيدني",
    nameEnglish: "Sydney Time (AEST/AEDT)",
    offset: 10,
    country: "أستراليا",
    city: "سيدني",
    flag: "🇦🇺",
    region: 'world'
  },
  {
    id: "beijing",
    name: "توقيت بكين",
    nameEnglish: "Beijing Time (CST)",
    offset: 8,
    country: "الصين",
    city: "بكين",
    flag: "🇨🇳",
    region: 'world'
  },
  {
    id: "mumbai",
    name: "توقيت مومباي",
    nameEnglish: "Mumbai Time (IST)",
    offset: 5.5,
    country: "الهند",
    city: "مومباي",
    flag: "🇮🇳",
    region: 'world'
  }
];

// تحويل الوقت بين المناطق الزمنية
export function convertTime(
  time: Date,
  sourceTimezone: Timezone,
  targetTimezone: Timezone
): TimeConversion {
  // حساب الفرق بالساعات
  const timeDifference = targetTimezone.offset - sourceTimezone.offset;
  
  // تحويل الوقت
  const targetTime = new Date(time.getTime() + (timeDifference * 60 * 60 * 1000));
  
  // حساب فرق الأيام
  const dayDifference = targetTime.getDate() - time.getDate();
  
  return {
    sourceTime: time,
    targetTime,
    sourceTimezone,
    targetTimezone,
    timeDifference,
    dayDifference
  };
}

// الحصول على الوقت الحالي في منطقة زمنية محددة
export function getCurrentTimeInTimezone(timezone: Timezone): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (timezone.offset * 3600000));
}

// تنسيق الوقت للعرض
export function formatTimeDisplay(date: Date): TimeDisplay {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const dayOfWeek = date.getDay();
  
  // التنسيق الإنجليزي
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const dateStr = `${day}/${month + 1}/${year}`;
  const dayName = arabicDays[dayOfWeek];
  
  // التنسيق العربي
  const arabicTime = `${toArabicNumerals(hours)}:${toArabicNumerals(minutes)}`;
  const arabicDate = `${toArabicNumerals(day)} ${arabicMonths[month]} ${toArabicNumerals(year)}`;
  
  return {
    time,
    date: dateStr,
    dayName,
    arabicTime,
    arabicDate
  };
}

// الحصول على جميع المناطق الزمنية
export function getAllTimezones(): Timezone[] {
  return timezones;
}

// الحصول على المناطق الزمنية العربية
export function getArabTimezones(): Timezone[] {
  return timezones.filter(tz => tz.region === 'arab');
}

// الحصول على المناطق الزمنية العالمية
export function getWorldTimezones(): Timezone[] {
  return timezones.filter(tz => tz.region === 'world');
}

// البحث عن منطقة زمنية بالمعرف
export function getTimezoneById(id: string): Timezone | null {
  return timezones.find(tz => tz.id === id) || null;
}

// البحث عن منطقة زمنية بالاسم
export function getTimezoneByName(name: string): Timezone | null {
  return timezones.find(tz => 
    tz.name === name || 
    tz.nameEnglish === name ||
    tz.city === name
  ) || null;
}

// التحقق من صحة الوقت المدخل
export function validateTime(hours: number, minutes: number): { isValid: boolean; error?: string } {
  if (hours < 0 || hours > 23) {
    return { isValid: false, error: "الساعة يجب أن تكون بين ٠ و ٢٣" };
  }
  
  if (minutes < 0 || minutes > 59) {
    return { isValid: false, error: "الدقائق يجب أن تكون بين ٠ و ٥٩" };
  }
  
  return { isValid: true };
}

// التحقق من صحة التاريخ المدخل
export function validateDate(year: number, month: number, day: number): { isValid: boolean; error?: string } {
  if (year < 1900 || year > 2100) {
    return { isValid: false, error: "السنة يجب أن تكون بين ١٩٠٠ و ٢١٠٠" };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: "الشهر يجب أن يكون بين ١ و ١٢" };
  }
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: `اليوم يجب أن يكون بين ١ و ${toArabicNumerals(daysInMonth)}` };
  }
  
  return { isValid: true };
}

// حساب فرق التوقيت بين منطقتين
export function calculateTimeDifference(timezone1: Timezone, timezone2: Timezone): number {
  return timezone2.offset - timezone1.offset;
}

// تحويل الوقت من نص إلى كائن Date
export function parseTimeString(timeStr: string, dateStr?: string): Date | null {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date;
  } catch {
    return null;
  }
}

// الحصول على المناطق الزمنية الشائعة
export function getPopularTimezones(): Timezone[] {
  const popularIds = ['mecca', 'cairo', 'dubai', 'london', 'new_york', 'tokyo'];
  return popularIds.map(id => getTimezoneById(id)).filter(Boolean) as Timezone[];
}

// Additional helper functions

// تحويل متعدد المناطق الزمنية
export function convertToMultipleTimezones(
  sourceTime: Date,
  sourceTimezone: Timezone,
  targetTimezones: Timezone[]
): TimeConversion[] {
  return targetTimezones.map(targetTz => 
    convertTime(sourceTime, sourceTimezone, targetTz)
  );
}

// الحصول على الأوقات العالمية الحالية
export function getWorldClocks(): Array<{ timezone: Timezone; time: Date; display: TimeDisplay }> {
  const popularTimezones = getPopularTimezones();
  
  return popularTimezones.map(timezone => ({
    timezone,
    time: getCurrentTimeInTimezone(timezone),
    display: formatTimeDisplay(getCurrentTimeInTimezone(timezone))
  }));
}

// حساب أفضل وقت للاجتماع بين منطقتين زمنيتين
export function findBestMeetingTime(
  timezone1: Timezone,
  timezone2: Timezone,
  workingHoursStart: number = 9,
  workingHoursEnd: number = 17
): { time1: string; time2: string; isWorkingHours: boolean } | null {
  const timeDiff = calculateTimeDifference(timezone1, timezone2);
  
  // البحث عن أفضل وقت في ساعات العمل
  for (let hour = workingHoursStart; hour <= workingHoursEnd; hour++) {
    const otherHour = hour + timeDiff;
    
    if (otherHour >= workingHoursStart && otherHour <= workingHoursEnd) {
      return {
        time1: `${hour.toString().padStart(2, '0')}:00`,
        time2: `${otherHour.toString().padStart(2, '0')}:00`,
        isWorkingHours: true
      };
    }
  }
  
  // إذا لم يوجد وقت مناسب في ساعات العمل، اقترح وقت وسط
  const middleHour = Math.floor((workingHoursStart + workingHoursEnd) / 2);
  const otherMiddleHour = middleHour + timeDiff;
  
  return {
    time1: `${middleHour.toString().padStart(2, '0')}:00`,
    time2: `${otherMiddleHour.toString().padStart(2, '0')}:00`,
    isWorkingHours: false
  };
}

// تحويل الوقت مع مراعاة التوقيت الصيفي (مبسط)
export function convertTimeWithDST(
  time: Date,
  sourceTimezone: Timezone,
  targetTimezone: Timezone
): TimeConversion {
  // هذه دالة مبسطة - في التطبيق الحقيقي نحتاج مكتبة متخصصة للتوقيت الصيفي
  let sourceOffset = sourceTimezone.offset;
  let targetOffset = targetTimezone.offset;
  
  // تطبيق التوقيت الصيفي للمناطق الأوروبية والأمريكية (مبسط)
  const month = time.getMonth();
  const isDSTPeriod = month >= 2 && month <= 9; // مارس إلى أكتوبر تقريباً
  
  if (isDSTPeriod) {
    if (['london', 'paris', 'berlin'].includes(sourceTimezone.id)) {
      sourceOffset += 1;
    }
    if (['london', 'paris', 'berlin'].includes(targetTimezone.id)) {
      targetOffset += 1;
    }
    if (['new_york', 'los_angeles'].includes(sourceTimezone.id)) {
      sourceOffset += 1;
    }
    if (['new_york', 'los_angeles'].includes(targetTimezone.id)) {
      targetOffset += 1;
    }
  }
  
  const timeDifference = targetOffset - sourceOffset;
  const targetTime = new Date(time.getTime() + (timeDifference * 60 * 60 * 1000));
  const dayDifference = targetTime.getDate() - time.getDate();
  
  return {
    sourceTime: time,
    targetTime,
    sourceTimezone: { ...sourceTimezone, offset: sourceOffset },
    targetTimezone: { ...targetTimezone, offset: targetOffset },
    timeDifference,
    dayDifference
  };
}