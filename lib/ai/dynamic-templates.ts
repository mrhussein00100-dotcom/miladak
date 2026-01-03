/**
 * نظام القوالب الديناميكية
 * يولد محتوى متنوع وغير مكرر باستخدام قوالب ديناميكية
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  calculateTemplateHash,
  isTemplateUsedRecently,
  markTemplateAsUsed,
} from '../db/used-templates';

export type TemplateCategory =
  | 'birthday'
  | 'zodiac'
  | 'health'
  | 'pregnancy'
  | 'age'
  | 'general';
export type TemplateType = 'intro' | 'section' | 'faq' | 'conclusion';

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'date';
  required: boolean;
  default?: any;
}

export interface Template {
  id: string;
  category: TemplateCategory;
  type: TemplateType;
  template: string;
  variables: string[];
  minWords: number;
  maxWords: number;
  expandable: boolean;
}

export interface TemplateContext {
  topic: string;
  name?: string;
  age?: number;
  zodiacSign?: string;
  date?: string;
  category: TemplateCategory;
  [key: string]: any;
}

// Cache للقوالب
let templatesCache: Map<string, Template[]> | null = null;

// عبارات انتقالية
const TRANSITION_PHRASES = [
  'بالإضافة إلى ذلك،',
  'علاوة على ما سبق،',
  'من ناحية أخرى،',
  'كما أن',
  'ومن الجدير بالذكر أن',
  'وفي هذا السياق،',
  'ولا يفوتنا أن نذكر',
  'ومما يستحق الإشارة إليه',
  'وبالنظر إلى ذلك،',
  'ومن المهم أيضاً',
];

// عبارات تأكيدية
const EMPHASIS_PHRASES = [
  'من المؤكد أن',
  'لا شك أن',
  'من الواضح أن',
  'يتضح جلياً أن',
  'من البديهي أن',
  'من الثابت أن',
];

// عبارات CTA
const CTA_PHRASES = [
  'شاركوا هذا المقال مع أصدقائكم',
  'تابعونا للمزيد من المقالات المفيدة',
  'لا تنسوا ترك تعليقاتكم',
  'اشتركوا في نشرتنا البريدية',
  'زوروا موقعنا للمزيد',
];

/**
 * تحميل القوالب من الملفات
 */
async function loadTemplatesFromFiles(): Promise<Map<string, Template[]>> {
  const templates = new Map<string, Template[]>();
  const dataPath = path.join(process.cwd(), 'data', 'templates');

  const categories: TemplateCategory[] = [
    'birthday',
    'zodiac',
    'health',
    'pregnancy',
    'age',
    'general',
  ];
  const types: TemplateType[] = ['intro', 'section', 'faq', 'conclusion'];

  for (const category of categories) {
    for (const type of types) {
      const key = `${category}_${type}`;
      const filePath = path.join(dataPath, type + 's', `${category}.json`);

      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(content);
          templates.set(key, data.templates || []);
        } else {
          // استخدام القوالب الافتراضية
          templates.set(key, getDefaultTemplates(category, type));
        }
      } catch (error) {
        console.warn(`⚠️ [Templates] فشل تحميل ${filePath}:`, error);
        templates.set(key, getDefaultTemplates(category, type));
      }
    }
  }

  return templates;
}

/**
 * الحصول على القوالب (مع cache)
 */
export async function getTemplates(): Promise<Map<string, Template[]>> {
  if (!templatesCache) {
    templatesCache = await loadTemplatesFromFiles();
  }
  return templatesCache;
}

/**
 * الحصول على قالب عشوائي غير مستخدم
 */
export async function getRandomTemplate(
  category: TemplateCategory,
  type: TemplateType,
  articleId?: number
): Promise<Template | null> {
  const templates = await getTemplates();
  const key = `${category}_${type}`;
  const categoryTemplates = templates.get(key) || [];

  if (categoryTemplates.length === 0) {
    return null;
  }

  // خلط القوالب
  const shuffled = [...categoryTemplates].sort(() => Math.random() - 0.5);

  // البحث عن قالب غير مستخدم
  for (const template of shuffled) {
    const hash = calculateTemplateHash(template.template);
    const isUsed = await isTemplateUsedRecently(hash, 30);

    if (!isUsed) {
      // تسجيل القالب كمستخدم
      await markTemplateAsUsed({
        templateHash: hash,
        templateType: type,
        category,
        articleId,
      });

      return template;
    }
  }

  // إذا كل القوالب مستخدمة، أرجع واحد عشوائي
  return shuffled[0];
}

