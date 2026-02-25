/**
 * Section Manager - مدير أقسام المقال
 * يضمن اكتمال جميع أقسام المقال المطلوبة
 */

import { ArticleLength, TopicAnalysis } from './types';

// ============================================
// Required Sections Configuration
// ============================================

export interface RequiredSections {
  intro: boolean;
  mainSections: number; // minimum H2 sections
  faq: boolean;
  tips: boolean;
  conclusion: boolean;
}

export const REQUIRED_SECTIONS_CONFIG: Record<ArticleLength, RequiredSections> =
  {
    short: {
      intro: true,
      mainSections: 2,
      faq: false,
      tips: false,
      conclusion: true,
    },
    medium: {
      intro: true,
      mainSections: 3,
      faq: false,
      tips: true,
      conclusion: true,
    },
    long: {
      intro: true,
      mainSections: 4,
      faq: true,
      tips: true,
      conclusion: true,
    },
    comprehensive: {
      intro: true,
      mainSections: 5,
      faq: true,
      tips: true,
      conclusion: true,
    },
  };

// ============================================
// Section Check Result
// ============================================

export interface SectionCheckResult {
  hasIntro: boolean;
  h2Count: number;
  hasFaq: boolean;
  hasTips: boolean;
  hasConclusion: boolean;
  missingSections: string[];
}

// ============================================
// Default Section Templates
// ============================================

const DEFAULT_SECTIONS = {
  intro: (topic: string) => `<h2>مقدمة</h2>
<p>مرحباً بكم في هذا المقال الشامل عن <strong>${topic}</strong>. سنتناول في هذا المقال جميع الجوانب المهمة المتعلقة بهذا الموضوع، ونقدم لكم معلومات مفيدة ونصائح عملية.</p>
<p>تابعوا معنا لاكتشاف المزيد من التفاصيل والمعلومات القيمة.</p>`,

  conclusion: (topic: string) => `<h2>الخاتمة</h2>
<p>في الختام، نأمل أن يكون هذا المقال قد أفادكم في فهم <strong>${topic}</strong> بشكل أفضل. لقد تناولنا العديد من الجوانب المهمة التي نتمنى أن تكون مفيدة لكم.</p>
<p>لا تنسوا مشاركة هذا المقال مع أصدقائكم وأحبائكم، وتابعونا للمزيد من المقالات المفيدة على موقع ميلادك!</p>`,

  faq: (topic: string, questions: { q: string; a: string }[]) => {
    const defaultQuestions = [
      {
        q: `ما هي أهم المعلومات عن ${topic}؟`,
        a: `${topic} من المواضيع المهمة التي تستحق الاهتمام. يمكنك الاطلاع على التفاصيل في الأقسام السابقة من هذا المقال.`,
      },
      {
        q: `أين أجد المزيد من المعلومات؟`,
        a: `يمكنك زيارة موقع ميلادك للمزيد من المقالات والأدوات المفيدة المتعلقة بهذا الموضوع.`,
      },
      {
        q: `كيف أستفيد من هذه المعلومات؟`,
        a: `يمكنك تطبيق النصائح والمعلومات المذكورة في حياتك اليومية للحصول على أفضل النتائج.`,
      },
    ];

    const faqs = questions.length > 0 ? questions : defaultQuestions;

    return `<h2>الأسئلة الشائعة</h2>
${faqs
  .map(
    (faq) => `<h3>${faq.q}</h3>
<p>${faq.a}</p>`
  )
  .join('\n')}`;
  },

  tips: (topic: string, tips: string[]) => {
    const defaultTips = [
      `استفد من المعلومات المتاحة عن ${topic} لتحسين معرفتك`,
      `شارك هذا المقال مع من يهمه الأمر`,
      `تابعنا للمزيد من المقالات المفيدة`,
      `لا تتردد في طرح أسئلتك واستفساراتك`,
      `طبق النصائح المذكورة للحصول على أفضل النتائج`,
    ];

    const tipsList = tips.length > 0 ? tips : defaultTips.slice(0, 5);

    return `<h2>نصائح مهمة</h2>
<p>إليكم بعض النصائح المفيدة:</p>
<ul>
${tipsList.map((tip) => `<li>${tip}</li>`).join('\n')}
</ul>`;
  },
};

// ============================================
// Section Manager Class
// ============================================

export class SectionManager {
  /**
   * الحصول على الأقسام المطلوبة لطول معين
   */
  getRequiredSections(length: ArticleLength): RequiredSections {
    return REQUIRED_SECTIONS_CONFIG[length];
  }

  /**
   * فحص الأقسام الموجودة في المحتوى
   */
  checkSections(content: string): SectionCheckResult {
    const missingSections: string[] = [];

    const hasIntro = this.hasIntroduction(content);
    if (!hasIntro) missingSections.push('intro');

    const h2Count = this.countH2Sections(content);

    const hasFaq = this.hasFaqSection(content);
    const hasTips = this.hasTipsSection(content);
    const hasConclusion = this.hasConclusion(content);

    if (!hasConclusion) missingSections.push('conclusion');

    return {
      hasIntro,
      h2Count,
      hasFaq,
      hasTips,
      hasConclusion,
      missingSections,
    };
  }

