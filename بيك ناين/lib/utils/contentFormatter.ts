/**
 * أداة تنسيق المحتوى وإنشاء جدول المحتويات تلقائياً
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * استخراج العناوين من المحتوى HTML
 */
export function extractHeadings(content: string): TOCItem[] {
  const headings: TOCItem[] = [];
  const regex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // إزالة أي HTML داخلي
    const id = `heading-${index++}`;
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * إنشاء جدول المحتويات HTML
 */
export function generateTOC(headings: TOCItem[]): string {
  if (headings.length === 0) return '';

  let toc = `<div class="toc-container bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
  <h3 class="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
    </svg>
    محتويات المقال
  </h3>
  <nav class="toc-nav">
    <ul class="space-y-2">`;

  headings.forEach((heading) => {
    const indent = (heading.level - 2) * 16; // h2 = 0, h3 = 16px, h4 = 32px
    toc += `
      <li style="padding-right: ${indent}px;">
        <a href="#${heading.id}" class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ${heading.text}
        </a>
      </li>`;
  });

  toc += `
    </ul>
  </nav>
</div>`;

  return toc;
}

/**
 * إضافة IDs للعناوين في المحتوى
 */
export function addHeadingIds(content: string): string {
  let index = 0;
  return content.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const id = `heading-${index++}`;
      // التحقق من عدم وجود id مسبقاً
      if (attrs.includes('id=')) {
        return match;
      }
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

/**
 * تنسيق المحتوى تلقائياً
 */
export function formatContent(content: string): string {
  let formatted = content;

  // 1. تنظيف المحتوى من الأسطر الفارغة الزائدة
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // 2. تحويل الأسطر الجديدة إلى فقرات إذا لم تكن موجودة
  if (!formatted.includes('<p>') && !formatted.includes('<h')) {
    const paragraphs = formatted.split(/\n\n+/);
    formatted = paragraphs
      .map((p) => p.trim())
      .filter((p) => p)
      .map((p) => `<p>${p}</p>`)
      .join('\n');
  }

  // 3. إصلاح الفقرات الفارغة
  formatted = formatted.replace(/<p>\s*<\/p>/g, '');

  // 4. إضافة فئات للعناوين
  formatted = formatted.replace(
    /<h2([^>]*)>/g,
    '<h2$1 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">'
  );
  formatted = formatted.replace(
    /<h3([^>]*)>/g,
    '<h3$1 class="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100">'
  );
  formatted = formatted.replace(
    /<h4([^>]*)>/g,
    '<h4$1 class="text-lg font-medium mt-4 mb-2 text-gray-700 dark:text-gray-200">'
  );

  // 5. تنسيق الفقرات
  formatted = formatted.replace(
    /<p([^>]*)>/g,
    '<p$1 class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">'
  );

  // 6. تنسيق القوائم
  formatted = formatted.replace(
    /<ul([^>]*)>/g,
    '<ul$1 class="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">'
  );
  formatted = formatted.replace(
    /<ol([^>]*)>/g,
    '<ol$1 class="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">'
  );

  // 7. تنسيق الروابط
  formatted = formatted.replace(
    /<a([^>]*)>/g,
    '<a$1 class="text-blue-600 dark:text-blue-400 hover:underline">'
  );

  // 8. تنسيق النص العريض والمائل
  formatted = formatted.replace(
    /<strong([^>]*)>/g,
    '<strong$1 class="font-bold text-gray-900 dark:text-white">'
  );

  // 9. إضافة IDs للعناوين
  formatted = addHeadingIds(formatted);

  return formatted;
}

/**
 * إضافة جدول المحتويات للمحتوى
 */
export function addTableOfContents(content: string): string {
  // أولاً نضيف IDs للعناوين
  const contentWithIds = addHeadingIds(content);

  // استخراج العناوين
  const headings = extractHeadings(contentWithIds);

  // إذا كان هناك أقل من 3 عناوين، لا نضيف جدول محتويات
  if (headings.length < 3) {
    return contentWithIds;
  }

  // إنشاء جدول المحتويات
  const toc = generateTOC(headings);

  // إضافة جدول المحتويات بعد أول فقرة أو في البداية
  const firstParagraphEnd = contentWithIds.indexOf('</p>');
  if (firstParagraphEnd !== -1) {
    return (
      contentWithIds.slice(0, firstParagraphEnd + 4) +
      '\n' +
      toc +
      '\n' +
      contentWithIds.slice(firstParagraphEnd + 4)
    );
  }

  return toc + '\n' + contentWithIds;
}

/**
 * تنسيق المحتوى الكامل مع جدول المحتويات
 */
export function processContent(
  content: string,
  options: {
    addTOC?: boolean;
    formatStyles?: boolean;
  } = {}
): string {
  const { addTOC = true, formatStyles = true } = options;

  let processed = content;

  // تنسيق المحتوى
  if (formatStyles) {
    processed = formatContent(processed);
  }

  // إضافة جدول المحتويات
  if (addTOC) {
    processed = addTableOfContents(processed);
  }

  return processed;
}

export default {
  extractHeadings,
  generateTOC,
  addHeadingIds,
  formatContent,
  addTableOfContents,
  processContent,
};
