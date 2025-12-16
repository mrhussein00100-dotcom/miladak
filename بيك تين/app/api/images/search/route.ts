import { NextRequest, NextResponse } from 'next/server';
import { translateArabicTerm } from '@/lib/images/dictionary';

// قاموس سريع للترجمة (fallback)
const quickTranslations: Record<string, string> = {
  'عيد ميلاد': 'birthday celebration cake',
  احتفال: 'celebration party',
  كيكة: 'birthday cake',
  هدايا: 'gifts presents',
  بالونات: 'balloons party',
  شموع: 'candles birthday',
  حفلة: 'party celebration',
  سعادة: 'happiness joy',
  فرح: 'joy happy',
  حب: 'love heart',
  عائلة: 'family gathering',
  أطفال: 'children kids',
  طفل: 'child kid',
  زهور: 'flowers bouquet',
  ورد: 'roses flowers',
  طبيعة: 'nature landscape',
  سماء: 'sky clouds',
  بحر: 'sea ocean beach',
  جبال: 'mountains landscape',
  غروب: 'sunset sky',
  شروق: 'sunrise morning',
  نجوم: 'stars night sky',
  قمر: 'moon night',
  شمس: 'sun sunshine',
  ربيع: 'spring flowers',
  صيف: 'summer beach',
  خريف: 'autumn fall leaves',
  شتاء: 'winter snow',
  رمضان: 'ramadan islamic',
  عيد: 'eid celebration',
  مولود: 'newborn baby',
  زفاف: 'wedding marriage',
  تخرج: 'graduation celebration',
  نجاح: 'success achievement',
  صحة: 'health wellness',
  رياضة: 'sports fitness',
  طعام: 'food delicious',
  قهوة: 'coffee cup',
  كتاب: 'book reading',
  موسيقى: 'music instruments',
  فن: 'art creative',
  تكنولوجيا: 'technology digital',
  عمل: 'business work office',
  سفر: 'travel adventure',
  مدينة: 'city urban',
  ريف: 'countryside rural',
};

// دالة لترجمة النص العربي للإنجليزية
function translateToEnglish(arabicText: string): string {
  // تنظيف النص
  const cleanText = arabicText.trim().toLowerCase();

  // محاولة الترجمة من القاموس السريع أولاً
  for (const [arabic, english] of Object.entries(quickTranslations)) {
    if (cleanText.includes(arabic)) {
      return english;
    }
  }

  // محاولة الترجمة من قاعدة البيانات
  try {
    const translations = translateArabicTerm(cleanText);
    if (
      translations &&
      translations.length > 0 &&
      translations[0] !== cleanText
    ) {
      return translations[0];
    }
  } catch (e) {
    // تجاهل الأخطاء
  }

  // استخراج كلمات مفتاحية عامة من النص
  const keywords = extractKeywords(cleanText);
  if (keywords) {
    return keywords;
  }

  // fallback: استخدام كلمات عامة
  return 'celebration happy colorful';
}

// استخراج كلمات مفتاحية من النص
function extractKeywords(text: string): string | null {
  const keywordMap: Record<string, string> = {
    ميلاد: 'birthday',
    سنة: 'year celebration',
    عمر: 'age birthday',
    مبارك: 'blessed celebration',
    سعيد: 'happy joy',
    جميل: 'beautiful',
    رائع: 'amazing wonderful',
    حياة: 'life living',
    يوم: 'day special',
    ليلة: 'night evening',
    صباح: 'morning sunrise',
    مساء: 'evening sunset',
  };

  const found: string[] = [];
  for (const [arabic, english] of Object.entries(keywordMap)) {
    if (text.includes(arabic)) {
      found.push(english);
    }
  }

  return found.length > 0 ? found.join(' ') : null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const count = parseInt(searchParams.get('count') || '12');

  if (!query) {
    return NextResponse.json({
      success: false,
      error: 'يرجى إدخال كلمة البحث',
    });
  }

  const pexelsApiKey = process.env.PEXELS_API_KEY;

  if (!pexelsApiKey) {
    return NextResponse.json({
      success: false,
      error: 'PEXELS_API_KEY غير موجود',
    });
  }

  try {
    // ترجمة النص العربي للإنجليزية
    const englishQuery = translateToEnglish(query);
    console.log(`🔍 Searching images: "${query}" -> "${englishQuery}"`);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        englishQuery
      )}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: pexelsApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    const images = data.photos?.map((photo: any) => photo.src.large) || [];

    // إذا لم نجد صور، نبحث بكلمات عامة
    if (images.length === 0) {
      console.log('⚠️ No images found, trying fallback search...');
      const fallbackResponse = await fetch(
        `https://api.pexels.com/v1/search?query=celebration+colorful+happy&per_page=${count}&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsApiKey,
          },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackImages =
          fallbackData.photos?.map((photo: any) => photo.src.large) || [];

        return NextResponse.json({
          success: true,
          images: fallbackImages,
          total: fallbackData.total_results,
          translated: englishQuery,
          fallback: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      images,
      total: data.total_results,
      translated: englishQuery,
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في البحث عن الصور',
    });
  }
}
