import { YearFact } from './yearsData';

// بيانات تفصيلية لكل عقد
const decadeHighlights: Record<number, { facts: string[]; events: any[] }> = {
  1950: {
    facts: ["الحرب الباردة", "بداية عصر التلفزيون", "سباق التسلح النووي"],
    events: [
      { title: "الحرب الكورية", year: 1950, category: "سياسي" },
      { title: "اكتشاف DNA", year: 1953, category: "علمي" },
      { title: "ديزني لاند", year: 1955, category: "ترفيهي" },
    ]
  },
  1960: {
    facts: ["سباق الفضاء", "حركة الحقوق المدنية", "عصر البيتلز"],
    events: [
      { title: "يوري غاغارين في الفضاء", year: 1961, category: "علمي" },
      { title: "اغتيال كينيدي", year: 1963, category: "سياسي" },
      { title: "الهبوط على القمر", year: 1969, category: "علمي" },
    ]
  },
  1970: {
    facts: ["أزمة النفط", "عصر الديسكو", "بداية الكمبيوتر الشخصي"],
    events: [
      { title: "حرب أكتوبر", year: 1973, category: "سياسي" },
      { title: "تأسيس Microsoft", year: 1975, category: "تقني" },
      { title: "تأسيس Apple", year: 1976, category: "تقني" },
    ]
  },
  1980: {
    facts: ["بداية عصر الكمبيوتر", "الحرب الباردة", "MTV والفيديو كليب"],
    events: [
      { title: "Windows 1.0", year: 1985, category: "تقني" },
      { title: "كارثة تشيرنوبل", year: 1986, category: "كارثي" },
      { title: "سقوط جدار برلين", year: 1989, category: "سياسي" },
    ]
  },
  1990: {
    facts: ["نهاية الحرب الباردة", "بداية الإنترنت", "عصر Windows 95"],
    events: [
      { title: "حرب الخليج", year: 1991, category: "سياسي" },
      { title: "Windows 95", year: 1995, category: "تقني" },
      { title: "ولادة دولي", year: 1996, category: "علمي" },
    ]
  },
  2000: {
    facts: ["ألفية جديدة", "11 سبتمبر", "ثورة التكنولوجيا"],
    events: [
      { title: "11 سبتمبر", year: 2001, category: "سياسي" },
      { title: "Facebook", year: 2004, category: "تقني" },
      { title: "YouTube", year: 2005, category: "تقني" },
      { title: "iPhone", year: 2007, category: "تقني" },
    ]
  },
  2010: {
    facts: ["عصر السوشيال ميديا", "الربيع العربي", "الهواتف الذكية"],
    events: [
      { title: "Instagram", year: 2010, category: "تقني" },
      { title: "الربيع العربي", year: 2011, category: "سياسي" },
      { title: "ISIS", year: 2014, category: "سياسي" },
    ]
  },
  2020: {
    facts: ["جائحة كورونا", "عصر الذكاء الاصطناعي", "العمل عن بعد"],
    events: [
      { title: "كورونا", year: 2020, category: "صحي" },
      { title: "ChatGPT", year: 2022, category: "تقني" },
      { title: "GPT-4", year: 2023, category: "تقني" },
    ]
  },
};

// دالة لحساب عدد السكان بناءً على السنة
function calculatePopulation(year: number): string {
  const populations: Record<number, number> = {
    1950: 2.5, 1960: 3.0, 1970: 3.7, 1980: 4.4, 1990: 5.3,
    2000: 6.1, 2010: 6.9, 2020: 7.8, 2024: 8.2
  };
  
  // إيجاد أقرب سنة
  const years = Object.keys(populations).map(Number).sort((a, b) => a - b);
  let lower = years[0];
  let upper = years[years.length - 1];
  
  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) {
      lower = years[i];
      upper = years[i + 1];
      break;
    }
  }
  
  // استقراء خطي
  const ratio = (year - lower) / (upper - lower);
  const pop = populations[lower] + ratio * (populations[upper] - populations[lower]);
  return `${Math.round(pop * 10) / 10} مليار`;
}

// دالة لحساب متوسط العمر
function calculateLifeExpectancy(year: number): string {
  const base = 47;
  const growth = (year - 1950) / 75 * 26;
  return `${Math.round(base + growth)} سنة`;
}

// توليد جميع السنوات من 1950-2025
export function generateAllYears(): YearFact[] {
  const years: YearFact[] = [];
  
  for (let year = 1950; year <= 2025; year++) {
    const decade = Math.floor(year / 10) * 10;
    const highlights = decadeHighlights[decade] || { facts: [], events: [] };
    
    const population = calculatePopulation(year);
    const lifeExpectancy = calculateLifeExpectancy(year);
    
    years.push({
      year,
      facts: [
        `كان عدد سكان العالم ${population}`,
        `متوسط العمر المتوقع ${lifeExpectancy}`,
        ...highlights.facts.slice(0, 2),
      ],
      worldEvents: [],
      majorEvents: highlights.events
        .filter(e => e.year === year)
        .map(e => ({
          title: e.title,
          description: e.title,
          date: `${year}`,
          category: e.category,
        })),
      popularSongs: [],
      famousBirthdays: [],
      worldStats: {
        population,
        avgLifeExpectancy: lifeExpectancy,
        internetUsers: year >= 1990 ? `${Math.round(Math.pow(2, (year - 1990) / 3))} مليون` : "غير متوفر",
      },
    });
  }
  
  return years;
}

// الحصول على بيانات السنوات المولدة
export const allGeneratedYears = generateAllYears();
