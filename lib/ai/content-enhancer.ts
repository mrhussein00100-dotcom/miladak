/**
 * Content Enhancer - نظام تحسين المحتوى المولد
 * Version 1.0
 *
 * يشمل:
 * - تحسين جودة الفقرات
 * - تنوع العناوين SEO
 * - منع قطع المقالات
 * - التحقق من اكتمال المحتوى
 */

// ===== أنماط العناوين المتنوعة =====
export const SEO_TITLE_PATTERNS: Record<string, string[]> = {
  birthday: [
    // أنماط الأسئلة
    'كيف تحتفل بـ{topic}؟ دليلك الشامل {year}',
    'ما هي أفضل طريقة للاحتفال بـ{topic}؟',
    'هل تبحث عن أفكار لـ{topic}؟ إليك الدليل الكامل',
    'كيف تجعل {topic} مميزاً ولا يُنسى؟',
    'ما الذي يجعل {topic} استثنائياً؟',

    // أنماط القوائم
    '10 أفكار رائعة لـ{topic} في {year}',
    '15 طريقة مبتكرة للاحتفال بـ{topic}',
    '7 نصائح ذهبية لـ{topic} مثالي',
    '20 فكرة إبداعية لـ{topic}',
    '5 أسرار لـ{topic} لا يُنسى',

    // أنماط الدليل الشامل
    'دليلك الشامل لـ{topic} - كل ما تحتاج معرفته',
    '{topic}: الدليل الكامل للاحتفال {year}',
    'كل شيء عن {topic} - معلومات وأفكار ونصائح',
    '{topic} - دليل شامل مع أفكار وهدايا',

    // أنماط التهنئة
    'أجمل تهاني {topic} - رسائل وعبارات مميزة',
    'رسائل تهنئة {topic} - أجمل الكلمات والعبارات',
    'عبارات {topic} المميزة - تهاني من القلب',

    // أنماط الأفكار
    'أفكار {topic} الإبداعية - اجعله يوماً مميزاً',
    '{topic}: أفكار وهدايا وديكورات رائعة',
    'أفضل أفكار {topic} لعام {year}',

    // أنماط المقارنة
    '{topic} التقليدي vs العصري - أيهما أفضل؟',
    'مقارنة شاملة: أفضل طرق الاحتفال بـ{topic}',

    // أنماط النصائح
    'نصائح خبراء الحفلات لـ{topic} مثالي',
    'أسرار نجاح {topic} من المحترفين',
    'خطوة بخطوة: كيف تخطط لـ{topic}',

    // أنماط جديدة ومتنوعة
    '{topic} {year}: أحدث الأفكار والتريندات',
    'اجعل {topic} لا يُنسى - دليل {year}',
    '{topic} المثالي: من التخطيط للتنفيذ',
    'كل ما تريد معرفته عن {topic}',
    '{topic}: أفكار، هدايا، وتهاني مميزة',
  ],

  zodiac: [
    // أنماط الصفات
    'صفات {topic} الكاملة - نقاط القوة والضعف',
    'كل ما تريد معرفته عن {topic}',
    '{topic}: الصفات والتوافق والحب',
    'شخصية {topic} - تحليل شامل ومفصل',

    // أنماط التوافق
    'توافق {topic} مع الأبراج الأخرى - دليل {year}',
    '{topic} في الحب: مع من يتوافق؟',
    'أفضل شريك لـ{topic} - دليل التوافق',

    // أنماط التوقعات
    'توقعات {topic} لعام {year} - الحب والعمل والصحة',
    '{topic} {year}: ماذا يخبئ لك الفلك؟',
    'حظ {topic} هذا الشهر - توقعات مفصلة',

    // أنماط الأسئلة
    'هل أنت {topic}؟ اكتشف صفاتك الحقيقية',
    'ما الذي يميز {topic} عن باقي الأبراج؟',
    'لماذا {topic} من أقوى الأبراج؟',

    // أنماط المعلومات
    '{topic}: الحجر الكريم، اللون، والرقم المحظوظ',
    'أسرار {topic} التي لا يعرفها الكثيرون',
    'حقائق مذهلة عن {topic}',

    // أنماط جديدة
    '{topic} في {year}: دليلك الفلكي الشامل',
    'مواليد {topic}: صفات، توافق، وتوقعات',
    'اكتشف عالم {topic} - دليل شامل',
    '{topic}: من أنت حقاً؟',
    'دليل {topic} الكامل للحب والعمل',
  ],

  age: [
    // أنماط الحساب
    'حساب العمر بدقة - {topic}',
    'كيف تحسب {topic} بالضبط؟',
    '{topic}: الطريقة الصحيحة للحساب',

    // أنماط المعلومات
    'كل ما تريد معرفته عن {topic}',
    '{topic} - معلومات شاملة ومفيدة',
    'دليلك الكامل لـ{topic}',

    // أنماط الأدوات
    'أفضل أداة لـ{topic} - دقيقة وسهلة',
    '{topic} أونلاين - حاسبة مجانية',
    'حاسبة {topic} الذكية - نتائج فورية',

    // أنماط الأسئلة
    'كيف أعرف {topic}؟ الطريقة السهلة',
    'هل تريد معرفة {topic}؟ إليك الحل',

    // أنماط جديدة
    '{topic}: حاسبة دقيقة ومعلومات مفيدة',
    'اكتشف {topic} في ثوانٍ',
    '{topic} بالتفصيل - سنوات، شهور، أيام',
  ],

  health: [
    // أنماط المعلومات الصحية
    '{topic}: دليلك الصحي الشامل',
    'كل ما تحتاج معرفته عن {topic}',
    '{topic} - معلومات طبية موثوقة',

    // أنماط النصائح
    'نصائح ذهبية لـ{topic}',
    'كيف تحافظ على {topic}؟',
    'أسرار {topic} الصحية',

    // أنماط الحاسبات
    'حاسبة {topic} - نتائج دقيقة وموثوقة',
    '{topic}: احسب واعرف نتيجتك',
    'أداة {topic} المجانية - استخدمها الآن',

    // أنماط جديدة
    '{topic} {year}: أحدث المعلومات والنصائح',
    'دليل {topic} للمبتدئين والمحترفين',
    '{topic}: من الألف إلى الياء',
  ],

  general: [
    // أنماط عامة
    '{topic}: دليلك الشامل {year}',
    'كل ما تريد معرفته عن {topic}',
    '{topic} - معلومات ونصائح مفيدة',
    'دليل {topic} الكامل',
    '{topic}: أفكار ومعلومات قيمة',

    // أنماط الأسئلة
    'ما هو {topic}؟ شرح مفصل',
    'كيف تستفيد من {topic}؟',
    'لماذا {topic} مهم؟',

    // أنماط القوائم
    '10 حقائق عن {topic}',
    '7 نصائح لـ{topic}',
    '5 أشياء يجب معرفتها عن {topic}',

    // أنماط جديدة
    '{topic} في {year}: كل ما هو جديد',
    'اكتشف عالم {topic}',
    '{topic}: من البداية للاحتراف',
  ],
};

