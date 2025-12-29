/**
 * خدمة تحليل المحتوى المتقدمة
 */

export interface ContentMetrics {
  readabilityScore: number;
  seoScore: number;
  engagementScore: number;
  qualityScore: number;
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
  metaOptimization: MetaOptimization;
}

export interface SEOIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  fix: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MetaOptimization {
  titleSuggestions: string[];
  descriptionSuggestions: string[];
  keywordSuggestions: string[];
}

export interface ReadabilityAnalysis {
  score: number;
  level: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  suggestions: string[];
}

export class ContentAnalyzer {
  /**
   * تحليل شامل للمحتوى
   */
  analyzeContent(content: string): {
    metrics: ContentMetrics;
    seo: SEOAnalysis;
    readability: ReadabilityAnalysis;
  } {
    const text = this.extractText(content);

    return {
      metrics: this.calculateMetrics(content, text),
      seo: this.analyzeSEO(content, text),
      readability: this.analyzeReadability(text),
    };
  }

  /**
   * استخراج النص من HTML
   */
  private extractText(content: string): string {
    return content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * حساب المقاييس العامة
   */
  private calculateMetrics(content: string, text: string): ContentMetrics {
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const headings = (content.match(/<h[1-6][^>]*>/gi) || []).length;
    const images = (content.match(/<img[^>]*>/gi) || []).length;
    const links = (content.match(/<a[^>]*href/gi) || []).length;

    // نقاط القراءة
    const avgWordsPerSentence = words.length / (sentences.length || 1);
    const readabilityScore = Math.max(
      0,
      Math.min(100, 100 - (avgWordsPerSentence - 15) * 2)
    );

    // نقاط SEO
    const lengthScore = Math.min(25, (words.length / 300) * 25);
    const headingScore = headings > 0 ? 25 : 0;
    const imageScore = images > 0 ? 25 : 0;
    const linkScore = links > 0 ? 25 : 0;
    const seoScore = lengthScore + headingScore + imageScore + linkScore;

    // نقاط التفاعل
    const engagementScore = Math.min(
      100,
      headings * 10 + images * 5 + links * 3 + (words.length > 500 ? 20 : 0)
    );

    // نقاط الجودة الإجمالية
    const qualityScore = (readabilityScore + seoScore + engagementScore) / 3;

    return {
      readabilityScore: Math.round(readabilityScore),
      seoScore: Math.round(seoScore),
      engagementScore: Math.round(engagementScore),
      qualityScore: Math.round(qualityScore),
    };
  }

  /**
   * تحليل SEO
   */
  private analyzeSEO(content: string, text: string): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const suggestions: string[] = [];
    const words = text.split(/\s+/).filter(Boolean);

    // فحص طول المحتوى
    if (words.length < 300) {
      issues.push({
        type: 'warning',
        message: 'المحتوى قصير جداً',
        fix: 'أضف المزيد من المحتوى (الحد الأدنى 300 كلمة)',
        priority: 'high',
      });
    }

    // فحص العناوين
    const headings = content.match(/<h[1-6][^>]*>/gi) || [];
    if (headings.length === 0) {
      issues.push({
        type: 'error',
        message: 'لا توجد عناوين في المحتوى',
        fix: 'أضف عناوين H2 و H3 لتنظيم المحتوى',
        priority: 'high',
      });
    }

    // فحص الصور
    const images = content.match(/<img[^>]*>/gi) || [];
    if (images.length === 0) {
      issues.push({
        type: 'warning',
        message: 'لا توجد صور في المحتوى',
        fix: 'أضف صور توضيحية لتحسين التفاعل',
        priority: 'medium',
      });
    }

    // فحص alt text للصور
    const imagesWithoutAlt = images.filter((img) => !img.includes('alt='));
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'warning',
        message: `${imagesWithoutAlt.length} صورة بدون نص بديل`,
        fix: 'أضف نص بديل (alt text) لجميع الصور',
        priority: 'medium',
      });
    }

    // فحص الروابط
    const links = content.match(/<a[^>]*href/gi) || [];
    if (links.length === 0) {
      suggestions.push('أضف روابط داخلية وخارجية ذات صلة');
    }

    // حساب النقاط
    const score = Math.max(0, 100 - issues.length * 15);

    return {
      score: Math.round(score),
      issues,
      suggestions,
      metaOptimization: this.generateMetaOptimization(text),
    };
  }

  /**
   * تحليل سهولة القراءة
   */
  private analyzeReadability(text: string): ReadabilityAnalysis {
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    const avgWordsPerSentence = words.length / (sentences.length || 1);

    // تقدير متوسط المقاطع (تقريبي للعربية)
    const avgSyllablesPerWord =
      words.reduce((sum, word) => {
        return sum + Math.max(1, Math.ceil(word.length / 3));
      }, 0) / words.length;

    // حساب نقاط سهولة القراءة (معدل للعربية)
    const score =
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    const normalizedScore = Math.max(0, Math.min(100, score));

    let level: ReadabilityAnalysis['level'];
    if (normalizedScore >= 80) level = 'very-easy';
    else if (normalizedScore >= 60) level = 'easy';
    else if (normalizedScore >= 40) level = 'medium';
    else if (normalizedScore >= 20) level = 'hard';
    else level = 'very-hard';

    const suggestions: string[] = [];
    if (avgWordsPerSentence > 20) {
      suggestions.push('استخدم جمل أقصر (أقل من 20 كلمة)');
    }
    if (normalizedScore < 60) {
      suggestions.push('استخدم كلمات أبسط وأكثر شيوعاً');
      suggestions.push('قسم الفقرات الطويلة إلى فقرات أصغر');
    }

    return {
      score: Math.round(normalizedScore),
      level,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
      suggestions,
    };
  }

  /**
   * توليد اقتراحات تحسين الميتا
   */
  private generateMetaOptimization(text: string): MetaOptimization {
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    // استخراج الكلمات المفتاحية الأكثر تكراراً
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

    const topKeywords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    return {
      titleSuggestions: [
        sentences[0]?.substring(0, 60) + '...' || 'عنوان المقال',
        `دليل شامل: ${topKeywords.slice(0, 2).join(' و')}`,
        `كل ما تحتاج معرفته عن ${topKeywords[0] || 'الموضوع'}`,
      ],
      descriptionSuggestions: [
        sentences[0]?.substring(0, 150) + '...' || 'وصف المقال',
        `اكتشف ${topKeywords.slice(0, 3).join('، ')} في هذا المقال الشامل`,
        `دليل مفصل يغطي ${topKeywords
          .slice(0, 2)
          .join(' و')} بطريقة سهلة ومفهومة`,
      ],
      keywordSuggestions: topKeywords.slice(0, 5),
    };
  }

  /**
   * اقتراح تحسينات للمحتوى
   */
  suggestImprovements(content: string): string[] {
    const analysis = this.analyzeContent(content);
    const suggestions: string[] = [];

    if (analysis.metrics.seoScore < 70) {
      suggestions.push('أضف المزيد من العناوين والصور لتحسين SEO');
    }

    if (analysis.readability.score < 60) {
      suggestions.push('استخدم جمل أقصر وكلمات أبسط لتحسين سهولة القراءة');
    }

    if (analysis.metrics.engagementScore < 50) {
      suggestions.push('أضف المزيد من العناصر التفاعلية مثل القوائم والروابط');
    }

    return suggestions;
  }
}

export default ContentAnalyzer;
