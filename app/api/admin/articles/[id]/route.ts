/**
 * API المقال الفردي - GET, PUT, DELETE
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getArticleById,
  updateArticle,
  deleteArticle,
  type ArticleInput,
} from '@/lib/db/articles';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - جلب مقال واحد
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    const article = await getArticleById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب المقال',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * تنظيف وتصحيح URLs الصور في المحتوى - نسخة محسنة
 */
function sanitizeImageUrls(content: string): string {
  if (!content) return content;

  let sanitized = content;

  try {
    // إصلاح الصور المكسورة أو غير المكتملة
    // 1. إصلاح الصور التي تحتوي على علامات اقتباس مزدوجة داخل src
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
            // تنظيف before و after من أحرف التحكم فقط
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

    // 2. إزالة الصور التي تحتوي على URLs فارغة أو غير صالحة
    sanitized = sanitized.replace(/<img[^>]*src=""[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="undefined"[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="null"[^>]*>/gi, '');

    // 3. إصلاح علامات img غير المغلقة
    sanitized = sanitized.replace(
      /<img([^>]*[^\/])>(?!<\/img>)/gi,
      '<img$1 />'
    );

    // 4. إصلاح الصور المكررة في نفس المكان
    sanitized = sanitized.replace(
      /(<img[^>]*src="([^"]*)"[^>]*>)\s*\1/gi,
      '$1'
    );
  } catch (error) {
    console.error('[sanitizeImageUrls] General error:', error);
    // في حالة الخطأ، نعيد المحتوى الأصلي
    return content;
  }

  return sanitized;
}

/**
 * التحقق من صحة المحتوى قبل الحفظ - نسخة محسنة
 */
function validateContent(content: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
} {
  if (!content) {
    return { valid: true, sanitized: '' };
  }

  try {
    // تنظيف المحتوى
    let sanitized = sanitizeImageUrls(content);

    // إصلاح HTML المكسور
    sanitized = fixBrokenHtml(sanitized);

    // التحقق من وجود أحرف غير صالحة
    const invalidChars = sanitized.match(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g
    );
    if (invalidChars) {
      // إزالة الأحرف غير الصالحة
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
      };
    }

    // التحقق من صحة HTML للصور
    const imageValidation = validateImageHtml(sanitized);
    if (!imageValidation.valid) {
      return {
        valid: false,
        error: imageValidation.error,
        sanitized: imageValidation.sanitized,
      };
    }

    return { valid: true, sanitized: imageValidation.sanitized };
  } catch (error) {
    console.error('[validateContent] Error:', error);
    return {
      valid: false,
      error: 'حدث خطأ أثناء معالجة المحتوى. يرجى المحاولة مرة أخرى.',
      sanitized: content,
    };
  }
}

/**
 * التحقق من صحة HTML الخاص بالصور
 */
function validateImageHtml(content: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
} {
  try {
    let sanitized = content;

    // البحث عن الصور المكررة في نفس المكان
    const imageMatches = content.match(/<img[^>]*>/gi) || [];
    const imageUrls = new Map<string, number>();

    for (const imgTag of imageMatches) {
      const srcMatch = imgTag.match(/src="([^"]*)"/i);
      if (srcMatch) {
        const url = srcMatch[1];
        const count = imageUrls.get(url) || 0;
        imageUrls.set(url, count + 1);

        // إذا كانت نفس الصورة مكررة أكثر من 3 مرات في مكان قريب
        if (count > 2) {
          const imgIndex = content.indexOf(imgTag);
          const surroundingText = content.substring(
            Math.max(0, imgIndex - 200),
            Math.min(content.length, imgIndex + imgTag.length + 200)
          );

          // إذا كانت الصور المكررة في نفس الفقرة أو القسم
          const duplicateCount = (
            surroundingText.match(new RegExp(escapeRegExp(url), 'gi')) || []
          ).length;
          if (duplicateCount > 2) {
            return {
              valid: false,
              error: `تم العثور على نفس الصورة مكررة ${duplicateCount} مرات في نفس المكان. يرجى إزالة الصور المكررة.`,
              sanitized: content,
            };
          }
        }
      }
    }

    // إصلاح الصور المكسورة في السياق
    sanitized = sanitized.replace(
      /(<figure[^>]*>)\s*(<img[^>]*>)\s*(<img[^>]*>)\s*(<\/figure>)/gi,
      (match, figureStart, img1, img2, figureEnd) => {
        // إذا كانت نفس الصورة مكررة داخل figure
        const src1 = img1.match(/src="([^"]*)"/i)?.[1];
        const src2 = img2.match(/src="([^"]*)"/i)?.[1];
        if (src1 === src2) {
          return figureStart + img1 + figureEnd;
        }
        return match;
      }
    );

    return { valid: true, sanitized };
  } catch (error) {
    console.error('[validateImageHtml] Error:', error);
    return { valid: true, sanitized: content };
  }
}

/**
 * تحويل النص إلى regex آمن
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * إصلاح HTML المكسور
 */
