/**
 * خدمة استخلاص المحتوى من الروابط
 * تستخدم cheerio و @mozilla/readability لاستخراج المحتوى النظيف
 */

import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import type { ExtractedContent, ContentMetadata } from '@/types/rewriter';

// قائمة العناصر المراد إزالتها
const ELEMENTS_TO_REMOVE = [
  'script',
  'style',
  'noscript',
  'iframe',
  'nav',
  'footer',
  'header',
  'aside',
  'form',
  '.ad',
  '.ads',
  '.advertisement',
  '.social-share',
  '.comments',
  '.related-posts',
  '.sidebar',
  '[role="navigation"]',
  '[role="banner"]',
  '[role="complementary"]',
];

// User-Agent للطلبات
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/**
 * استخلاص المحتوى من رابط
 */
export async function extractFromUrl(url: string): Promise<ExtractedContent> {
  try {
    // التحقق من صحة الرابط
    const validUrl = validateUrl(url);
    if (!validUrl) {
      return createErrorResult('رابط غير صالح');
    }

    // جلب HTML
    const html = await fetchHtml(validUrl);
    if (!html) {
      return createErrorResult('فشل في جلب المحتوى من الرابط');
    }

    // استخراج المحتوى باستخدام Readability
    const readabilityResult = extractWithReadability(html, validUrl);

    // استخراج البيانات الوصفية باستخدام cheerio
    const $ = cheerio.load(html);
    const metadata = extractMetadata($, validUrl);
    const images = extractImages($, validUrl);

    // تنظيف المحتوى
    const cleanContent = cleanText(readabilityResult.content);

    return {
      title: readabilityResult.title || metadata.siteName || 'بدون عنوان',
      content: readabilityResult.content,
      cleanContent,
      author: readabilityResult.author,
      publishDate: extractPublishDate($),
      images,
      metadata: {
        ...metadata,
        wordCount: countWords(cleanContent),
      },
      success: true,
    };
  } catch (error) {
    console.error('Error extracting content:', error);
    return createErrorResult(
      error instanceof Error ? error.message : 'خطأ غير معروف'
    );
  }
}

/**
 * التحقق من صحة الرابط
 */
function validateUrl(url: string): string | null {
  try {
    // إضافة البروتوكول إذا لم يكن موجوداً
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * جلب HTML من الرابط
 */
async function fetchHtml(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 ثانية

    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

/**
 * استخراج المحتوى باستخدام Readability
 */
function extractWithReadability(
  html: string,
  url: string
): {
  title: string;
  content: string;
  author?: string;
} {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article) {
      return {
        title: article.title || '',
        content: article.textContent || '',
        author: article.byline || undefined,
      };
    }
  } catch (error) {
    console.error('Readability error:', error);
  }

  // Fallback: استخدام cheerio
  return extractWithCheerio(html);
}

/**
 * استخراج المحتوى باستخدام cheerio (fallback)
 */
function extractWithCheerio(html: string): {
  title: string;
  content: string;
  author?: string;
} {
  const $ = cheerio.load(html);

  // إزالة العناصر غير المرغوبة
  ELEMENTS_TO_REMOVE.forEach((selector) => {
    $(selector).remove();
  });

  // استخراج العنوان
  const title =
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    '';

  // استخراج المحتوى
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    'main',
    '.post',
    '#content',
  ];

  let content = '';
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length) {
      content = element.text().trim();
      if (content.length > 200) break;
    }
  }

  // إذا لم نجد محتوى، نأخذ body
  if (!content || content.length < 200) {
    content = $('body').text().trim();
  }

  // استخراج الكاتب
  const author =
    $('[rel="author"]').text().trim() ||
    $('.author').first().text().trim() ||
    $('meta[name="author"]').attr('content') ||
    undefined;

  return { title, content, author };
}

/**
 * استخراج البيانات الوصفية
 */
function extractMetadata($: cheerio.CheerioAPI, url: string): ContentMetadata {
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    undefined;

  const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsStr
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  const language =
    $('html').attr('lang') ||
    $('meta[http-equiv="content-language"]').attr('content') ||
    'ar';

  const siteName =
    $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname;

  const ogImage = $('meta[property="og:image"]').attr('content') || undefined;

  return {
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    language,
    wordCount: 0, // سيتم حسابه لاحقاً
    siteName,
    ogImage,
  };
}

/**
 * استخراج الصور
 */
function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images: string[] = [];
  const seen = new Set<string>();

  // صورة OG
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    const fullUrl = resolveUrl(ogImage, baseUrl);
    if (fullUrl && !seen.has(fullUrl)) {
      images.push(fullUrl);
      seen.add(fullUrl);
    }
  }

  // صور المقال
  $('article img, .content img, main img, .post img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      const fullUrl = resolveUrl(src, baseUrl);
      if (fullUrl && !seen.has(fullUrl) && isValidImageUrl(fullUrl)) {
        images.push(fullUrl);
        seen.add(fullUrl);
      }
    }
  });

  return images.slice(0, 10); // أقصى 10 صور
}

/**
 * استخراج تاريخ النشر
 */
function extractPublishDate($: cheerio.CheerioAPI): string | undefined {
  const dateSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    'meta[name="DC.date.issued"]',
    'time[datetime]',
    '.date',
    '.published',
    '.post-date',
  ];

  for (const selector of dateSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const date =
        element.attr('content') ||
        element.attr('datetime') ||
        element.text().trim();
      if (date) {
        try {
          const parsed = new Date(date);
          if (!isNaN(parsed.getTime())) {
            return parsed.toISOString();
          }
        } catch {
          // تجاهل التواريخ غير الصالحة
        }
      }
    }
  }

  return undefined;
}

/**
 * تحويل الرابط النسبي إلى مطلق
 */
function resolveUrl(url: string, baseUrl: string): string | null {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return null;
  }
}

/**
 * التحقق من صحة رابط الصورة
 */
function isValidImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();

  // تجاهل الصور الصغيرة والأيقونات
  if (
    lowercaseUrl.includes('icon') ||
    lowercaseUrl.includes('logo') ||
    lowercaseUrl.includes('avatar') ||
    lowercaseUrl.includes('1x1') ||
    lowercaseUrl.includes('pixel')
  ) {
    return false;
  }

  return (
    imageExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
    lowercaseUrl.includes('/image') ||
    lowercaseUrl.includes('/img')
  );
}

/**
 * تنظيف النص
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // تحويل المسافات المتعددة إلى واحدة
    .replace(/\n\s*\n/g, '\n\n') // تحويل الأسطر الفارغة المتعددة إلى اثنين
    .replace(/\t/g, ' ') // تحويل التابات إلى مسافات
    .trim();
}

/**
 * حساب عدد الكلمات
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * إنشاء نتيجة خطأ
 */
function createErrorResult(error: string): ExtractedContent {
  return {
    title: '',
    content: '',
    cleanContent: '',
    images: [],
    metadata: {
      wordCount: 0,
    },
    success: false,
    error,
  };
}

export default {
  extractFromUrl,
};
