/**
 * منسق ذكي بسيط وفعال للمحتوى
 */

/**
 * تنسيق ذكي شامل للمحتوى - يحول النص العادي إلى مقال منسق بالكامل
 */
export function smartFormatContent(content: string): string {
  if (!content || content.trim().length === 0) {
    return content;
  }

  let formatted = content;

  // 1. تنظيف المحتوى من HTML الزائد
  formatted = formatted.replace(/<br\s*\/?>/gi, '\n');
  formatted = formatted.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  formatted = formatted.replace(/<[^>]*>/g, '');
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  formatted = formatted.trim();

  // 2. تقسيم إلى فقرات
  const paragraphs = formatted.split('\n\n').filter((p) => p.trim().length > 0);

  if (paragraphs.length === 0) {
    return content;
  }

  // 3. إنشاء المحتوى المنسق
  let result = '';

  // إضافة عنوان رئيسي من أول جملة
  const firstSentence = paragraphs[0].split(/[.!?]/)[0].trim();
  if (firstSentence.length > 10 && firstSentence.length < 100) {
    result += `<h2 class="text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white pb-3 border-b-2 border-blue-500 flex items-center gap-3">
      <span class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">📌</span>
      ${firstSentence}
    </h2>\n\n`;
  }

  // 4. معالجة الفقرات وإضافة عناوين ذكية
  const sectionsCount = Math.min(
    6,
    Math.max(2, Math.ceil(paragraphs.length / 3))
  );
  const paragraphsPerSection = Math.ceil(paragraphs.length / sectionsCount);

  const sectionTitles = [
    'مقدمة',
    'النقاط الأساسية',
    'التفاصيل المهمة',
    'معلومات إضافية',
    'نصائح مفيدة',
    'الخلاصة',
  ];

  for (let i = 0; i < sectionsCount; i++) {
    const startIdx = i * paragraphsPerSection;
    const endIdx = Math.min((i + 1) * paragraphsPerSection, paragraphs.length);
    const sectionParagraphs = paragraphs.slice(startIdx, endIdx);

    if (sectionParagraphs.length === 0) continue;

    // إضافة عنوان القسم (تخطي العنوان الأول إذا تم إضافته بالفعل)
    if (i > 0 || !firstSentence || firstSentence.length <= 10) {
      const headingLevel = i === 0 ? 'h2' : 'h3';
      const headingClass =
        i === 0
          ? 'text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white pb-3 border-b-2 border-blue-500 flex items-center gap-3'
          : 'text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2';
      const icon = i === 0 ? '📌' : '📍';
      const iconClass =
        i === 0
          ? 'w-8 h-8 bg-blue-500 rounded-lg'
          : 'w-2 h-6 bg-purple-500 rounded-full';

      result += `<${headingLevel} class="${headingClass}">
        <span class="${iconClass} flex items-center justify-center text-white text-sm">${icon}</span>
        ${sectionTitles[i] || `القسم ${i + 1}`}
      </${headingLevel}>\n\n`;
    }

    // إضافة فقرات القسم
    sectionParagraphs.forEach((paragraph, pIndex) => {
      const cleanParagraph = paragraph.trim();

      // تحويل النقاط إلى قائمة
      if (
        cleanParagraph.includes('•') ||
        cleanParagraph.includes('-') ||
        /^\d+\./.test(cleanParagraph)
      ) {
        const listItems = cleanParagraph
          .split(/[•\-]|\d+\./)
          .filter((item) => item.trim().length > 0);
        if (listItems.length > 1) {
          result +=
            '<ul class="my-6 space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">\n';
          listItems.forEach((item) => {
            const cleanItem = item.trim();
            if (cleanItem.length > 0) {
              result += `  <li class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></span>
    <span>${cleanItem}</span>
  </li>\n`;
            }
          });
          result += '</ul>\n\n';
          return;
        }
      }

      // فقرة عادية
      result += `<p class="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">${cleanParagraph}</p>\n\n`;
    });
  }

  return result.trim();
}

/**
 * إنشاء جدول محتويات بسيط
 */
export function generateSimpleTOC(content: string): string {
  const headings = extractHeadingsFromContent(content);

  if (headings.length < 2) {
    return '';
  }

  let toc = `
<nav class="toc-container not-prose my-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-sm">
  <div class="flex items-center gap-3 mb-4 pb-3 border-b border-blue-100 dark:border-gray-700">
    <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    </div>
    <div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">📑 محتويات المقال</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">${headings.length} أقسام</p>
    </div>
  </div>
  <ul class="space-y-2">`;

  headings.forEach((heading, index) => {
    const id = `section-${index + 1}`;
    const indent = (heading.level - 2) * 20;
    const icon = heading.level === 2 ? '📌' : '📍';
    const fontSize = heading.level === 2 ? 'text-sm font-medium' : 'text-sm';
    const color =
      heading.level === 2
        ? 'text-blue-700 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400';

    toc += `
    <li style="padding-right: ${indent}px;" class="group">
      <a href="#${id}" class="${fontSize} ${color} hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-all">
        <span class="opacity-60 group-hover:opacity-100">${icon}</span>
        <span>${heading.text}</span>
      </a>
    </li>`;
  });

  toc += `
  </ul>
</nav>`;

  return toc;
}

/**
 * استخراج العناوين من المحتوى
 */
function extractHeadingsFromContent(
  content: string
): Array<{ level: number; text: string }> {
  const headings: Array<{ level: number; text: string }> = [];
  const regex = /<h([2-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    headings.push({ level, text });
  }

  return headings;
}

/**
 * إضافة IDs للعناوين
 */
export function addHeadingIDs(content: string): string {
  let index = 0;
  return content.replace(
    /<h([2-6])([^>]*?)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const id = `section-${++index}`;
      if (attrs.includes('id=')) {
        return match;
      }
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

/**
 * التنسيق الشامل - الدالة الرئيسية
 */
export function applyCompleteFormatting(
  content: string,
  options: {
    addTOC?: boolean;
    addImages?: boolean;
  } = {}
): string {
  const { addTOC = true } = options;

  // 1. التنسيق الذكي للمحتوى
  let formatted = smartFormatContent(content);

  // 2. إضافة IDs للعناوين
  formatted = addHeadingIDs(formatted);

  // 3. إضافة جدول المحتويات
  if (addTOC) {
    const toc = generateSimpleTOC(formatted);
    if (toc) {
      // إدراج جدول المحتويات بعد أول عنوان أو في البداية
      const firstHeadingMatch = formatted.match(/<\/h[2-6]>/i);
      if (firstHeadingMatch) {
        const insertIndex =
          formatted.indexOf(firstHeadingMatch[0]) + firstHeadingMatch[0].length;
        formatted =
          formatted.slice(0, insertIndex) +
          '\n\n' +
          toc +
          '\n\n' +
          formatted.slice(insertIndex);
      } else {
        formatted = toc + '\n\n' + formatted;
      }
    }
  }

  return formatted;
}
