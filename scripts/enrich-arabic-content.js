
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
console.log(`Connecting to database at ${dbPath}...`);
const db = new Database(dbPath);

// Arabic Historical Events
const arabicEvents = [
  // Islamic History
  { day: 10, month: 1, year: 630, title: "فتح مكة", description: "دخول جيش المسلمين مكة المكرمة بقيادة الرسول محمد صلى الله عليه وسلم سلمياً", category: "إسلامي" },
  { day: 12, month: 3, year: 624, title: "غزوة بدر الكبرى", description: "أول معركة فاصلة في الإسلام بين المسلمين وقريش", category: "إسلامي" },
  { day: 19, month: 3, year: 625, title: "غزوة أحد", description: "معركة بين المسلمين وقريش عند جبل أحد", category: "إسلامي" },
  { day: 20, month: 8, year: 636, title: "معركة اليرموك", description: "انتصار المسلمين بقيادة خالد بن الوليد على الروم وإنهاء حكمهم في الشام", category: "إسلامي" },
  { day: 16, month: 11, year: 636, title: "معركة القادسية", description: "انتصار المسلمين بقيادة سعد بن أبي وقاص على الفرس", category: "إسلامي" },
  { day: 2, month: 10, year: 1187, title: "تحرير القدس", description: "صلاح الدين الأيوبي يستعيد القدس بعد معركة حطين", category: "تاريخي" },
  { day: 29, month: 5, year: 1453, title: "فتح القسطنطينية", description: "محمد الفاتح يفتح القسطنطينية وينهي الإمبراطورية البيزنطية", category: "تاريخي" },
  { day: 2, month: 1, year: 1492, title: "سقوط غرناطة", description: "تسليم غرناطة وانتهاء الحكم العربي في الأندلس", category: "تاريخي" },

  // Modern Arab History
  { day: 23, month: 7, year: 1952, title: "ثورة 23 يوليو", description: "تنظيم الضباط الأحرار يطيح بالملكية في مصر", category: "تاريخي" },
  { day: 6, month: 10, year: 1973, title: "نصر أكتوبر", description: "عبور الجيش المصري لخط بارليف وتحرير أجزاء من سيناء", category: "تاريخي" },
  { day: 1, month: 11, year: 1954, title: "اندلاع الثورة الجزائرية", description: "بداية حرب التحرير الجزائرية ضد الاستعمار الفرنسي", category: "تاريخي" },
  { day: 5, month: 7, year: 1962, title: "استقلال الجزائر", description: "إعلان استقلال الجزائر بعد 132 عاماً من الاستعمار", category: "تاريخي" },
  { day: 2, month: 12, year: 1971, title: "قيام دولة الإمارات", description: "اتحاد سبع إمارات وإعلان دولة الإمارات العربية المتحدة", category: "تاريخي" },
  { day: 25, month: 5, year: 1946, title: "استقلال الأردن", description: "إعلان استقلال المملكة الأردنية الهاشمية", category: "تاريخي" },
  { day: 22, month: 11, year: 1943, title: "استقلال لبنان", description: "نهاية الانتداب الفرنسي على لبنان", category: "تاريخي" },
  { day: 17, month: 4, year: 1946, title: "عيد الجلاء السوري", description: "خروج آخر جندي فرنسي من الأراضي السورية", category: "تاريخي" },
  { day: 3, month: 10, year: 1932, title: "استقلال العراق", description: "انضمام العراق لعصبة الأمم كدولة مستقلة", category: "تاريخي" },
  { day: 1, month: 1, year: 1956, title: "استقلال السودان", description: "إعلان استقلال السودان من الحكم الثنائي", category: "تاريخي" },
  { day: 20, month: 3, year: 1956, title: "استقلال تونس", description: "تونس تنال استقلالها عن فرنسا", category: "تاريخي" },
  { day: 18, month: 11, year: 1956, title: "عيد استقلال المغرب", description: "عودة الملك محمد الخامس وإعلان استقلال المغرب", category: "تاريخي" },
  { day: 23, month: 9, year: 1932, title: "اليوم الوطني السعودي", description: "توحيد المملكة العربية السعودية على يد الملك عبد العزيز", category: "تاريخي" },
  { day: 22, month: 5, year: 1990, title: "الوحدة اليمنية", description: "إعلان الوحدة بين شطري اليمن الشمالي والجنوبي", category: "تاريخي" },
  { day: 25, month: 2, year: 1961, title: "استقلال الكويت", description: "إلغاء اتفاقية الحماية البريطانية وإعلان الاستقلال", category: "تاريخي" },
  { day: 16, month: 12, year: 1971, title: "اليوم الوطني البحريني", description: "تولي الشيخ عيسى بن سلمان مقاليد الحكم", category: "تاريخي" },
  { day: 18, month: 12, year: 1878, title: "اليوم الوطني القطري", description: "ذكرى تأسيس دولة قطر على يد الشيخ جاسم بن محمد", category: "تاريخي" },
  { day: 18, month: 11, year: 1970, title: "اليوم الوطني العماني", description: "ذكرى ميلاد السلطان قابوس وبدء النهضة", category: "تاريخي" },

  // Culture & Science
  { day: 18, month: 12, year: 1973, title: "اليوم العالمي للغة العربية", description: "اعتماد اللغة العربية لغة رسمية في الأمم المتحدة", category: "ثقافي" },
  { day: 10, month: 12, year: 1988, title: "جائزة نوبل لنجيب محفوظ", description: "أول أديب عربي يفوز بجائزة نوبل في الأدب", category: "ثقافي" },
  { day: 12, month: 10, year: 1999, title: "جائزة نوبل لأحمد زويل", description: "فوز العالم المصري أحمد زويل بجائزة نوبل في الكيمياء", category: "علمي" },
  { day: 3, month: 11, year: 1957, title: "الكلبة لايكا", description: "أول كائن حي يخرج إلى الفضاء (حدث عالمي)", category: "علمي" },
  { day: 20, month: 7, year: 1969, title: "الهبوط على القمر", description: "أول هبوط بشري على سطح القمر (أبولو 11)", category: "علمي" }
];

