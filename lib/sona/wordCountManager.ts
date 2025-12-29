/**
 * Word Count Manager - مدير عدد الكلمات
 * يتحكم في طول المقالات ويضمن أنها ضمن الحدود المطلوبة
 */

import { ArticleLength, TopicAnalysis } from './types';

// ============================================
// Word Count Limits
// ============================================

export const WORD_COUNT_LIMITS: Record<
  ArticleLength,
  { min: number; max: number }
> = {
  short: { min: 400, max: 600 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  comprehensive: { min: 2500, max: 4000 },
};

// ============================================
// Additional Content Templates
// ============================================

const ADDITIONAL_CONTENT_TEMPLATES = {
  tips: [
    'من النصائح المهمة في هذا الموضوع أن تحرص على التخطيط المسبق والاستعداد الجيد.',
    'ينصح الخبراء بالاهتمام بالتفاصيل الصغيرة التي تصنع الفرق الكبير.',
    'لا تنسَ أهمية المتابعة المستمرة والتقييم الدوري للنتائج.',
    'من الضروري الاستفادة من تجارب الآخرين والتعلم من أخطائهم.',
    'احرص على توثيق كل خطوة لتتمكن من المراجعة والتحسين لاحقاً.',
  ],
  facts: [
    'تشير الدراسات الحديثة إلى أهمية هذا الموضوع في حياتنا اليومية.',
    'يعتبر هذا الموضوع من المواضيع التي تحظى باهتمام متزايد في الآونة الأخيرة.',
    'هناك العديد من الجوانب المثيرة للاهتمام التي يمكن استكشافها في هذا المجال.',
    'يرتبط هذا الموضوع بشكل وثيق بجوانب أخرى من حياتنا.',
  ],
  benefits: [
    'من أهم الفوائد التي يمكن الحصول عليها هي تحسين جودة الحياة بشكل عام.',
    'يساعد فهم هذا الموضوع على اتخاذ قرارات أفضل وأكثر وعياً.',
    'يمكن أن يؤدي الاهتمام بهذا الجانب إلى نتائج إيجابية ملموسة.',
    'الاستثمار في هذا المجال يعود بالنفع على المدى الطويل.',
  ],
  conclusion_additions: [
    'نتمنى أن تكون هذه المعلومات قد أفادتكم وأضافت لمعرفتكم.',
    'لا تترددوا في مشاركة هذا المقال مع من تعتقدون أنه سيفيدهم.',
    'تابعونا للمزيد من المقالات المفيدة والمعلومات القيمة.',
    'نسعد بتلقي تعليقاتكم واستفساراتكم حول هذا الموضوع.',
  ],
};

// ============================================
// Word Count Manager Class
// ============================================

export class WordCountManager {
  /**
   * الحصول على حدود الكلمات لطول معين
   */
  getLimits(length: ArticleLength): { min: number; max: number } {
    return WORD_COUNT_LIMITS[length];
  }

  /**
   * عد الكلمات في المحتوى
   */
  countWords(content: string): number {
    const textOnly = content.replace(/<[^>]*>/g, ' ');
    const words = textOnly.split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  }

  /**
   * التحقق من أن المحتوى ضمن الحدود
   */
  isWithinLimits(content: string, length: ArticleLength): boolean {
    const wordCount = this.countWords(content);
    const limits = this.getLimits(length);
    return wordCount >= limits.min && wordCount <= limits.max;
  }

  /**
   * الحصول على حالة عدد الكلمات
   */
  getWordCountStatus(
    content: string,
    length: ArticleLength
  ): {
    wordCount: number;
    status: 'below' | 'within' | 'above';
    difference: number;
  } {
    const wordCount = this.countWords(content);
    const limits = this.getLimits(length);

    if (wordCount < limits.min) {
      return {
        wordCount,
        status: 'below',
        difference: limits.min - wordCount,
      };
    }

    if (wordCount > limits.max) {
      return {
        wordCount,
        status: 'above',
        difference: wordCount - limits.max,
      };
    }

    return {
      wordCount,
      status: 'within',
      difference: 0,
    };
  }

  /**
   * توسيع المحتوى لتحقيق الحد الأدنى من الكلمات
   */
  expandContent(
    content: string,
    analysis: TopicAnalysis,
    targetMin: number
  ): string {
    let expandedContent = content;
    let currentWordCount = this.countWords(expandedContent);

    // إذا كان المحتوى كافياً، لا نحتاج للتوسيع
    if (currentWordCount >= targetMin) {
      return expandedContent;
    }

    const wordsNeeded = targetMin - currentWordCount;

    // إضافة محتوى إضافي بناءً على الفئة
    const additionalSections: string[] = [];

    // إضافة قسم نصائح إذا لم يكن موجوداً
    if (!content.includes('نصائح') && wordsNeeded > 50) {
      const tipsSection = this.generateTipsSection(analysis);
      additionalSections.push(tipsSection);
    }

    // إضافة قسم فوائد إذا لم يكن موجوداً
    if (!content.includes('فوائد') && wordsNeeded > 100) {
      const benefitsSection = this.generateBenefitsSection(analysis);
      additionalSections.push(benefitsSection);
    }

    // إضافة حقائق إضافية
    if (wordsNeeded > 150) {
      const factsSection = this.generateFactsSection(analysis);
      additionalSections.push(factsSection);
    }

    // إدراج المحتوى الإضافي قبل الخاتمة
    if (additionalSections.length > 0) {
      const conclusionIndex = expandedContent.search(
        /<h2[^>]*>.*?(خاتمة|الخاتمة|ختام)/i
      );
      if (conclusionIndex > -1) {
        expandedContent =
          expandedContent.slice(0, conclusionIndex) +
          additionalSections.join('\n\n') +
          '\n\n' +
          expandedContent.slice(conclusionIndex);
      } else {
        // إذا لم توجد خاتمة، أضف في النهاية
        expandedContent += '\n\n' + additionalSections.join('\n\n');
      }
    }

    // إذا لا يزال المحتوى قصيراً، أضف فقرات إضافية للخاتمة
    currentWordCount = this.countWords(expandedContent);
    if (currentWordCount < targetMin) {
      const additionalConclusion = this.generateAdditionalConclusion();
      expandedContent = expandedContent.replace(
        /<\/p>\s*$/,
        `</p>\n<p>${additionalConclusion}</p>`
      );
    }

    return expandedContent;
  }

  /**
   * تقليص المحتوى للوصول للحد الأقصى
   */
  trimContent(content: string, targetMax: number): string {
    let trimmedContent = content;
    let currentWordCount = this.countWords(trimmedContent);

    // إذا كان المحتوى ضمن الحدود، لا نحتاج للتقليص
    if (currentWordCount <= targetMax) {
      return trimmedContent;
    }

    // استراتيجية التقليص:
    // 1. إزالة الفقرات الزائدة من الأقسام الطويلة
    // 2. تقصير القوائم الطويلة
    // 3. إزالة المحتوى المكرر

    // تقصير القوائم الطويلة
    trimmedContent = this.trimLongLists(trimmedContent);
    currentWordCount = this.countWords(trimmedContent);

    if (currentWordCount <= targetMax) {
      return trimmedContent;
    }

    // إزالة فقرات من الأقسام الطويلة
    trimmedContent = this.trimLongSections(trimmedContent, targetMax);

    return trimmedContent;
  }

  // ============================================
  // Helper Methods for Expansion
  // ============================================

  private generateTipsSection(analysis: TopicAnalysis): string {
    const tips = this.shuffleArray([
      ...ADDITIONAL_CONTENT_TEMPLATES.tips,
    ]).slice(0, 3);
    const topic = analysis.keywords[0] || 'هذا الموضوع';

    return `<h2>نصائح مهمة حول ${topic}</h2>
<p>إليكم بعض النصائح المفيدة:</p>
<ul>
${tips.map((tip) => `<li>${tip}</li>`).join('\n')}
</ul>`;
  }

  private generateBenefitsSection(analysis: TopicAnalysis): string {
    const benefits = this.shuffleArray([
      ...ADDITIONAL_CONTENT_TEMPLATES.benefits,
    ]).slice(0, 3);
    const topic = analysis.keywords[0] || 'هذا الموضوع';

    return `<h2>فوائد معرفة ${topic}</h2>
<p>هناك العديد من الفوائد التي يمكن الحصول عليها:</p>
<ul>
${benefits.map((benefit) => `<li>${benefit}</li>`).join('\n')}
</ul>`;
  }

  private generateFactsSection(analysis: TopicAnalysis): string {
    const facts = this.shuffleArray([
      ...ADDITIONAL_CONTENT_TEMPLATES.facts,
    ]).slice(0, 3);

    return `<h2>معلومات إضافية</h2>
<p>إليكم بعض المعلومات المفيدة:</p>
<ul>
${facts.map((fact) => `<li>${fact}</li>`).join('\n')}
</ul>`;
  }

  private generateAdditionalConclusion(): string {
    const additions = ADDITIONAL_CONTENT_TEMPLATES.conclusion_additions;
    return additions[Math.floor(Math.random() * additions.length)];
  }

  // ============================================
  // Helper Methods for Trimming
  // ============================================

  private trimLongLists(content: string): string {
    // تقصير القوائم التي تحتوي على أكثر من 7 عناصر
    return content.replace(/<ul>([\s\S]*?)<\/ul>/gi, (match, listContent) => {
      const items = listContent.match(/<li>[\s\S]*?<\/li>/gi) || [];
      if (items.length > 7) {
        const trimmedItems = items.slice(0, 5);
        return `<ul>\n${trimmedItems.join('\n')}\n</ul>`;
      }
      return match;
    });
  }

  private trimLongSections(content: string, targetMax: number): string {
    // تقسيم المحتوى إلى أقسام
    const sections = content.split(/<h2/i);

    if (sections.length <= 2) {
      return content; // لا يوجد ما يكفي من الأقسام للتقليص
    }

    // إزالة قسم واحد من المنتصف (ليس المقدمة أو الخاتمة)
    const middleIndex = Math.floor(sections.length / 2);
    sections.splice(middleIndex, 1);

    // إعادة بناء المحتوى
    let result = sections[0];
    for (let i = 1; i < sections.length; i++) {
      result += '<h2' + sections[i];
    }

    return result;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export singleton instance
export const wordCountManager = new WordCountManager();
