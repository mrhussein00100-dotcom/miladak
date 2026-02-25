/**
 * نظام التنسيق المحسن الشامل للمحتوى
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  position: number;
}

export interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  headings: TOCItem[];
  readabilityScore: number;
  seoScore: number;
  suggestedImages: number;
  estimatedReadTime: number;
}

export interface ProcessingOptions {
  autoFormat: boolean;
  addTOC: boolean;
  insertImages: boolean;
  optimizeSEO: boolean;
  imageCount: number;
  tocMinHeadings: number;
}

/**
 * تحليل المحتوى وإضافة عناوين ذكية
 */
export function analyzeAndAddHeadings(content: string): string {
  // إذا كان يحتوي على عناوين بالفعل
  if (/<h[1-6][^>]*>/i.test(content)) return content;

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

  // 2. تنسيق العناوين مع Schema.org والتصميم المحسن
  formatted = formatted.replace(
    /<h1([^>]*)>(.*?)<\/h1>/gi,
    `<h1$1 class="text-4xl md:text-5xl font-bold mt-12 mb-8 text-gray-900 dark:text-white pb-4 border-b-4 border-gradient-to-r from-blue-500 to-purple-500 flex items-center gap-4" itemProp="headline">
      <span class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">🎯</span>
      <span>$2</span>
    </h1>`
  );

  formatted = formatted.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    `<h2$1 class="text-3xl md:text-4xl font-bold mt-12 mb-6 text-gray-900 dark:text-white pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 flex items-center gap-4" itemProp="name">
      <span class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">📌</span>
      <span>$2</span>
    </h2>`
  );

  formatted = formatted.replace(
    /<h3([^>]*)>(.*?)<\/h3>/gi,
    `<h3$1 class="text-2xl md:text-3xl font-semibold mt-10 mb-5 text-gray-800 dark:text-gray-100 flex items-center gap-3" itemProp="name">
      <span class="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-sm"></span>
      <span>$2</span>
    </h3>`
  );

  formatted = formatted.replace(
    /<h4([^>]*)>(.*?)<\/h4>/gi,
    `<h4$1 class="text-xl md:text-2xl font-medium mt-8 mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
      <span class="w-2 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></span>
      <span>$2</span>
    </h4>`
  );

  formatted = formatted.replace(
    /<h5([^>]*)>(.*?)<\/h5>/gi,
    `<h5$1 class="text-lg md:text-xl font-medium mt-6 mb-3 text-gray-600 dark:text-gray-300 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
      <span>$2</span>
    </h5>`
  );

  formatted = formatted.replace(
    /<h6([^>]*)>(.*?)<\/h6>/gi,
    `<h6$1 class="text-base md:text-lg font-medium mt-4 mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span class="w-1 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full"></span>
      <span>$2</span>
    </h6>`
  );

  // 3. تنسيق الفقرات مع تحسين SEO
  formatted = formatted.replace(
    /<p([^>]*)>(.*?)<\/p>/gi,
    '<p$1 class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-light" itemProp="text">$2</p>'
  );

  // 4. تنسيق القوائم المحسن
  formatted = formatAdvancedLists(formatted);

  // 5. تنسيق الروابط
  formatted = formatted.replace(
    /<a([^>]*)href="([^"]*)"([^>]*)>(.*?)<\/a>/gi,
    '<a$1href="$2"$3 class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 font-medium transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded">$4</a>'
  );

  // 6. تنسيق النص العريض والمائل
  formatted = formatted.replace(
    /<strong([^>]*)>(.*?)<\/strong>/gi,
    '<strong$1 class="font-bold text-gray-900 dark:text-white bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">$2</strong>'
  );

  formatted = formatted.replace(
    /<em([^>]*)>(.*?)<\/em>/gi,
    '<em$1 class="italic text-gray-800 dark:text-gray-200 font-medium">$2</em>'
  );

  // 7. تنسيق الاقتباسات
  formatted = formatted.replace(
    /<blockquote([^>]*)>(.*?)<\/blockquote>/gis,
    `<blockquote$1 class="my-8 border-r-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-l-xl p-6 italic text-gray-700 dark:text-gray-300 shadow-sm">
      <div class="flex items-start gap-4">
        <span class="text-4xl text-blue-400 leading-none">❝</span>
        <div class="flex-1">$2</div>
      </div>
    </blockquote>`
  );

  // 8. تنسيق الكود
  formatted = formatted.replace(
    /<pre([^>]*)>(.*?)<\/pre>/gis,
    `<pre$1 class="my-6 bg-gray-900 dark:bg-gray-800 text-green-400 p-6 rounded-xl overflow-x-auto border border-gray-700 shadow-lg">
      <code>$2</code>
    </pre>`
  );

  formatted = formatted.replace(
    /<code([^>]*)>(.*?)<\/code>/gi,
    '<code$1 class="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-2 py-1 rounded text-sm font-mono">$2</code>'
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
    '<ul$1 class="my-8 space-y-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">'
  );

  // قوائم مرقمة محسنة
  formatted = formatted.replace(
    /<ol([^>]*)>/gi,
    '<ol$1 class="my-8 space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700 counter-reset: item shadow-sm">'
  );

  // عناصر القائمة المحسنة
  formatted = formatted.replace(
    /<li([^>]*)>(.*?)<\/li>/gi,
    `<li$1 class="flex items-start gap-4 text-gray-700 dark:text-gray-300 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
      <span class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></span>
      <span class="flex-1">$2</span>
    </li>`
  );

  return formatted;
}

