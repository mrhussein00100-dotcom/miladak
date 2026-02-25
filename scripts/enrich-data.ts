
import unifiedDb from '../lib/db/unified-connection';
import { dailyEvents, dailyBirthdays } from '../lib/dailyData';
import { CELEBRITIES_BY_DATE } from '../lib/celebrities';
import { yearsData } from '../lib/yearsData';
import { birthstoneData, birthFlowerData } from '../lib/ai/providers/local';

async function enrichDatabase() {
  console.log('🚀 Starting database enrichment...');
  
  await unifiedDb.initialize();

  // 1. Enrich Birthstones
  console.log('💎 Enriching Birthstones...');
  try {
    await unifiedDb.execute('DELETE FROM birthstones');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='birthstones'");
  } catch (e) {}

  for (const [monthStr, data] of Object.entries(birthstoneData)) {
    const month = parseInt(monthStr);
    await unifiedDb.execute(
      'INSERT INTO birthstones (month, stone_name, stone_name_ar, description) VALUES (?, ?, ?, ?)',
      [month, data.name, data.name, data.meaning]
    );
  }

  // 2. Enrich Birth Flowers
  console.log('🌸 Enriching Birth Flowers...');
  try {
    await unifiedDb.execute('DELETE FROM birth_flowers');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='birth_flowers'");
  } catch (e) {}

  for (const [monthStr, data] of Object.entries(birthFlowerData)) {
    const month = parseInt(monthStr);
    await unifiedDb.execute(
      'INSERT INTO birth_flowers (month, flower_name, flower_name_ar, description) VALUES (?, ?, ?, ?)',
      [month, data.name, data.name, data.meaning]
    );
  }

  // 3. Enrich Daily Events
  console.log('📅 Enriching Daily Events...');
  try {
    await unifiedDb.execute('DELETE FROM daily_events');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='daily_events'");
  } catch (e) {}
  
  for (const event of dailyEvents) {
    await unifiedDb.execute(
      'INSERT INTO daily_events (day, month, year, title, description, category) VALUES (?, ?, ?, ?, ?, ?)',
      [event.day, event.month, event.year || null, event.title, event.description, event.category]
    );
  }

  // 4. Enrich Daily Birthdays AND Celebrities
  console.log('🎂 Enriching Daily Birthdays & Celebrities...');
  try {
    await unifiedDb.execute('DELETE FROM daily_birthdays');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='daily_birthdays'");
    
    // Check if celebrities table exists and has content, delete it too
    await unifiedDb.execute('DELETE FROM celebrities');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='celebrities'");
  } catch (e) {}

  const allBirthdays = [...dailyBirthdays];
  
  // Add from celebrities.ts
  for (const [dateStr, celebs] of Object.entries(CELEBRITIES_BY_DATE)) {
    const [monthStr, dayStr] = dateStr.split('-');
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    
    for (const celeb of celebs) {
       allBirthdays.push({
         day, month, 
         birthYear: celeb.birthYear, 
         name: celeb.name, 
         profession: celeb.profession
       });
    }
  }

  // Insert into both tables to be safe
  for (const b of allBirthdays) {
    // daily_birthdays
    await unifiedDb.execute(
      'INSERT INTO daily_birthdays (day, month, birth_year, name, profession) VALUES (?, ?, ?, ?, ?)',
      [b.day, b.month, b.birthYear || 0, b.name, b.profession]
    );
    
    // celebrities
    try {
      await unifiedDb.execute(
        'INSERT INTO celebrities (day, month, birth_year, name, profession) VALUES (?, ?, ?, ?, ?)',
        [b.day, b.month, b.birthYear || 0, b.name, b.profession]
      );
    } catch (e) {
      // Ignore if table doesn't exist or other error
    }
  }

  // 5. Enrich Years Data
  console.log('📆 Enriching Years Data...');
  try {
    await unifiedDb.execute('DELETE FROM years');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='years'");
  } catch (e) {}
  
  for (const yearData of yearsData) {
    // Schema: year, description, events (text), characteristics (text)
    const eventsJson = JSON.stringify({
      worldEvents: yearData.worldEvents,
      majorEvents: yearData.majorEvents
    });
    
    const charsJson = JSON.stringify({
      facts: yearData.facts,
      worldStats: yearData.worldStats,
      popularSongs: yearData.popularSongs
    });
    
    await unifiedDb.execute(
      'INSERT INTO years (year, description, events, characteristics) VALUES (?, ?, ?, ?)',
      [
        yearData.year, 
        `أحداث وحقائق عام ${yearData.year}`, 
        eventsJson, 
        charsJson
      ]
    );
  }
  
  // 6. Chinese Zodiac
  console.log('🐉 Enriching Chinese Zodiac...');
  try {
    await unifiedDb.execute('DELETE FROM chinese_zodiac');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='chinese_zodiac'");
  } catch (e) {}
  
  const animals = [
    { name: 'Rat', ar: 'الفأر', desc: 'سريع البديهة، واسع الحيلة، متعدد الاستخدامات، لطيف' },
    { name: 'Ox', ar: 'الثور', desc: 'مجتهد، يمكن الاعتماد عليه، قوي، مصمم' },
    { name: 'Tiger', ar: 'النمر', desc: 'شجاع، واثق، تنافسي' },
    { name: 'Rabbit', ar: 'الأرنب', desc: 'هادئ، أنيق، طيب، مسؤول' },
    { name: 'Dragon', ar: 'التنين', desc: 'واثق، ذكي، متحمس' },
    { name: 'Snake', ar: 'الثعبان', desc: 'غامض، ذكي، حكيم' },
    { name: 'Horse', ar: 'الحصان', desc: 'نشيط، نشيط، متحمس' },
    { name: 'Goat', ar: 'الماعز', desc: 'هادئ، لطيف، متعاطف' },
    { name: 'Monkey', ar: 'القرد', desc: 'حاد، ذكي، فضولي' },
    { name: 'Rooster', ar: 'الديك', desc: 'ملتزم، مجتهد، شجاع' },
    { name: 'Dog', ar: 'الكلب', desc: 'لطيف، مخلص، صادق' },
    { name: 'Pig', ar: 'الخنزير', desc: 'رحيم، كريم، مجتهد' }
  ];
  
  for (let y = 1900; y <= 2040; y++) {
    const index = (y - 1900) % 12;
    const animal = animals[index];
    
    // Schema: year, name, description. NO name_ar.
    
    await unifiedDb.execute(
      'INSERT INTO chinese_zodiac (year, name, description) VALUES (?, ?, ?)',
      [y, animal.name, `${animal.ar} - ${animal.desc}`]
    );
  }

  // 7. Lucky Colors (lucky_colors table)
  console.log('🎨 Enriching Lucky Colors...');
  try {
    await unifiedDb.execute('DELETE FROM lucky_colors');
    await unifiedDb.execute("DELETE FROM sqlite_sequence WHERE name='lucky_colors'");
  } catch (e) {}

  const luckyColors = [
    { month: 1, name: 'Red', ar: 'الأحمر', hex: '#FF0000' },
    { month: 2, name: 'Purple', ar: 'البنفسجي', hex: '#800080' },
    { month: 3, name: 'Light Blue', ar: 'الأزرق الفاتح', hex: '#ADD8E6' },
    { month: 4, name: 'White', ar: 'الأبيض', hex: '#FFFFFF' },
    { month: 5, name: 'Green', ar: 'الأخضر', hex: '#008000' },
    { month: 6, name: 'Pearl White', ar: 'الأبيض اللؤلؤي', hex: '#FDEEF4' },
    { month: 7, name: 'Ruby Red', ar: 'الأحمر الياقوتي', hex: '#E0115F' },
    { month: 8, name: 'Light Green', ar: 'الأخضر الفاتح', hex: '#90EE90' },
    { month: 9, name: 'Deep Blue', ar: 'الأزرق الداكن', hex: '#00008B' },
    { month: 10, name: 'Pink', ar: 'الوردي', hex: '#FFC0CB' },
    { month: 11, name: 'Yellow', ar: 'الأصفر', hex: '#FFFF00' },
    { month: 12, name: 'Turquoise', ar: 'الفيروزي', hex: '#40E0D0' },
  ];

  for (const color of luckyColors) {
    try {
      await unifiedDb.execute(
        'INSERT INTO lucky_colors (month, color_name, color_name_ar, hex_code) VALUES (?, ?, ?, ?)',
        [color.month, color.name, color.ar, color.hex]
      );
    } catch (e) { /* ignore */ }
  }

  console.log('✅ Database enrichment complete!');
  process.exit(0);
}

enrichDatabase().catch(err => {
  console.error('❌ Error enriching database:', err);
  process.exit(1);
});
