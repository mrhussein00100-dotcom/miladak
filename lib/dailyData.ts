import { DailyEvent, DailyBirthday } from './yearsData';

// أحداث تاريخية حسب اليوم والشهر (بدون تحديد السنة = حدث متكرر)
export const dailyEvents: DailyEvent[] = [
  // يناير
  { day: 1, month: 1, title: "رأس السنة الميلادية", description: "بداية السنة الجديدة", category: "ثقافي" },
  { day: 4, month: 1, year: 2010, title: "برج خليفة", description: "افتتاح أطول برج في العالم", category: "عمراني" },
  { day: 12, month: 1, year: 2010, title: "زلزال هاييتي", description: "زلزال مدمر بقوة 7.0", category: "طبيعي" },
  { day: 20, month: 1, year: 2009, title: "باراك أوباما", description: "أول رئيس أمريكي أسود", category: "سياسي" },
  
  // فبراير
  { day: 6, month: 2, year: 1952, title: "جلوس إليزابيث الثانية", description: "تولي الملكة إليزابيث العرش", category: "سياسي" },
  { day: 11, month: 2, year: 1990, title: "نيلسون مانديلا", description: "إطلاق سراح مانديلا من السجن", category: "سياسي" },
  { day: 14, month: 2, title: "عيد الحب", description: "يوم الحب العالمي", category: "ثقافي" },
  
  // مارس
  { day: 8, month: 3, title: "يوم المرأة العالمي", description: "الاحتفال بالمرأة", category: "ثقافي" },
  { day: 11, month: 3, year: 2011, title: "زلزال اليابان", description: "زلزال وتسونامي مدمر", category: "طبيعي" },
  { day: 21, month: 3, title: "يوم الأم", description: "عيد الأم في العالم العربي", category: "ثقافي" },
  
  // أبريل
  { day: 1, month: 4, title: "كذبة أبريل", description: "يوم الكذب العالمي", category: "ثقافي" },
  { day: 15, month: 4, year: 1912, title: "غرق تيتانيك", description: "غرق السفينة الشهيرة", category: "تاريخي" },
  { day: 22, month: 4, title: "يوم الأرض", description: "اليوم العالمي للأرض", category: "بيئي" },
  
  // مايو
  { day: 1, month: 5, title: "عيد العمال", description: "اليوم العالمي للعمال", category: "اجتماعي" },
  { day: 8, month: 5, year: 1945, title: "نهاية الحرب العالمية الثانية", description: "انتهاء الحرب في أوروبا", category: "تاريخي" },
  
  // يونيو
  { day: 5, month: 6, title: "يوم البيئة العالمي", description: "الاحتفال بحماية البيئة", category: "بيئي" },
  { day: 21, month: 6, title: "أطول يوم في السنة", description: "الانقلاب الصيفي", category: "فلكي" },
  
  // يوليو
  { day: 4, month: 7, year: 1776, title: "استقلال أمريكا", description: "إعلان استقلال الولايات المتحدة", category: "تاريخي" },
  { day: 20, month: 7, year: 1969, title: "الهبوط على القمر", description: "أول هبوط بشري على القمر", category: "علمي" },
  { day: 23, month: 7, year: 1952, title: "ثورة 23 يوليو", description: "الثورة المصرية", category: "تاريخي" },
  
  // أغسطس
  { day: 2, month: 8, year: 1990, title: "غزو الكويت", description: "اجتياح العراق للكويت", category: "سياسي" },
  { day: 6, month: 8, year: 1945, title: "هيروشيما", description: "القنبلة الذرية على هيروشيما", category: "تاريخي" },
  { day: 15, month: 8, year: 1947, title: "استقلال الهند", description: "نهاية الاستعمار البريطاني", category: "تاريخي" },
  
  // سبتمبر
  { day: 11, month: 9, year: 2001, title: "هجمات 11 سبتمبر", description: "الهجمات الإرهابية على أمريكا", category: "تاريخي" },
  { day: 23, month: 9, year: 1932, title: "توحيد السعودية", description: "إعلان المملكة العربية السعودية", category: "تاريخي" },
  
  // أكتوبر
  { day: 6, month: 10, year: 1973, title: "حرب أكتوبر", description: "حرب أكتوبر المجيدة", category: "تاريخي" },
  { day: 24, month: 10, year: 1945, title: "الأمم المتحدة", description: "تأسيس الأمم المتحدة", category: "سياسي" },
  { day: 31, month: 10, title: "الهالوين", description: "عيد الرعب", category: "ثقافي" },
  
  // نوفمبر
  { day: 9, month: 11, year: 1989, title: "سقوط جدار برلين", description: "انهيار الجدار", category: "تاريخي" },
  { day: 22, month: 11, year: 1963, title: "اغتيال كينيدي", description: "اغتيال الرئيس الأمريكي", category: "تاريخي" },
  
  // ديسمبر
  { day: 10, month: 12, title: "يوم حقوق الإنسان", description: "اليوم العالمي لحقوق الإنسان", category: "حقوقي" },
  { day: 25, month: 12, title: "عيد الميلاد", description: "الكريسماس", category: "ديني" },
  { day: 31, month: 12, title: "ليلة رأس السنة", description: "آخر يوم في السنة", category: "ثقافي" },
];

