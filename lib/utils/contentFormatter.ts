/**
 * أداة تنسيق المحتوى وإنشاء جدول المحتويات تلقائياً - نسخة محسنة
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
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const id = `heading-${index++}`;
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * إنشاء جدول المحتويات HTML محسن
 */
export function generateTOC(headings: TOCItem[]): string {
  if (headings.length === 0) return '';

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
    const indent = (heading.level - 2) * 20;
    const icon = heading.level === 2 ? '📌' : heading.level === 3 ? '📍' : '•';
    const fontSize = heading.level === 2 ? 'text-sm font-medium' : 'text-sm';
    const color =
      heading.level === 2
        ? 'text-blue-700 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400';

    toc += `
    <li style="padding-right: ${indent}px;" class="group">
      <a href="#${heading.id}" class="${fontSize} ${color} hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-all">
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
 * إضافة IDs للعناوين في المحتوى
 */
export function addHeadingIds(content: string): string {
  let index = 0;
  return content.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
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
 * تحويل النص العادي إلى HTML منسق مع عناوين
 */
export function convertPlainTextToHTML(content: string): string {
  // إذا كان المحتوى يحتوي على HTML بالفعل
  if (
    content.includes('<h2>') ||
    content.includes('<h3>') ||
    content.includes('<p>')
  ) {
    return content;
  }

  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
      }
      continue;
    }

    // تحويل العناوين بعلامات #
    if (line.startsWith('### ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
      }
      html += `<h4>${line.slice(4)}</h4>\n`;
    } else if (line.startsWith('## ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
      }
      html += `<h3>${line.slice(3)}</h3>\n`;
    } else if (line.startsWith('# ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
      }
      html += `<h2>${line.slice(2)}</h2>\n`;
    }
    // تحويل القوائم
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) html += `</${listType}>\n`;
        html += '<ul>\n';
        inList = true;
        listType = 'ul';
      }
      html += `<li>${line.slice(2)}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) html += `</${listType}>\n`;
        html += '<ol>\n';
        inList = true;
        listType = 'ol';
      }
      html += `<li>${line.replace(/^\d+\.\s/, '')}</li>\n`;
    }
    // فقرة عادية
    else {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
      }
      html += `<p>${line}</p>\n`;
    }
  }

  if (inList) {
    html += `</${listType}>\n`;
  }

  return html;
}

/**
 * إضافة عناوين تلقائية للمحتوى الذي لا يحتوي على عناوين
 */
export function smartAddHeadings(content: string): string {
  // التحقق من وجود عناوين
  const hasHeadings = /<h[2-4][^>]*>/i.test(content);
  if (hasHeadings) return content;

  // تنظيف المحتوى
  let cleanContent = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p/gi, '</p>\n<p');

  // استخراج الفقرات
  const paragraphMatches =
    cleanContent.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];

  // إذا لم توجد فقرات، نحاول تقسيم النص
  if (paragraphMatches.length < 2) {
    const textContent = cleanContent.replace(/<[^>]*>/g, '').trim();
    const sentences = textContent
      .split(/[.،؟!]\s+/)
      .filter((s) => s.trim().length > 20);

    if (sentences.length >= 3) {
      let result = `<h2>مقدمة</h2>\n<p>${sentences
        .slice(0, 2)
        .join('. ')}.</p>\n`;
      result += `<h3>التفاصيل</h3>\n<p>${sentences
        .slice(2, -1)
        .join('. ')}.</p>\n`;
      if (sentences.length > 3) {
        result += `<h3>الخلاصة</h3>\n<p>${sentences
          .slice(-1)
          .join('. ')}.</p>\n`;
      }
      return result;
    }
    return content;
  }

  // تقسيم الفقرات إلى أقسام
  const totalParagraphs = paragraphMatches.length;
  let result = '';

  // القسم الأول: مقدمة
  result += `<h2>مقدمة</h2>\n`;
  const introCount = Math.min(2, Math.ceil(totalParagraphs * 0.2));
  for (let i = 0; i < introCount; i++) {
    result += paragraphMatches[i] + '\n';
  }

  // القسم الثاني: المحتوى الرئيسي
  const mainStart = introCount;
  const mainEnd =
    totalParagraphs - Math.min(2, Math.ceil(totalParagraphs * 0.2));

  if (mainEnd > mainStart) {
    result += `<h3>التفاصيل والمعلومات</h3>\n`;
    for (let i = mainStart; i < mainEnd; i++) {
      result += paragraphMatches[i] + '\n';

      // إضافة عنوان فرعي كل 3-4 فقرات
      if ((i - mainStart + 1) % 3 === 0 && i < mainEnd - 1) {
        const subHeadings = ['نقاط مهمة', 'معلومات إضافية', 'تفاصيل أخرى'];
        const subIndex = Math.floor((i - mainStart) / 3) % subHeadings.length;
        result += `<h4>${subHeadings[subIndex]}</h4>\n`;
      }
    }
  }

  // القسم الأخير: الخلاصة
  if (mainEnd < totalParagraphs) {
    result += `<h3>الخلاصة</h3>\n`;
    for (let i = mainEnd; i < totalParagraphs; i++) {
      result += paragraphMatches[i] + '\n';
    }
  }

  return result;
}

