/**
 * خدمة البحث عن الصور المحسنة
 */

export interface ImageSearchOptions {
  query: string;
  count: number;
  category?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  minWidth?: number;
  minHeight?: number;
}

export interface ImageResult {
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer?: string;
  source: string;
}

export interface SearchResult {
  images: ImageResult[];
  totalResults: number;
  query: string;
  translatedQuery?: string;
}

export class ImageSearchService {
  private arabicToEnglishDict: { [key: string]: string } = {
    // الطبيعة والبيئة
    طبيعة: 'nature',
    شجرة: 'tree',
    زهرة: 'flower',
    بحر: 'sea',
    جبل: 'mountain',
    سماء: 'sky',
    غروب: 'sunset',
    شروق: 'sunrise',
    نهر: 'river',
    غابة: 'forest',
    صحراء: 'desert',
    مطر: 'rain',
    ثلج: 'snow',

    // التكنولوجيا
    تكنولوجيا: 'technology',
    كمبيوتر: 'computer',
    هاتف: 'phone',
    إنترنت: 'internet',
    برمجة: 'programming',
    ذكي: 'smart',
    رقمي: 'digital',
    تطبيق: 'application',
    موقع: 'website',
    شبكة: 'network',

    // الطعام والشراب
    طعام: 'food',
    فاكهة: 'fruit',
    خضار: 'vegetables',
    لحم: 'meat',
    خبز: 'bread',
    قهوة: 'coffee',
    شاي: 'tea',
    ماء: 'water',
    عصير: 'juice',
    حلوى: 'dessert',

    // الرياضة والصحة
    رياضة: 'sport',
    كرة: 'ball',
    جري: 'running',
    سباحة: 'swimming',
    صحة: 'health',
    طبيب: 'doctor',
    مستشفى: 'hospital',
    دواء: 'medicine',
    تمرين: 'exercise',

    // التعليم والعمل
    تعليم: 'education',
    مدرسة: 'school',
    جامعة: 'university',
    كتاب: 'book',
    قلم: 'pen',
    عمل: 'work',
    مكتب: 'office',
    اجتماع: 'meeting',
    مشروع: 'project',

    // السفر والسياحة
    سفر: 'travel',
    سياحة: 'tourism',
    طائرة: 'airplane',
    فندق: 'hotel',
    شاطئ: 'beach',
    مدينة: 'city',
    قرية: 'village',
    طريق: 'road',
    جسر: 'bridge',

    // الفن والثقافة
    فن: 'art',
    رسم: 'painting',
    موسيقى: 'music',
    مسرح: 'theater',
    سينما: 'cinema',
    ثقافة: 'culture',
    تاريخ: 'history',
    متحف: 'museum',

    // الأسرة والمجتمع
    أسرة: 'family',
    طفل: 'child',
    أم: 'mother',
    أب: 'father',
    زواج: 'wedding',
    حب: 'love',
    صداقة: 'friendship',
    مجتمع: 'community',

    // الأعمال والمال
    أعمال: 'business',
    مال: 'money',
    بنك: 'bank',
    استثمار: 'investment',
    تجارة: 'commerce',
    سوق: 'market',
    شركة: 'company',
    نجاح: 'success',
  };

