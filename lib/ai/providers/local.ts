/**
 * المولد المحلي المخصص - لا يحتاج APIs خارجية
 * يستخدم قوالب عربية جاهزة مع بيانات ديناميكية
 */

import { getTemplates, type AITemplate } from '@/lib/db/templates';

export interface LocalGenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  variables?: TemplateVariables;
  category?: string;
}

export interface LocalGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'local';
  generationTime: number;
}

export interface TemplateVariables {
  name?: string;
  age?: number;
  birthDate?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  birthstone?: string;
  birthFlower?: string;
  luckyNumber?: number;
  luckyColor?: string;
  historicalEvents?: string[];
  celebrities?: string[];
  [key: string]: any;
}

// بيانات الأبراج
const zodiacData: Record<string, any> = {
  الحمل: {
    element: 'ناري',
    traits: 'الشجاعة والحماس والقيادة',
    dates: '21 مارس - 19 أبريل',
  },
  الثور: {
    element: 'ترابي',
    traits: 'الصبر والإخلاص والعملية',
    dates: '20 أبريل - 20 مايو',
  },
  الجوزاء: {
    element: 'هوائي',
    traits: 'الذكاء والتواصل والمرونة',
    dates: '21 مايو - 20 يونيو',
  },
  السرطان: {
    element: 'مائي',
    traits: 'العاطفة والحنان والحدس',
    dates: '21 يونيو - 22 يوليو',
  },
  الأسد: {
    element: 'ناري',
    traits: 'الكرم والإبداع والثقة',
    dates: '23 يوليو - 22 أغسطس',
  },
  العذراء: {
    element: 'ترابي',
    traits: 'الدقة والتحليل والتواضع',
    dates: '23 أغسطس - 22 سبتمبر',
  },
  الميزان: {
    element: 'هوائي',
    traits: 'العدل والدبلوماسية والجمال',
    dates: '23 سبتمبر - 22 أكتوبر',
  },
  العقرب: {
    element: 'مائي',
    traits: 'العمق والغموض والإصرار',
    dates: '23 أكتوبر - 21 نوفمبر',
  },
  القوس: {
    element: 'ناري',
    traits: 'التفاؤل والمغامرة والحرية',
    dates: '22 نوفمبر - 21 ديسمبر',
  },
  الجدي: {
    element: 'ترابي',
    traits: 'الطموح والمسؤولية والانضباط',
    dates: '22 ديسمبر - 19 يناير',
  },
  الدلو: {
    element: 'هوائي',
    traits: 'الابتكار والاستقلالية والإنسانية',
    dates: '20 يناير - 18 فبراير',
  },
  الحوت: {
    element: 'مائي',
    traits: 'الحساسية والخيال والرحمة',
    dates: '19 فبراير - 20 مارس',
  },
};

// أحجار الميلاد
const birthstoneData: Record<number, { name: string; meaning: string }> = {
  1: { name: 'العقيق', meaning: 'الحماية والقوة' },
  2: { name: 'الجمشت', meaning: 'الحكمة والصفاء' },
  3: { name: 'الزبرجد', meaning: 'الشجاعة والهدوء' },
  4: { name: 'الماس', meaning: 'الخلود والنقاء' },
  5: { name: 'الزمرد', meaning: 'الحب والتجدد' },
  6: { name: 'اللؤلؤ', meaning: 'النقاء والحكمة' },
  7: { name: 'الياقوت', meaning: 'الحب والعاطفة' },
  8: { name: 'الزبرجد الأخضر', meaning: 'القوة والحماية' },
  9: { name: 'الياقوت الأزرق', meaning: 'الحقيقة والإخلاص' },
  10: { name: 'الأوبال', meaning: 'الأمل والإبداع' },
  11: { name: 'التوباز', meaning: 'الصداقة والقوة' },
  12: { name: 'الفيروز', meaning: 'الحظ والنجاح' },
};

