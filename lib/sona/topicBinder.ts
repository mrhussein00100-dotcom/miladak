/**
 * SONA v4 Topic Binder - ربط المحتوى بالموضوع
 * يضمن أن كل جزء من المقال مرتبط بالموضوع المطلوب
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { ExtractedEntities, TopicCategory } from './types';

/**
 * إعدادات ربط الموضوع
 */
export interface TopicBinderConfig {
  /** الموضوع الرئيسي */
  topic: string;
  /** الكلمات المفتاحية الإجبارية */
  requiredKeywords: string[];
  /** الكيانات المستخرجة */
  entities: ExtractedEntities;
  /** الحد الأقصى للكلمات بدون ذكر الموضوع */
  maxWordsWithoutMention: number;
  /** فئة الموضوع */
  category?: TopicCategory;
}

/**
 * نتيجة ربط الموضوع
 */
export interface TopicBinderResult {
  /** المحتوى بعد الربط */
  boundContent: string;
  /** عدد مرات ذكر الموضوع */
  topicMentionCount: number;
  /** درجة الربط (0-100) */
  bindingScore: number;
  /** الكلمات المفتاحية المفقودة */
  missingKeywords: string[];
  /** هل تم تعديل المحتوى */
  wasModified: boolean;
}

/**
 * إعدادات افتراضية
 */
const DEFAULT_CONFIG: Partial<TopicBinderConfig> = {
  maxWordsWithoutMention: 100,
};

/**
 * عبارات الربط بالموضوع
 */
const TOPIC_CONNECTORS = {
  intro: [
    'في هذا المقال نتحدث عن {topic}',
    'نستعرض معكم اليوم {topic}',
    '{topic} هو موضوعنا اليوم',
    'دعونا نتعرف على {topic}',
  ],
  section: [
    'فيما يخص {topic}',
    'بالنسبة لـ{topic}',
    'عند الحديث عن {topic}',
    'من المهم في {topic}',
    'يتميز {topic} بـ',
  ],
  paragraph: [
    'كما نرى في {topic}',
    'هذا يرتبط بـ{topic}',
    'في سياق {topic}',
    'ضمن {topic}',
  ],
  conclusion: [
    'في الختام، {topic}',
    'نأمل أن يكون {topic} قد أفادكم',
    'هذا ما يميز {topic}',
    'تذكروا دائماً أن {topic}',
  ],
  name: ['بالنسبة لـ{name}', '{name} يستحق', 'نتمنى لـ{name}', 'مع {name}'],
  age: ['في عمر {age} سنة', 'عند بلوغ {age} عاماً', 'في سن {age}'],
};

/**
 * Topic Binder Class
 * يربط المحتوى بالموضوع ويضمن ذكره بشكل كافٍ
 */
export class TopicBinder {
  private config: TopicBinderConfig;

  constructor(config?: Partial<TopicBinderConfig>) {
    this.config = {
      topic: '',
      requiredKeywords: [],
      entities: {
        names: [],
        dates: [],
        numbers: [],
        zodiacSigns: [],
        ages: [],
        keywords: [],
      },
      maxWordsWithoutMention: DEFAULT_CONFIG.maxWordsWithoutMention!,
      ...config,
    };
  }

  /**
   * ربط المحتوى بالموضوع
   */
  bind(
    content: string,
    config?: Partial<TopicBinderConfig>
  ): TopicBinderResult {
    const mergedConfig = { ...this.config, ...config };
    let boundContent = content;
    let wasModified = false;

    // حساب درجة الربط الأولية
    const initialScore = this.calculateBindingScore(content, mergedConfig);

    // دائماً نحاول تحسين الربط إذا كانت الدرجة أقل من 80%
    // أو إذا كان عدد الذكر أقل من المتوقع
    const wordCount = this.countWords(content);
    const currentMentions = this.countTopicMentions(content, mergedConfig);
    const expectedMentions = Math.max(
      1,
      Math.floor(wordCount / mergedConfig.maxWordsWithoutMention)
    );

    if (initialScore < 80 || currentMentions < expectedMentions) {
      boundContent = this.improveBinding(content, mergedConfig);
      wasModified = boundContent !== content;
    }

    // حساب النتائج النهائية
    const finalScore = this.calculateBindingScore(boundContent, mergedConfig);
    const mentionCount = this.countTopicMentions(boundContent, mergedConfig);
    const missingKeywords = this.findMissingKeywords(
      boundContent,
      mergedConfig
    );

    return {
      boundContent,
      topicMentionCount: mentionCount,
      bindingScore: finalScore,
      missingKeywords,
      wasModified,
    };
  }