/**
 * استخراج العناوين من المحتوى HTML
 */
export function extractHeadings(content: string): TOCItem[] {
  const headings: TOCItem[] = [];
  const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const id = `heading-${index++}`;
    const position = match.index;
    headings.push({ id, text, level, position });
  }

  return headings;
}

/**
 * إنشاء جدول المحتويات HTML محسن
 */
export function generateEnhancedTOC(headings: TOCItem[]): string {
  if (headings.length < 2) return '';

  let toc = `
<nav class="toc-container not-prose my-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-blue-100 dark:border-gray-700 shadow-xl">
  <div class="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-gray-600">
    <div class="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    </div>
    <div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">📑 جدول المحتويات</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${
        headings.length
      } قسم • ${Math.ceil(headings.length * 2)} دقائق قراءة</p>
    </div>
  </div>
  <ul class="space-y-3">`;

  headings.forEach((heading, index) => {
    const indent = (heading.level - 1) * 24;
    const icons = ['🎯', '📌', '📍', '🔸', '▪️', '•'];
    const icon = icons[heading.level - 1] || '•';
    const fontSize =
      heading.level === 1
        ? 'text-lg font-bold'
        : heading.level === 2
        ? 'text-base font-semibold'
        : 'text-sm font-medium';
    const color =
      heading.level <= 2
        ? 'text-blue-700 dark:text-blue-400'
        : heading.level <= 4
        ? 'text-purple-600 dark:text-purple-400'
        : 'text-gray-600 dark:text-gray-400';

    toc += `
    <li style="padding-right: ${indent}px;" class="group">
      <a href="#${heading.id}" class="${fontSize} ${color} hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-gray-600">
        <span class="opacity-70 group-hover:opacity-100 transition-opacity text-lg">${icon}</span>
        <span class="flex-1">${heading.text}</span>
        <span class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">انتقال</span>
      </a>
    </li>`;
  });

  toc += `
  </ul>
  <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      💡 انقر على أي عنوان للانتقال إليه مباشرة
    </p>
  </div>
</nav>`;

  return toc;
}

/**
 * إضافة IDs للعناوين في المحتوى
 */
