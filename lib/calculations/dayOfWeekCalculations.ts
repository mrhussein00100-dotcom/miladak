/**
 * مكتبة حسابات يوم الأسبوع
 * تحدد يوم الأسبوع لأي تاريخ مع معلومات إضافية
 */
export interface DayOfWeekData {
  date: Date;
  dayOfWeek: {
    arabic: string;
    english: string;
    number: number; // 0 = الأحد، 1 = الاثنين، إلخ
  };
  additionalInfo: {
    season: string;
    zodiacSign: string;
    moonPhase: string;
    weekNumber: number;
    dayOfYear: number;
    isWeekend: boolean;
    isWorkday: boolean;
  };
  historicalEvents: Array<{
    year: number;
    event: string;
    category: string;
  }>;
  funFacts: string[];
}

export class DayOfWeekCalculations {
  private static readonly DAY_NAMES_ARABIC = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  private static readonly DAY_NAMES_ENGLISH = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  private static readonly ZODIAC_SIGNS = [
    { name: 'الجدي', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    { name: 'الدلو', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    { name: 'الحوت', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    { name: 'الحمل', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    { name: 'الثور', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    { name: 'الجوزاء', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    { name: 'السرطان', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    { name: 'الأسد', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    { name: 'العذراء', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    { name: 'الميزان', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    { name: 'العقرب', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    { name: 'القوس', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
  ];

  /**
   * حساب يوم الأسبوع مع معلومات إضافية
   */
  static calculateDayOfWeek(date: Date): DayOfWeekData {
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      throw new Error('التاريخ المدخل غير صحيح');
    }

    const dayNumber = targetDate.getDay();

    return {
      date: targetDate,
      dayOfWeek: {
        arabic: this.DAY_NAMES_ARABIC[dayNumber],
        english: this.DAY_NAMES_ENGLISH[dayNumber],
        number: dayNumber
      },
      additionalInfo: this.getAdditionalInfo(targetDate),
      historicalEvents: this.getHistoricalEvents(targetDate),
      funFacts: this.getFunFacts(targetDate)
    };
  }

  /**
   * الحصول على معلومات إضافية عن التاريخ
   */
  private static getAdditionalInfo(date: Date) {
    return {
      season: this.getSeason(date),
      zodiacSign: this.getZodiacSign(date),
      moonPhase: this.getMoonPhase(date),
      weekNumber: this.getWeekNumber(date),
      dayOfYear: this.getDayOfYear(date),
      isWeekend: this.isWeekend(date),
      isWorkday: this.isWorkday(date)
    };
  }

  /**
   * تحديد الفصل
   */
  private static getSeason(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 20)) {
      return 'الشتاء';
    } else if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
      return 'الربيع';
    } else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
      return 'الصيف';
    } else {
      return 'الخريف';
    }
  }

  /**
   * تحديد البرج الفلكي
   */
  private static getZodiacSign(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const sign of this.ZODIAC_SIGNS) {
      if (
        (month === sign.start.month && day >= sign.start.day) ||
        (month === sign.end.month && day <= sign.end.day) ||
        (sign.start.month > sign.end.month && 
         (month === sign.start.month || month === sign.end.month))
      ) {
        return sign.name;
      }
    }

    return 'غير محدد';
  }

  /**
   * تحديد طور القمر (تقريبي)
   */
  private static getMoonPhase(date: Date): string {
    // حساب تقريبي لطور القمر بناءً على دورة 29.5 يوم
    const knownNewMoon = new Date('2000-01-06'); // تاريخ محدد لمحاق معروف
    const daysSinceKnownNewMoon = Math.floor((date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24));
    const lunarCycle = 29.53059; // متوسط الدورة القمرية بالأيام
    const phase = (daysSinceKnownNewMoon % lunarCycle) / lunarCycle;

    if (phase < 0.125) return 'محاق';
    if (phase < 0.25) return 'هلال متزايد';
    if (phase < 0.375) return 'تربيع أول';
    if (phase < 0.5) return 'أحدب متزايد';
    if (phase < 0.625) return 'بدر';
    if (phase < 0.75) return 'أحدب متناقص';
    if (phase < 0.875) return 'تربيع أخير';
    return 'هلال متناقص';
  }

  /**
   * حساب رقم الأسبوع في السنة
   */
  private static getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffMs = date.getTime() - startOfYear.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);
  }

  /**
   * حساب رقم اليوم في السنة
   */
  private static getDayOfYear(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffMs = date.getTime() - startOfYear.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * التحقق من كون اليوم عطلة نهاية أسبوع
   */
  private static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 5 || day === 6; // الجمعة والسبت في السعودية
  }

  /**
   * التحقق من كون اليوم يوم عمل
   */
  private static isWorkday(date: Date): boolean {
    return !this.isWeekend(date);
  }

  /**
   * الحصول على أحداث تاريخية (عينة)
   */
  private static getHistoricalEvents(date: Date): Array<{year: number, event: string, category: string}> {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // قاعدة بيانات مبسطة للأحداث التاريخية
    const events: {[key: string]: Array<{year: number, event: string, category: string}>} = {
      '1-1': [
        { year: 1970, event: 'بداية العصر الحديث للحاسوب', category: 'تقنية' },
        { year: 2000, event: 'بداية الألفية الجديدة', category: 'تاريخ' }
      ],
      '9-23': [
        { year: 1932, event: 'توحيد المملكة العربية السعودية', category: 'تاريخ سعودي' }
      ],
      '12-25': [
        { year: 336, event: 'أول احتفال بعيد الميلاد المسيحي', category: 'ديني' }
      ]
    };

    const key = `${month}-${day}`;
    return events[key] || [];
  }

  /**
   * الحصول على حقائق ممتعة عن اليوم
   */
  private static getFunFacts(date: Date): string[] {
    const dayName = this.DAY_NAMES_ARABIC[date.getDay()];
    const facts: string[] = [];

    // حقائق عامة عن أيام الأسبوع
    const dayFacts: {[key: string]: string[]} = {
      'الأحد': [
        'الأحد هو أول أيام الأسبوع في التقويم العربي',
        'يُسمى الأحد بهذا الاسم لأنه اليوم الواحد من الأسبوع'
      ],
      'الاثنين': [
        'الاثنين هو اليوم الثاني من الأسبوع',
        'يُعتبر الاثنين بداية أسبوع العمل في معظم البلدان'
      ],
      'الثلاثاء': [
        'الثلاثاء هو اليوم الثالث من الأسبوع',
        'في الثقافة الشعبية، الثلاثاء يوم مبارك للسفر'
      ],
      'الأربعاء': [
        'الأربعاء هو منتصف أسبوع العمل',
        'يُسمى أحياناً "يوم الحدبة" في الثقافة الغربية'
      ],
      'الخميس': [
        'الخميس هو آخر أيام العمل في الأسبوع السعودي',
        'يُعتبر الخميس يوماً مباركاً في الثقافة الإسلامية'
      ],
      'الجمعة': [
        'الجمعة هو يوم العطلة الأسبوعية في الإسلام',
        'صلاة الجمعة واجبة على المسلمين الذكور'
      ],
      'السبت': [
        'السبت هو ثاني أيام العطلة في السعودية',
        'يُسمى السبت بهذا الاسم من كلمة "سبت" أي الراحة'
      ]
    };

    facts.push(...(dayFacts[dayName] || []));

    // حقائق عن الفصل
    const season = this.getSeason(date);
    facts.push(`هذا التاريخ يقع في فصل ${season}`);

    // حقائق عن رقم اليوم في السنة
    const dayOfYear = this.getDayOfYear(date);
    facts.push(`هذا هو اليوم رقم ${dayOfYear} في السنة`);

    return facts;
  }

  /**
   * تنسيق الأرقام بالأرقام العربية
   */
  static toArabicNumerals(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return '٠';
    }
    return String(num)
      .split('')
      .map(d => /[0-9]/.test(d) ? String.fromCharCode(0x0660 + parseInt(d)) : d)
      .join('');
  }

  /**
   * حساب عدد الأيام بين تاريخين
   */
  static daysBetween(date1: Date, date2: Date): number {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * التحقق من السنة الكبيسة
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
}