/**
 * استبدال المتغيرات في القالب
 */
export function replaceVariables(
  template: string,
  context: TemplateContext
): string {
  let result = template;

  // استبدال المتغيرات الأساسية
  result = result.replace(/\{\{topic\}\}/g, context.topic);
  result = result.replace(/\{\{name\}\}/g, context.name || 'المحتفى به');
  result = result.replace(/\{\{age\}\}/g, String(context.age || ''));
  result = result.replace(/\{\{zodiacSign\}\}/g, context.zodiacSign || '');
  result = result.replace(
    /\{\{date\}\}/g,
    context.date || new Date().toLocaleDateString('ar-SA')
  );
  result = result.replace(/\{\{category\}\}/g, context.category);

  // استبدال المتغيرات الإضافية
  for (const [key, value] of Object.entries(context)) {
    if (typeof value === 'string' || typeof value === 'number') {
      result = result.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        String(value)
      );
    } else if (Array.isArray(value)) {
      result = result.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        value.map((v) => `<li>${v}</li>`).join('\n')
      );
    }
  }

  // إضافة عبارات انتقالية عشوائية
  result = result.replace(
    /\{\{transition\}\}/g,
    () =>
      TRANSITION_PHRASES[Math.floor(Math.random() * TRANSITION_PHRASES.length)]
  );

  // إضافة عبارات تأكيدية عشوائية
  result = result.replace(
    /\{\{emphasis\}\}/g,
    () => EMPHASIS_PHRASES[Math.floor(Math.random() * EMPHASIS_PHRASES.length)]
  );

  // إضافة CTA عشوائي
  result = result.replace(
    /\{\{cta\}\}/g,
    () => CTA_PHRASES[Math.floor(Math.random() * CTA_PHRASES.length)]
  );

  return result;
}

/**
 * توليد مقدمة ديناميكية
 */
export async function generateIntro(
  context: TemplateContext,
  targetWords: number = 150
): Promise<string> {
  const template = await getRandomTemplate(context.category, 'intro');

  if (template) {
    return replaceVariables(template.template, context);
  }

  // قالب افتراضي
  return generateDefaultIntro(context, targetWords);
}

/**
 * توليد قسم ديناميكي
 */
export async function generateSection(
  context: TemplateContext,
  sectionTitle: string,
  targetWords: number = 200
): Promise<string> {
  const template = await getRandomTemplate(context.category, 'section');

  if (template) {
    const sectionContext = { ...context, sectionTitle };
    return replaceVariables(template.template, sectionContext);
  }

  // قالب افتراضي
  return generateDefaultSection(context, sectionTitle, targetWords);
}

/**
 * توليد سؤال شائع
 */
export async function generateFAQ(
  context: TemplateContext
): Promise<{ question: string; answer: string }> {
  const template = await getRandomTemplate(context.category, 'faq');

  if (template) {
    const content = replaceVariables(template.template, context);
    const parts = content.split('|||');
    return {
      question: parts[0] || `ما هي أهم المعلومات عن ${context.topic}؟`,
      answer:
        parts[1] ||
        `يمكنك معرفة المزيد عن ${context.topic} من خلال هذا المقال.`,
    };
  }

  // قالب افتراضي
  return generateDefaultFAQ(context);
}

/**
 * توليد خاتمة ديناميكية
 */
export async function generateConclusion(
  context: TemplateContext,
  targetWords: number = 100
): Promise<string> {
  const template = await getRandomTemplate(context.category, 'conclusion');

  if (template) {
    return replaceVariables(template.template, context);
  }

  // قالب افتراضي
  return generateDefaultConclusion(context, targetWords);
}

/**
 * توليد مقال كامل
 */