// تتبع الأنماط المستخدمة (في الذاكرة - يمكن نقله لقاعدة البيانات لاحقاً)
const usedPatterns: Map<string, { pattern: string; timestamp: number }[]> =
  new Map();

/**
 * توليد عنوان SEO متنوع
 */
export function generateDiverseSEOTitle(
  topic: string,
  category: string = 'general'
): string {
  const year = new Date().getFullYear();
  const patterns = SEO_TITLE_PATTERNS[category] || SEO_TITLE_PATTERNS.general;

  // الحصول على الأنماط المستخدمة مؤخراً لهذه الفئة
  const categoryKey = category;
  const recentlyUsed = usedPatterns.get(categoryKey) || [];
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  // تصفية الأنماط المستخدمة خلال 30 يوم
  const recentPatterns = recentlyUsed
    .filter((p) => p.timestamp > thirtyDaysAgo)
    .map((p) => p.pattern);

  // استبعاد الأنماط المستخدمة مؤخراً
  const availablePatterns = patterns.filter((p) => !recentPatterns.includes(p));

  // إذا استُنفدت كل الأنماط، استخدم أي نمط
  const patternPool =
    availablePatterns.length > 0 ? availablePatterns : patterns;

  // اختيار نمط عشوائي
  const randomIndex = Math.floor(Math.random() * patternPool.length);
  const selectedPattern = patternPool[randomIndex];

  // تسجيل النمط المستخدم
  if (!usedPatterns.has(categoryKey)) {
    usedPatterns.set(categoryKey, []);
  }
  usedPatterns.get(categoryKey)!.push({
    pattern: selectedPattern,
    timestamp: Date.now(),
  });

  // استبدال المتغيرات
  let title = selectedPattern
    .replace(/{topic}/g, topic)
    .replace(/{year}/g, String(year));

  // التأكد من أن العنوان لا يتجاوز 60 حرف
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  return title;
}

