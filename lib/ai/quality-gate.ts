/**
 * بوابة الجودة للتحقق من اكتمال المحتوى
 * يضمن أن المقالات مكتملة وغير مقطوعة
 */

export type ArticleLength = 'short' | 'medium' | 'long' | 'comprehensive';

// حدود عدد الكلمات الصارمة
export const WORD_COUNT_LIMITS: Record<
  ArticleLength,
  { min: number; max: number; target: number }
> = {
  short: { min: 800, max: 1200, target: 1000 },
  medium: { min: 2000, max: 3000, target: 2500 },
  long: { min: 3500, max: 4500, target: 4000 },
  comprehensive: { min: 5000, max: 6000, target: 5500 },
};

// توزيع الأقسام حسب طول المقال
export const SECTION_DISTRIBUTION: Record<
  ArticleLength,
  {
    intro: { words: number; paragraphs: number };
    sections: { count: number; wordsEach: number };
    faq: { count: number; wordsEach: number };
    conclusion: { words: number; paragraphs: number };
  }
> = {
  short: {
    intro: { words: 100, paragraphs: 1 },
    sections: { count: 4, wordsEach: 150 },
    faq: { count: 3, wordsEach: 50 },
    conclusion: { words: 100, paragraphs: 1 },
  },
  medium: {
    intro: { words: 200, paragraphs: 2 },
    sections: { count: 6, wordsEach: 300 },
    faq: { count: 5, wordsEach: 60 },
    conclusion: { words: 200, paragraphs: 2 },
  },
  long: {
    intro: { words: 300, paragraphs: 3 },
    sections: { count: 10, wordsEach: 350 },
    faq: { count: 7, wordsEach: 70 },
    conclusion: { words: 300, paragraphs: 3 },
  },
  comprehensive: {
    intro: { words: 400, paragraphs: 4 },
    sections: { count: 15, wordsEach: 350 },
    faq: { count: 10, wordsEach: 80 },
    conclusion: { words: 400, paragraphs: 4 },
  },
};

export interface QualityConfig {
  targetLength: ArticleLength;
  requiredSections?: string[];
  minKeywordDensity?: number;
  maxKeywordDensity?: number;
  requiredKeywords?: string[];
}

export interface QualityResult {
  passed: boolean;
  score: number;
  wordCount: number;
  wordCountStatus: 'below' | 'ok' | 'above';
  missingSections: string[];
  keywordDensity: number;
  structureScore: number;
  completenessScore: number;
  suggestions: string[];
}

/**
 * حساب عدد الكلمات في النص
 */