// زهور الميلاد
const birthFlowerData: Record<number, { name: string; meaning: string }> = {
  1: { name: 'القرنفل', meaning: 'الحب والإعجاب' },
  2: { name: 'البنفسج', meaning: 'الوفاء والتواضع' },
  3: { name: 'النرجس', meaning: 'البدايات الجديدة' },
  4: { name: 'البازلاء الحلوة', meaning: 'السعادة والمتعة' },
  5: { name: 'زنبق الوادي', meaning: 'السعادة والتواضع' },
  6: { name: 'الورد', meaning: 'الحب والجمال' },
  7: { name: 'الدلفينيوم', meaning: 'الكرم والمرح' },
  8: { name: 'الغلاديولس', meaning: 'القوة والنزاهة' },
  9: { name: 'زهرة النجمة', meaning: 'الحب والصبر' },
  10: { name: 'القطيفة', meaning: 'الدفء والإبداع' },
  11: { name: 'الأقحوان', meaning: 'الصداقة والفرح' },
  12: { name: 'البونسيتيا', meaning: 'النجاح والاحتفال' },
};

// عبارات تهنئة متنوعة
const greetings = [
  'كل عام وأنت بخير',
  'عيد ميلاد سعيد',
  'أتمنى لك عاماً مليئاً بالسعادة',
  'عام جديد مليء بالنجاحات',
  'أجمل التهاني بمناسبة عيد ميلادك',
];

// فقرات إضافية للمقالات الطويلة مع دعم RTL للعربية
const additionalParagraphs = {
  birthday: [
    `<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">أهمية الاحتفال بعيد الميلاد</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">يعتبر عيد الميلاد مناسبة خاصة للاحتفال بالحياة والتأمل في الإنجازات. إنه يوم للتقدير والامتنان لكل ما حققناه خلال العام الماضي.</p>`,
    `<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">تقاليد الاحتفال بعيد الميلاد</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">تختلف تقاليد الاحتفال بعيد الميلاد من ثقافة لأخرى، لكنها جميعاً تشترك في روح الفرح والاحتفال. من الكيك والشموع إلى الهدايا والتمنيات الطيبة.</p>`,
    `<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">نصائح لعيد ميلاد مميز</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">لجعل عيد ميلادك مميزاً، احرص على قضاء الوقت مع أحبائك، وتذكر أن تقدر كل لحظة. اجعل هذا اليوم فرصة للتفكير في أهدافك وأحلامك للعام القادم.</p>`,
  ],
  zodiac: [
    `<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">التوافق في العلاقات</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">يلعب البرج دوراً مهماً في فهم التوافق بين الأشخاص. معرفة خصائص برجك يساعدك على فهم نفسك وعلاقاتك بشكل أفضل.</p>`,
    `<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">تأثير الكواكب</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">تؤثر حركة الكواكب على طاقة كل برج بطريقة مختلفة. فهم هذه التأثيرات يساعدك على اتخاذ قرارات أفضل في حياتك.</p>`,
  ],
};

// استبدال المتغيرات في القالب
function replaceVariables(
  template: string,
  variables: TemplateVariables
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    if (Array.isArray(value)) {
      result = result.replace(
        regex,
        value.map((v) => `<li>${v}</li>`).join('\n')
      );
    } else {
      result = result.replace(regex, String(value || ''));
    }
  }

  return result;
}

// توليد عنوان من الموضوع
function generateTitle(topic: string, variables: TemplateVariables): string {
  if (variables.name && variables.age) {
    return `${variables.name} يحتفل بعيد ميلاده الـ ${variables.age} - كل ما تريد معرفته`;
  }
  if (variables.zodiacSign) {
    return `برج ${variables.zodiacSign} - صفاته وتوافقه وحظه`;
  }
  return `${topic} - دليلك الشامل`;
}

