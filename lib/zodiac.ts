export function getZodiacSign(month: number, day: number): string {
  const zodiacSigns = [
    { name: "الجدي", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: "الدلو", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: "الحوت", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: "الحمل", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: "الثور", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: "الجوزاء", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { name: "السرطان", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { name: "الأسد", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: "العذراء", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: "الميزان", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: "العقرب", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: "القوس", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ];

  for (const sign of zodiacSigns) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign.name;
      }
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign.name;
      }
    }
  }

  return "غير معروف";
}

export function getArabicDayName(date: Date): string {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return days[date.getDay()];
}