export function countWords(content: string): number {
  // إزالة HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');
  // تقسيم على المسافات وتصفية الكلمات الفارغة
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * التحقق من جودة المحتوى
 */
export function validateQuality(
  content: string,
  config: QualityConfig
): QualityResult {
  const wordCount = countWords(content);
  const limits = WORD_COUNT_LIMITS[config.targetLength];

  // تحديد حالة عدد الكلمات
  let wordCountStatus: 'below' | 'ok' | 'above' = 'ok';
  if (wordCount < limits.min) {
    wordCountStatus = 'below';
  } else if (wordCount > limits.max) {
    wordCountStatus = 'above';
  }

  // التحقق من الأقسام المطلوبة
  const defaultRequiredSections = ['مقدمة', 'الخاتمة'];
  const requiredSections = config.requiredSections || defaultRequiredSections;
  const missingSections: string[] = [];

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      missingSections.push(section);
    }
  }

  // حساب كثافة الكلمات المفتاحية
  let keywordDensity = 0;
  if (config.requiredKeywords && config.requiredKeywords.length > 0) {
    let keywordCount = 0;
    const lowerContent = content.toLowerCase();

    for (const keyword of config.requiredKeywords) {
      const matches = lowerContent.match(
        new RegExp(keyword.toLowerCase(), 'g')
      );
      keywordCount += matches ? matches.length : 0;
    }

    keywordDensity = (keywordCount / wordCount) * 100;
  }

  // حساب نقاط البنية
  const structureScore = calculateStructureScore(content, config.targetLength);

  // حساب نقاط الاكتمال
  const completenessScore = calculateCompletenessScore(
    content,
    config.targetLength
  );

  // حساب النقاط الإجمالية
  let score = 0;

  // نقاط عدد الكلمات (40%)
  if (wordCountStatus === 'ok') {
    score += 40;
  } else if (wordCountStatus === 'below') {
    const ratio = wordCount / limits.min;
    score += Math.floor(40 * ratio);
  } else {
    score += 30; // أكثر من المطلوب - مقبول
  }

  // نقاط الأقسام (20%)
  const sectionScore =
    ((requiredSections.length - missingSections.length) /
      requiredSections.length) *
    20;
  score += sectionScore;

  // نقاط البنية (20%)
  score += (structureScore / 100) * 20;

  // نقاط الاكتمال (20%)
  score += (completenessScore / 100) * 20;

  // تحديد ما إذا كان المحتوى يمر
  const passed =
    score >= 70 && wordCountStatus !== 'below' && missingSections.length === 0;

  // توليد الاقتراحات
  const suggestions: string[] = [];

  if (wordCountStatus === 'below') {
    suggestions.push(
      `المحتوى قصير جداً (${wordCount} كلمة). المطلوب: ${limits.min}-${limits.max} كلمة`
    );
  }

  if (missingSections.length > 0) {
    suggestions.push(`أقسام مفقودة: ${missingSections.join('، ')}`);
  }

  if (structureScore < 70) {
    suggestions.push('يُنصح بتحسين بنية المقال (إضافة عناوين فرعية وقوائم)');
  }

  if (completenessScore < 70) {
    suggestions.push(
      'المحتوى يبدو غير مكتمل - يُنصح بإضافة المزيد من التفاصيل'
    );
  }

  return {
    passed,
    score: Math.round(score),
    wordCount,
    wordCountStatus,
    missingSections,
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    structureScore,
    completenessScore,
    suggestions,
  };
}

/**
 * حساب نقاط البنية
 */
function calculateStructureScore(
  content: string,
  length: ArticleLength
): number {
  let score = 0;
  const distribution = SECTION_DISTRIBUTION[length];

  // التحقق من وجود H2
  const h2Count = (content.match(/<h2/g) || []).length;
  const expectedH2 = distribution.sections.count;
  const h2Ratio = Math.min(h2Count / expectedH2, 1);
  score += h2Ratio * 30;

  // التحقق من وجود H3
  const h3Count = (content.match(/<h3/g) || []).length;
  if (h3Count > 0) score += 15;

  // التحقق من وجود قوائم
  const hasLists = content.includes('<ul>') || content.includes('<ol>');
  if (hasLists) score += 15;

  // التحقق من وجود فقرات كافية
  const pCount = (content.match(/<p>/g) || []).length;
  const expectedP =
    distribution.intro.paragraphs +
    distribution.sections.count * 2 +
    distribution.conclusion.paragraphs;
  const pRatio = Math.min(pCount / expectedP, 1);
  score += pRatio * 20;

  // التحقق من وجود FAQ
  const hasFaq =
    content.includes('الأسئلة الشائعة') || content.includes('أسئلة شائعة');
  if (hasFaq) score += 10;

  // التحقق من وجود خاتمة
  const hasConclusion =
    content.includes('الخاتمة') || content.includes('في الختام');
  if (hasConclusion) score += 10;

  return Math.min(score, 100);
}

/**
 * حساب نقاط الاكتمال
 */
function calculateCompletenessScore(
  content: string,
  length: ArticleLength
): number {
  let score = 0;
  const limits = WORD_COUNT_LIMITS[length];
  const wordCount = countWords(content);

  // نقاط عدد الكلمات
  if (wordCount >= limits.min) {
    score += 40;
  } else {
    score += (wordCount / limits.min) * 40;
  }

  // التحقق من عدم القطع المفاجئ
  const lastParagraph = content.match(/<p>([^<]+)<\/p>\s*$/);
  if (lastParagraph) {
    const lastText = lastParagraph[1];
    // التحقق من أن الفقرة الأخيرة تنتهي بشكل صحيح
    if (
      lastText.endsWith('.') ||
      lastText.endsWith('!') ||
      lastText.endsWith('؟')
    ) {
      score += 20;
    }
  }

  // التحقق من وجود مقدمة
  const hasIntro =
    content.includes('مقدمة') || content.match(/<h2[^>]*>.*مقدمة.*<\/h2>/i);
  if (hasIntro) score += 15;

  // التحقق من وجود خاتمة
  const hasConclusion =
    content.includes('الخاتمة') || content.includes('في الختام');
  if (hasConclusion) score += 15;

  // التحقق من التنوع في المحتوى
  const hasVariety = content.includes('<ul>') && content.includes('<h3>');
  if (hasVariety) score += 10;

  return Math.min(score, 100);
}