  /**
   * ربط المقدمة بالموضوع
   * Requirements: 1.1 - تضمين الموضوع في الجملة الأولى
   */
  bindIntro(intro: string, config?: Partial<TopicBinderConfig>): string {
    const mergedConfig = { ...this.config, ...config };
    const { topic, entities } = mergedConfig;

    // التحقق من وجود الموضوع في الجملة الأولى
    const sentences = this.splitIntoSentences(intro);
    if (sentences.length === 0) {
      // إذا كان النص فارغاً، نرجع جملة تحتوي على الموضوع
      const connector = this.getRandomConnector('intro', topic, entities);
      return connector;
    }

    const firstSentence = sentences[0];
    const topicKeywords = this.getTopicKeywords(mergedConfig);

    // إذا كانت الجملة الأولى لا تحتوي على الموضوع
    if (!this.containsAnyKeyword(firstSentence, topicKeywords)) {
      // إنشاء جملة افتتاحية جديدة تحتوي على الموضوع
      const connector = this.getRandomConnector('intro', topic, entities);
      sentences[0] = `${connector}. ${firstSentence}`;
    }

    return sentences.join('. ');
  }

  /**
   * ربط قسم H2 بالموضوع
   * Requirements: 1.2 - تضمين كلمة مفتاحية في عنوان H2
   */
  bindSection(
    sectionTitle: string,
    sectionContent: string,
    config?: Partial<TopicBinderConfig>
  ): { title: string; content: string } {
    const mergedConfig = { ...this.config, ...config };
    const topicKeywords = this.getTopicKeywords(mergedConfig);

    let boundTitle = sectionTitle;
    let boundContent = sectionContent;

    // التحقق من وجود كلمة مفتاحية في العنوان
    if (!this.containsAnyKeyword(sectionTitle, topicKeywords)) {
      // إضافة كلمة مفتاحية للعنوان
      const keyword = topicKeywords[0] || mergedConfig.topic;
      boundTitle = this.addKeywordToTitle(sectionTitle, keyword);
    }

    // ربط المحتوى
    boundContent = this.ensureTopicMentionFrequency(boundContent, mergedConfig);

    return { title: boundTitle, content: boundContent };
  }

  /**
   * ربط الخاتمة بالموضوع
   * Requirements: 1.4 - إعادة ذكر الموضوع في الخاتمة
   */
  bindConclusion(
    conclusion: string,
    config?: Partial<TopicBinderConfig>
  ): string {
    const mergedConfig = { ...this.config, ...config };
    const { topic, entities } = mergedConfig;
    const topicKeywords = this.getTopicKeywords(mergedConfig);

    // إذا كان النص فارغاً
    if (!conclusion || conclusion.trim().length === 0) {
      const connector = this.getRandomConnector('conclusion', topic, entities);
      return connector;
    }

    // التحقق من ذكر الموضوع في الخاتمة
    if (!this.containsAnyKeyword(conclusion, topicKeywords)) {
      const connector = this.getRandomConnector('conclusion', topic, entities);
      return `${conclusion} ${connector}`;
    }

    return conclusion;
  }

  /**
   * حساب درجة ربط المحتوى بالموضوع
   */
  calculateBindingScore(
    content: string,
    config?: Partial<TopicBinderConfig>
  ): number {
    const mergedConfig = { ...this.config, ...config };
    const topicKeywords = this.getTopicKeywords(mergedConfig);
    const words = this.countWords(content);

    if (words === 0) return 0;

    let score = 0;

    // 1. نسبة ذكر الكلمات المفتاحية (40%)
    const mentionCount = this.countTopicMentions(content, mergedConfig);
    const expectedMentions = Math.ceil(
      words / mergedConfig.maxWordsWithoutMention
    );
    const mentionRatio = Math.min(mentionCount / expectedMentions, 1);
    score += mentionRatio * 40;

    // 2. وجود الكلمات المفتاحية الإجبارية (30%)
    const requiredFound = mergedConfig.requiredKeywords.filter((kw) =>
      content.toLowerCase().includes(kw.toLowerCase())
    ).length;
    const requiredRatio =
      mergedConfig.requiredKeywords.length > 0
        ? requiredFound / mergedConfig.requiredKeywords.length
        : 1;
    score += requiredRatio * 30;

    // 3. توزيع الذكر عبر المحتوى (20%)
    const distributionScore = this.calculateDistributionScore(
      content,
      topicKeywords
    );
    score += distributionScore * 20;

    // 4. ذكر الكيانات (الأسماء، الأعمار) (10%)
    const entityScore = this.calculateEntityScore(
      content,
      mergedConfig.entities
    );
    score += entityScore * 10;

    return Math.round(score);
  }