export async function generateFullArticle(
  context: TemplateContext,
  options: {
    introWords?: number;
    sectionsCount?: number;
    sectionWords?: number;
    faqCount?: number;
    conclusionWords?: number;
  } = {}
): Promise<string> {
  const {
    introWords = 150,
    sectionsCount = 5,
    sectionWords = 200,
    faqCount = 3,
    conclusionWords = 100,
  } = options;

  const parts: string[] = [];

  // المقدمة
  const intro = await generateIntro(context, introWords);
  parts.push(intro);

  // الأقسام
  const sectionTitles = getSectionTitles(context.category, sectionsCount);
  for (const title of sectionTitles) {
    const section = await generateSection(context, title, sectionWords);
    parts.push(section);
  }

  // الأسئلة الشائعة
  if (faqCount > 0) {
    const faqs: string[] = [];
    for (let i = 0; i < faqCount; i++) {
      const faq = await generateFAQ(context);
      faqs.push(`<h3>${faq.question}</h3>\n<p>${faq.answer}</p>`);
    }
    parts.push(`<h2>الأسئلة الشائعة</h2>\n${faqs.join('\n')}`);
  }

  // الخاتمة
  const conclusion = await generateConclusion(context, conclusionWords);
  parts.push(conclusion);

  return parts.join('\n\n');
}

/**
 * الحصول على عناوين الأقسام حسب الفئة
 */
function getSectionTitles(category: TemplateCategory, count: number): string[] {
  const titles: Record<TemplateCategory, string[]> = {
    birthday: [
      'أجمل تهاني عيد الميلاد',
      'أفكار هدايا مميزة',
      'أفكار للاحتفال',
      'تقاليد الاحتفال',
      'نصائح لحفلة ناجحة',
      'رسائل تهنئة',
      'أفكار للكيك',
      'ديكورات الحفلة',
      'ألعاب وأنشطة',
      'ذكريات لا تُنسى',
    ],
    zodiac: [
      'صفات البرج',
      'نقاط القوة والضعف',
      'التوافق مع الأبراج الأخرى',
      'الحب والعلاقات',
      'العمل والمال',
      'الصحة والعافية',
      'نصائح مهمة',
      'مشاهير من البرج',
      'حقائق مثيرة',
      'توقعات البرج',
    ],
    health: [
      'معلومات أساسية',
      'الفوائد الصحية',
      'نصائح مهمة',
      'الأخطاء الشائعة',
      'النظام الغذائي',
      'التمارين المناسبة',
      'العادات الصحية',
      'الوقاية والعلاج',
      'نصائح الخبراء',
      'أسئلة شائعة',
    ],
    pregnancy: [
      'تطور الجنين',
      'التغيرات في جسم الأم',
      'الأعراض الشائعة',
      'التغذية السليمة',
      'الفحوصات المطلوبة',
      'نصائح للحامل',
      'التمارين المناسبة',
      'الاستعداد للولادة',
      'نصائح للأب',
      'أسئلة شائعة',
    ],
    age: [
      'حساب العمر بدقة',
      'معالم العمر',
      'نصائح لكل مرحلة',
      'الصحة في كل عمر',
      'الإنجازات المتوقعة',
      'التخطيط للمستقبل',
      'الاحتفال بالعمر',
      'حقائق مثيرة',
      'نصائح مهمة',
      'أسئلة شائعة',
    ],
    general: [
      'معلومات أساسية',
      'تفاصيل مهمة',
      'نصائح وإرشادات',
      'الأخطاء الشائعة',
      'أفضل الممارسات',
      'نصائح الخبراء',
      'حقائق مثيرة',
      'معلومات إضافية',
      'نصائح عملية',
      'أسئلة شائعة',
    ],
  };

  const categoryTitles = titles[category] || titles.general;
  return categoryTitles.slice(0, count);
}

/**
 * القوالب الافتراضية
 */