/**
 * توسيع المحتوى إذا كان ناقصاً
 */
export function expandContent(
  content: string,
  targetWords: number,
  topic: string,
  category: string
): string {
  const currentWords = countWords(content);

  if (currentWords >= targetWords) {
    return content;
  }

  const wordsNeeded = targetWords - currentWords;
  let expandedContent = content;

  // إضافة فقرات إضافية
  const additionalParagraphs = generateAdditionalParagraphs(
    topic,
    category,
    wordsNeeded
  );

  // إدراج الفقرات قبل الخاتمة
  if (expandedContent.includes('<h2>الخاتمة</h2>')) {
    expandedContent = expandedContent.replace(
      '<h2>الخاتمة</h2>',
      additionalParagraphs + '\n\n<h2>الخاتمة</h2>'
    );
  } else {
    // إضافة في النهاية
    expandedContent += '\n\n' + additionalParagraphs;
  }

  return expandedContent;
}

/**
 * توليد فقرات إضافية
 */
function generateAdditionalParagraphs(
  topic: string,
  category: string,
  wordsNeeded: number
): string {
  const paragraphs: string[] = [];
  let wordsAdded = 0;

  // قوالب الفقرات الإضافية حسب الفئة
  const templates: Record<string, string[]> = {
    birthday: [
      `<h2>نصائح إضافية للاحتفال</h2>
<p>لجعل الاحتفال أكثر تميزاً، يمكنك التفكير في إضافة لمسات شخصية تعكس اهتمامات المحتفى به. سواء كان ذلك من خلال اختيار موضوع معين للحفلة أو تحضير أنشطة ممتعة تناسب الجميع.</p>
<p>من المهم أيضاً التخطيط المسبق للحفلة لضمان سير الأمور بسلاسة. قم بإعداد قائمة بالمدعوين وتأكد من إرسال الدعوات في وقت مبكر.</p>`,
      `<h2>أفكار للهدايا المميزة</h2>
<p>اختيار الهدية المناسبة يمكن أن يكون تحدياً، لكن مع بعض التفكير يمكنك إيجاد هدية مثالية. فكر في اهتمامات الشخص وهواياته، واختر شيئاً يعكس معرفتك به.</p>
<ul>
<li>الهدايا الشخصية المخصصة</li>
<li>التجارب والمغامرات</li>
<li>الكتب والمجلات</li>
<li>الأدوات التقنية</li>
</ul>`,
      `<h2>تقاليد الاحتفال حول العالم</h2>
<p>تختلف تقاليد الاحتفال بأعياد الميلاد من ثقافة لأخرى، مما يضيف تنوعاً وغنى لهذه المناسبة. في بعض الثقافات، يُعتبر عيد الميلاد مناسبة عائلية حميمة، بينما في أخرى يكون احتفالاً كبيراً مع الأصدقاء.</p>`,
    ],
    zodiac: [
      `<h2>تأثير الكواكب على البرج</h2>
<p>تلعب الكواكب دوراً مهماً في تشكيل خصائص كل برج. فهم هذه التأثيرات يساعدك على فهم نفسك بشكل أفضل واتخاذ قرارات أكثر وعياً في حياتك.</p>
<p>كل كوكب يحمل طاقة معينة تؤثر على جوانب مختلفة من الشخصية والحياة.</p>`,
      `<h2>نصائح للتعامل مع طاقة البرج</h2>
<p>لتحقيق أقصى استفادة من طاقة برجك، من المهم فهم نقاط قوتك والعمل على تطويرها، مع الوعي بنقاط الضعف والسعي لتحسينها.</p>
<ul>
<li>التأمل والتواصل مع الذات</li>
<li>ممارسة الأنشطة التي تناسب طاقة برجك</li>
<li>بناء علاقات متوازنة</li>
</ul>`,
    ],
    health: [
      `<h2>نصائح صحية إضافية</h2>
<p>الحفاظ على صحة جيدة يتطلب اهتماماً مستمراً بعدة جوانب من حياتنا. من التغذية السليمة إلى النشاط البدني المنتظم، كل عنصر يلعب دوراً مهماً.</p>
<p>لا تنسَ أهمية النوم الكافي والراحة النفسية في الحفاظ على صحتك العامة.</p>`,
    ],
    pregnancy: [
      `<h2>نصائح للحامل</h2>
<p>فترة الحمل هي وقت مميز يتطلب عناية خاصة. من المهم المتابعة المنتظمة مع الطبيب والاهتمام بالتغذية السليمة.</p>
<p>استمعي لجسمك واحصلي على الراحة الكافية، ولا تترددي في طلب المساعدة عند الحاجة.</p>`,
    ],
    general: [
      `<h2>معلومات إضافية</h2>
<p>هناك العديد من الجوانب المهمة التي يجب مراعاتها عند التعامل مع هذا الموضوع. الفهم الشامل يساعدك على اتخاذ قرارات أفضل.</p>
<p>نأمل أن تكون هذه المعلومات مفيدة لك في رحلتك لفهم هذا الموضوع بشكل أعمق.</p>`,
    ],
  };

  const categoryTemplates = templates[category] || templates.general;

  for (const template of categoryTemplates) {
    if (wordsAdded >= wordsNeeded) break;

    paragraphs.push(template);
    wordsAdded += countWords(template);
  }

  return paragraphs.join('\n\n');
}

