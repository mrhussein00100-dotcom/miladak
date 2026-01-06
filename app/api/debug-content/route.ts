/**
 * API مؤقت لتشخيص مشاكل حفظ المحتوى
 */

import { NextRequest, NextResponse } from 'next/server';

// نسخة من دوال التنظيف للاختبار
function sanitizeImageUrls(content: string): string {
  if (!content) return content;

  let sanitized = content;

  try {
    sanitized = sanitized.replace(
      /<img([^>]*?)src="([^"]*)"([^>]*?)>/gi,
      (match, before, src, after) => {
        try {
          let cleanSrc = src
            .replace(/[\u0000-\u001F\u007F]/g, '')
            .replace(/\s+/g, '%20')
            .replace(/"/g, '%22')
            .replace(/'/g, '%27')
            .trim();

          if (
            cleanSrc.startsWith('http://') ||
            cleanSrc.startsWith('https://') ||
            cleanSrc.startsWith('/') ||
            cleanSrc.startsWith('data:')
          ) {
            const cleanBefore = before.replace(/[\u0000-\u001F\u007F]/g, '');
            const cleanAfter = after.replace(/[\u0000-\u001F\u007F]/g, '');
            return `<img${cleanBefore}src="${cleanSrc}"${cleanAfter}>`;
          }

          if (cleanSrc && cleanSrc.length > 5) {
            cleanSrc = 'https://' + cleanSrc.replace(/^\/+/, '');
            const cleanBefore = before.replace(/[\u0000-\u001F\u007F]/g, '');
            const cleanAfter = after.replace(/[\u0000-\u001F\u007F]/g, '');
            return `<img${cleanBefore}src="${cleanSrc}"${cleanAfter}>`;
          }

          return '';
        } catch (e) {
          console.error('Error processing image:', e);
          return match;
        }
      }
    );

    sanitized = sanitized.replace(/<img[^>]*src=""[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="undefined"[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="null"[^>]*>/gi, '');
    sanitized = sanitized.replace(
      /<img([^>]*[^\/])>(?!<\/img>)/gi,
      '<img$1 />'
    );
    sanitized = sanitized.replace(
      /(<img[^>]*src="([^"]*)"[^>]*>)\s*\1/gi,
      '$1'
    );
  } catch (error) {
    console.error('General sanitization error:', error);
    return content;
  }

  return sanitized;
}

function analyzeContent(content: string) {
  const images = content.match(/<img[^>]*>/gi) || [];
  const imageAnalysis = images.map((img, index) => {
    const srcMatch = img.match(/src="([^"]*)"/i);
    const imgIndex = content.indexOf(img);
    const before = content.substring(Math.max(0, imgIndex - 100), imgIndex);
    const after = content.substring(
      imgIndex + img.length,
      Math.min(content.length, imgIndex + img.length + 100)
    );

    return {
      index: index + 1,
      html: img,
      src: srcMatch ? srcMatch[1] : 'لا يوجد src',
      srcLength: srcMatch ? srcMatch[1].length : 0,
      hasSpecialChars: srcMatch
        ? /[\u0000-\u001F\u007F-\u009F]/.test(srcMatch[1])
        : false,
      contextBefore: before.slice(-50),
      contextAfter: after.slice(0, 50),
      inFigure: before.includes('<figure'),
      inDiv: before.includes('<div class='),
    };
  });

  // البحث عن الصور المكررة
  const imageUrls = new Map<string, number>();
  images.forEach((img) => {
    const srcMatch = img.match(/src="([^"]*)"/i);
    if (srcMatch) {
      const url = srcMatch[1];
      const count = imageUrls.get(url) || 0;
      imageUrls.set(url, count + 1);
    }
  });

  const duplicates = Array.from(imageUrls.entries())
    .filter(([_, count]) => count > 1)
    .map(([url, count]) => ({ url, count }));

  return {
    contentLength: content.length,
    imageCount: images.length,
    images: imageAnalysis,
    duplicates,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'لم يتم إرسال محتوى للتحليل' },
        { status: 400 }
      );
    }

    console.log('[Debug Content] Analyzing content...');

    // تحليل المحتوى الأصلي
    const originalAnalysis = analyzeContent(content);

    // تنظيف المحتوى
    const sanitized = sanitizeImageUrls(content);

    // تحليل المحتوى بعد التنظيف
    const sanitizedAnalysis = analyzeContent(sanitized);

    // مقارنة النتائج
    const comparison = {
      lengthDifference: content.length - sanitized.length,
      contentChanged: content !== sanitized,
      imageCountChanged:
        originalAnalysis.imageCount !== sanitizedAnalysis.imageCount,
    };

    return NextResponse.json({
      success: true,
      data: {
        original: originalAnalysis,
        sanitized: sanitizedAnalysis,
        comparison,
        // إرسال عينة من المحتوى للمراجعة (أول 500 حرف)
        originalSample: content.substring(0, 500),
        sanitizedSample: sanitized.substring(0, 500),
      },
    });
  } catch (error) {
    console.error('[Debug Content] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء تحليل المحتوى',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