// توليد ميتا من المحتوى
function generateMetaFromContent(
  content: string,
  title: string
): { metaTitle: string; metaDescription: string } {
  const metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

  // استخراج أول فقرة نصية
  const textMatch = content.match(/<p>(.*?)<\/p>/);
  const firstParagraph = textMatch ? textMatch[1].replace(/<[^>]*>/g, '') : '';
  const metaDescription =
    firstParagraph.length > 160
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;

  return { metaTitle, metaDescription };
}

// استخراج كلمات مفتاحية
function extractKeywords(content: string, topic: string): string[] {
  const keywords = new Set<string>();

  // إضافة الموضوع
  keywords.add(topic);

  // كلمات شائعة
  const commonKeywords = ['عيد ميلاد', 'برج', 'حظ', 'توافق', 'صفات', 'شخصية'];
  commonKeywords.forEach((k) => {
    if (content.includes(k)) keywords.add(k);
  });

  // الأبراج
  Object.keys(zodiacData).forEach((z) => {
    if (content.includes(z)) keywords.add(z);
  });

  return Array.from(keywords).slice(0, 15);
}

// توليد مقال باستخدام القوالب المحلية
export async function generateArticle(
  request: LocalGenerationRequest
): Promise<LocalGenerationResponse> {
  const startTime = Date.now();

  // تحديد نوع القالب
  let category: AITemplate['category'] = 'general';
  if (request.topic.includes('عيد ميلاد') || request.topic.includes('ميلاد')) {
    category = 'birthday';
  } else if (
    request.topic.includes('برج') ||
    Object.keys(zodiacData).some((z) => request.topic.includes(z))
  ) {
    category = 'zodiac';
  } else if (request.topic.includes('عمر') || request.topic.includes('سنة')) {
    category = 'age';
  }

  // جلب القوالب المناسبة
  const templates = await getTemplates({ category, activeOnly: true });

  if (templates.length === 0) {
    // استخدام قالب افتراضي
    return generateDefaultArticle(request, startTime);
  }

  // اختيار قالب عشوائي
  const template = templates[Math.floor(Math.random() * templates.length)];

  // تجهيز المتغيرات
  const variables = prepareVariables(request.variables || {}, request.topic);

  // استبدال المتغيرات
  let content = replaceVariables(template.template_content, variables);

  // إضافة فقرات إضافية للمقالات الطويلة
  if (request.length === 'long' || request.length === 'comprehensive') {
    const extraParagraphs =
      additionalParagraphs[category as keyof typeof additionalParagraphs] || [];
    content += '\n\n' + extraParagraphs.join('\n\n');
  }

  // توليد العنوان
  const title = variables.title || generateTitle(request.topic, variables);

  // توليد الميتا
  const { metaTitle, metaDescription } = generateMetaFromContent(
    content,
    title
  );

  // استخراج الكلمات المفتاحية
  const keywords = extractKeywords(content, request.topic);

  return {
    content,
    title,
    metaTitle,
    metaDescription,
    keywords,
    wordCount: content.split(/\s+/).length,
    provider: 'local',
    generationTime: Date.now() - startTime,
  };
}