// مشاهير حسب تاريخ الميلاد
export const dailyBirthdays: DailyBirthday[] = [
  // يناير
  { day: 1, month: 1, name: "جي إدغار هوفر", profession: "مدير FBI", birthYear: 1895 },
  { day: 8, month: 1, name: "إلفيس بريسلي", profession: "مغني", birthYear: 1935 },
  { day: 17, month: 1, name: "محمد علي كلاي", profession: "ملاكم", birthYear: 1942 },
  { day: 25, month: 1, name: "فرجينيا وولف", profession: "كاتبة", birthYear: 1882 },
  
  // فبراير
  { day: 5, month: 2, name: "كريستيانو رونالدو", profession: "لاعب كرة قدم", birthYear: 1985 },
  { day: 6, month: 2, name: "بوب مارلي", profession: "مغني", birthYear: 1945 },
  { day: 11, month: 2, name: "توماس إديسون", profession: "مخترع", birthYear: 1847 },
  { day: 18, month: 2, name: "جون ترافولتا", profession: "ممثل", birthYear: 1954 },
  { day: 19, month: 2, name: "ميلي بوبي براون", profession: "ممثلة", birthYear: 2004 },
  { day: 24, month: 2, name: "ستيف جوبز", profession: "مؤسس أبل", birthYear: 1955 },
  
  // مارس
  { day: 14, month: 3, name: "ألبرت أينشتاين", profession: "عالم فيزياء", birthYear: 1879 },
  { day: 27, month: 3, name: "ماريا كاري", profession: "مغنية", birthYear: 1969 },
  
  // أبريل
  { day: 4, month: 4, name: "روبرت داوني جونيور", profession: "ممثل", birthYear: 1965 },
  { day: 9, month: 4, name: "كريستين ستيوارت", profession: "ممثلة", birthYear: 1990 },
  { day: 15, month: 4, name: "إيما واتسون", profession: "ممثلة", birthYear: 1990 },
  { day: 23, month: 4, name: "ويليام شكسبير", profession: "كاتب مسرحي", birthYear: 1564 },
  
  // مايو
  { day: 5, month: 5, name: "كارل ماركس", profession: "فيلسوف", birthYear: 1818 },
  { day: 21, month: 5, name: "بيغي ناين", profession: "رابر", birthYear: 1997 },
  
  // يونيو
  { day: 4, month: 6, name: "أنجلينا جولي", profession: "ممثلة", birthYear: 1975 },
  { day: 14, month: 6, name: "دونالد ترامب", profession: "رئيس أمريكي", birthYear: 1946 },
  { day: 26, month: 6, name: "ليونيل ميسي", profession: "لاعب كرة قدم", birthYear: 1987 },
  
  // يوليو
  { day: 8, month: 7, name: "جايدن سميث", profession: "ممثل", birthYear: 2000 },
  { day: 18, month: 7, name: "نيلسون مانديلا", profession: "ناشط حقوقي", birthYear: 1918 },
  { day: 21, month: 7, name: "روبن ويليامز", profession: "ممثل", birthYear: 1951 },
  
  // أغسطس
  { day: 4, month: 8, name: "باراك أوباما", profession: "رئيس أمريكي", birthYear: 1961 },
  { day: 15, month: 8, name: "جينيفر لورانس", profession: "ممثلة", birthYear: 1990 },
  { day: 26, month: 8, name: "ماكولاي كولكين", profession: "ممثل", birthYear: 1980 },
  { day: 29, month: 8, name: "مايكل جاكسون", profession: "مغني", birthYear: 1958 },
  
  // سبتمبر
  { day: 15, month: 9, name: "الأمير هاري", profession: "أمير بريطاني", birthYear: 1984 },
  { day: 21, month: 9, name: "بيل موراي", profession: "ممثل", birthYear: 1950 },
  
  // أكتوبر
  { day: 5, month: 10, name: "كيت وينسلت", profession: "ممثلة", birthYear: 1975 },
  { day: 28, month: 10, name: "بيل غيتس", profession: "مؤسس مايكروسوفت", birthYear: 1955 },
  { day: 30, month: 10, name: "دييغو مارادونا", profession: "لاعب كرة قدم", birthYear: 1960 },
  { day: 31, month: 10, name: "ويلو سميث", profession: "مغنية", birthYear: 2000 },
  
  // نوفمبر
  { day: 3, month: 11, name: "كيندال جينر", profession: "عارضة أزياء", birthYear: 1995 },
  { day: 11, month: 11, name: "ليوناردو دي كابريو", profession: "ممثل", birthYear: 1974 },
  
  // ديسمبر
  { day: 5, month: 12, name: "والت ديزني", profession: "منتج ومخرج", birthYear: 1901 },
  { day: 18, month: 12, name: "كريستينا أغيليرا", profession: "مغنية", birthYear: 1980 },
  { day: 25, month: 12, name: "إسحاق نيوتن", profession: "عالم فيزياء", birthYear: 1642 },
];

// دالة للحصول على أحداث يوم معين
export function getEventsForDay(day: number, month: number): DailyEvent[] {
  return dailyEvents.filter(event => event.day === day && event.month === month);
}

// دالة للحصول على مشاهير يوم معين
export function getBirthdaysForDay(day: number, month: number): DailyBirthday[] {
  return dailyBirthdays.filter(birthday => birthday.day === day && birthday.month === month);
}

// دالة للحصول على جميع بيانات يوم معين
export function getDailyData(day: number, month: number) {
  return {
    events: getEventsForDay(day, month),
    birthdays: getBirthdaysForDay(day, month),
  };
}
