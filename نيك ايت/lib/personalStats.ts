// حسابات إحصائية شخصية مذهلة
import { formatNumber } from "./ageCalculations";

export interface PersonalJourneyStats {
  heartbeats: string;
  breaths: string;
  steps: string;
  sleepHours: string;
  sleepYears: string;
  meals: string;
  blinks: string;
}

export interface WorldWhenBornStats {
  worldPopulation: string;
  egyptPopulation: string;
  lifeExpectancy: string;
  internetUsers: string;
  mobilePhones: string;
  earthRotations: string;
  moonCycles: string;
}

// حساب رحلتك عبر الزمن
export function calculatePersonalJourney(birthDate: Date): PersonalJourneyStats {
  const now = new Date();
  const ageInSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  const ageInMinutes = ageInSeconds / 60;
  const ageInHours = ageInMinutes / 60;
  const ageInDays = ageInHours / 24;
  const ageInYears = ageInDays / 365.25;
  
  // ضربات القلب (متوسط 70 نبضة في الدقيقة)
  const heartbeats = Math.floor(ageInMinutes * 70);
  
  // الأنفاس (متوسط 16 نفس في الدقيقة)
  const breaths = Math.floor(ageInMinutes * 16);
  
  // الخطوات (متوسط 7500 خطوة يومياً)
  const steps = Math.floor(ageInDays * 7500);
  
  // ساعات النوم (متوسط 8 ساعات يومياً)
  const sleepHours = Math.floor(ageInDays * 8);
  const sleepYears = (sleepHours / 24 / 365.25).toFixed(1);
  
  // الوجبات (3 وجبات يومياً)
  const meals = Math.floor(ageInDays * 3);
  
  // رمش العين (متوسط 15-20 رمشة في الدقيقة)
  const blinks = Math.floor(ageInMinutes * 17);
  
  return {
    heartbeats: formatNumber(heartbeats),
    breaths: formatNumber(breaths),
    steps: formatNumber(steps),
    sleepHours: formatNumber(sleepHours),
    sleepYears,
    meals: formatNumber(meals),
    blinks: formatNumber(blinks)
  };
}

// إحصائيات العالم عند الولادة
export function getWorldWhenBorn(birthYear: number): WorldWhenBornStats {
  // بيانات تقديرية من الأمم المتحدة ومصادر موثوقة
  const populationData: Record<number, { world: number; egypt: number; lifeExp: number }> = {
    1950: { world: 2.5, egypt: 21, lifeExp: 42 },
    1960: { world: 3.0, egypt: 27, lifeExp: 47 },
    1970: { world: 3.7, egypt: 35, lifeExp: 51 },
    1980: { world: 4.4, egypt: 43, lifeExp: 56 },
    1990: { world: 5.3, egypt: 57, lifeExp: 63 },
    1995: { world: 5.7, egypt: 62, lifeExp: 66 },
    2000: { world: 6.1, egypt: 68, lifeExp: 69 },
    2005: { world: 6.5, egypt: 74, lifeExp: 71 },
    2010: { world: 6.9, egypt: 81, lifeExp: 71 },
    2015: { world: 7.3, egypt: 91, lifeExp: 71 },
    2020: { world: 7.8, egypt: 102, lifeExp: 72 },
    2024: { world: 8.1, egypt: 106, lifeExp: 72 }
  };
  
  // إيجاد أقرب سنة متاحة
  const availableYears = Object.keys(populationData).map(Number).sort((a, b) => a - b);
  let closestYear = availableYears[0];
  let minDiff = Math.abs(birthYear - closestYear);
  
  for (const year of availableYears) {
    const diff = Math.abs(birthYear - year);
    if (diff < minDiff) {
      minDiff = diff;
      closestYear = year;
    }
  }
  
  const data = populationData[closestYear];
  
  // حساب الدورات الفلكية
  const currentYear = new Date().getFullYear();
  const ageInYears = currentYear - birthYear;
  const earthRotations = Math.floor(ageInYears * 365.25);
  const moonCycles = Math.floor(ageInYears * 12.37); // القمر يدور 12.37 مرة في السنة
  
  // معلومات عن الإنترنت والتكنولوجيا
  let internetUsers = "لم يكن الإنترنت موجوداً";
  let mobilePhones = "لم تكن الهواتف المحمولة منتشرة";
  
  if (birthYear >= 2020) {
    internetUsers = "أكثر من 4.5 مليار مستخدم";
    mobilePhones = "أكثر من 5 مليار مستخدم";
  } else if (birthYear >= 2015) {
    internetUsers = "حوالي 3 مليار مستخدم";
    mobilePhones = "أكثر من 7 مليار جهاز";
  } else if (birthYear >= 2010) {
    internetUsers = "حوالي 2 مليار مستخدم";
    mobilePhones = "حوالي 5 مليار جهاز";
  } else if (birthYear >= 2000) {
    internetUsers = "حوالي 400 مليون مستخدم";
    mobilePhones = "حوالي 700 مليون جهاز";
  } else if (birthYear >= 1995) {
    internetUsers = "أقل من 50 مليون مستخدم";
    mobilePhones = "قليلة جداً - في البداية";
  }
  
  return {
    worldPopulation: `${data.world.toFixed(1)} مليار نسمة`,
    egyptPopulation: `${data.egypt} مليون نسمة`,
    lifeExpectancy: `${data.lifeExp} سنة`,
    internetUsers,
    mobilePhones,
    earthRotations: formatNumber(earthRotations),
    moonCycles: formatNumber(moonCycles)
  };
}

// Milestones شخصية مميزة
export interface PersonalMilestone {
  title: string;
  date: string;
  achieved: boolean;
}

export function calculateMilestones(birthDate: Date): PersonalMilestone[] {
  const milestones: PersonalMilestone[] = [];
  const now = new Date();
  
  // 1000 يوم
  const day1000 = new Date(birthDate.getTime() + 1000 * 24 * 60 * 60 * 1000);
  milestones.push({
    title: "1000 يوم من عمرك",
    date: day1000.toLocaleDateString('ar-EG'),
    achieved: now > day1000
  });
  
  // 10000 يوم
  const day10000 = new Date(birthDate.getTime() + 10000 * 24 * 60 * 60 * 1000);
  milestones.push({
    title: "10,000 يوم من عمرك",
    date: day10000.toLocaleDateString('ar-EG'),
    achieved: now > day10000
  });
  
  // 1 مليون دقيقة
  const min1M = new Date(birthDate.getTime() + 1000000 * 60 * 1000);
  milestones.push({
    title: "مليون دقيقة من عمرك",
    date: min1M.toLocaleDateString('ar-EG'),
    achieved: now > min1M
  });
  
  // 1 مليار ثانية
  const sec1B = new Date(birthDate.getTime() + 1000000000 * 1000);
  milestones.push({
    title: "مليار ثانية من عمرك 🎉",
    date: sec1B.toLocaleDateString('ar-EG'),
    achieved: now > sec1B
  });
  
  // 500 شهر
  const month500Date = new Date(birthDate);
  month500Date.setMonth(month500Date.getMonth() + 500);
  milestones.push({
    title: "500 شهر من عمرك",
    date: month500Date.toLocaleDateString('ar-EG'),
    achieved: now > month500Date
  });
  
  return milestones;
}
