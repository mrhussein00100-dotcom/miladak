import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url?.trim()) {
      return NextResponse.json(
        { success: false, error: 'الرابط مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من صحة الرابط
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'الرابط غير صحيح' },
        { status: 400 }
      );
    }

    // جلب محتوى الصفحة مع محاولات متعددة
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 ثانية timeout

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ];

    let response;
    let lastError;

    try {
      // محاولة مع User Agents مختلفة
      for (const userAgent of userAgents) {
        try {
          response = await fetch(url, {
            headers: {
              'User-Agent': userAgent,
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
              'Accept-Encoding': 'gzip, deflate, br',
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Upgrade-Insecure-Requests': '1',
            },
            signal: controller.signal,
            redirect: 'follow',
          });

          if (response.ok) break;
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('فشلت جميع المحاولات');
      }
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(
        `فشل جلب الصفحة: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      throw new Error('الرابط لا يشير إلى صفحة HTML');
    }

    const html = await response.text();

    if (!html || html.length < 100) {
      throw new Error('المحتوى المُجلب فارغ أو قصير جداً');
    }

    const $ = cheerio.load(html);

    // إزالة العناصر غير المرغوبة
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // محاولة استخراج المحتوى الرئيسي
    let content = '';
    let title = '';

    // استخراج العنوان
    title =
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      $('meta[property="og:title"]').attr('content')?.trim() ||
      '';

    // محاولة إيجاد المحتوى الرئيسي من عدة أماكن شائعة
    const contentSelectors = [
      'article',
      '[role="main"]',
      'main article',
      '.article-body',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content-area',
      '[class*="article-body"]',
      '[class*="post-body"]',
      '[class*="entry-body"]',
      '[class*="story"]',
      '[class*="text"]',
      '[id*="article"]',
      '[id*="story"]',
      '[id*="content"]',
      '[data-testid*="article"]',
      '[data-testid*="content"]',
      'main',
      '.content',
      '#content',
    ];

    let bestContent = '';
    let maxLength = 0;

    // جرب كل selector وخذ الأطول
    for (const selector of contentSelectors) {
      try {
        const element = $(selector).first();
        if (element.length) {
          // إزالة العناصر غير المرغوبة من داخل العنصر
          const clone = element.clone();
          clone
            .find(
              'script, style, nav, aside, .ad, .advertisement, .related, .sidebar, .comments'
            )
            .remove();

          const tempContent = clone.html() || '';
          const textLength = clone.text().trim().length;

          if (textLength > maxLength && textLength > 200) {
            bestContent = tempContent;
            maxLength = textLength;
          }
        }
      } catch (e) {
        continue;
      }
    }

    content = bestContent;

    // إذا لم نجد محتوى، حاول جمع كل الفقرات الطويلة
    if (!content || maxLength < 300) {
      const paragraphs: string[] = [];
      const headings: string[] = [];

      // جمع العناوين
      $('h1, h2, h3, h4').each((i, elem) => {
        const text = $(elem).text().trim();
        const tagName = elem.tagName.toLowerCase();
        if (text.length > 10 && text.length < 200) {
          headings.push(`<${tagName}>${text}</${tagName}>`);
        }
      });

      // جمع الفقرات
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        // تجنب الفقرات القصيرة جداً أو الطويلة جداً بشكل غير طبيعي
        if (
          text.length > 50 &&
          text.length < 2000 &&
          !text.includes('cookie') &&
          !text.includes('terms')
        ) {
          paragraphs.push(`<p>${text}</p>`);
        }
      });

      // جمع القوائم
      $('ul li, ol li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20 && text.length < 500) {
          paragraphs.push(`<li>${text}</li>`);
        }
      });

      if (paragraphs.length > 3 || headings.length > 0) {
        content = [...headings, ...paragraphs].join('\n');
      }
    }

    // آخر محاولة: استخراج كل النص المفيد من body
    if (!content || content.length < 200) {
      const bodyText = $('body').text();
      const cleanText = bodyText
        .replace(/\s+/g, ' ')
        .replace(/cookie/gi, '')
        .replace(/privacy/gi, '')
        .trim();

      if (cleanText.length > 500) {
        // تقسيم النص إلى جمل وأخذ الجمل المفيدة
        const sentences = cleanText
          .split(/[.!?]\s+/)
          .filter((s) => s.length > 50 && s.length < 500);
        if (sentences.length > 5) {
          content = sentences.map((s) => `<p>${s}.</p>`).join('\n');
        }
      }
    }

    // تنظيف المحتوى بشكل أفضل
    const $content = cheerio.load(content);

    // إزالة جميع العناصر غير المرغوبة
    $content(
      'script, style, nav, header, footer, iframe, noscript, aside, form, button'
    ).remove();
    $content(
      '.sidebar, .menu, .navigation, .ad, .advertisement, .banner, .social, .share'
    ).remove();
    $content('.related, .comments, .comment, .widget, .popup, .modal').remove();
    $content(
      '[class*="cookie"], [class*="gdpr"], [class*="subscribe"]'
    ).remove();

    // إزالة الصور والفيديوهات (نريد نص فقط)
    $content('img, video, svg, picture, figure').remove();

    // إزالة الروابط الزائدة والأزرار
    $content('a[class*="button"], a[class*="btn"]').remove();

    // الحصول على النص النظيف
    let cleanContent = $content.html() || '';

    // تنظيف شامل للمسافات والعناصر الفارغة
    cleanContent = cleanContent
      .replace(/\s+/g, ' ')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<div>\s*<\/div>/g, '')
      .replace(/<span>\s*<\/span>/g, '')
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, '<br>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ')
      .trim();

    // تحويل إلى فقرات منسقة
    if (cleanContent) {
      const tempDiv = cheerio.load(cleanContent);
      const textParts: string[] = [];

      tempDiv('p, h1, h2, h3, h4, h5, h6, li').each((i, elem) => {
        const text = tempDiv(elem).text().trim();
        const tagName = elem.tagName;
        if (text && text.length > 20) {
          if (tagName === 'p') {
            textParts.push(`<p>${text}</p>`);
          } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            textParts.push(`<${tagName}>${text}</${tagName}>`);
          } else if (tagName === 'li') {
            textParts.push(`<li>${text}</li>`);
          }
        }
      });

      if (textParts.length > 0) {
        cleanContent = textParts.join('\n');
      }
    }

    if (!cleanContent || cleanContent.length < 100) {
      // معلومات إضافية للمستخدم
      const hints = [];

      if (
        url.includes('msn.com') ||
        url.includes('google.com') ||
        url.includes('facebook.com')
      ) {
        hints.push(
          '⚠️ هذا الموقع يستخدم JavaScript لتحميل المحتوى ويصعب جلبه تلقائياً'
        );
        hints.push(
          '💡 حل: افتح المقال في المتصفح، انسخ المحتوى يدوياً، والصقه في "إدخال محتوى"'
        );
      } else {
        hints.push('⚠️ لم يتم العثور على محتوى كافٍ في الصفحة');
        hints.push(
          '💡 حاول: نسخ المحتوى يدوياً من المتصفح ولصقه في "إدخال محتوى"'
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: hints.join('\n'),
          debug_info: {
            title_found: !!title,
            html_length: html.length,
            text_length: $('body').text().length,
          },
        },
        { status: 400 }
      );
    }

    // حساب عدد الكلمات
    const wordCount = $content
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ').length;

    return NextResponse.json({
      success: true,
      title,
      content: cleanContent,
      word_count: wordCount,
      url,
    });
  } catch (error: any) {
    console.error('خطأ في جلب المقال:', error);

    let errorMessage = 'حدث خطأ أثناء جلب المقال';

    if (error.name === 'AbortError') {
      errorMessage = 'انتهت مهلة الاتصال. الرجاء المحاولة مرة أخرى';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'فشل الاتصال بالموقع. تأكد من الرابط وحاول مرة أخرى';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