/**
 * تنسيق الفقرات
 */
export function formatParagraphs(content: string): string {
  let result = content;

  // تقسيم الفقرات الطويلة (أكثر من 150 كلمة)
  result = result.replace(/<p>([\s\S]*?)<\/p>/g, (match, text) => {
    const words = text.trim().split(/\s+/);

    if (words.length > 150) {
      // تقسيم إلى فقرات أصغر
      const paragraphs: string[] = [];
      let currentParagraph: string[] = [];

      for (const word of words) {
        currentParagraph.push(word);

        // تقسيم عند نهاية الجملة إذا تجاوزنا 80 كلمة
        if (currentParagraph.length >= 80 && /[.!؟،]$/.test(word)) {
          paragraphs.push(`<p>${currentParagraph.join(' ')}</p>`);
          currentParagraph = [];
        }
      }

      if (currentParagraph.length > 0) {
        paragraphs.push(`<p>${currentParagraph.join(' ')}</p>`);
      }

      return paragraphs.join('\n');
    }

    return match;
  });

  // إضافة تباعد بين الفقرات
  result = result.replace(/<\/p>\s*<p>/g, '</p>\n\n<p>');

  // تنسيق القوائم
  result = result.replace(
    /<ul>\s*/g,
    '<ul class="list-disc list-inside space-y-2 my-4">\n'
  );
  result = result.replace(
    /<ol>\s*/g,
    '<ol class="list-decimal list-inside space-y-2 my-4">\n'
  );

  // تنسيق العناوين
  result = result.replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4">');
  result = result.replace(
    /<h3>/g,
    '<h3 class="text-xl font-semibold mt-6 mb-3">'
  );

  return result;
}

/**
 * التحقق من اكتمال المقال
 */
