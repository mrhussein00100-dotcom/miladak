/**
 * Age Calculation Functions
 */

interface HijriDate {
  years: number;
  months: number;
  days: number;
  date: string;
}

interface NextBirthday {
  date: string;
  daysUntil: number;
  age: number;
}

interface AgeData {
  birthDate: Date;
  years: number;
  months: number;
  days: number;
  weeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  dayOfWeek: string;
  zodiacSign: string;
  chineseZodiac: string;
  hijri: HijriDate;
  nextBirthday: NextBirthday;
}

interface LifeStats {
  heartbeats: number;
  breaths: number;
  sleepDays: number;
  foodKg: number;
  moviesWatched: number;
  stepsWalked: number;
  wordsSpoken: number;
  waterLiters: number;
  blinks: number;
  meals: number;
  dreams: number;
  laughs: number;
}

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const ZODIAC_SIGNS = [
  { name: 'الجدي', start: [1, 1], end: [1, 19] },
  { name: 'الدلو', start: [1, 20], end: [2, 18] },
  { name: 'الحوت', start: [2, 19], end: [3, 20] },
  { name: 'الحمل', start: [3, 21], end: [4, 19] },
  { name: 'الثور', start: [4, 20], end: [5, 20] },
  { name: 'الجوزاء', start: [5, 21], end: [6, 20] },
  { name: 'السرطان', start: [6, 21], end: [7, 22] },
  { name: 'الأسد', start: [7, 23], end: [8, 22] },
  { name: 'العذراء', start: [8, 23], end: [9, 22] },
  { name: 'الميزان', start: [9, 23], end: [10, 22] },
  { name: 'العقرب', start: [10, 23], end: [11, 21] },
  { name: 'القوس', start: [11, 22], end: [12, 21] },
  { name: 'الجدي', start: [12, 22], end: [12, 31] },
];

const CHINESE_ZODIAC = ['الفأر', 'الثور', 'النمر', 'الأرنب', 'التنين', 'الأفعى', 'الحصان', 'الماعز', 'القرد', 'الديك', 'الكلب', 'الخنزير'];

function getZodiacSign(month: number, day: number): string {
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (month === startMonth && day >= startDay) return sign.name;
    if (month === endMonth && day <= endDay) return sign.name;
  }
  return 'الجدي';
}

function getChineseZodiac(year: number): string {
  return CHINESE_ZODIAC[(year - 4) % 12];
}

function gregorianToJulian(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function julianToHijri(jd: number): { year: number; month: number; day: number } {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

function gregorianToHijri(date: Date): HijriDate {
  const jd = gregorianToJulian(date);
  const hijri = julianToHijri(jd);
  const hijriMonths = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
  return { years: hijri.year, months: hijri.month, days: hijri.day, date: hijri.day + ' ' + hijriMonths[hijri.month - 1] + ' ' + hijri.year };
}

function calculateNextBirthday(birthDate: Date, currentDate: Date): NextBirthday {
  const now = new Date(currentDate);
  const thisYearBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  let nextBirthdayDate: Date;
  let nextAge: number;
  if (thisYearBirthday > now) {
    nextBirthdayDate = thisYearBirthday;
    nextAge = now.getFullYear() - birthDate.getFullYear();
  } else {
    nextBirthdayDate = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    nextAge = now.getFullYear() - birthDate.getFullYear() + 1;
  }
  const daysUntil = Math.ceil((nextBirthdayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return { date: nextBirthdayDate.toISOString().split('T')[0], daysUntil, age: nextAge };
}

export function calculateAge(birthDate: Date, currentDate: Date = new Date()): AgeData {
  const birth = new Date(birthDate);
  const now = new Date(currentDate);
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(totalMs / (1000 * 60));
  const totalSeconds = Math.floor(totalMs / 1000);
  const weeks = Math.floor(totalDays / 7);
  return {
    birthDate: birth, years, months, days, weeks, totalDays, totalHours, totalMinutes, totalSeconds,
    dayOfWeek: ARABIC_DAYS[birth.getDay()],
    zodiacSign: getZodiacSign(birth.getMonth() + 1, birth.getDate()),
    chineseZodiac: getChineseZodiac(birth.getFullYear()),
    hijri: gregorianToHijri(birth),
    nextBirthday: calculateNextBirthday(birth, now),
  };
}

export function validateBirthDate(date: Date): { valid: boolean; error?: string } {
  if (isNaN(date.getTime())) return { valid: false, error: 'تاريخ غير صحيح' };
  if (date > new Date()) return { valid: false, error: 'لا يمكن أن يكون تاريخ الميلاد في المستقبل' };
  if (date < new Date(1900, 0, 1)) return { valid: false, error: 'تاريخ الميلاد قديم جدا' };
  return { valid: true };
}

export function calculateLifeStats(totalDays: number): LifeStats {
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  return {
    heartbeats: Math.floor(totalMinutes * 72), breaths: Math.floor(totalMinutes * 16),
    sleepDays: Math.floor(totalDays / 3), foodKg: Math.floor(totalDays * 1.5),
    moviesWatched: Math.floor(totalDays / 14), stepsWalked: Math.floor(totalDays * 5000),
    wordsSpoken: Math.floor(totalDays * 16000), waterLiters: Math.floor(totalDays * 2),
    blinks: Math.floor(totalHours * 900), meals: Math.floor(totalDays * 3),
    dreams: Math.floor(totalDays * 4), laughs: Math.floor(totalDays * 15),
  };
}

export type { AgeData, LifeStats, HijriDate, NextBirthday };