  /**
   * البحث عن صور مع ترجمة تلقائية
   */
  async searchImages(options: ImageSearchOptions): Promise<SearchResult> {
    const translatedQuery = this.translateQuery(options.query);

    try {
      // البحث بالاستعلام المترجم أولاً
      const response = await fetch('/api/images/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: translatedQuery,
          count: options.count,
          category: options.category,
          orientation: options.orientation,
          min_width: options.minWidth,
          min_height: options.minHeight,
        }),
      });

      const data = await response.json();

      if (data.success && data.images && data.images.length > 0) {
        return {
          images: data.images.map((url: string, index: number) => ({
            url,
            thumbnailUrl: url,
            width: 800,
            height: 600,
            alt: this.generateAltText(options.query, index),
            source: 'pexels',
          })),
          totalResults: data.images.length,
          query: options.query,
          translatedQuery:
            translatedQuery !== options.query ? translatedQuery : undefined,
        };
      }

      // إذا لم تنجح الترجمة، جرب الاستعلام الأصلي
      if (translatedQuery !== options.query) {
        const fallbackResponse = await fetch('/api/images/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: options.query,
            count: options.count,
          }),
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackData.success && fallbackData.images) {
          return {
            images: fallbackData.images.map((url: string, index: number) => ({
              url,
              thumbnailUrl: url,
              width: 800,
              height: 600,
              alt: this.generateAltText(options.query, index),
              source: 'pexels',
            })),
            totalResults: fallbackData.images.length,
            query: options.query,
          };
        }
      }

      return {
        images: [],
        totalResults: 0,
        query: options.query,
        translatedQuery:
          translatedQuery !== options.query ? translatedQuery : undefined,
      };
    } catch (error) {
      console.error('Image search error:', error);
      return {
        images: [],
        totalResults: 0,
        query: options.query,
      };
    }
  }

  /**
   * ترجمة الاستعلام من العربية إلى الإنجليزية
   */
  private translateQuery(query: string): string {
    const words = query.toLowerCase().split(/\s+/);
    const translatedWords = words.map((word) => {
      // إزالة علامات الترقيم
      const cleanWord = word.replace(
        /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,
        ''
      );

      // البحث في القاموس
      if (this.arabicToEnglishDict[cleanWord]) {
        return this.arabicToEnglishDict[cleanWord];
      }

      // البحث عن تطابق جزئي
      for (const [arabic, english] of Object.entries(
        this.arabicToEnglishDict
      )) {
        if (cleanWord.includes(arabic) || arabic.includes(cleanWord)) {
          return english;
        }
      }

      return word; // إرجاع الكلمة كما هي إذا لم توجد ترجمة
    });

    return translatedWords.join(' ');
  }

  /**
   * توليد نص بديل للصورة
   */
  private generateAltText(query: string, index: number): string {
    const baseAlt = `صورة توضيحية عن ${query}`;
    return index === 0 ? baseAlt : `${baseAlt} ${index + 1}`;
  }

  /**
   * البحث عن صور مناسبة للموضوع
   */
  async findRelevantImages(
    content: string,
    count: number = 5
  ): Promise<ImageResult[]> {
    // استخراج الكلمات المفتاحية من المحتوى
    const keywords = this.extractKeywords(content);

    if (keywords.length === 0) {
      return [];
    }

    // البحث باستخدام أهم الكلمات المفتاحية
    const searchQuery = keywords.slice(0, 3).join(' ');
    const result = await this.searchImages({
      query: searchQuery,
      count,
      orientation: 'landscape',
    });

    return result.images;
  }

  /**
   * استخراج الكلمات المفتاحية من المحتوى
   */
  private extractKeywords(content: string): string[] {
    // إزالة HTML وتنظيف النص
    const text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // تقسيم إلى كلمات
    const words = text.split(/\s+/);

    // حساب تكرار الكلمات
    const wordFreq: { [key: string]: number } = {};
    words.forEach((word) => {
      const cleanWord = word
        .toLowerCase()
        .replace(
          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,
          ''
        );
      if (cleanWord.length > 3) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // ترتيب الكلمات حسب التكرار
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * اقتراح صور بناءً على العناوين
   */
  async suggestImagesForHeadings(
    content: string
  ): Promise<{ heading: string; images: ImageResult[] }[]> {
    const headings = this.extractHeadings(content);
    const suggestions: { heading: string; images: ImageResult[] }[] = [];

    for (const heading of headings.slice(0, 5)) {
      // أول 5 عناوين فقط
      const result = await this.searchImages({
        query: heading,
        count: 3,
      });

      if (result.images.length > 0) {
        suggestions.push({
          heading,
          images: result.images,
        });
      }
    }

    return suggestions;
  }

  /**
   * استخراج العناوين من المحتوى
   */
  private extractHeadings(content: string): string[] {
    const headingMatches =
      content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
    return headingMatches.map((match) => {
      return match.replace(/<[^>]*>/g, '').trim();
    });
  }

  /**
   * تحسين جودة البحث بناءً على السياق
   */
  async smartSearch(
    content: string,
    topic: string,
    count: number = 5
  ): Promise<ImageResult[]> {
    // دمج الموضوع مع الكلمات المفتاحية من المحتوى
    const keywords = this.extractKeywords(content);
    const combinedQuery = [topic, ...keywords.slice(0, 2)].join(' ');

    const result = await this.searchImages({
      query: combinedQuery,
      count,
      orientation: 'landscape',
      minWidth: 800,
    });

    return result.images;
  }
}

export default ImageSearchService;