function fixBrokenHtml(content: string): string {
  let fixed = content;

  // 1. إصلاح علامات figure غير المغلقة
  const figureOpens = (fixed.match(/<figure/gi) || []).length;
  const figureCloses = (fixed.match(/<\/figure>/gi) || []).length;
  if (figureOpens > figureCloses) {
    for (let i = 0; i < figureOpens - figureCloses; i++) {
      fixed += '</figure>';
    }
  }

  // 2. إصلاح علامات div غير المغلقة
  const divOpens = (fixed.match(/<div/gi) || []).length;
  const divCloses = (fixed.match(/<\/div>/gi) || []).length;
  if (divOpens > divCloses) {
    for (let i = 0; i < divOpens - divCloses; i++) {
      fixed += '</div>';
    }
  }

  // 3. إصلاح علامات p غير المغلقة
  const pOpens = (fixed.match(/<p[^>]*>/gi) || []).length;
  const pCloses = (fixed.match(/<\/p>/gi) || []).length;
  if (pOpens > pCloses) {
    for (let i = 0; i < pOpens - pCloses; i++) {
      fixed += '</p>';
    }
  }

  // 4. إزالة علامات HTML المكسورة (مثل < بدون >)
  fixed = fixed.replace(/<(?![a-zA-Z\/!])/g, '&lt;');

  // 5. إصلاح الـ attributes المكسورة في الصور
  fixed = fixed.replace(
    /<img([^>]*?)class="([^"]*)"([^>]*?)class="([^"]*)"([^>]*?)>/gi,
    (match, b1, c1, b2, c2, b3) => {
      // دمج الـ classes
      return `<img${b1}class="${c1} ${c2}"${b2}${b3}>`;
    }
  );

  return fixed;
}

// PUT - تحديث مقال
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'خطأ في تنسيق البيانات المرسلة. تأكد من صحة المحتوى.',
        },
        { status: 400 }
      );
    }

    // تنظيف والتحقق من المحتوى
    if (body.content) {
      console.log(
        `[Article Update] Processing content for article ${articleId}`
      );
      console.log(
        `[Article Update] Original content length: ${body.content.length}`
      );

      const validation = validateContent(body.content);
      if (!validation.valid) {
        console.error(
          `[Article Update] Content validation failed: ${validation.error}`
        );
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }

      console.log(
        `[Article Update] Content sanitized, new length: ${validation.sanitized.length}`
      );
      body.content = validation.sanitized;
    }

    // التحقق من حجم المحتوى
    const contentSize = body.content ? body.content.length : 0;
    console.log(
      `[Article Update] ID: ${articleId}, Content size: ${contentSize} chars`
    );

    // تحذير إذا كان المحتوى كبير جداً
    if (contentSize > 5000000) {
      // 5MB
      console.warn(`[Article Update] Content too large: ${contentSize} chars`);
      return NextResponse.json(
        {
          success: false,
          error: 'حجم المحتوى كبير جداً. يرجى تقليل عدد الصور أو حجم المحتوى.',
        },
        { status: 413 }
      );
    }

    const input: Partial<ArticleInput> = {};

    if (body.title !== undefined) input.title = body.title;
    if (body.slug !== undefined) input.slug = body.slug;
    if (body.content !== undefined) input.content = body.content;
    if (body.excerpt !== undefined) input.excerpt = body.excerpt;
    if (body.image !== undefined) input.image = body.image;
    if (body.featured_image !== undefined)
      input.featured_image = body.featured_image;
    if (body.category_id !== undefined) input.category_id = body.category_id;
    if (body.published !== undefined) input.published = body.published;
    if (body.featured !== undefined) input.featured = body.featured;
    if (body.meta_description !== undefined)
      input.meta_description = body.meta_description;
    if (body.meta_keywords !== undefined)
      input.meta_keywords = body.meta_keywords;
    if (body.ai_provider !== undefined) input.ai_provider = body.ai_provider;
    if (body.publish_date !== undefined) input.publish_date = body.publish_date;
    if (body.author !== undefined) input.author = body.author;

    let success;
    try {
      success = await updateArticle(articleId, input);
    } catch (dbError) {
      console.error('[Article Update] Database error:', dbError);
      const dbErrorMsg = String(dbError);

      // تحليل نوع الخطأ
      if (
        dbErrorMsg.includes('invalid byte sequence') ||
        dbErrorMsg.includes('encoding')
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'يوجد أحرف غير صالحة في المحتوى. جرب إزالة الصور وإعادة إضافتها.',
            details: 'مشكلة في ترميز الأحرف',
          },
          { status: 400 }
        );
      }

      if (
        dbErrorMsg.includes('value too long') ||
        dbErrorMsg.includes('too long')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'أحد الحقول طويل جداً. جرب تقليل حجم المحتوى أو عدد الصور.',
            details: 'تجاوز الحد المسموح',
          },
          { status: 400 }
        );
      }

      throw dbError;
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    const updatedArticle = await getArticleById(articleId);

    console.log(`[Article Update] Success for ID: ${articleId}`);
    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'تم تحديث المقال بنجاح',
    });
  } catch (error) {
    console.error('Error updating article:', error);

    const errorMessage = String(error);

    if (errorMessage.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'يوجد مقال بنفس الـ slug' },
        { status: 409 }
      );
    }

    // معالجة أخطاء قاعدة البيانات
    if (
      errorMessage.includes('too long') ||
      errorMessage.includes('value too long')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'المحتوى أو أحد الحقول طويل جداً. يرجى تقليل حجم المحتوى.',
        },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes('invalid byte sequence') ||
      errorMessage.includes('encoding')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'يوجد أحرف غير صالحة في المحتوى. يرجى إزالة الأحرف الخاصة.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث المقال',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف مقال
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    const success = await deleteArticle(articleId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف المقال',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
