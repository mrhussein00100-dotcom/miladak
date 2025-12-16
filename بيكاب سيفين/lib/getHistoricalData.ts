import { allGeneratedYears } from './generateAllYears';
import { getDailyData } from './dailyData';
import { YearFact } from './yearsData';

/**
 * دالة مركزية للحصول على البيانات التاريخية
 * تعطي الأولوية للبيانات اليومية، وإذا لم تكن موجودة تعرض بيانات السنة
 */
export function getHistoricalData(params: {
  year: number;
  month?: number;
  day?: number;
}) {
  const { year, month, day } = params;
  
  // الحصول على بيانات السنة
  const yearData = allGeneratedYears.find(y => y.year === year);
  
  // إذا كان لدينا يوم وشهر، نحصل على البيانات اليومية
  let dailyData = null;
  if (month !== undefined && day !== undefined) {
    dailyData = getDailyData(day, month);
  }
  
  return {
    year: yearData,
    daily: dailyData,
    // دمج البيانات: الأولوية للبيانات اليومية
    combinedEvents: [
      ...(dailyData?.events || []),
      ...(yearData?.majorEvents || []),
    ],
    combinedBirthdays: [
      ...(dailyData?.birthdays || []),
      ...(yearData?.famousBirthdays.map(b => ({
        ...b,
        day: 0,
        month: 0,
        birthYear: year,
      })) || []),
    ],
  };
}

/**
 * دالة للحصول على مشاهير اليوم
 * تبحث في نفس اليوم من جميع السنوات
 */
export function getCelebritiesOfTheDay(day: number, month: number) {
  const dailyData = getDailyData(day, month);
  return dailyData.birthdays;
}

/**
 * دالة للحصول على أحداث اليوم
 * تبحث في نفس اليوم من جميع السنوات
 */
export function getEventsOfTheDay(day: number, month: number) {
  const dailyData = getDailyData(day, month);
  return dailyData.events;
}

/**
 * دالة للحصول على بيانات كاملة ليوم محدد
 */
export function getDataForDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const year = date.getFullYear();
  
  return getHistoricalData({ year, month, day });
}

/**
 * دالة للحصول على بيانات اليوم الحالي
 */
export function getTodayData() {
  return getDataForDate(new Date());
}

/**
 * دالة للحصول على جميع السنوات المتاحة
 */
export function getAvailableYears(): number[] {
  return allGeneratedYears.map(y => y.year).sort((a, b) => b - a);
}

/**
 * دالة للبحث عن أحداث بفئة معينة
 */
export function searchEventsByCategory(category: string) {
  return allGeneratedYears
    .flatMap(y => y.majorEvents)
    .filter(e => e.category === category);
}

/**
 * دالة للحصول على ملخص السنة
 */
export function getYearSummary(year: number) {
  const yearData = allGeneratedYears.find(y => y.year === year);
  if (!yearData) return null;
  
  return {
    year: yearData.year,
    population: yearData.worldStats?.population,
    lifeExpectancy: yearData.worldStats?.avgLifeExpectancy,
    eventsCount: yearData.majorEvents.length,
    factsCount: yearData.facts.length,
    topEvents: yearData.majorEvents.slice(0, 3),
    topFacts: yearData.facts.slice(0, 3),
  };
}