// Arab Celebrities
const arabicCelebrities = [
  // Music & Art
  { day: 3, month: 2, birth_year: 1898, name: "أم كلثوم", profession: "سيدة الغناء العربي" },
  { day: 31, month: 3, birth_year: 1891, name: "زكي رستم", profession: "ممثل مصري قدير" },
  { day: 21, month: 6, birth_year: 1929, name: "عبد الحليم حافظ", profession: "العندليب الأسمر" },
  { day: 21, month: 11, birth_year: 1935, name: "فيروز", profession: "جارة القمر" },
  { day: 15, month: 5, birth_year: 1983, name: "نانسي عجرم", profession: "مغنية لبنانية" },
  { day: 10, month: 10, birth_year: 1954, name: "محمد منير", profession: "الكينج" },
  { day: 12, month: 9, birth_year: 1957, name: "كاظم الساهر", profession: "قيصر الغناء العربي" },
  { day: 27, month: 10, birth_year: 1972, name: "إليسا", profession: "ملكة الإحساس" },
  { day: 10, month: 3, birth_year: 1955, name: "يسرا", profession: "أيقونة السينما المصرية" },
  { day: 17, month: 5, birth_year: 1940, name: "عادل إمام", profession: "الزعيم" },
  { day: 21, month: 1, birth_year: 1889, name: "نجيب الريحاني", profession: "رائد المسرح الكوميدي" },
  { day: 13, month: 3, birth_year: 1902, name: "محمد عبد الوهاب", profession: "موسيقار الأجيال" },
  { day: 28, month: 11, birth_year: 1960, name: "عاصي الحلاني", profession: "فارس الغناء العربي" },
  { day: 16, month: 5, birth_year: 1983, name: "نانسي عجرم", profession: "نجمة البوب العربي" },
  { day: 26, month: 2, birth_year: 1965, name: "نجوى كرم", profession: "شمس الأغنية اللبنانية" },
  { day: 25, month: 8, birth_year: 1979, name: "حسين الجسمي", profession: "سفير الأغنية الخليجية" },
  { day: 18, month: 11, birth_year: 1949, name: "أحمد زكي", profession: "النمر الأسود" },
  { day: 21, month: 1, birth_year: 1945, name: "نبيلة عبيد", profession: "نجمة مصر الأولى" },
  { day: 11, month: 11, birth_year: 1975, name: "هند صبري", profession: "ممثلة تونسية" },

  // Literature & Poetry
  { day: 14, month: 10, birth_year: 1868, name: "أحمد شوقي", profession: "أمير الشعراء" },
  { day: 11, month: 12, birth_year: 1911, name: "نجيب محفوظ", profession: "أديب نوبل" },
  { day: 31, month: 8, birth_year: 1886, name: "عباس محمود العقاد", profession: "عملاق الأدب العربي" },
  { day: 14, month: 11, birth_year: 1889, name: "طه حسين", profession: "عميد الأدب العربي" },
  { day: 13, month: 3, birth_year: 1941, name: "محمود درويش", profession: "شاعر المقاومة الفلسطينية" },
  { day: 23, month: 8, birth_year: 1923, name: "نازك الملائكة", profession: "رائدة الشعر الحر" },
  { day: 2, month: 1, birth_year: 1930, name: "أدونيس", profession: "شاعر ومفكر سوري" },
  { day: 24, month: 10, birth_year: 1925, name: "صلاح جاهين", profession: "شاعر العامية وفنان" },

  // Science & Thought
  { day: 26, month: 2, birth_year: 1946, name: "أحمد زويل", profession: "عالم كيمياء مصري" },
  { day: 17, month: 7, birth_year: 1935, name: "فاروق الباز", profession: "عالم جيولوجيا وفضاء" },
  { day: 30, month: 11, birth_year: 1929, name: "مصطفى محمود", profession: "مفكر وطبيب مصري" },
  { day: 15, month: 4, birth_year: 1917, name: "محمد الغزالي", profession: "عالم دين ومفكر" },
  { day: 21, month: 6, birth_year: 1940, name: "محمد البرادعي", profession: "دبلوماسي وسياسي" },

  // Sports
  { day: 22, month: 6, birth_year: 1992, name: "محمد صلاح", profession: "أسطورة كرة القدم المصرية" },
  { day: 7, month: 11, birth_year: 1978, name: "محمد أبو تريكة", profession: "ساحر الكرة المصرية" },
  { day: 1, month: 6, birth_year: 1985, name: "رياض محرز", profession: "نجم الكرة الجزائرية" },
  { day: 4, month: 11, birth_year: 1998, name: "أشرف حكيمي", profession: "نجم الكرة المغربية" },
  { day: 20, month: 8, birth_year: 1985, name: "أنس جابر", profession: "بطلة التنس التونسية" }
];