export function validateArticleCompleteness(content: string): {
  isComplete: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // التحقق من وجود خاتمة
  const hasConclusion =
    /<h2[^>]*>.*?(الخاتمة|الخلاصة|في الختام|ختاماً).*?<\/h2>/i.test(content) ||
    /<p[^>]*>.*?(في الختام|ختاماً|نأمل|نتمنى).*?<\/p>/i.test(content);

  if (!hasConclusion) {
    issues.push('المقال لا يحتوي على خاتمة واضحة');
    suggestions.push('إضافة قسم خاتمة مع ملخص وCTA');
  }

  // التحقق من إغلاق HTML tags
  const openTags = (content.match(/<[a-z]+[^>]*>/gi) || []).length;
  const closeTags = (content.match(/<\/[a-z]+>/gi) || []).length;

  if (openTags !== closeTags) {
    issues.push('بعض علامات HTML غير مغلقة');
    suggestions.push('مراجعة وإغلاق جميع علامات HTML');
  }

  // التحقق من عدد الكلمات
  const wordCount = content
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount < 300) {
    issues.push('المقال قصير جداً');
    suggestions.push('إضافة محتوى إضافي للوصول لـ 500 كلمة على الأقل');
  }

  // التحقق من الفقرة الأخيرة
  const lastParagraph = content.match(/<p[^>]*>([^<]+)<\/p>\s*$/);
  if (lastParagraph) {
    const lastText = lastParagraph[1].trim();
    if (lastText.length < 20 || !/[.!؟]$/.test(lastText)) {
      issues.push('الفقرة الأخيرة قد تكون مقطوعة');
      suggestions.push('التأكد من اكتمال الفقرة الأخيرة');
    }
  }

  return {
    isComplete: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * إصلاح المقال المقطوع
 */
export function fixTruncatedArticle(content: string, topic: string): string {
  let result = content;

  // التحقق من اكتمال المقال
  const validation = validateArticleCompleteness(content);

  if (!validation.isComplete) {
    // إضافة خاتمة إذا لم تكن موجودة
    if (validation.issues.includes('المقال لا يحتوي على خاتمة واضحة')) {
      const conclusion = generateConclusion(topic);
      result += conclusion;
    }

    // إغلاق HTML tags المفتوحة
    result = closeOpenTags(result);
  }

  return result;
}

/**
 * توليد خاتمة
 */
function generateConclusion(topic: string): string {
  const conclusions = [
    `<h2>الخاتمة</h2>
<p>في الختام، نأمل أن يكون هذا المقال قد أفادكم وقدم لكم معلومات قيمة عن ${topic}. شاركوا المقال مع أصدقائكم وتابعونا للمزيد من المقالات المفيدة!</p>`,

    `<h2>الخلاصة</h2>
<p>نتمنى أن تكونوا قد استفدتم من هذا الدليل الشامل عن ${topic}. لا تترددوا في ترك تعليقاتكم وأسئلتكم، ونحن سعداء بمساعدتكم!</p>`,

    `<h2>ختاماً</h2>
<p>هكذا نكون قد استعرضنا معكم كل ما يتعلق بـ${topic}. نأمل أن تكون المعلومات مفيدة لكم. شاركونا آراءكم في التعليقات!</p>`,
  ];

  return conclusions[Math.floor(Math.random() * conclusions.length)];
}

/**
 * إغلاق HTML tags المفتوحة
 */
function closeOpenTags(html: string): string {
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-z]+)[^>]*>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    // تجاهل self-closing tags
    if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
      continue;
    }

    if (fullTag.startsWith('</')) {
      // closing tag
      const lastOpen = tagStack.pop();
      if (lastOpen !== tagName) {
        // tag mismatch - إعادة إضافته
        if (lastOpen) tagStack.push(lastOpen);
      }
    } else if (!fullTag.endsWith('/>')) {
      // opening tag
      tagStack.push(tagName);
    }
  }

  // إغلاق Tags المتبقية
  let result = html;
  while (tagStack.length > 0) {
    const tag = tagStack.pop();
    result += `</${tag}>`;
  }

  return result;
}

/**
 * تحسين المحتوى الكامل
 */
export function enhanceContent(
  content: string,
  topic: string,
  category: string = 'general'
): {
  content: string;
  title: string;
  isComplete: boolean;
} {
  // توليد عنوان متنوع
  const title = generateDiverseSEOTitle(topic, category);

  // تنسيق الفقرات
  let enhancedContent = formatParagraphs(content);

  // إصلاح المقال المقطوع
  enhancedContent = fixTruncatedArticle(enhancedContent, topic);

  // التحقق النهائي
  const validation = validateArticleCompleteness(enhancedContent);

  return {
    content: enhancedContent,
    title,
    isComplete: validation.isComplete,
  };
}

export default {
  generateDiverseSEOTitle,
  formatParagraphs,
  validateArticleCompleteness,
  fixTruncatedArticle,
  enhanceContent,
  SEO_TITLE_PATTERNS,
};
