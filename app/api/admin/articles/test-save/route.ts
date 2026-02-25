/**
 * API اختبار حفظ المقال (بدون حفظ فعلي)
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * تنظيف وتصحيح URLs الصور في المحتوى - نسخة مبسطة للاختبار
 */
function sanitizeImageUrls(content: string): string {
  if (!content) return content;

  let sanitized = content;

  try {
    // إصلاح الصور المكسورة أو غير المكتملة
    sanitized = sanitized.replace(
      /<img([^>]*?)src="([^"]*)"([^>]*?)>/gi,
      (match, before, src, after) => {
        try {
          // تنظيف URL من الأحرف الخاصة
          let cleanSrc = src
            .replace(/[\u0000-\u001F\u007F]/g, '') // إزالة أحرف التحكم فقط
            .replace(/\s+/g, '%20') // استبدال المسافات
            .replace(/"/g, '%22') // استبدال علامات الاقتباس
            .replace(/'/g, '%27') // استبدال الفاصلة العليا
            .trim();

          // التحقق من صحة URL
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

          // إذا كان URL غير صالح، نحاول إصلاحه
          if (cleanSrc && cleanSrc.length > 5) {
            cleanSrc = 'https://' + cleanSrc.replace(/^\/+/, '');
            const cleanBefore = before.replace(/[\u0000-\u001F\u007F]/g, '');
            const cleanAfter = after.replace(/[\u0000-\u001F\u007F]/g, '');
            return `<img${cleanBefore}src="${cleanSrc}"${cleanAfter}>`;
          }

          // URL غير صالح تماماً - إزالة الصورة
          return '';
        } catch (e) {
          console.error('[sanitizeImageUrls] Error processing image:', e);
          return match;
        }
      }
    );

    // إزالة الصور التي تحتوي على URLs فارغة أو غير صالحة
    sanitized = sanitized.replace(/<img[^>]*src=""[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="undefined"[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="null"[^>]*>/gi, '');

    // إصلاح علامات img غير المغلقة
    sanitized = sanitized.replace(
      /<img([^>]*[^\/])>(?!<\/img>)/gi,
      '<img$1 />'
    );
  } catch (error) {
    console.error('[sanitizeImageUrls] General error:', error);
    return content;
  }

  return sanitized;
}

/**
 * التحقق من صحة المحتوى قبل الحفظ - نسخة للاختبار
 */
function validateContent(content: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
  warnings: string[];
} {
  if (!content) {
    return { valid: true, sanitized: '', warnings: [] };
  }

  const warnings: string[] = [];

  try {
    // تنظيف المحتوى
    let sanitized = sanitizeImageUrls(content);

    // التحقق من وجود أحرف غير صالحة
    const invalidChars = sanitized.match(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g
    );
    if (invalidChars) {
      warnings.push(
        `تم العثور على ${invalidChars.length} حرف غير صالح وتم إزالته`
      );
      sanitized = sanitized.replace(
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
        ''
      );
    }

    // التحقق من حجم المحتوى
    if (sanitized.length > 10000000) {
      // 10MB
      return {
        valid: false,
        error: 'حجم المحتوى كبير جداً (أكثر من 10MB)',
        sanitized,
        warnings,
      };
    }

    // فحص الصور المكررة
    const imageMatches = sanitized.match(/<img[^>]*>/gi) || [];
    const imageUrls = new Map<string, number>();

    for (const imgTag of imageMatches) {
      const srcMatch = imgTag.match(/src="([^"]*)"/i);
      if (srcMatch) {
        const url = srcMatch[1];
        const count = imageUrls.get(url) || 0;
        imageUrls.set(url, count + 1);
      }
    }

    const duplicates = Array.from(imageUrls.entries())
      .filter(([_, count]) => count > 1)
      .map(([url, count]) => ({ url, count }));

    if (duplicates.length > 0) {
      warnings.push(`تم العثور على ${duplicates.length} صورة مكررة`);
      duplicates.forEach((dup) => {
        warnings.push(
          `الصورة ${dup.url.substring(0, 50)}... مكررة ${dup.count} مرات`
        );
      });
    }

    // فحص الصور المكسورة
    const brokenImages = imageMatches.filter((img) => {
      const srcMatch = img.match(/src="([^"]*)"/i);
      return !srcMatch || !srcMatch[1] || srcMatch[1].length < 5;
    });

    if (brokenImages.length > 0) {
      warnings.push(`تم العثور على ${brokenImages.length} صورة مكسورة`);
    }

    return { valid: true, sanitized, warnings };
  } catch (error) {
    console.error('[validateContent] Error:', error);
    return {
      valid: false,
      error: 'حدث خطأ أثناء معالجة المحتوى',
      sanitized: content,
      warnings,
    };
  }
}

// POST - اختبار حفظ المقال (بدون حفظ فعلي)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, dryRun = true } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'لا يوجد محتوى للاختبار' },
        { status: 400 }
      );
    }

    console.log(`[Test Save] Processing content, length: ${content.length}`);

    // التحقق من صحة المحتوى
    const validation = validateContent(content);

    if (!validation.valid) {
      console.error(`[Test Save] Validation failed: ${validation.error}`);
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          warnings: validation.warnings,
          testMode: true,
        },
        { status: 400 }
      );
    }

    // محاكاة عملية الحفظ
    const contentSize = validation.sanitized.length;
    console.log(`[Test Save] Content size: ${contentSize} chars`);

    // تحذير إذا كان المحتوى كبير جداً
    if (contentSize > 5000000) {
      // 5MB
      console.warn(`[Test Save] Content too large: ${contentSize} chars`);
      return NextResponse.json(
        {
          success: false,
          error: 'حجم المحتوى كبير جداً. يرجى تقليل عدد الصور أو حجم المحتوى.',
          warnings: validation.warnings,
          testMode: true,
        },
        { status: 413 }
      );
    }

    // محاكاة تأخير قاعدة البيانات
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`[Test Save] Success - dry run mode`);

    return NextResponse.json({
      success: true,
      message: 'اختبار الحفظ نجح - لم يتم الحفظ الفعلي',
      data: {
        originalLength: content.length,
        sanitizedLength: validation.sanitized.length,
        warnings: validation.warnings,
        testMode: true,
        dryRun: true,
      },
    });
  } catch (error) {
    console.error('Test save error:', error);

    const errorMessage = String(error);

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في اختبار الحفظ',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        testMode: true,
      },
      { status: 500 }
    );
  }
}