function getDefaultTemplates(
  category: TemplateCategory,
  type: TemplateType
): Template[] {
  const defaults: Record<TemplateType, Template[]> = {
    intro: [
      {
        id: `${category}_intro_1`,
        category,
        type: 'intro',
        template: `<h2>مقدمة</h2>
<p>{{emphasis}} موضوع {{topic}} من المواضيع المهمة التي تستحق الاهتمام. في هذا المقال الشامل، سنقدم لكم معلومات قيمة ونصائح عملية.</p>
<p>{{transition}} سنتناول جوانب متعددة تساعدكم على فهم هذا الموضوع بشكل أعمق.</p>`,
        variables: ['topic'],
        minWords: 50,
        maxWords: 200,
        expandable: true,
      },
    ],
    section: [
      {
        id: `${category}_section_1`,
        category,
        type: 'section',
        template: `<h2>{{sectionTitle}}</h2>
<p>{{emphasis}} هذا القسم يتناول جانباً مهماً من {{topic}}. نقدم لكم معلومات مفصلة ونصائح عملية.</p>
<p>{{transition}} هناك عدة نقاط يجب مراعاتها:</p>
<ul>
<li>النقطة الأولى المهمة</li>
<li>النقطة الثانية للتوضيح</li>
<li>النقطة الثالثة للتأكيد</li>
</ul>`,
        variables: ['topic', 'sectionTitle'],
        minWords: 100,
        maxWords: 400,
        expandable: true,
      },
    ],
    faq: [
      {
        id: `${category}_faq_1`,
        category,
        type: 'faq',
        template: `ما هي أهم المعلومات عن {{topic}}؟|||يمكنك معرفة المزيد عن {{topic}} من خلال قراءة هذا المقال الشامل الذي يغطي جميع الجوانب المهمة.`,
        variables: ['topic'],
        minWords: 30,
        maxWords: 100,
        expandable: false,
      },
    ],
    conclusion: [
      {
        id: `${category}_conclusion_1`,
        category,
        type: 'conclusion',
        template: `<h2>الخاتمة</h2>
<p>في الختام، نأمل أن يكون هذا المقال قد أفادكم وقدم لكم معلومات قيمة عن {{topic}}.</p>
<p>{{cta}}. نتمنى لكم التوفيق والنجاح!</p>`,
        variables: ['topic'],
        minWords: 50,
        maxWords: 150,
        expandable: true,
      },
    ],
  };

  return defaults[type] || [];
}

/**
 * توليد مقدمة افتراضية
 */
function generateDefaultIntro(
  context: TemplateContext,
  targetWords: number
): string {
  const { topic, name, age, category } = context;

  if (category === 'birthday') {
    if (name && age) {
      return `<h2>مقدمة</h2>
<p>نحتفل اليوم بمناسبة عيد ميلاد <strong>${name}</strong> الذي يبلغ من العمر <strong>${age} عاماً</strong>! هذه مناسبة سعيدة تستحق الاحتفال والتهنئة.</p>
<p>في هذا المقال الشامل، سنقدم لكم أجمل التهاني والأمنيات، بالإضافة إلى أفكار رائعة للاحتفال وهدايا مميزة.</p>`;
    }
    return `<h2>مقدمة</h2>
<p>عيد الميلاد من أجمل المناسبات التي نحتفل بها مع أحبائنا. إنه يوم مميز نعبر فيه عن حبنا وتقديرنا.</p>
<p>في هذا المقال، سنقدم لكم كل ما تحتاجونه لجعل هذا اليوم لا يُنسى.</p>`;
  }

  if (category === 'zodiac') {
    const zodiac = context.zodiacSign || '';
    return `<h2>مقدمة عن برج ${zodiac}</h2>
<p>برج <strong>${zodiac}</strong> من الأبراج المميزة التي تتميز بصفات فريدة. في هذا المقال الشامل، سنتعرف على كل ما يخص هذا البرج.</p>
<p>سنتناول صفاته، نقاط قوته وضعفه، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليده.</p>`;
  }

  return `<h2>مقدمة</h2>
<p>مرحباً بكم في هذا المقال الشامل عن <strong>${topic}</strong>. سنقدم لكم معلومات مفيدة ونصائح عملية.</p>
<p>تابعوا معنا لاكتشاف كل ما تحتاجون معرفته عن هذا الموضوع المهم.</p>`;
}

/**
 * توليد قسم افتراضي
 */