console.log('Starting enrichment V2...');

// Insert Events
const insertEvent = db.prepare(`
  INSERT INTO daily_events (day, month, year, title, description, category)
  SELECT @day, @month, @year, @title, @description, @category
  WHERE NOT EXISTS (
    SELECT 1 FROM daily_events WHERE title = @title AND day = @day AND month = @month
  )
`);

let eventsAdded = 0;
for (const event of arabicEvents) {
  try {
    const info = insertEvent.run(event);
    if (info.changes > 0) eventsAdded++;
  } catch (err) {
    console.log(`Skipped duplicate or error: ${event.title}`);
  }
}
console.log(`Added ${eventsAdded} new events.`);

// Insert Celebrities
const insertCeleb = db.prepare(`
  INSERT INTO daily_birthdays (day, month, birth_year, name, profession)
  SELECT @day, @month, @birth_year, @name, @profession
  WHERE NOT EXISTS (
    SELECT 1 FROM daily_birthdays WHERE name = @name
  )
`);

let celebsAdded = 0;
for (const celeb of arabicCelebrities) {
  try {
    const info = insertCeleb.run(celeb);
    if (info.changes > 0) celebsAdded++;
  } catch (err) {
    console.log(`Skipped duplicate or error: ${celeb.name}`);
  }
}
console.log(`Added ${celebsAdded} new celebrities.`);

console.log('Enrichment V2 complete!');
