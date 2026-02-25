// أحداث حسب اليوم والشهر
export interface DailyEvent {
  day: number;      // 1-31
  month: number;    // 1-12
  year?: number;    // السنة (اختياري)
  title: string;
  description: string;
  category: string;
}

export interface DailyBirthday {
  day: number;
  month: number;
  year?: number;
  name: string;
  profession: string;
  birthYear?: number;  // سنة الميلاد
}

export interface YearFact {
  year: number;
  facts: string[];
  worldEvents: {
    title: string;
    description: string;
    date?: string;
  }[];
  majorEvents: {
    title: string;
    description: string;
    date: string;
    category: string; // سياسي، رياضي، علمي، اقتصادي، ثقافي
  }[];
  popularSongs: {
    title: string;
    artist: string;
    country?: string;
  }[];
  famousBirthdays: {
    name: string;
    profession: string;
    date?: string;
  }[];
  worldStats?: {
    population?: string;
    avgLifeExpectancy?: string;
    internetUsers?: string;
    oilPrice?: string;
  };
  // أحداث يومية لهذه السنة
  dailyEvents?: DailyEvent[];
  dailyBirthdays?: DailyBirthday[];
}

export const yearsData: YearFact[] = [
  {
    year: 1990,
    facts: [
      "كان عدد سكان العالم 5.3 مليار نسمة",
      "كان سعر الذهب حوالي 383 دولار للأونصة",
      "لم يكن الإنترنت متاحاً للعامة بعد",
      "كان الاتصال يتم عبر الهاتف الأرضي فقط",
    ],
    worldEvents: [
      {
        title: "انهيار جدار برلين",
        description: "سقوط الجدار الذي قسم ألمانيا لعقود",
        date: "9 نوفمبر 1989",
      },
      {
        title: "إطلاق تلسكوب هابل",
        description: "أول تلسكوب فضائي يدور حول الأرض",
        date: "24 أبريل 1990",
      },
      {
        title: "اختراع الويب",
        description: "تيم بيرنرز-لي يخترع الشبكة العنكبوتية",
        date: "1990",
      },
    ],
    majorEvents: [
      {
        title: "غزو العراق للكويت",
        description: "اجتياح القوات العراقية للكويت",
        date: "2 أغسطس 1990",
        category: "سياسي",
      },
      {
        title: "إطلاق Windows 3.0",
        description: "مايكروسوفت تطلق نظام ويندوز 3.0",
        date: "22 مايو 1990",
        category: "تقني",
      },
      {
        title: "كأس العالم في إيطاليا",
        description: "ألمانيا تفوز بكأس العالم",
        date: "8 يوليو 1990",
        category: "رياضي",
      },
    ],
    popularSongs: [
      { title: "Ice Ice Baby", artist: "Vanilla Ice", country: "أمريكا" },
      { title: "Vision of Love", artist: "Mariah Carey", country: "أمريكا" },
      { title: "Hold On", artist: "Wilson Phillips", country: "أمريكا" },
      { title: "Vogue", artist: "Madonna", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "إيما واتسون", profession: "ممثلة", date: "15 أبريل" },
      { name: "جينيفر لورانس", profession: "ممثلة", date: "15 أغسطس" },
      { name: "كريستين ستيوارت", profession: "ممثلة", date: "9 أبريل" },
    ],
    worldStats: {
      population: "5.3 مليار",
      avgLifeExpectancy: "64 سنة",
      internetUsers: "أقل من مليون",
      oilPrice: "23 دولار للبرميل",
    },
  },
  {
    year: 2000,
    facts: [
      "كان عدد سكان العالم 6.1 مليار نسمة",
      "بداية الألفية الجديدة",
      "كان الإنترنت في بداية انتشاره",
      "ظهور الهواتف المحمولة بشكل واسع",
    ],
    worldEvents: [
      {
        title: "أزمة Y2K",
        description: "مخاوف من انهيار أنظمة الكمبيوتر",
        date: "1 يناير 2000",
      },
      {
        title: "سيدني 2000",
        description: "الألعاب الأولمبية في أستراليا",
        date: "سبتمبر 2000",
      },
    ],
    majorEvents: [
      {
        title: "انتخاب جورج بوش",
        description: "فوز جورج دبليو بوش برئاسة أمريكا",
        date: "7 نوفمبر 2000",
        category: "سياسي",
      },
      {
        title: "سوني تطلق PS2",
        description: "إطلاق بلايستيشن 2",
        date: "4 مارس 2000",
        category: "تقني",
      },
    ],
    popularSongs: [
      { title: "Oops!... I Did It Again", artist: "Britney Spears", country: "أمريكا" },
      { title: "Music", artist: "Madonna", country: "أمريكا" },
      { title: "It's Gonna Be Me", artist: "NSYNC", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "ويلو سميث", profession: "مغنية", date: "31 أكتوبر" },
      { name: "جايدن سميث", profession: "ممثل", date: "8 يوليو" },
    ],
    worldStats: {
      population: "6.1 مليار",
      avgLifeExpectancy: "67 سنة",
      internetUsers: "361 مليون",
      oilPrice: "28 دولار للبرميل",
    },
  },
  {
    year: 2010,
    facts: [
      "كان عدد سكان العالم 6.9 مليار نسمة",
      "ظهور Instagram وتطبيقات التواصل الاجتماعي",
      "انتشار الهواتف الذكية بشكل كبير",
      "بداية عصر الآيباد",
    ],
    worldEvents: [
      {
        title: "زلزال هاييتي",
        description: "زلزال مدمر بقوة 7.0 درجة",
        date: "12 يناير 2010",
      },
      {
        title: "كأس العالم في جنوب أفريقيا",
        description: "أول كأس عالم في أفريقيا",
        date: "يونيو 2010",
      },
    ],
    majorEvents: [
      {
        title: "إطلاق iPad",
        description: "أبل تطلق الآيباد",
        date: "3 أبريل 2010",
        category: "تقني",
      },
      {
        title: "إطلاق Instagram",
        description: "تطبيق مشاركة الصور",
        date: "6 أكتوبر 2010",
        category: "تقني",
      },
    ],
    popularSongs: [
      { title: "Tik Tok", artist: "Kesha", country: "أمريكا" },
      { title: "California Gurls", artist: "Katy Perry", country: "أمريكا" },
      { title: "Love The Way You Lie", artist: "Eminem", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "ميلي بوبي براون", profession: "ممثلة", date: "19 فبراير" },
    ],
    worldStats: {
      population: "6.9 مليار",
      avgLifeExpectancy: "70 سنة",
      internetUsers: "1.97 مليار",
      oilPrice: "79 دولار للبرميل",
    },
  },
  {
    year: 1980,
    facts: [
      "كان عدد سكان العالم 4.4 مليار نسمة",
      "بداية عصر الكمبيوتر الشخصي",
      "الحرب الباردة في ذروتها",
      "انتشار التلفزيون الملون",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "أولمبياد موسكو", description: "الألعاب الأولمبية الصيفية", date: "يوليو 1980", category: "رياضي" },
      { title: "حرب إيران والعراق", description: "بداية الحرب", date: "22 سبتمبر 1980", category: "سياسي" },
    ],
    popularSongs: [
      { title: "Another One Bites the Dust", artist: "Queen", country: "بريطانيا" },
      { title: "Call Me", artist: "Blondie", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "كريستينا أغيليرا", profession: "مغنية", date: "18 ديسمبر" },
      { name: "ماكولاي كولكين", profession: "ممثل", date: "26 أغسطس" },
    ],
    worldStats: { population: "4.4 مليار", avgLifeExpectancy: "61 سنة" },
  },
  {
    year: 1985,
    facts: [
      "كان عدد سكان العالم 4.8 مليار نسمة",
      "عصر ألعاب الفيديو الذهبي",
      "انتشار الأجهزة الكهربائية المنزلية",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "Windows 1.0", description: "مايكروسوفت تطلق أول نظام ويندوز", date: "20 نوفمبر 1985", category: "تقني" },
      { title: "Live Aid", description: "حفل خيري عالمي ضخم", date: "13 يوليو 1985", category: "ثقافي" },
    ],
    popularSongs: [
      { title: "Like a Virgin", artist: "Madonna", country: "أمريكا" },
      { title: "We Are the World", artist: "USA for Africa", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "كريستيانو رونالدو", profession: "لاعب كرة قدم", date: "5 فبراير" },
    ],
    worldStats: { population: "4.8 مليار", avgLifeExpectancy: "62 سنة" },
  },
  {
    year: 1995,
    facts: [
      "كان عدد سكان العالم 5.7 مليار نسمة",
      "بداية عصر الإنترنت الجماهيري",
      "ظهور Windows 95",
      "انتشار الهواتف المحمولة",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "إطلاق Windows 95", description: "ثورة في عالم الحاسوب", date: "24 أغسطس 1995", category: "تقني" },
      { title: "DVD", description: "ظهور تقنية DVD", date: "1995", category: "تقني" },
    ],
    popularSongs: [
      { title: "Gangsta's Paradise", artist: "Coolio", country: "أمريكا" },
      { title: "Waterfalls", artist: "TLC", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "كيندال جينر", profession: "عارضة أزياء", date: "3 نوفمبر" },
    ],
    worldStats: { population: "5.7 مليار", avgLifeExpectancy: "65 سنة", internetUsers: "16 مليون" },
  },
  {
    year: 2005,
    facts: [
      "كان عدد سكان العالم 6.5 مليار نسمة",
      "انتشار YouTube",
      "عصر الهواتف الذكية الأولى",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "إطلاق YouTube", description: "بداية عصر الفيديو الرقمي", date: "14 فبراير 2005", category: "تقني" },
      { title: "إعصار كاترينا", description: "إعصار مدمر في أمريكا", date: "أغسطس 2005", category: "طبيعي" },
    ],
    popularSongs: [
      { title: "Hollaback Girl", artist: "Gwen Stefani", country: "أمريكا" },
      { title: "Gold Digger", artist: "Kanye West", country: "أمريكا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "6.5 مليار", avgLifeExpectancy: "68 سنة", internetUsers: "1 مليار" },
  },
  {
    year: 2015,
    facts: [
      "كان عدد سكان العالم 7.3 مليار نسمة",
      "عصر السوشيال ميديا الذهبي",
      "انتشار Uber وتطبيقات التوصيل",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "اتفاقية باريس للمناخ", description: "اتفاق دولي لمكافحة التغير المناخي", date: "12 ديسمبر 2015", category: "سياسي" },
      { title: "Windows 10", description: "مايكروسوفت تطلق ويندوز 10", date: "29 يوليو 2015", category: "تقني" },
    ],
    popularSongs: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", country: "أمريكا" },
      { title: "Hello", artist: "Adele", country: "بريطانيا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "7.3 مليار", avgLifeExpectancy: "72 سنة", internetUsers: "3.2 مليار" },
  },
  {
    year: 2020,
    facts: [
      "كان عدد سكان العالم 7.8 مليار نسمة",
      "جائحة كورونا غيرت العالم",
      "انتشار العمل عن بعد",
      "ازدهار التجارة الإلكترونية",
    ],
    worldEvents: [
      { title: "جائحة كورونا", description: "انتشار فيروس كوفيد-19 عالمياً", date: "مارس 2020" },
    ],
    majorEvents: [
      { title: "تأجيل أولمبياد طوكيو", description: "تأجيل الألعاب الأولمبية بسبب الجائحة", date: "24 مارس 2020", category: "رياضي" },
      { title: "إطلاق PS5", description: "سوني تطلق بلايستيشن 5", date: "12 نوفمبر 2020", category: "تقني" },
    ],
    popularSongs: [
      { title: "Blinding Lights", artist: "The Weeknd", country: "كندا" },
      { title: "Watermelon Sugar", artist: "Harry Styles", country: "بريطانيا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "7.8 مليار", avgLifeExpectancy: "73 سنة", internetUsers: "4.5 مليار" },
  },
  {
    year: 1970,
    facts: [
      "كان عدد سكان العالم 3.7 مليار نسمة",
      "عصر الروك أند رول الذهبي",
      "بداية حركة حماية البيئة",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "أبولو 13", description: "مهمة فضائية فاشلة تقريباً", date: "أبريل 1970", category: "علمي" },
      { title: "كأس العالم في المكسيك", description: "البرازيل تفوز باللقب الثالث", date: "يونيو 1970", category: "رياضي" },
    ],
    popularSongs: [
      { title: "Let It Be", artist: "The Beatles", country: "بريطانيا" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "ماريا كاري", profession: "مغنية", date: "27 مارس" },
    ],
    worldStats: { population: "3.7 مليار", avgLifeExpectancy: "58 سنة" },
  },
  {
    year: 1975,
    facts: [
      "كان عدد سكان العالم 4.1 مليار نسمة",
      "بداية عصر الكمبيوتر المنزلي",
      "انتهاء حرب فيتنام",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "نهاية حرب فيتنام", description: "سقوط سايغون", date: "30 أبريل 1975", category: "سياسي" },
      { title: "Microsoft", description: "تأسيس شركة مايكروسوفت", date: "4 أبريل 1975", category: "تقني" },
    ],
    popularSongs: [
      { title: "Bohemian Rhapsody", artist: "Queen", country: "بريطانيا" },
    ],
    famousBirthdays: [
      { name: "أنجلينا جولي", profession: "ممثلة", date: "4 يونيو" },
    ],
    worldStats: { population: "4.1 مليار", avgLifeExpectancy: "60 سنة" },
  },
  {
    year: 1960,
    facts: [
      "كان عدد سكان العالم 3 مليار نسمة",
      "بداية سباق الفضاء",
      "الحرب الباردة في ذروتها",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "أولمبياد روما", description: "الألعاب الأولمبية الصيفية", date: "أغسطس 1960", category: "رياضي" },
    ],
    popularSongs: [
      { title: "It's Now or Never", artist: "Elvis Presley", country: "أمريكا" },
    ],
    famousBirthdays: [
      { name: "دييغو مارادونا", profession: "لاعب كرة قدم", date: "30 أكتوبر" },
    ],
    worldStats: { population: "3 مليار", avgLifeExpectancy: "52 سنة" },
  },
  {
    year: 1965,
    facts: [
      "كان عدد سكان العالم 3.3 مليار نسمة",
      "بداية حرب فيتنام الأمريكية",
      "عصر الروك الذهبي",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "حرب فيتنام", description: "تصعيد الحرب الأمريكية", date: "1965", category: "سياسي" },
    ],
    popularSongs: [
      { title: "Yesterday", artist: "The Beatles", country: "بريطانيا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "3.3 مليار", avgLifeExpectancy: "55 سنة" },
  },
  {
    year: 2022,
    facts: [
      "كان عدد سكان العالم 8 مليار نسمة",
      "عصر الذكاء الاصطناعي",
      "العملات الرقمية والـ NFT",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "كأس العالم قطر 2022", description: "الأرجنتين تفوز بكأس العالم", date: "18 ديسمبر 2022", category: "رياضي" },
      { title: "ChatGPT", description: "إطلاق ChatGPT من OpenAI", date: "30 نوفمبر 2022", category: "تقني" },
    ],
    popularSongs: [
      { title: "As It Was", artist: "Harry Styles", country: "بريطانيا" },
      { title: "Anti-Hero", artist: "Taylor Swift", country: "أمريكا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "8 مليار", avgLifeExpectancy: "73 سنة", internetUsers: "5.3 مليار" },
  },
  {
    year: 2023,
    facts: [
      "كان عدد سكان العالم 8.1 مليار نسمة",
      "انفجار الذكاء الاصطناعي التوليدي",
      "عصر ChatGPT والـ AI",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "GPT-4", description: "إطلاق GPT-4 من OpenAI", date: "14 مارس 2023", category: "تقني" },
      { title: "Vision Pro", description: "أبل تكشف عن نظارة الواقع المختلط", date: "5 يونيو 2023", category: "تقني" },
    ],
    popularSongs: [
      { title: "Flowers", artist: "Miley Cyrus", country: "أمريكا" },
    ],
    famousBirthdays: [],
    worldStats: { population: "8.1 مليار", avgLifeExpectancy: "73 سنة", internetUsers: "5.4 مليار" },
  },
  {
    year: 2024,
    facts: [
      "كان عدد سكان العالم 8.2 مليار نسمة",
      "عصر الذكاء الاصطناعي المتقدم",
      "انتشار السيارات الكهربائية",
    ],
    worldEvents: [],
    majorEvents: [
      { title: "أولمبياد باريس 2024", description: "الألعاب الأولمبية في فرنسا", date: "يوليو 2024", category: "رياضي" },
    ],
    popularSongs: [],
    famousBirthdays: [],
    worldStats: { population: "8.2 مليار", avgLifeExpectancy: "73 سنة", internetUsers: "5.5 مليار" },
  },
];

// دالة للحصول على بيانات سنة معينة
export function getYearData(year: number): YearFact | undefined {
  return yearsData.find(y => y.year === year);
}

// دالة للحصول على جميع السنوات المتاحة
export function getAvailableYears(): number[] {
  return yearsData.map(y => y.year).sort((a, b) => b - a);
}
