/**
 * تنسيق متقدم للمحتوى مع تحسين SEO وإضافة عناوين ذكية
 */

/**
 * تحليل المحتوى وإضافة عناوين ذكية
 */
export function analyzeAndAddHeadings(content: string): string {
  // إذا كان يحتوي على عناوين بالفعل
  if (/<h[2-4][^>]*>/i.test(content)) return content;

  // تنظيف المحتوى
  let text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // تقسيم إلى جمل
  const sentences = text.split(/[.،؟!]\s+/).filter((s) => s.trim().length > 15);

  if (sentences.length < 3) return content;

  // إنشاء أقسام ذكية
  let result = '';
  const sectionsCount = Math.min(
    6,
    Math.max(3, Math.ceil(sentences.length / 4))
  );
  const sentencesPerSection = Math.ceil(sentences.length / sectionsCount);

  const sectionTitles = [
    'مقدمة',
    'النقاط الرئيسية',
    'التفاصيل المهمة',
    'معلومات إضافية',
    'نصائح وإرشادات',
    'الخلاصة والنتائج',
  ];

  for (let i = 0; i < sectionsCount; i++) {
    const start = i * sentencesPerSection;
    const end = Math.min((i + 1) * sentencesPerSection, sentences.length);
    const sectionSentences = sentences.slice(start, end);

    if (sectionSentences.length === 0) continue;

    const headingLevel = i === 0 ? 'h2' : 'h3';
    result += `<${headingLevel}>${sectionTitles[i]}</${headingLevel}>\n`;
    result += `<p>${sectionSentences.join('. ')}.</p>\n\n`;
  }

  return result;
}
/**
 * تنسيق شامل للمحتوى مع تحسين SEO
 */
export function comprehensiveFormat(content: string): string {
  let formatted = content;

  // 1. إضافة عناوين ذكية
  formatted = analyzeAndAddHeadings(formatted);

  // 2. تنسيق العناوين مع Schema.org
  formatted = formatted.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    `<h2$1 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 flex items-center gap-4" itemProp="headline">
      <span class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">📌</span>
      <span>$2</span>
    </h2>`
  );

  formatted = formatted.replace(
    /<h3([^>]*)>(.*?)<\/h3>/gi,
    `<h3$1 class="text-2xl font-semibold mt-10 mb-5 text-gray-800 dark:text-gray-100 flex items-center gap-3" itemProp="name">
      <span class="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
      <span>$2</span>
    </h3>`
  );

  formatted = formatted.replace(
    /<h4([^>]*)>(.*?)<\/h4>/gi,
    `<h4$1 class="text-xl font-medium mt-8 mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
      <span class="w-2 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></span>
      <span>$2</span>
    </h4>`
  );

  // 3. تنسيق الفقرات مع تحسين SEO
  formatted = formatted.replace(
    /<p([^>]*)>(.*?)<\/p>/gi,
    '<p$1 class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-light" itemProp="text">$2</p>'
  );

  return formatted;
}

/**
 * إضافة تنسيق متقدم للقوائم والتعداد
 */
export function formatAdvancedLists(content: string): string {
  let formatted = content;

  // قوائم نقطية محسنة
  formatted = formatted.replace(
    /<ul([^>]*)>/gi,
    '<ul$1 class="my-8 space-y-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">'
  );

  // قوائم مرقمة محسنة
  formatted = formatted.replace(
    /<ol([^>]*)>/gi,
    '<ol$1 class="my-8 space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700 counter-reset: item">'
  );

  return formatted;
}
