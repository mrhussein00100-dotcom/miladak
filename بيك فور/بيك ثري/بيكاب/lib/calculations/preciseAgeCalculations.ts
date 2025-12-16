/**
 * مكتبة حسابات العمر الدقيقة
 * تحسب العمر بالثواني والدقائق والساعات مع إحصائيات مثيرة
 */

export interface PreciseAgeData {
  birthDate: Date;
  currentAge: {
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    totalYears: number;
    // العمر المفصل
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  statistics: {
    heartbeats: number;
    breaths: number;
    blinks: number;
    steps: number;
    sleepHours: number;
    mealsEaten: number;
  };
  nextBirthday: {
    date: Date;
    daysRemaining: number;
    hoursRemaining: number;
    minutesRemaining: number;
    secondsRemaining: number;
  };
  lifeProgress: {
    percentage: number; // نسبة من متوسط العمر المتوقع (75 سنة)
    daysLived: number;
    weeksLived: number;
    monthsLived: number;
  };
}

export class PreciseAgeCalculator {
  private static readonly AVERAGE_LIFE_EXPECTANCY = 75; // سنة
  private static readonly HEART_RATE_PER_MINUTE = 70; // نبضة في الدقيقة
  private static readonly BREATHS_PER_MINUTE = 16; // نفس في الدقيقة
  private static readonly BLINKS_PER_MINUTE = 17; // رمشة في الدقيقة
  private static readonly STEPS_PER_DAY = 7500; // خطوة في اليوم
  private static readonly SLEEP_HOURS_PER_DAY = 8; // ساعات نوم في اليوم
  private static readonly MEALS_PER_DAY = 3; // وجبات في اليوم

  /**
   * حساب العمر الدقيق بجميع الوحدات
   */
  static calculatePreciseAge(birthDate: Date): PreciseAgeData {
    const now = new Date();
    const birth = new Date(birthDate);
    
    // التأكد من صحة التاريخ
    if (birth > now) {
      throw new Error('تاريخ الميلاد لا يمكن أن يكون في المستقبل');
    }
    
    if (birth < new Date('1900-01-01')) {
      throw new Error('تاريخ الميلاد قديم جداً');
    }

    // حساب الفرق بالميلي ثانية
    const diffMs = now.getTime() - birth.getTime();
    
    // الحسابات الأساسية
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    
    // حساب العمر المفصل (سنوات، شهور، أيام دقيقة)
    const detailedAge = this.calculateDetailedAge(birth, now);
    
    // حساب الشهور والسنوات الإجمالية
    const totalMonths = this.calculateTotalMonths(birth, now);
    const totalYears = Math.floor(totalMonths / 12);

    // حساب الإحصائيات المثيرة
    const statistics = this.calculateLifeStatistics(totalMinutes, totalDays);
    
    // حساب عيد الميلاد القادم
    const nextBirthday = this.calculateNextBirthday(birth, now);
    
    // حساب تقدم الحياة
    const lifeProgress = this.calculateLifeProgress(totalDays, totalWeeks, totalMonths);

    return {
      birthDate: birth,
      currentAge: {
        totalSeconds,
        totalMinutes,
        totalHours,
        totalDays,
        totalWeeks,
        totalMonths,
        totalYears,
        ...detailedAge
      },
      statistics,
      nextBirthday,
      lifeProgress
    };
  }

  /**
   * حساب العمر المفصل بدقة (سنوات، شهور، أيام، ساعات، دقائق، ثواني)
   */
  private static calculateDetailedAge(birth: Date, now: Date) {
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    let hours = now.getHours() - birth.getHours();
    let minutes = now.getMinutes() - birth.getMinutes();
    let seconds = now.getSeconds() - birth.getSeconds();

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
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
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
  private static calculateTotalMonths(birth: Date, now: Date): number {
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += now.getMonth();
    
    if (now.getDate() < birth.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  }

  /**
   * حساب الإحصائيات المثيرة للحياة
   */
  private static calculateLifeStatistics(totalMinutes: number, totalDays: number) {
    return {
      heartbeats: Math.floor(totalMinutes * this.HEART_RATE_PER_MINUTE),
      breaths: Math.floor(totalMinutes * this.BREATHS_PER_MINUTE),
      blinks: Math.floor(totalMinutes * this.BLINKS_PER_MINUTE),
      steps: Math.floor(totalDays * this.STEPS_PER_DAY),
      sleepHours: Math.floor(totalDays * this.SLEEP_HOURS_PER_DAY),
      mealsEaten: Math.floor(totalDays * this.MEALS_PER_DAY)
    };
  }

  /**
   * حساب عيد الميلاد القادم
   */
  private static calculateNextBirthday(birth: Date, now: Date) {
    const currentYear = now.getFullYear();
    let nextBirthdayYear = currentYear;
    
    // إنشاء تاريخ عيد الميلاد لهذا العام
    const birthdayThisYear = new Date(currentYear, birth.getMonth(), birth.getDate());
    
    // إذا مر عيد الميلاد لهذا العام، احسب للعام القادم
    if (birthdayThisYear <= now) {
      nextBirthdayYear = currentYear + 1;
    }
    
    const nextBirthdayDate = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
    const diffMs = nextBirthdayDate.getTime() - now.getTime();
    
    const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {
      date: nextBirthdayDate,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      secondsRemaining
    };
  }

  /**
   * حساب تقدم الحياة بناءً على متوسط العمر المتوقع
   */
  private static calculateLifeProgress(totalDays: number, totalWeeks: number, totalMonths: number) {
    const expectedLifeDays = this.AVERAGE_LIFE_EXPECTANCY * 365.25;
    const percentage = Math.min(100, Math.max(0, (totalDays / expectedLifeDays) * 100));

    return {
      percentage: Math.round(percentage * 100) / 100, // تقريب لرقمين عشريين
      daysLived: totalDays,
      weeksLived: totalWeeks,
      monthsLived: totalMonths
    };
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
   * تنسيق الأرقام الكبيرة مع فواصل
   */
  static formatLargeNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return '0';
    }
    return new Intl.NumberFormat('en-US').format(num);
  }

  /**
   * تنسيق الأرقام الكبيرة بالأرقام العربية مع فواصل
   */
  static formatLargeNumberArabic(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return '٠';
    }
    return this.toArabicNumerals(num);
  }
}

/**
 * دالة مساعدة لحساب العمر بالثواني (للاستخدام السريع)
 */
export function calculateAgeInSeconds(birthDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - birthDate.getTime();
  return Math.floor(diffMs / 1000);
}

/**
 * دالة مساعدة لحساب العمر بالدقائق (للاستخدام السريع)
 */
export function calculateAgeInMinutes(birthDate: Date): number {
  return Math.floor(calculateAgeInSeconds(birthDate) / 60);
}

/**
 * دالة مساعدة لحساب العمر بالساعات (للاستخدام السريع)
 */
export function calculateAgeInHours(birthDate: Date): number {
  return Math.floor(calculateAgeInMinutes(birthDate) / 60);
}