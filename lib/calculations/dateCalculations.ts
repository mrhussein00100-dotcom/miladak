/**
 * مكتبة حسابات التواريخ الدقيقة
 * تحسب الفروق بين التواريخ بوحدات مختلفة
 */

export interface DateDifferenceData {
  startDate: Date;
  endDate: Date;
  difference: {
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    totalYears: number;
    workdays: number;
    weekends: number;
    // الفرق المفصل
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  percentage: {
    ofYear: number;
    ofDecade: number;
    ofCentury: number;
  };
  additionalInfo: {
    isLeapYear: boolean;
    seasonStart: string;
    seasonEnd: string;
    dayOfWeekStart: string;
    dayOfWeekEnd: string;
  };
}

export class DateCalculator {
  private static readonly DAYS_IN_YEAR = 365.25;
  private static readonly DAYS_IN_DECADE = 365.25 * 10;
  private static readonly DAYS_IN_CENTURY = 365.25 * 100;

  /**
   * حساب الفرق بين تاريخين بدقة
   */
  static calculateDateDifference(startDate: Date, endDate: Date): DateDifferenceData {
    // التأكد من أن التاريخ الأول أقدم من الثاني
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      throw new Error('التاريخ الأول يجب أن يكون أقدم من التاريخ الثاني');
    }

    // حساب الفرق بالميلي ثانية
    const diffMs = end.getTime() - start.getTime();
    
    // الحسابات الأساسية
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    
    // حساب الفرق المفصل
    const detailedDiff = this.calculateDetailedDifference(start, end);
    
    // حساب الشهور والسنوات الإجمالية
    const totalMonths = this.calculateTotalMonths(start, end);
    const totalYears = Math.floor(totalMonths / 12);
    
    // حساب أيام العمل والعطل
    const workdaysInfo = this.calculateWorkdays(start, end);
    
    // حساب النسب المئوية
    const percentage = this.calculatePercentages(totalDays);
    
    // معلومات إضافية
    const additionalInfo = this.getAdditionalInfo(start, end);

    return {
      startDate: start,
      endDate: end,
      difference: {
        totalDays,
        totalWeeks,
        totalMonths,
        totalYears,
        workdays: workdaysInfo.workdays,
        weekends: workdaysInfo.weekends,
        ...detailedDiff
      },
      percentage,
      additionalInfo
    };
  }

  /**
   * حساب الفرق المفصل (سنوات، شهور، أيام، ساعات، دقائق، ثواني)
   */
  private static calculateDetailedDifference(start: Date, end: Date) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    let hours = end.getHours() - start.getHours();
    let minutes = end.getMinutes() - start.getMinutes();
    let seconds = end.getSeconds() - start.getSeconds();

    // تعديل الثواني
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }

    // تعديل الدقائق
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }

    // تعديل الساعات
    if (hours < 0) {
      hours += 24;
      days--;
    }

    // تعديل الأيام
    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    // تعديل الشهور
    if (months < 0) {
      months += 12;
      years--;
    }

    return { years, months, days, hours, minutes, seconds };
  }

  /**
   * حساب إجمالي الشهور بدقة
   */
  private static calculateTotalMonths(start: Date, end: Date): number {
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    
    if (end.getDate() < start.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  }

  /**
   * حساب أيام العمل والعطل
   */
  private static calculateWorkdays(start: Date, end: Date) {
    let workdays = 0;
    let weekends = 0;
    
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      
      // في السعودية: الجمعة (5) والسبت (6) عطلة
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        weekends++;
      } else {
        workdays++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return { workdays, weekends };
  }

  /**
   * حساب النسب المئوية
   */
  private static calculatePercentages(totalDays: number) {
    return {
      ofYear: Math.round((totalDays / this.DAYS_IN_YEAR) * 100 * 100) / 100,
      ofDecade: Math.round((totalDays / this.DAYS_IN_DECADE) * 100 * 100) / 100,
      ofCentury: Math.round((totalDays / this.DAYS_IN_CENTURY) * 100 * 100) / 100
    };
  }

  /**
   * الحصول على معلومات إضافية
   */
  private static getAdditionalInfo(start: Date, end: Date) {
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    return {
      isLeapYear: this.isLeapYear(end.getFullYear()),
      seasonStart: this.getSeason(start),
      seasonEnd: this.getSeason(end),
      dayOfWeekStart: dayNames[start.getDay()],
      dayOfWeekEnd: dayNames[end.getDay()]
    };
  }

  /**
   * التحقق من السنة الكبيسة
   */
  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
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
   * تنسيق الأرقام الكبيرة
   */
  static formatLargeNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return '٠';
    }
    return this.toArabicNumerals(num);
  }

  /**
   * حساب الأيام المتبقية في السنة
   */
  static getDaysRemainingInYear(date: Date): number {
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    const diffMs = endOfYear.getTime() - date.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * حساب رقم الأسبوع في السنة
   */
  static getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffMs = date.getTime() - startOfYear.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);
  }
}