/**
 * تنسيق المحتوى تلقائياً - نسخة محسنة
 */
export function formatContent(content: string): string {
  let formatted = content;

  // 1. تحويل النص العادي إلى HTML إذا لزم الأمر
  formatted = convertPlainTextToHTML(formatted);

  // 1.5 إضافة عناوين تلقائية إذا لم توجد
  formatted = smartAddHeadings(formatted);

  // 2. تنظيف المحتوى
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  formatted = formatted.replace(/<p>\s*<\/p>/g, '');
  formatted = formatted.replace(/<p><br\s*\/?><\/p>/g, '');

  // 3. إزالة الفئات القديمة لتجنب التكرار
  formatted = formatted.replace(/class="[^"]*"/g, '');

  // 4. تنسيق العناوين بشكل جميل
  formatted = formatted.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    `<h2$1 class="text-2xl md:text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white pb-3 border-b-2 border-blue-500 flex items-center gap-3">
      <span class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">📌</span>
      $2
    </h2>`
  );

  formatted = formatted.replace(
    /<h3([^>]*)>(.*?)<\/h3>/gi,
    `<h3$1 class="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
      <span class="w-2 h-6 bg-purple-500 rounded-full"></span>
      $2
    </h3>`
  );

  formatted = formatted.replace(
    /<h4([^>]*)>(.*?)<\/h4>/gi,
    `<h4$1 class="text-lg md:text-xl font-medium mt-6 mb-3 text-gray-700 dark:text-gray-200 flex items-center gap-2">
      <span class="w-1.5 h-4 bg-green-500 rounded-full"></span>
      $2
    </h4>`
  );

  // 5. تنسيق الفقرات
  formatted = formatted.replace(
    /<p([^>]*)>(.*?)<\/p>/gi,
    '<p$1 class="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">$2</p>'
  );

  // 6. تنسيق القوائم بشكل جميل
  formatted = formatted.replace(
    /<ul([^>]*)>/gi,
    '<ul$1 class="my-6 space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">'
  );

  formatted = formatted.replace(
    /<ol([^>]*)>/gi,
    '<ol$1 class="my-6 space-y-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 list-decimal list-inside">'
  );

  formatted = formatted.replace(
    /<li([^>]*)>(.*?)<\/li>/gi,
    `<li$1 class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
      <span class="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></span>
      <span>$2</span>
    </li>`
  );

  // 7. تنسيق الروابط
  formatted = formatted.replace(
    /<a([^>]*)href="([^"]*)"([^>]*)>(.*?)<\/a>/gi,
    '<a$1href="$2"$3 class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 font-medium transition-colors">$4</a>'
  );

  // 8. تنسيق النص العريض
  formatted = formatted.replace(
    /<strong([^>]*)>(.*?)<\/strong>/gi,
    '<strong$1 class="font-bold text-gray-900 dark:text-white">$2</strong>'
  );

  // 9. تنسيق الاقتباسات
  formatted = formatted.replace(
    /<blockquote([^>]*)>(.*?)<\/blockquote>/gis,
    `<blockquote$1 class="my-6 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-l-xl p-5 italic text-gray-700 dark:text-gray-300">
      <div class="flex items-start gap-3">
        <span class="text-3xl text-blue-400">❝</span>
        <div>$2</div>
      </div>
    </blockquote>`
  );

  // 10. تنسيق الصور - بحذر لتجنب إفساد HTML
  formatted = formatted.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    // تجنب إضافة class إذا كان موجوداً بالفعل
    if (attrs.includes('class=')) {
      return match;
    }

    // التحقق من أن الصورة ليست داخل figure أو div منسق بالفعل
    const imgIndex = formatted.indexOf(match);
    const beforeImg = formatted.substring(
      Math.max(0, imgIndex - 100),
      imgIndex
    );
    const afterImg = formatted.substring(
      imgIndex + match.length,
      Math.min(formatted.length, imgIndex + match.length + 100)
    );

    // إذا كانت الصورة داخل figure أو div منسق، لا نغيرها
    if (beforeImg.includes('<figure') && afterImg.includes('</figure>')) {
      return match;
    }
    if (beforeImg.includes('<div class=') && afterImg.includes('</div>')) {
      return match;
    }

    // تنظيف attrs من الأحرف الخاصة بحذر أكبر
    let cleanAttrs = attrs;
    try {
      // إزالة أحرف التحكم فقط، وليس كل الأحرف الخاصة
      cleanAttrs = attrs.replace(/[\u0000-\u001F\u007F]/g, '');

      // التأكد من وجود مسافة قبل class
      if (cleanAttrs && !cleanAttrs.startsWith(' ')) {
        cleanAttrs = ' ' + cleanAttrs;
      }

      return `<img${cleanAttrs} class="rounded-xl shadow-lg my-6 w-full">`;
    } catch (error) {
      // في حالة الخطأ، نعيد الصورة كما هي
      console.warn('Error processing image attributes:', error);
      return match;
    }
  });

  // 11. إضافة IDs للعناوين
  formatted = addHeadingIds(formatted);

  return formatted;
}