// تجهيز المتغيرات مع القيم الافتراضية
function prepareVariables(
  vars: TemplateVariables,
  topic: string
): TemplateVariables {
  const now = new Date();
  const month = now.getMonth() + 1;

  // تحديد البرج من الموضوع
  let zodiacSign = vars.zodiacSign;
  if (!zodiacSign) {
    for (const sign of Object.keys(zodiacData)) {
      if (topic.includes(sign)) {
        zodiacSign = sign;
        break;
      }
    }
  }

  const zodiac = zodiacSign ? zodiacData[zodiacSign] : null;
  const birthstone = birthstoneData[month];
  const birthFlower = birthFlowerData[month];

  // توليد محتوى للمتغيرات العامة
  const introduction = `نقدم لكم اليوم مقالاً شاملاً ومفصلاً عن ${topic}. هذا الموضوع يهم الكثير من القراء ونأمل أن تجدوا فيه كل ما تبحثون عنه من معلومات قيمة ومفيدة.`;

  const mainContent = `<p>يعتبر موضوع ${topic} من المواضيع المهمة التي تستحق الاهتمام والدراسة. هناك العديد من الجوانب التي يجب مراعاتها عند التعامل مع هذا الموضوع.</p>
<p>من أهم النقاط التي يجب معرفتها:</p>
<ul>
<li>الفهم الصحيح للموضوع وأبعاده المختلفة</li>
<li>التطبيق العملي للمعلومات المكتسبة</li>
<li>الاستفادة من تجارب الآخرين في هذا المجال</li>
<li>متابعة آخر المستجدات والتطورات</li>
</ul>
<p>كما أن هناك العديد من الفوائد التي يمكن الحصول عليها من خلال الاهتمام بهذا الموضوع، منها تطوير المهارات الشخصية وزيادة المعرفة.</p>`;

  const additionalInfo = `<p>بالإضافة إلى ما سبق، هناك معلومات إضافية مهمة يجب الإشارة إليها:</p>
<ul>
<li>يُنصح بالاطلاع على المصادر الموثوقة للحصول على معلومات دقيقة</li>
<li>من المفيد مشاركة هذه المعلومات مع الآخرين</li>
<li>التطبيق العملي هو أفضل طريقة للتعلم</li>
</ul>`;

  const conclusion = `في الختام، نأمل أن يكون هذا المقال قد أفادكم وقدم لكم معلومات قيمة عن ${topic}. لا تترددوا في ترك تعليقاتكم وأسئلتكم، وشاركوا المقال مع من يهمه الأمر.`;

  return {
    ...vars,
    name: vars.name || 'صاحب/ة المناسبة',
    age: vars.age || 25,
    birthDate: vars.birthDate || now.toLocaleDateString('ar-SA'),
    zodiacSign: zodiacSign || 'الحمل',
    zodiacTraits: zodiac?.traits || 'صفات مميزة',
    zodiacElement: zodiac?.element || 'ناري',
    zodiacStartDate: zodiac?.dates?.split(' - ')[0] || '',
    zodiacEndDate: zodiac?.dates?.split(' - ')[1] || '',
    birthstone: birthstone?.name || 'حجر كريم',
    birthstoneSymbol: birthstone?.meaning || 'معنى جميل',
    birthFlower: birthFlower?.name || 'زهرة جميلة',
    birthFlowerMeaning: birthFlower?.meaning || 'معنى رائع',
    luckyNumber: vars.luckyNumber || Math.floor(Math.random() * 9) + 1,
    luckyColor: vars.luckyColor || 'الأزرق',
    historicalEvents: vars.historicalEvents || [
      'حدث تاريخي مهم',
      'اكتشاف علمي',
      'إنجاز رياضي',
    ],
    celebrities: vars.celebrities || [
      'شخصية مشهورة',
      'فنان معروف',
      'رياضي بارز',
    ],
    title: vars.title || topic,
    greeting: greetings[Math.floor(Math.random() * greetings.length)],
    // متغيرات القالب العام
    introduction,
    mainContent,
    additionalInfo,
    conclusion,
  };
}