function generateDefaultSection(
  context: TemplateContext,
  sectionTitle: string,
  targetWords: number
): string {
  const { topic, category } = context;

  return `<h2>${sectionTitle}</h2>
<p>في هذا القسم، نتناول جانباً مهماً من ${topic}. نقدم لكم معلومات مفصلة ونصائح عملية تساعدكم على فهم هذا الموضوع بشكل أفضل.</p>
<p>من أهم النقاط التي يجب مراعاتها:</p>
<ul>
<li>الفهم الصحيح للموضوع وأبعاده المختلفة</li>
<li>التطبيق العملي للمعلومات المكتسبة</li>
<li>الاستفادة من تجارب الآخرين في هذا المجال</li>
</ul>
<p>نأمل أن تكون هذه المعلومات مفيدة لكم في رحلتكم لفهم ${topic}.</p>`;
}

/**
 * توليد سؤال شائع افتراضي
 */
function generateDefaultFAQ(context: TemplateContext): {
  question: string;
  answer: string;
} {
  const { topic, category } = context;

  const faqs: Record<
    TemplateCategory,
    Array<{ question: string; answer: string }>
  > = {
    birthday: [
      {
        question: 'كيف أحتفل بعيد ميلاد مميز؟',
        answer:
          'للاحتفال بعيد ميلاد مميز: خطط مسبقاً، اختر موضوعاً للحفلة، ادعُ الأحباء، وأعد كيكة مخصصة.',
      },
      {
        question: 'ما هي أفضل أفكار هدايا عيد الميلاد؟',
        answer:
          'أفضل الهدايا هي التي تناسب شخصية واهتمامات المحتفى به. يمكنك اختيار هدايا شخصية أو تجارب مميزة.',
      },
    ],
    zodiac: [
      {
        question: 'كيف أعرف برجي؟',
        answer:
          'يمكنك معرفة برجك من تاريخ ميلادك. كل برج له فترة محددة من السنة.',
      },
      {
        question: 'هل الأبراج حقيقية؟',
        answer:
          'الأبراج جزء من علم الفلك التقليدي. يؤمن بها البعض كدليل للشخصية والتوافق.',
      },
    ],
    health: [
      {
        question: 'كيف أحافظ على صحتي؟',
        answer:
          'للحفاظ على صحتك: اتبع نظاماً غذائياً متوازناً، مارس الرياضة بانتظام، واحصل على نوم كافٍ.',
      },
    ],
    pregnancy: [
      {
        question: 'ما هي أهم نصائح الحمل؟',
        answer:
          'من أهم النصائح: المتابعة المنتظمة مع الطبيب، التغذية السليمة، والراحة الكافية.',
      },
    ],
    age: [
      {
        question: 'كيف أحسب عمري بدقة؟',
        answer:
          'يمكنك حساب عمرك بدقة باستخدام حاسبة العمر على موقعنا التي تحسب العمر بالسنوات والشهور والأيام.',
      },
    ],
    general: [
      {
        question: `أين أجد معلومات أكثر عن ${topic}؟`,
        answer: `يمكنك زيارة موقع ميلادك للمزيد من المعلومات والمقالات المفيدة حول ${topic}.`,
      },
    ],
  };

  const categoryFaqs = faqs[category] || faqs.general;
  return categoryFaqs[Math.floor(Math.random() * categoryFaqs.length)];
}

/**
 * توليد خاتمة افتراضية
 */
function generateDefaultConclusion(
  context: TemplateContext,
  targetWords: number
): string {
  const { topic, name, category } = context;

  if (category === 'birthday' && name) {
    return `<h2>الخاتمة</h2>
<p>في الختام، نتمنى لـ<strong>${name}</strong> عيد ميلاد سعيد وعاماً جديداً مليئاً بالسعادة والنجاح والصحة.</p>
<p>نأمل أن تكون هذه الأفكار والنصائح قد ساعدتكم في التخطيط لاحتفال مميز. شاركوا المقال مع أصدقائكم!</p>`;
  }

  return `<h2>الخاتمة</h2>
<p>نأمل أن يكون هذا المقال قد أفادكم وقدم لكم معلومات قيمة عن ${topic}.</p>
<p>شاركوا المقال مع أصدقائكم وتابعونا للمزيد من المقالات المفيدة على موقع ميلادك!</p>`;
}

export default {
  getTemplates,
  getRandomTemplate,
  replaceVariables,
  generateIntro,
  generateSection,
  generateFAQ,
  generateConclusion,
  generateFullArticle,
  TRANSITION_PHRASES,
  EMPHASIS_PHRASES,
  CTA_PHRASES,
};