  /**
   * التحقق من اكتمال المقال حسب الطول المطلوب
   */
  isComplete(content: string, length: ArticleLength): boolean {
    const required = this.getRequiredSections(length);
    const current = this.checkSections(content);

    if (required.intro && !current.hasIntro) return false;
    if (current.h2Count < required.mainSections) return false;
    if (required.faq && !current.hasFaq) return false;
    if (required.tips && !current.hasTips) return false;
    if (required.conclusion && !current.hasConclusion) return false;

    return true;
  }

  /**
   * إضافة الأقسام المفقودة
   */
  addMissingSections(
    content: string,
    analysis: TopicAnalysis,
    length: ArticleLength
  ): string {
    const required = this.getRequiredSections(length);
    const current = this.checkSections(content);
    let updatedContent = content;
    const topic = analysis.keywords[0] || 'هذا الموضوع';

    // إضافة المقدمة إذا كانت مفقودة
    if (required.intro && !current.hasIntro) {
      const intro = DEFAULT_SECTIONS.intro(topic);
      updatedContent = intro + '\n\n' + updatedContent;
    }

    // إضافة قسم النصائح إذا كان مطلوباً ومفقوداً
    if (required.tips && !current.hasTips) {
      const tips = DEFAULT_SECTIONS.tips(topic, []);
      // إضافة قبل الخاتمة أو في النهاية
      updatedContent = this.insertBeforeConclusion(updatedContent, tips);
    }

    // إضافة قسم FAQ إذا كان مطلوباً ومفقوداً
    if (required.faq && !current.hasFaq) {
      const faq = DEFAULT_SECTIONS.faq(topic, []);
      // إضافة قبل الخاتمة أو في النهاية
      updatedContent = this.insertBeforeConclusion(updatedContent, faq);
    }

    // إضافة الخاتمة إذا كانت مفقودة
    if (required.conclusion && !current.hasConclusion) {
      const conclusion = DEFAULT_SECTIONS.conclusion(topic);
      updatedContent = updatedContent + '\n\n' + conclusion;
    }

    return updatedContent;
  }

  /**
   * إضافة قسم معين
   */
  addSection(
    content: string,
    sectionType: 'intro' | 'conclusion' | 'faq' | 'tips',
    analysis: TopicAnalysis,
    customContent?: { questions?: { q: string; a: string }[]; tips?: string[] }
  ): string {
    const topic = analysis.keywords[0] || 'هذا الموضوع';

    switch (sectionType) {
      case 'intro':
        return DEFAULT_SECTIONS.intro(topic) + '\n\n' + content;

      case 'conclusion':
        return content + '\n\n' + DEFAULT_SECTIONS.conclusion(topic);

      case 'faq':
        const faq = DEFAULT_SECTIONS.faq(topic, customContent?.questions || []);
        return this.insertBeforeConclusion(content, faq);

      case 'tips':
        const tips = DEFAULT_SECTIONS.tips(topic, customContent?.tips || []);
        return this.insertBeforeConclusion(content, tips);

      default:
        return content;
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * التحقق من وجود مقدمة
   */
  private hasIntroduction(content: string): boolean {
    const introPatterns = [
      /<h2[^>]*>.*?(مقدمة|تمهيد|نبذة).*?<\/h2>/i,
      /^<h2/i, // يبدأ بعنوان H2
    ];

    // التحقق من وجود فقرة في البداية قبل أي H2
    const firstH2Index = content.search(/<h2/i);
    const hasOpeningParagraph =
      firstH2Index > 0 && content.slice(0, firstH2Index).includes('<p>');

    return (
      introPatterns.some((pattern) => pattern.test(content)) ||
      hasOpeningParagraph
    );
  }

  /**
   * عد أقسام H2
   */
  private countH2Sections(content: string): number {
    const h2Matches = content.match(/<h2[^>]*>/gi);
    return h2Matches ? h2Matches.length : 0;
  }

  /**
   * التحقق من وجود قسم FAQ
   */
  private hasFaqSection(content: string): boolean {
    const faqPatterns = [
      /<h2[^>]*>.*?(أسئلة شائعة|الأسئلة الشائعة|FAQ|أسئلة متكررة).*?<\/h2>/i,
    ];

    return faqPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * التحقق من وجود قسم نصائح
   */
  private hasTipsSection(content: string): boolean {
    const tipsPatterns = [/<h2[^>]*>.*?(نصائح|نصيحة|إرشادات|توصيات).*?<\/h2>/i];

    return tipsPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * التحقق من وجود خاتمة
   */
  private hasConclusion(content: string): boolean {
    const conclusionPatterns = [
      /<h2[^>]*>.*?(خاتمة|الخاتمة|ختام|في الختام|خلاصة).*?<\/h2>/i,
    ];

    return conclusionPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * إدراج محتوى قبل الخاتمة
   */
  private insertBeforeConclusion(content: string, newSection: string): string {
    const conclusionPattern =
      /<h2[^>]*>.*?(خاتمة|الخاتمة|ختام|في الختام|خلاصة).*?<\/h2>/i;
    const match = content.match(conclusionPattern);

    if (match && match.index !== undefined) {
      return (
        content.slice(0, match.index) +
        newSection +
        '\n\n' +
        content.slice(match.index)
      );
    }

    // إذا لم توجد خاتمة، أضف في النهاية
    return content + '\n\n' + newSection;
  }
}

// Export singleton instance
export const sectionManager = new SectionManager();