  /**
   * عد مرات ذكر الموضوع
   */
  countTopicMentions(
    content: string,
    config?: Partial<TopicBinderConfig>
  ): number {
    const mergedConfig = { ...this.config, ...config };
    const topicKeywords = this.getTopicKeywords(mergedConfig);
    const lowerContent = content.toLowerCase();

    let count = 0;
    topicKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = lowerContent.match(regex);
      if (matches) {
        count += matches.length;
      }
    });

    return count;
  }

  /**
   * البحث عن الكلمات المفتاحية المفقودة
   */
  findMissingKeywords(
    content: string,
    config?: Partial<TopicBinderConfig>
  ): string[] {
    const mergedConfig = { ...this.config, ...config };
    const lowerContent = content.toLowerCase();

    return mergedConfig.requiredKeywords.filter(
      (kw) => !lowerContent.includes(kw.toLowerCase())
    );
  }

  // ==================== Private Methods ====================

  /**
   * تحسين ربط المحتوى بالموضوع
   */
  private improveBinding(content: string, config: TopicBinderConfig): string {
    let improved = content;

    // 1. ضمان تكرار ذكر الموضوع كل 100 كلمة
    improved = this.ensureTopicMentionFrequency(improved, config);

    // 2. إضافة الكلمات المفتاحية المفقودة
    improved = this.addMissingKeywords(improved, config);

    return improved;
  }

  /**
   * ضمان ذكر الموضوع كل N كلمة
   * Requirements: 1.3 - ذكر الموضوع كل 100 كلمة
   */
  private ensureTopicMentionFrequency(
    content: string,
    config: TopicBinderConfig
  ): string {
    const { topic, entities, maxWordsWithoutMention } = config;
    const topicKeywords = this.getTopicKeywords(config);

    // تقسيم المحتوى إلى فقرات
    const paragraphs = content.split(/\n\n+/);
    let totalWords = 0;
    let wordsSinceLastMention = 0;

    const improvedParagraphs = paragraphs.map((paragraph) => {
      const paragraphWords = this.countWords(paragraph);
      totalWords += paragraphWords;

      // التحقق من وجود الموضوع في الفقرة
      const hasTopic = this.containsAnyKeyword(paragraph, topicKeywords);

      if (hasTopic) {
        wordsSinceLastMention = 0;
        return paragraph;
      }

      wordsSinceLastMention += paragraphWords;

      // إذا مر أكثر من maxWordsWithoutMention كلمة بدون ذكر الموضوع
      if (wordsSinceLastMention >= maxWordsWithoutMention) {
        const connector = this.getRandomConnector('paragraph', topic, entities);
        wordsSinceLastMention = 0;
        return `${paragraph} ${connector}`;
      }

      return paragraph;
    });

    // إذا كان المحتوى طويلاً ولم يتم ذكر الموضوع بشكل كافٍ
    let result = improvedParagraphs.join('\n\n');
    const mentionCount = this.countTopicMentions(result, config);
    const expectedMentions = Math.max(
      1,
      Math.floor(totalWords / maxWordsWithoutMention)
    );

    // إضافة ذكر إضافي إذا لزم الأمر
    if (mentionCount < expectedMentions && paragraphs.length > 0) {
      const connector = this.getRandomConnector('paragraph', topic, entities);
      result = `${result}\n\n${connector}`;
    }

    return result;
  }

  /**
   * إضافة الكلمات المفتاحية المفقودة
   */
  private addMissingKeywords(
    content: string,
    config: TopicBinderConfig
  ): string {
    const missing = this.findMissingKeywords(content, config);
    if (missing.length === 0) return content;

    // إضافة الكلمات المفقودة بشكل طبيعي
    let improved = content;
    missing.forEach((keyword) => {
      // البحث عن مكان مناسب لإضافة الكلمة
      const sentences = this.splitIntoSentences(improved);
      if (sentences.length > 2) {
        // إضافة في منتصف المحتوى
        const midIndex = Math.floor(sentences.length / 2);
        sentences[midIndex] = `${sentences[midIndex]} وهذا يرتبط بـ${keyword}.`;
        improved = sentences.join(' ');
      }
    });

    return improved;
  }

  /**
   * الحصول على الكلمات المفتاحية للموضوع
   */
  private getTopicKeywords(config: TopicBinderConfig): string[] {
    const keywords: string[] = [];

    // إضافة الموضوع نفسه
    if (config.topic) {
      keywords.push(config.topic);
      // إضافة كلمات الموضوع المنفصلة
      config.topic.split(/\s+/).forEach((word) => {
        if (word.length > 2) keywords.push(word);
      });
    }

    // إضافة الكلمات المفتاحية الإجبارية
    keywords.push(...config.requiredKeywords);

    // إضافة الكيانات
    keywords.push(...config.entities.names);
    keywords.push(...config.entities.zodiacSigns);

    return [...new Set(keywords)].filter((k) => k.length > 1);
  }

  /**
   * التحقق من وجود أي كلمة مفتاحية
   */
  private containsAnyKeyword(text: string, keywords: string[]): boolean {
    const lowerText = text.toLowerCase();
    return keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
  }

  /**
   * إضافة كلمة مفتاحية للعنوان
   */
  private addKeywordToTitle(title: string, keyword: string): string {
    // إذا كان العنوان قصيراً، نضيف الكلمة في النهاية
    if (title.length < 30) {
      return `${title} - ${keyword}`;
    }
    // إذا كان طويلاً، نضيف في البداية
    return `${keyword}: ${title}`;
  }

  /**
   * الحصول على عبارة ربط عشوائية
   */
  private getRandomConnector(
    type: keyof typeof TOPIC_CONNECTORS,
    topic: string,
    entities: ExtractedEntities
  ): string {
    const connectors = TOPIC_CONNECTORS[type];
    const connector = connectors[Math.floor(Math.random() * connectors.length)];

    let result = connector.replace(/{topic}/g, topic);

    // استبدال الاسم إذا وجد
    if (entities.names.length > 0) {
      result = result.replace(/{name}/g, entities.names[0]);
    }

    // استبدال العمر إذا وجد
    if (entities.ages.length > 0) {
      result = result.replace(/{age}/g, entities.ages[0].toString());
    }

    return result;
  }

  /**
   * تقسيم النص إلى جمل
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?؟،]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * عد الكلمات
   */
  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }

  /**
   * حساب درجة توزيع الكلمات المفتاحية
   */
  private calculateDistributionScore(
    content: string,
    keywords: string[]
  ): number {
    const paragraphs = content.split(/\n\n+/);
    if (paragraphs.length === 0) return 0;

    let paragraphsWithKeywords = 0;
    paragraphs.forEach((p) => {
      if (this.containsAnyKeyword(p, keywords)) {
        paragraphsWithKeywords++;
      }
    });

    return paragraphsWithKeywords / paragraphs.length;
  }

  /**
   * حساب درجة ذكر الكيانات
   */
  private calculateEntityScore(
    content: string,
    entities: ExtractedEntities
  ): number {
    const lowerContent = content.toLowerCase();
    let found = 0;
    let total = 0;

    // التحقق من الأسماء
    if (entities.names.length > 0) {
      total++;
      if (entities.names.some((n) => lowerContent.includes(n.toLowerCase()))) {
        found++;
      }
    }

    // التحقق من الأبراج
    if (entities.zodiacSigns.length > 0) {
      total++;
      if (
        entities.zodiacSigns.some((z) => lowerContent.includes(z.toLowerCase()))
      ) {
        found++;
      }
    }

    // التحقق من الأعمار
    if (entities.ages.length > 0) {
      total++;
      if (entities.ages.some((a) => content.includes(a.toString()))) {
        found++;
      }
    }

    return total > 0 ? found / total : 1;
  }
}

// Export singleton instance with default config
export const topicBinder = new TopicBinder();
