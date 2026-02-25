/**
 * سكريبت لتشخيص مشكلة حفظ المقالات مع الصور
 */

const fs = require('fs');
const path = require('path');

// محاكاة دوال التنظيف من API
function sanitizeImageUrls(content) {
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

    // إزالة الصور التي تحتوي على URLs فارغة أو غير صالحة
    sanitized = sanitized.replace(/<img[^>]*src=""[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="undefined"[^>]*>/gi, '');
    sanitized = sanitized.replace(/<img[^>]*src="null"[^>]*>/gi, '');

    // إصلاح علامات img غير المغلقة
    sanitized = sanitized.replace(
      /<img([^>]*[^\/])>(?!<\/img>)/gi,
      '<img$1 />'
    );

    // إصلاح الصور المكررة في نفس المكان
    sanitized = sanitized.replace(
      /(<img[^>]*src="([^"]*)"[^>]*>)\s*\1/gi,
      '$1'
    );
  } catch (error) {
    console.error('[sanitizeImageUrls] General error:', error);
    return content;
  }

  return sanitized;
}

function analyzeContent(content) {
  console.log('\n=== تحليل المحتوى ===');
  console.log(`طول المحتوى: ${content.length} حرف`);

  // البحث عن الصور
  const images = content.match(/<img[^>]*>/gi) || [];
  console.log(`عدد الصور: ${images.length}`);

  // تحليل كل صورة
  images.forEach((img, index) => {
    console.log(`\nصورة ${index + 1}:`);
    console.log(`HTML: ${img}`);

    const srcMatch = img.match(/src="([^"]*)"/i);
    if (srcMatch) {
      console.log(`URL: ${srcMatch[1]}`);
      console.log(`طول URL: ${srcMatch[1].length}`);

      // البحث عن أحرف خاصة
      const specialChars = srcMatch[1].match(/[\u0000-\u001F\u007F-\u009F]/g);
      if (specialChars) {
        console.log(`أحرف خاصة موجودة: ${specialChars.join(', ')}`);
      }
    }

    // البحث عن السياق
    const imgIndex = content.indexOf(img);
    const before = content.substring(Math.max(0, imgIndex - 100), imgIndex);
    const after = content.substring(
      imgIndex + img.length,
      Math.min(content.length, imgIndex + img.length + 100)
    );

    console.log(`السياق قبل الصورة: ${before.slice(-50)}`);
    console.log(`السياق بعد الصورة: ${after.slice(0, 50)}`);

    // التحقق من وجود figure أو div
    if (before.includes('<figure')) {
      console.log('الصورة داخل figure');
    }
    if (before.includes('<div class=')) {
      console.log('الصورة داخل div منسق');
    }
  });

  // البحث عن الصور المكررة
  const imageUrls = new Map();
  images.forEach((img) => {
    const srcMatch = img.match(/src="([^"]*)"/i);
    if (srcMatch) {
      const url = srcMatch[1];
      const count = imageUrls.get(url) || 0;
      imageUrls.set(url, count + 1);
    }
  });

  console.log('\n=== الصور المكررة ===');
  imageUrls.forEach((count, url) => {
    if (count > 1) {
      console.log(`URL مكرر ${count} مرات: ${url}`);
    }
  });
}

// دالة لاختبار المحتوى
function testContent(content) {
  console.log('=== اختبار المحتوى الأصلي ===');
  analyzeContent(content);

  console.log('\n=== اختبار المحتوى بعد التنظيف ===');
  const sanitized = sanitizeImageUrls(content);
  analyzeContent(sanitized);

  console.log('\n=== مقارنة الطول ===');
  console.log(`الأصلي: ${content.length} حرف`);
  console.log(`بعد التنظيف: ${sanitized.length} حرف`);
  console.log(`الفرق: ${content.length - sanitized.length} حرف`);

  if (content !== sanitized) {
    console.log('\n=== تم تعديل المحتوى ===');
    // حفظ النتائج للمقارنة
    fs.writeFileSync('debug-original.html', content, 'utf8');
    fs.writeFileSync('debug-sanitized.html', sanitized, 'utf8');
    console.log('تم حفظ الملفات: debug-original.html و debug-sanitized.html');
  } else {
    console.log('\n=== لم يتم تعديل المحتوى ===');
  }
}

// مثال للاختبار
const sampleContent = `
<p>هذا مثال على مقال يحتوي على صور.</p>

<figure class="my-8">
  <img src="https://example.com/image1.jpg" alt="صورة 1" class="w-full rounded-2xl shadow-lg" loading="lazy" />
  <figcaption class="text-center text-sm text-gray-500 mt-3">صورة توضيحية 1</figcaption>
</figure>

<p>فقرة أخرى مع صورة مختلفة.</p>

<img src="https://example.com/image2.jpg" alt="صورة 2" class="rounded-xl" />

<p>نفس الصورة الأولى في مكان آخر:</p>

<img src="https://example.com/image1.jpg" alt="صورة 1 مكررة" />
`;

console.log('🔍 بدء تشخيص مشكلة حفظ المقالات...\n');

// اختبار المحتوى النموذجي
testContent(sampleContent);

console.log('\n✅ انتهى التشخيص. يمكنك الآن اختبار محتوى مقالك الفعلي.');
console.log('لاختبار محتوى مقال معين، استبدل sampleContent بمحتوى مقالك.');