/**
 * إضافة جدول المحتويات للمحتوى
 */
export function addTableOfContents(content: string): string {
  const contentWithIds = addHeadingIds(content);
  const headings = extractHeadings(contentWithIds);

  // إذا كان هناك أقل من 2 عناوين، لا نضيف جدول محتويات
  if (headings.length < 2) {
    return contentWithIds;
  }

  const toc = generateTOC(headings);

  // إضافة جدول المحتويات بعد أول فقرة
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
 * البحث عن صور مناسبة للموضوع من Pexels
 */
export async function fetchRelevantImages(
  topic: string,
  count: number = 3
): Promise<string[]> {
  try {
    // استخدام خدمة البحث المحسنة إذا كانت متاحة
    try {
      const { default: ImageSearchService } = await import(
        '@/lib/services/imageSearchService'
      );
      const searchService = new ImageSearchService();
      const result = await searchService.searchImages({
        query: topic,
        count,
        orientation: 'landscape',
      });
      return result.images.map((img) => img.url);
    } catch (enhancedError) {
      // العودة للطريقة العادية في حالة الخطأ
      const response = await fetch(
        `/api/search-images?q=${encodeURIComponent(topic)}&count=${count}`
      );
      const data = await response.json();
      if (data.success && data.images) {
        return data.images;
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
  return [];
}

/**
 * إدراج صور تلقائية في المحتوى
 */
export function insertImagesInContent(
  content: string,
  images: string[],
  topic: string = ''
): string {
  if (!images || images.length === 0) return content;

  const headings = extractHeadings(content);
  if (headings.length === 0) return content;

  let result = content;
  let imageIndex = 0;

  // إدراج صورة بعد كل عنوان h2 أو h3
  for (const heading of headings) {
    if (imageIndex >= images.length) break;
    if (heading.level <= 3) {
      const headingRegex = new RegExp(
        `(<h${heading.level}[^>]*id="${heading.id}"[^>]*>.*?</h${heading.level}>)`,
        'gi'
      );
      const imageHtml = `
<figure class="my-8">
  <img src="${images[imageIndex]}" alt="${heading.text}" class="w-full rounded-2xl shadow-lg" loading="lazy" />
  <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic">${heading.text}</figcaption>
</figure>`;

      result = result.replace(headingRegex, `$1\n${imageHtml}`);
      imageIndex++;
    }
  }

  return result;
}

/**
 * تنسيق المحتوى الكامل مع جدول المحتويات والصور
 */
export function processContent(
  content: string,
  options: {
    addTOC?: boolean;
    formatStyles?: boolean;
    images?: string[];
    topic?: string;
    useEnhancedFormatting?: boolean;
  } = {}
): string {
  const {
    addTOC = true,
    formatStyles = true,
    images = [],
    topic = '',
    useEnhancedFormatting = true,
  } = options;

  let processed = content;

  // تنسيق المحتوى - استخدام التنسيق المحسن إذا كان متاحاً
  if (formatStyles) {
    if (useEnhancedFormatting) {
      // استخدام التنسيق المحسن الجديد
      try {
        const { comprehensiveFormat } = require('./enhancedFormatter');
        processed = comprehensiveFormat(processed);
      } catch (error) {
        // العودة للتنسيق العادي في حالة الخطأ
        processed = formatContent(processed);
      }
    } else {
      processed = formatContent(processed);
    }
  }

  // إدراج الصور
  if (images && images.length > 0) {
    processed = insertImagesInContent(processed, images, topic);
  }

  // إضافة جدول المحتويات
  if (addTOC) {
    if (useEnhancedFormatting) {
      try {
        const {
          extractHeadings,
          generateEnhancedTOC,
          addHeadingIds,
        } = require('./enhancedFormatter');
        processed = addHeadingIds(processed);
        const headings = extractHeadings(processed);
        if (headings.length >= 2) {
          const toc = generateEnhancedTOC(headings);
          const firstParagraphEnd = processed.indexOf('</p>');
          if (firstParagraphEnd !== -1) {
            processed =
              processed.slice(0, firstParagraphEnd + 4) +
              '\n' +
              toc +
              '\n' +
              processed.slice(firstParagraphEnd + 4);
          } else {
            processed = toc + '\n' + processed;
          }
        }
      } catch (error) {
        // العودة لجدول المحتويات العادي
        processed = addTableOfContents(processed);
      }
    } else {
      processed = addTableOfContents(processed);
    }
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
  convertPlainTextToHTML,
  insertImagesInContent,
  fetchRelevantImages,
};