export function addHeadingIds(content: string): string {
  let index = 0;
  return content.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const id = `heading-${index++}`;
      if (attrs.includes('id=')) {
        return match;
      }
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

/**
 * تحليل المحتوى وإعطاء إحصائيات
 */
export function analyzeContent(content: string): ContentAnalysis {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean);
  const headings = extractHeadings(content);

  // حساب نقاط القراءة (بسيط)
  const avgWordsPerSentence = words.length / (text.split(/[.!?]+/).length || 1);
  const readabilityScore = Math.max(
    0,
    Math.min(100, 100 - (avgWordsPerSentence - 15) * 2)
  );

  // حساب نقاط SEO (بسيط)
  const hasHeadings = headings.length > 0 ? 25 : 0;
  const hasGoodLength = words.length >= 300 ? 25 : (words.length / 300) * 25;
  const hasImages = content.includes('<img') ? 25 : 0;
  const hasLinks = content.includes('<a') ? 25 : 0;
  const seoScore = hasHeadings + hasGoodLength + hasImages + hasLinks;

  return {
    wordCount: words.length,
    characterCount: text.length,
    headings,
    readabilityScore: Math.round(readabilityScore),
    seoScore: Math.round(seoScore),
    suggestedImages: Math.max(1, Math.floor(headings.length / 2)),
    estimatedReadTime: Math.ceil(words.length / 200),
  };
}

/**
 * تحسين المحتوى للSEO
 */
export function optimizeForSEO(content: string): string {
  let optimized = content;

  // 1. إضافة Schema.org markup للمقال
  optimized = `<article itemScope itemType="https://schema.org/Article">
    ${optimized}
  </article>`;

  // 2. تحسين الصور بإضافة alt text إذا لم يكن موجود
  optimized = optimized.replace(
    /<img([^>]*?)(?:alt="[^"]*")?([^>]*?)>/gi,
    (match, before, after) => {
      if (match.includes('alt=')) return match;
      return `<img${before} alt="صورة توضيحية"${after}>`;
    }
  );

  // 3. تحسين الروابط الخارجية
  optimized = optimized.replace(
    /<a([^>]*?)href="(https?:\/\/[^"]*)"([^>]*?)>/gi,
    '<a$1href="$2"$3 rel="noopener noreferrer" target="_blank">'
  );

  return optimized;
}

/**
 * معالج المحتوى الشامل
 */
export class ContentProcessor {
  async processContent(
    content: string,
    options: ProcessingOptions
  ): Promise<string> {
    let processed = content;

    // 1. التنسيق الأساسي
    if (options.autoFormat) {
      processed = comprehensiveFormat(processed);
    }

    // 2. تحسين SEO
    if (options.optimizeSEO) {
      processed = optimizeForSEO(processed);
    }

    // 3. إضافة IDs للعناوين
    processed = addHeadingIds(processed);

    // 4. إضافة جدول المحتويات
    if (options.addTOC) {
      const headings = extractHeadings(processed);
      if (headings.length >= options.tocMinHeadings) {
        const toc = generateEnhancedTOC(headings);
        // إدراج جدول المحتويات بعد أول فقرة أو عنوان
        const insertPoint = processed.search(/<\/(?:p|h[1-6])>/i);
        if (insertPoint !== -1) {
          const insertIndex = processed.indexOf('>', insertPoint) + 1;
          processed =
            processed.slice(0, insertIndex) +
            '\n' +
            toc +
            '\n' +
            processed.slice(insertIndex);
        } else {
          processed = toc + '\n' + processed;
        }
      }
    }

    // 5. إدراج الصور (إذا كان مطلوب)
    if (options.insertImages && options.imageCount > 0) {
      // هذا سيتم تنفيذه في مكون منفصل
    }

    return processed;
  }

  analyzeContent(content: string): ContentAnalysis {
    return analyzeContent(content);
  }

  addSmartHeadings(content: string): string {
    return analyzeAndAddHeadings(content);
  }

  optimizeStructure(content: string): string {
    return comprehensiveFormat(content);
  }
}

export default {
  analyzeAndAddHeadings,
  comprehensiveFormat,
  formatAdvancedLists,
  extractHeadings,
  generateEnhancedTOC,
  addHeadingIds,
  analyzeContent,
  optimizeForSEO,
  ContentProcessor,
};