/**
 * التأكد من اكتمال المحتوى
 */
export function ensureCompleteness(
  content: string,
  length: ArticleLength
): string {
  let result = content;

  // التأكد من وجود مقدمة
  if (!result.includes('مقدمة')) {
    const introMatch = result.match(/<h2[^>]*>/);
    if (introMatch) {
      result = result.replace(
        introMatch[0],
        '<h2>مقدمة</h2>\n<p>نقدم لكم في هذا المقال معلومات شاملة ومفيدة.</p>\n\n' +
          introMatch[0]
      );
    }
  }

  // التأكد من وجود خاتمة
  if (!result.includes('الخاتمة') && !result.includes('في الختام')) {
    result += `\n\n<h2>الخاتمة</h2>
<p>نأمل أن يكون هذا المقال قد أفادكم وقدم لكم المعلومات التي تبحثون عنها. شاركوا المقال مع أصدقائكم وتابعونا للمزيد من المقالات المفيدة.</p>`;
  }

  // التأكد من أن المحتوى لا ينتهي بشكل مفاجئ
  const lastParagraph = result.match(/<p>([^<]+)<\/p>\s*$/);
  if (lastParagraph) {
    const lastText = lastParagraph[1];
    if (
      !lastText.endsWith('.') &&
      !lastText.endsWith('!') &&
      !lastText.endsWith('؟')
    ) {
      result = result.replace(lastParagraph[0], `<p>${lastText}.</p>`);
    }
  }

  return result;
}

/**
 * تقليص المحتوى إذا كان طويلاً جداً
 */
export function trimContent(content: string, maxWords: number): string {
  const currentWords = countWords(content);

  if (currentWords <= maxWords) {
    return content;
  }

  // البحث عن نقطة قطع مناسبة
  const sections = content.split(/<h2/);
  let trimmedContent = '';
  let wordsCount = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = i === 0 ? sections[i] : '<h2' + sections[i];
    const sectionWords = countWords(section);

    if (wordsCount + sectionWords <= maxWords) {
      trimmedContent += section;
      wordsCount += sectionWords;
    } else {
      // إضافة الخاتمة إذا لم تكن موجودة
      if (!trimmedContent.includes('الخاتمة')) {
        trimmedContent += `\n\n<h2>الخاتمة</h2>
<p>نأمل أن يكون هذا المقال قد أفادكم. تابعونا للمزيد من المقالات المفيدة.</p>`;
      }
      break;
    }
  }

  return trimmedContent;
}

export default {
  WORD_COUNT_LIMITS,
  SECTION_DISTRIBUTION,
  countWords,
  validateQuality,
  expandContent,
  ensureCompleteness,
  trimContent,
};