// توليد مقال افتراضي عند عدم وجود قوالب مع دعم RTL للعربية
function generateDefaultArticle(
  request: LocalGenerationRequest,
  startTime: number
): LocalGenerationResponse {
  const variables = prepareVariables(request.variables || {}, request.topic);

  const content = `
<h1 class="text-3xl font-bold mb-6 text-right" dir="rtl">${request.topic}</h1>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">مقدمة</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">${variables.greeting}! نقدم لكم اليوم مقالاً شاملاً عن ${request.topic}. هذا الموضوع يهم الكثيرين ونأمل أن تجدوا فيه ما يفيدكم.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">معلومات أساسية</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">يعتبر هذا الموضوع من المواضيع المهمة التي تستحق الاهتمام. سنتناول في هذا المقال جوانب متعددة تساعدكم على فهم أعمق.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">تفاصيل مهمة</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">هناك العديد من النقاط التي يجب مراعاتها عند التعامل مع هذا الموضوع. من أهمها الفهم الصحيح والتطبيق العملي.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">نصائح وإرشادات</h2>
<ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
<li class="text-right leading-relaxed">احرص على الاستفادة من المعلومات المقدمة</li>
<li class="text-right leading-relaxed">شارك هذا المقال مع من يهمه الأمر</li>
<li class="text-right leading-relaxed">تابعنا للمزيد من المقالات المفيدة</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">خاتمة</h2>
<p class="text-right leading-relaxed mb-4" dir="rtl">نتمنى أن يكون هذا المقال قد أفادكم. لا تترددوا في ترك تعليقاتكم وأسئلتكم.</p>
`;

  const title = request.topic;
  const { metaTitle, metaDescription } = generateMetaFromContent(
    content,
    title
  );

  return {
    content,
    title,
    metaTitle,
    metaDescription,
    keywords: extractKeywords(content, request.topic),
    wordCount: content.split(/\s+/).length,
    provider: 'local',
    generationTime: Date.now() - startTime,
  };
}

// إعادة صياغة محلية باستخدام المرادفات
export async function rewriteContent(
  content: string,
  style: string
): Promise<{
  original: string;
  rewritten: string;
  wordCount: number;
  provider: 'local';
}> {
  // قاموس المرادفات
  const synonyms: Record<string, string[]> = {
    جميل: ['رائع', 'بديع', 'ساحر', 'فاتن'],
    كبير: ['ضخم', 'هائل', 'عظيم', 'واسع'],
    صغير: ['ضئيل', 'قليل', 'محدود', 'بسيط'],
    سعيد: ['مبتهج', 'فرح', 'مسرور', 'منشرح'],
    مهم: ['ضروري', 'أساسي', 'جوهري', 'حيوي'],
    يقول: ['يذكر', 'يصرح', 'يوضح', 'يبين'],
    يعمل: ['يشتغل', 'يمارس', 'ينجز', 'يؤدي'],
    يريد: ['يرغب', 'يتمنى', 'يود', 'يطمح'],
    جيد: ['ممتاز', 'حسن', 'طيب', 'مناسب'],
    سيء: ['رديء', 'ضعيف', 'متدني', 'غير مناسب'],
  };

  let rewritten = content;

  // استبدال المرادفات
  for (const [word, alternatives] of Object.entries(synonyms)) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const replacement =
      alternatives[Math.floor(Math.random() * alternatives.length)];
    rewritten = rewritten.replace(regex, replacement);
  }

  // تعديل بسيط حسب النمط
  if (style === 'formal') {
    rewritten = rewritten.replace(/أنت/g, 'حضرتك');
    rewritten = rewritten.replace(/أنتم/g, 'حضراتكم');
  } else if (style === 'simplified') {
    rewritten = rewritten.replace(/بالإضافة إلى ذلك/g, 'كمان');
    rewritten = rewritten.replace(/علاوة على ذلك/g, 'وكمان');
  }

  return {
    original: content,
    rewritten,
    wordCount: rewritten.split(/\s+/).length,
    provider: 'local',
  };
}

// توليد عناوين محلياً
export async function generateTitles(
  topic: string,
  count: number = 10
): Promise<string[]> {
  const templates = [
    `${topic} - دليلك الشامل`,
    `كل ما تريد معرفته عن ${topic}`,
    `${topic}: معلومات مهمة ونصائح قيمة`,
    `اكتشف أسرار ${topic}`,
    `${topic} - حقائق ومعلومات مذهلة`,
    `دليل ${topic} الكامل`,
    `${topic}: ما لا تعرفه`,
    `أهم المعلومات عن ${topic}`,
    `${topic} - نظرة شاملة`,
    `تعرف على ${topic} بالتفصيل`,
    `${topic}: الدليل النهائي`,
    `كيف تفهم ${topic} بسهولة`,
  ];

  return templates.slice(0, count);
}

export default {
  generateArticle,
  rewriteContent,
  generateTitles,
};
