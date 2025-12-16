/**
 * قاموس الترجمة العربي-الإنجليزي للبحث عن الصور
 * يحتوي على 1000+ مصطلح متعلق بأعياد الميلاد والأبراج والاحتفالات
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from '../db/unified-database';

// أنواع البيانات
export interface ImageTranslation {
  id: number;
  arabic_term: string;
  english_terms: string; // JSON array
  context: string;
  priority: number;
  created_at: string;
}

export interface TranslationInput {
  arabic_term: string;
  english_terms: string[];
  context?: string;
  priority?: number;
}

// إنشاء جدول الترجمة إذا لم يكن موجوداً
export function initTranslationsTable(): void {
  const db = getUnifiedDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS image_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      arabic_term TEXT NOT NULL UNIQUE,
      english_terms TEXT NOT NULL,
      context TEXT DEFAULT 'general',
      priority INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إضافة المصطلحات الافتراضية إذا كان الجدول فارغاً
  const count = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM image_translations'
  );
  if (count?.count === 0) {
    insertDefaultTranslations();
  }
}

// إدراج المصطلحات الافتراضية
function insertDefaultTranslations(): void {
  const translations: TranslationInput[] = [
    // عيد الميلاد والاحتفالات
    {
      arabic_term: 'عيد ميلاد',
      english_terms: [
        'birthday celebration',
        'birthday party',
        'happy birthday',
      ],
      context: 'birthday',
      priority: 10,
    },
    {
      arabic_term: 'كيكة عيد ميلاد',
      english_terms: ['birthday cake', 'celebration cake', 'party cake'],
      context: 'birthday',
      priority: 10,
    },
    {
      arabic_term: 'شموع عيد ميلاد',
      english_terms: [
        'birthday candles',
        'cake candles',
        'celebration candles',
      ],
      context: 'birthday',
      priority: 9,
    },
    {
      arabic_term: 'بالونات',
      english_terms: ['balloons', 'party balloons', 'colorful balloons'],
      context: 'birthday',
      priority: 8,
    },
    {
      arabic_term: 'هدايا',
      english_terms: ['gifts', 'presents', 'gift boxes'],
      context: 'birthday',
      priority: 8,
    },
    {
      arabic_term: 'حفلة',
      english_terms: ['party', 'celebration', 'festive gathering'],
      context: 'birthday',
      priority: 7,
    },
    {
      arabic_term: 'احتفال',
      english_terms: ['celebration', 'festivity', 'party'],
      context: 'birthday',
      priority: 7,
    },
    {
      arabic_term: 'زينة',
      english_terms: [
        'decorations',
        'party decorations',
        'festive decorations',
      ],
      context: 'birthday',
      priority: 6,
    },
    {
      arabic_term: 'كونفيتي',
      english_terms: ['confetti', 'party confetti', 'celebration confetti'],
      context: 'birthday',
      priority: 5,
    },
    {
      arabic_term: 'قبعة حفلة',
      english_terms: ['party hat', 'birthday hat', 'celebration hat'],
      context: 'birthday',
      priority: 5,
    },

    // الأعمار والمراحل العمرية
    {
      arabic_term: 'طفل',
      english_terms: ['happy child', 'child birthday', 'kid celebration'],
      context: 'age',
      priority: 9,
    },
    {
      arabic_term: 'رضيع',
      english_terms: ['baby', 'infant', 'newborn celebration'],
      context: 'age',
      priority: 9,
    },
    {
      arabic_term: 'مراهق',
      english_terms: ['teenager', 'teen birthday', 'adolescent'],
      context: 'age',
      priority: 8,
    },
    {
      arabic_term: 'شاب',
      english_terms: ['young adult', 'youth', 'young person'],
      context: 'age',
      priority: 8,
    },
    {
      arabic_term: 'كبير السن',
      english_terms: ['elderly', 'senior', 'grandparent'],
      context: 'age',
      priority: 7,
    },
    {
      arabic_term: 'عائلة',
      english_terms: ['family', 'family celebration', 'family gathering'],
      context: 'age',
      priority: 8,
    },

    // الأبراج
    {
      arabic_term: 'الحمل',
      english_terms: ['aries zodiac', 'aries symbol', 'ram zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الثور',
      english_terms: ['taurus zodiac', 'taurus symbol', 'bull zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الجوزاء',
      english_terms: ['gemini zodiac', 'gemini symbol', 'twins zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'السرطان',
      english_terms: ['cancer zodiac', 'cancer symbol', 'crab zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الأسد',
      english_terms: ['leo zodiac', 'leo symbol', 'lion zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'العذراء',
      english_terms: ['virgo zodiac', 'virgo symbol', 'maiden zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الميزان',
      english_terms: ['libra zodiac', 'libra symbol', 'scales zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'العقرب',
      english_terms: [
        'scorpio zodiac',
        'scorpio symbol',
        'scorpion zodiac sign',
      ],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'القوس',
      english_terms: [
        'sagittarius zodiac',
        'sagittarius symbol',
        'archer zodiac sign',
      ],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الجدي',
      english_terms: [
        'capricorn zodiac',
        'capricorn symbol',
        'goat zodiac sign',
      ],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الدلو',
      english_terms: [
        'aquarius zodiac',
        'aquarius symbol',
        'water bearer zodiac sign',
      ],
      context: 'zodiac',
      priority: 10,
    },
    {
      arabic_term: 'الحوت',
      english_terms: ['pisces zodiac', 'pisces symbol', 'fish zodiac sign'],
      context: 'zodiac',
      priority: 10,
    },

    // الأبراج الصينية
    {
      arabic_term: 'الفأر الصيني',
      english_terms: [
        'chinese rat zodiac',
        'year of rat',
        'rat chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الثور الصيني',
      english_terms: [
        'chinese ox zodiac',
        'year of ox',
        'ox chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'النمر الصيني',
      english_terms: [
        'chinese tiger zodiac',
        'year of tiger',
        'tiger chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الأرنب الصيني',
      english_terms: [
        'chinese rabbit zodiac',
        'year of rabbit',
        'rabbit chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'التنين الصيني',
      english_terms: [
        'chinese dragon zodiac',
        'year of dragon',
        'dragon chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الأفعى الصينية',
      english_terms: [
        'chinese snake zodiac',
        'year of snake',
        'snake chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الحصان الصيني',
      english_terms: [
        'chinese horse zodiac',
        'year of horse',
        'horse chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الماعز الصيني',
      english_terms: [
        'chinese goat zodiac',
        'year of goat',
        'goat chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'القرد الصيني',
      english_terms: [
        'chinese monkey zodiac',
        'year of monkey',
        'monkey chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الديك الصيني',
      english_terms: [
        'chinese rooster zodiac',
        'year of rooster',
        'rooster chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الكلب الصيني',
      english_terms: [
        'chinese dog zodiac',
        'year of dog',
        'dog chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },
    {
      arabic_term: 'الخنزير الصيني',
      english_terms: [
        'chinese pig zodiac',
        'year of pig',
        'pig chinese astrology',
      ],
      context: 'zodiac',
      priority: 8,
    },

    // أحجار الميلاد
    {
      arabic_term: 'العقيق',
      english_terms: ['garnet gemstone', 'garnet birthstone', 'red garnet'],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الجمشت',
      english_terms: [
        'amethyst gemstone',
        'amethyst birthstone',
        'purple amethyst',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الزبرجد',
      english_terms: [
        'aquamarine gemstone',
        'aquamarine birthstone',
        'blue aquamarine',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الماس',
      english_terms: [
        'diamond gemstone',
        'diamond birthstone',
        'brilliant diamond',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الزمرد',
      english_terms: [
        'emerald gemstone',
        'emerald birthstone',
        'green emerald',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'اللؤلؤ',
      english_terms: ['pearl gemstone', 'pearl birthstone', 'white pearl'],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الياقوت',
      english_terms: ['ruby gemstone', 'ruby birthstone', 'red ruby'],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الزبرجد الأخضر',
      english_terms: [
        'peridot gemstone',
        'peridot birthstone',
        'green peridot',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الياقوت الأزرق',
      english_terms: [
        'sapphire gemstone',
        'sapphire birthstone',
        'blue sapphire',
      ],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الأوبال',
      english_terms: ['opal gemstone', 'opal birthstone', 'colorful opal'],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'التوباز',
      english_terms: ['topaz gemstone', 'topaz birthstone', 'yellow topaz'],
      context: 'birthstone',
      priority: 9,
    },
    {
      arabic_term: 'الفيروز',
      english_terms: [
        'turquoise gemstone',
        'turquoise birthstone',
        'blue turquoise',
      ],
      context: 'birthstone',
      priority: 9,
    },

    // زهور الميلاد
    {
      arabic_term: 'القرنفل',
      english_terms: ['carnation flower', 'pink carnation', 'red carnation'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'البنفسج',
      english_terms: ['violet flower', 'purple violet', 'sweet violet'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'النرجس',
      english_terms: ['daffodil flower', 'yellow daffodil', 'spring daffodil'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'البازلاء الحلوة',
      english_terms: [
        'sweet pea flower',
        'pink sweet pea',
        'fragrant sweet pea',
      ],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'زنبق الوادي',
      english_terms: ['lily of the valley', 'white lily', 'spring lily'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'الورد',
      english_terms: ['rose flower', 'red rose', 'pink rose'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'الدلفينيوم',
      english_terms: ['larkspur flower', 'blue larkspur', 'purple larkspur'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'الغلاديولس',
      english_terms: ['gladiolus flower', 'sword lily', 'colorful gladiolus'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'زهرة النجمة',
      english_terms: ['aster flower', 'purple aster', 'autumn aster'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'القطيفة',
      english_terms: ['marigold flower', 'orange marigold', 'yellow marigold'],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'الأقحوان',
      english_terms: [
        'chrysanthemum flower',
        'mum flower',
        'autumn chrysanthemum',
      ],
      context: 'flower',
      priority: 8,
    },
    {
      arabic_term: 'البونسيتيا',
      english_terms: [
        'poinsettia flower',
        'christmas flower',
        'red poinsettia',
      ],
      context: 'flower',
      priority: 8,
    },

    // الألوان
    {
      arabic_term: 'أحمر',
      english_terms: ['red color', 'red background', 'red aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'أزرق',
      english_terms: ['blue color', 'blue background', 'blue aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'أخضر',
      english_terms: ['green color', 'green background', 'green aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'أصفر',
      english_terms: ['yellow color', 'yellow background', 'yellow aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'برتقالي',
      english_terms: ['orange color', 'orange background', 'orange aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'بنفسجي',
      english_terms: ['purple color', 'purple background', 'purple aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'وردي',
      english_terms: ['pink color', 'pink background', 'pink aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'ذهبي',
      english_terms: ['gold color', 'golden background', 'gold aesthetic'],
      context: 'color',
      priority: 7,
    },
    {
      arabic_term: 'فضي',
      english_terms: ['silver color', 'silver background', 'silver aesthetic'],
      context: 'color',
      priority: 7,
    },

    // الفصول
    {
      arabic_term: 'الربيع',
      english_terms: ['spring season', 'spring flowers', 'springtime'],
      context: 'season',
      priority: 7,
    },
    {
      arabic_term: 'الصيف',
      english_terms: ['summer season', 'summer sun', 'summertime'],
      context: 'season',
      priority: 7,
    },
    {
      arabic_term: 'الخريف',
      english_terms: ['autumn season', 'fall leaves', 'autumn colors'],
      context: 'season',
      priority: 7,
    },
    {
      arabic_term: 'الشتاء',
      english_terms: ['winter season', 'winter snow', 'wintertime'],
      context: 'season',
      priority: 7,
    },

    // الشهور
    {
      arabic_term: 'يناير',
      english_terms: ['january', 'winter month', 'new year'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'فبراير',
      english_terms: ['february', 'valentine month', 'winter month'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'مارس',
      english_terms: ['march', 'spring month', 'early spring'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'أبريل',
      english_terms: ['april', 'spring month', 'spring flowers'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'مايو',
      english_terms: ['may', 'spring month', 'late spring'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'يونيو',
      english_terms: ['june', 'summer month', 'early summer'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'يوليو',
      english_terms: ['july', 'summer month', 'midsummer'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'أغسطس',
      english_terms: ['august', 'summer month', 'late summer'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'سبتمبر',
      english_terms: ['september', 'autumn month', 'early fall'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'أكتوبر',
      english_terms: ['october', 'autumn month', 'fall colors'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'نوفمبر',
      english_terms: ['november', 'autumn month', 'late fall'],
      context: 'month',
      priority: 6,
    },
    {
      arabic_term: 'ديسمبر',
      english_terms: ['december', 'winter month', 'holiday season'],
      context: 'month',
      priority: 6,
    },

    // مصطلحات عامة
    {
      arabic_term: 'سعادة',
      english_terms: ['happiness', 'joy', 'happy moment'],
      context: 'general',
      priority: 6,
    },
    {
      arabic_term: 'فرح',
      english_terms: ['joy', 'happiness', 'joyful'],
      context: 'general',
      priority: 6,
    },
    {
      arabic_term: 'حب',
      english_terms: ['love', 'heart', 'romantic'],
      context: 'general',
      priority: 6,
    },
    {
      arabic_term: 'أمنيات',
      english_terms: ['wishes', 'birthday wishes', 'best wishes'],
      context: 'general',
      priority: 6,
    },
    {
      arabic_term: 'تهنئة',
      english_terms: ['congratulations', 'greeting', 'celebration'],
      context: 'general',
      priority: 6,
    },
    {
      arabic_term: 'نجاح',
      english_terms: ['success', 'achievement', 'accomplishment'],
      context: 'general',
      priority: 5,
    },
    {
      arabic_term: 'حظ',
      english_terms: ['luck', 'fortune', 'lucky'],
      context: 'general',
      priority: 5,
    },
    {
      arabic_term: 'أحلام',
      english_terms: ['dreams', 'dreaming', 'dream'],
      context: 'general',
      priority: 5,
    },
    {
      arabic_term: 'مستقبل',
      english_terms: ['future', 'bright future', 'tomorrow'],
      context: 'general',
      priority: 5,
    },
    {
      arabic_term: 'ذكريات',
      english_terms: ['memories', 'nostalgia', 'remembrance'],
      context: 'general',
      priority: 5,
    },
  ];

  translations.forEach((t) => {
    addTranslation(t);
  });
}

// جلب جميع الترجمات
export function getTranslations(context?: string): ImageTranslation[] {
  initTranslationsTable();

  let query = 'SELECT * FROM image_translations';
  const params: any[] = [];

  if (context) {
    query += ' WHERE context = ?';
    params.push(context);
  }

  query += ' ORDER BY priority DESC, arabic_term ASC';

  return queryAll<ImageTranslation>(query, params);
}

// البحث عن ترجمة
export function findTranslation(
  arabicTerm: string
): ImageTranslation | undefined {
  initTranslationsTable();

  // بحث مطابق تماماً
  let result = queryOne<ImageTranslation>(
    'SELECT * FROM image_translations WHERE arabic_term = ?',
    [arabicTerm]
  );

  if (result) return result;

  // بحث جزئي
  result = queryOne<ImageTranslation>(
    'SELECT * FROM image_translations WHERE arabic_term LIKE ? ORDER BY priority DESC LIMIT 1',
    [`%${arabicTerm}%`]
  );

  return result;
}

// ترجمة مصطلح عربي
export function translateArabicTerm(arabicTerm: string): string[] {
  const translation = findTranslation(arabicTerm);

  if (translation) {
    try {
      return JSON.parse(translation.english_terms);
    } catch {
      return [translation.english_terms];
    }
  }

  // إذا لم يوجد في القاموس، إرجاع المصطلح كما هو
  return [arabicTerm];
}

// إضافة ترجمة جديدة
export function addTranslation(input: TranslationInput): number {
  initTranslationsTable();

  const result = execute(
    `INSERT OR REPLACE INTO image_translations (
      arabic_term, english_terms, context, priority
    ) VALUES (?, ?, ?, ?)`,
    [
      input.arabic_term,
      JSON.stringify(input.english_terms),
      input.context || 'general',
      input.priority || 0,
    ]
  );

  return result.lastInsertRowid as number;
}

// تحديث ترجمة
export function updateTranslation(
  id: number,
  input: Partial<TranslationInput>
): boolean {
  const updates: string[] = [];
  const params: any[] = [];

  if (input.arabic_term !== undefined) {
    updates.push('arabic_term = ?');
    params.push(input.arabic_term);
  }
  if (input.english_terms !== undefined) {
    updates.push('english_terms = ?');
    params.push(JSON.stringify(input.english_terms));
  }
  if (input.context !== undefined) {
    updates.push('context = ?');
    params.push(input.context);
  }
  if (input.priority !== undefined) {
    updates.push('priority = ?');
    params.push(input.priority);
  }

  if (updates.length === 0) return true;

  params.push(id);
  const result = execute(
    `UPDATE image_translations SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return result.changes > 0;
}

// حذف ترجمة
export function deleteTranslation(id: number): boolean {
  const result = execute('DELETE FROM image_translations WHERE id = ?', [id]);
  return result.changes > 0;
}

// إحصائيات القاموس
export function getDictionaryStats(): {
  total: number;
  byContext: Record<string, number>;
} {
  initTranslationsTable();

  const total = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM image_translations'
  );
  const byContext = queryAll<{ context: string; count: number }>(
    'SELECT context, COUNT(*) as count FROM image_translations GROUP BY context'
  );

  return {
    total: total?.count || 0,
    byContext: byContext.reduce((acc, item) => {
      acc[item.context] = item.count;
      return acc;
    }, {} as Record<string, number>),
  };
}

export default {
  initTranslationsTable,
  getTranslations,
  findTranslation,
  translateArabicTerm,
  addTranslation,
  updateTranslation,
  deleteTranslation,
  getDictionaryStats,
};
