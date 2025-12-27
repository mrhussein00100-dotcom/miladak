/**
 * SONA v4 Content Generator
 * مولد المحتوى - يولد مقالات عربية كاملة
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { TopicAnalyzer, topicAnalyzer } from './topicAnalyzer';
import { TemplateEngine, templateEngine } from './templateEngine';
import { Rephraser, rephraser } from './rephraser';
import {
  TopicAnalysis,
  TopicCategory,
  GenerationRequest,
  GeneratedContent,
  QualityReport,
  FAQ,
  ArticleLength,
} from './types';

// Base path for SONA data
const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

// Word count targets
const WORD_COUNT_TARGETS: Record<ArticleLength, number> = {
  short: 500,
  medium: 1000,
  long: 2000,
  comprehensive: 3000,
};

// Knowledge cache
const knowledgeCache: Map<string, any> = new Map();

/**
 * Load knowledge file
 */
function loadKnowledge(category: string): any {
  if (knowledgeCache.has(category)) {
    return knowledgeCache.get(category);
  }

  const filePath = path.join(SONA_DATA_PATH, 'knowledge', `${category}.json`);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      knowledgeCache.set(category, data);
      return data;
    }
  } catch (error) {
    console.error(`Error loading knowledge for ${category}:`, error);
  }

  return null;
}

/**
 * Load phrases file
 */
function loadPhrases(type: string): string[] {
  const filePath = path.join(SONA_DATA_PATH, 'phrases', `${type}.json`);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Flatten if nested
      if (typeof data === 'object' && !Array.isArray(data)) {
        const phrases: string[] = [];
        for (const value of Object.values(data)) {
          if (Array.isArray(value)) {
            phrases.push(...value);
          }
        }
        return phrases;
      }

      return data;
    }
  } catch (error) {
    console.error(`Error loading phrases for ${type}:`, error);
  }

  return [];
}

/**
 * Content Generator Class
 * يولد مقالات عربية كاملة ومتنوعة
 */
export class ContentGenerator {
  private analyzer: TopicAnalyzer;
  private templateEngine: TemplateEngine;
  private rephraser: Rephraser;
  private usedTemplates: string[] = [];

  constructor() {
    this.analyzer = topicAnalyzer;
    this.templateEngine = templateEngine;
    this.rephraser = rephraser;
  }

  /**
   * توليد مقال كامل
   */
  async generate(request: GenerationRequest): Promise<GeneratedContent> {
    const startTime = Date.now();

    // Reset used templates
    this.templateEngine.resetUsedTemplates();
    this.usedTemplates = [];

    // Analyze topic
    const analysis = this.analyzer.analyze(request.topic);

    // Override category if specified
    if (request.category) {
      analysis.category = request.category;
    }

    // Generate content sections
    const intro = await this.generateIntro(request.topic, analysis);
    const sections = await this.generateSections(
      request.topic,
      analysis,
      request.length
    );
    const faqs = await this.generateFAQ(request.topic, analysis, 3);
    const tips = await this.generateTips(request.topic, analysis, 5);
    const conclusion = await this.generateConclusion(request.topic, analysis);

    // Combine content
    let content = this.combineContent(intro, sections, faqs, tips, conclusion);

    // Apply rephrasing for variety
    content = this.rephraser.rephraseParagraph(content, {
      synonymReplacementRate: 0.2,
      preserveKeywords:
        request.includeKeywords || analysis.keywords.slice(0, 5),
    });

    // Add CTAs
    content = this.addCTAs(content, analysis);

    // Generate metadata
    const title = this.generateTitle(request.topic, analysis);
    const metaTitle = this.generateMetaTitle(title, analysis);
    const metaDescription = this.generateMetaDescription(
      request.topic,
      analysis
    );
    const keywords = this.generateKeywords(
      request.topic,
      analysis,
      request.includeKeywords
    );

    // Calculate quality
    const wordCount = this.countWords(content);
    const qualityReport = this.calculateQuality(content, analysis, keywords);

    // Get used templates
    this.usedTemplates = this.templateEngine.getUsedTemplates();

    const generationTime = Date.now() - startTime;

    return {
      content,
      title,
      metaTitle,
      metaDescription,
      keywords,
      wordCount,
      qualityReport,
      usedTemplates: this.usedTemplates,
      generationTime,
    };
  }

  /**
   * توليد مقدمة المقال
   */
  async generateIntro(topic: string, analysis: TopicAnalysis): Promise<string> {
    const template = await this.templateEngine.selectIntro(analysis);

    if (!template) {
      return this.generateDefaultIntro(topic, analysis);
    }

    const variables = this.prepareVariables(topic, analysis);
    let intro = this.templateEngine.fillTemplate(template.template, variables);

    // Apply light rephrasing
    intro = this.rephraser.replaceSynonyms(intro, {
      synonymReplacementRate: 0.15,
    });

    return `<h2>مقدمة</h2>\n<p>${intro}</p>`;
  }

  /**
   * توليد مقدمة افتراضية
   */
  private generateDefaultIntro(topic: string, analysis: TopicAnalysis): string {
    const intros = [
      `مرحباً بكم في موقع ميلادك! في هذا المقال الشامل، سنتناول ${topic} بالتفصيل.`,
      `هل تبحثون عن معلومات موثوقة حول ${topic}؟ أنتم في المكان الصحيح.`,
      `نقدم لكم اليوم دليلاً شاملاً عن ${topic}، مع معلومات مفيدة ونصائح عملية.`,
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];
    return `<h2>مقدمة</h2>\n<p>${intro}</p>`;
  }

  /**
   * توليد أقسام المقال
   */
  async generateSections(
    topic: string,
    analysis: TopicAnalysis,
    length: ArticleLength
  ): Promise<string[]> {
    const sections: string[] = [];
    const targetWordCount = WORD_COUNT_TARGETS[length];
    const sectionsCount = Math.ceil(targetWordCount / 200); // ~200 words per section

    // Get suggested sections
    const suggestedSections = analysis.suggestedSections.filter(
      (s) => s !== 'introduction' && s !== 'conclusion' && s !== 'faq'
    );

    // Load category-specific knowledge
    const knowledge = loadKnowledge(analysis.category);

    for (
      let i = 0;
      i < Math.min(sectionsCount, suggestedSections.length);
      i++
    ) {
      const sectionType = suggestedSections[i];
      const section = await this.generateSection(
        topic,
        analysis,
        sectionType,
        knowledge
      );
      sections.push(section);
    }

    // Add more general sections if needed
    while (sections.length < sectionsCount - 2) {
      const section = await this.generateGenericSection(
        topic,
        analysis,
        sections.length
      );
      sections.push(section);
    }

    return sections;
  }

  /**
   * توليد قسم واحد
   */
  async generateSection(
    topic: string,
    analysis: TopicAnalysis,
    sectionType: string,
    knowledge: any
  ): Promise<string> {
    const template = await this.templateEngine.selectParagraph(
      sectionType,
      analysis
    );
    const variables = this.prepareVariables(topic, analysis);

    // Add section-specific content
    variables.section_title = this.getSectionTitle(sectionType);
    variables.section_content = this.getSectionContent(
      sectionType,
      analysis,
      knowledge
    );

    if (template) {
      let content = this.templateEngine.fillTemplate(
        template.template,
        variables
      );
      content = this.rephraser.replaceSynonyms(content, {
        synonymReplacementRate: 0.2,
      });
      return content;
    }

    return this.generateDefaultSection(sectionType, variables);
  }

  /**
   * توليد قسم عام
   */
  private async generateGenericSection(
    topic: string,
    analysis: TopicAnalysis,
    index: number
  ): Promise<string> {
    const titles = [
      'معلومات مهمة',
      'نصائح مفيدة',
      'حقائق مثيرة',
      'تفاصيل إضافية',
      'معلومات تهمك',
    ];

    const title = titles[index % titles.length];
    const template = await this.templateEngine.selectParagraph(
      'general',
      analysis
    );
    const variables = this.prepareVariables(topic, analysis);
    variables.section_title = title;

    if (template) {
      let content = this.templateEngine.fillTemplate(
        template.template,
        variables
      );
      return `<h2>${title}</h2>\n${content}`;
    }

    return `<h2>${title}</h2>\n<p>نقدم لكم معلومات قيمة حول ${topic}.</p>`;
  }

  /**
   * توليد الأسئلة الشائعة
   * Requirements: 5.1
   */
  async generateFAQ(
    topic: string,
    analysis: TopicAnalysis,
    count: number
  ): Promise<FAQ[]> {
    const faqs: FAQ[] = [];
    const knowledge = loadKnowledge(analysis.category);

    // Category-specific FAQs
    const categoryFAQs = this.getCategoryFAQs(
      analysis.category,
      topic,
      knowledge
    );
    faqs.push(...categoryFAQs.slice(0, count));

    // Fill remaining with generic FAQs
    while (faqs.length < count) {
      faqs.push(this.generateGenericFAQ(topic, analysis, faqs.length));
    }

    return faqs;
  }

  /**
   * الحصول على أسئلة خاصة بالفئة
   */
  private getCategoryFAQs(
    category: TopicCategory,
    topic: string,
    knowledge: any
  ): FAQ[] {
    const faqs: FAQ[] = [];

    switch (category) {
      case 'zodiac':
        if (knowledge) {
          const sign = Object.keys(knowledge)[0];
          const signData = knowledge[sign];
          if (signData) {
            faqs.push({
              question: `ما هي أبرز صفات برج ${sign}؟`,
              answer: `يتميز برج ${sign} بعدة صفات منها: ${
                signData.traits?.slice(0, 3).join('، ') || 'صفات مميزة'
              }.`,
            });
            faqs.push({
              question: `ما هي الأبراج المتوافقة مع برج ${sign}؟`,
              answer: `يتوافق برج ${sign} مع: ${
                signData.compatibility?.join('، ') || 'عدة أبراج'
              }.`,
            });
          }
        }
        break;

      case 'birthday':
        faqs.push({
          question: 'كيف أحتفل بعيد ميلاد مميز؟',
          answer:
            'يمكنك الاحتفال بعيد ميلاد مميز من خلال التخطيط المسبق، اختيار موضوع للحفلة، دعوة الأحباء، وإعداد كيكة مخصصة.',
        });
        faqs.push({
          question: 'ما هي أفضل أفكار هدايا عيد الميلاد؟',
          answer:
            'تشمل أفضل الهدايا: الهدايا الشخصية، التجارب المميزة، الكتب، العطور، والهدايا العملية التي يحتاجها الشخص.',
        });
        break;

      case 'health':
        faqs.push({
          question: 'كيف أحافظ على صحتي؟',
          answer:
            'للحفاظ على صحتك: مارس الرياضة بانتظام، تناول غذاء متوازن، احصل على نوم كافٍ، واشرب الماء بكثرة.',
        });
        break;

      default:
        faqs.push({
          question: `ما هي أهم المعلومات عن ${topic}؟`,
          answer: `يعتبر ${topic} من المواضيع المهمة التي تستحق الاهتمام والدراسة.`,
        });
    }

    return faqs;
  }

  /**
   * توليد سؤال عام
   */
  private generateGenericFAQ(
    topic: string,
    analysis: TopicAnalysis,
    index: number
  ): FAQ {
    const questions = [
      {
        q: `ما هو ${topic}؟`,
        a: `${topic} هو موضوع مهم يستحق الاهتمام والدراسة.`,
      },
      {
        q: `لماذا ${topic} مهم؟`,
        a: `يعتبر ${topic} مهماً لأنه يؤثر على حياتنا اليومية.`,
      },
      {
        q: `كيف أستفيد من ${topic}؟`,
        a: `يمكنك الاستفادة من ${topic} من خلال تطبيق المعلومات في حياتك.`,
      },
      {
        q: `أين أجد معلومات أكثر عن ${topic}؟`,
        a: `يمكنك زيارة موقع ميلادك للمزيد من المعلومات.`,
      },
    ];

    const faq = questions[index % questions.length];
    return { question: faq.q, answer: faq.a };
  }

  /**
   * توليد النصائح
   * Requirements: 5.2
   */
  async generateTips(
    topic: string,
    analysis: TopicAnalysis,
    count: number
  ): Promise<string[]> {
    const tips: string[] = [];
    const knowledge = loadKnowledge(analysis.category);

    // Get category-specific tips
    if (knowledge) {
      const categoryTips = this.getCategoryTips(analysis, knowledge);
      tips.push(...categoryTips.slice(0, count));
    }

    // Fill with generic tips
    while (tips.length < count) {
      tips.push(this.generateGenericTip(topic, tips.length));
    }

    return tips;
  }

  /**
   * الحصول على نصائح خاصة بالفئة
   */
  private getCategoryTips(analysis: TopicAnalysis, knowledge: any): string[] {
    const tips: string[] = [];

    if (
      analysis.category === 'zodiac' &&
      analysis.extractedEntities.zodiacSigns.length > 0
    ) {
      const sign = analysis.extractedEntities.zodiacSigns[0];
      const signData = knowledge[sign];
      if (signData?.tips) {
        tips.push(...signData.tips);
      }
    } else if (analysis.category === 'birthday' && knowledge.ageSpecificTips) {
      const age = analysis.extractedEntities.ages[0];
      if (age) {
        if (age <= 12) tips.push(...(knowledge.ageSpecificTips.children || []));
        else if (age <= 18)
          tips.push(...(knowledge.ageSpecificTips.teens || []));
        else if (age <= 60)
          tips.push(...(knowledge.ageSpecificTips.adults || []));
        else tips.push(...(knowledge.ageSpecificTips.seniors || []));
      }
    }

    return tips;
  }

  /**
   * توليد نصيحة عامة
   */
  private generateGenericTip(topic: string, index: number): string {
    const tips = [
      `استفد من المعلومات المتاحة عن ${topic}`,
      `شارك معرفتك عن ${topic} مع الآخرين`,
      `تابع آخر المستجدات حول ${topic}`,
      `طبق ما تعلمته عن ${topic} في حياتك`,
      `استشر المختصين للمزيد عن ${topic}`,
    ];

    return tips[index % tips.length];
  }

  /**
   * توليد خاتمة المقال
   */
  async generateConclusion(
    topic: string,
    analysis: TopicAnalysis
  ): Promise<string> {
    const template = await this.templateEngine.selectConclusion(analysis);

    if (!template) {
      return this.generateDefaultConclusion(topic, analysis);
    }

    const variables = this.prepareVariables(topic, analysis);
    let conclusion = this.templateEngine.fillTemplate(
      template.template,
      variables
    );

    conclusion = this.rephraser.replaceSynonyms(conclusion, {
      synonymReplacementRate: 0.15,
    });

    return `<h2>الخاتمة</h2>\n<p>${conclusion}</p>`;
  }

  /**
   * توليد خاتمة افتراضية
   */
  private generateDefaultConclusion(
    topic: string,
    analysis: TopicAnalysis
  ): string {
    const conclusions = [
      `في الختام، نأمل أن يكون هذا المقال قد أفادكم في فهم ${topic}. شاركوا المقال مع أصدقائكم!`,
      `وبهذا نكون قد استعرضنا أهم المعلومات عن ${topic}. نتمنى لكم الاستفادة.`,
      `نأمل أن تكونوا قد استفدتم من هذا المقال عن ${topic}. تابعونا للمزيد!`,
    ];

    const conclusion =
      conclusions[Math.floor(Math.random() * conclusions.length)];
    return `<h2>الخاتمة</h2>\n<p>${conclusion}</p>`;
  }

  /**
   * دمج المحتوى
   */
  private combineContent(
    intro: string,
    sections: string[],
    faqs: FAQ[],
    tips: string[],
    conclusion: string
  ): string {
    const parts: string[] = [];

    // Add intro
    parts.push(intro);

    // Add sections
    parts.push(...sections);

    // Add tips section
    if (tips.length > 0) {
      const tipsHtml = tips.map((tip) => `<li>${tip}</li>`).join('\n');
      parts.push(`<h2>نصائح مهمة</h2>\n<ul>\n${tipsHtml}\n</ul>`);
    }

    // Add FAQ section
    if (faqs.length > 0) {
      const faqHtml = faqs
        .map((faq) => `<h3>${faq.question}</h3>\n<p>${faq.answer}</p>`)
        .join('\n');
      parts.push(`<h2>الأسئلة الشائعة</h2>\n${faqHtml}`);
    }

    // Add conclusion
    parts.push(conclusion);

    return parts.join('\n\n');
  }

  /**
   * إضافة دعوات للعمل
   * Requirements: 5.5
   */
  private addCTAs(content: string, analysis: TopicAnalysis): string {
    const ctas = loadPhrases('ctas');

    if (ctas.length === 0) {
      return content;
    }

    // Select random CTAs
    const selectedCTAs: string[] = [];
    for (let i = 0; i < 2; i++) {
      const cta = ctas[Math.floor(Math.random() * ctas.length)];
      if (!selectedCTAs.includes(cta)) {
        selectedCTAs.push(cta);
      }
    }

    // Add CTAs to content
    const ctaHtml = selectedCTAs
      .map((cta) => `<p class="cta"><strong>${cta}</strong></p>`)
      .join('\n');

    return content + '\n\n' + ctaHtml;
  }

  /**
   * توليد العنوان
   */
  private generateTitle(topic: string, analysis: TopicAnalysis): string {
    const templates: Record<TopicCategory, string[]> = {
      zodiac: [
        `برج ${topic}: صفاته وتوافقه ونصائح مهمة`,
        `كل ما تريد معرفته عن برج ${topic}`,
        `دليلك الشامل لبرج ${topic}`,
      ],
      birthday: [
        `${topic}: أفكار ونصائح للاحتفال`,
        `دليلك الشامل لـ ${topic}`,
        `${topic} - كل ما تحتاج معرفته`,
      ],
      health: [
        `${topic}: نصائح ومعلومات صحية مهمة`,
        `دليلك الصحي لـ ${topic}`,
        `${topic} - معلومات طبية موثوقة`,
      ],
      dates: [
        `${topic}: معلومات وأحداث تاريخية`,
        `كل ما تريد معرفته عن ${topic}`,
        `${topic} - دليل شامل`,
      ],
      general: [
        `${topic}: دليل شامل ومفصل`,
        `كل ما تريد معرفته عن ${topic}`,
        `${topic} - معلومات ونصائح مفيدة`,
      ],
    };

    const categoryTemplates = templates[analysis.category] || templates.general;
    return categoryTemplates[
      Math.floor(Math.random() * categoryTemplates.length)
    ];
  }

  /**
   * توليد عنوان الميتا
   */
  private generateMetaTitle(title: string, analysis: TopicAnalysis): string {
    const suffix = ' | ميلادك';
    const maxLength = 60 - suffix.length;

    if (title.length <= maxLength) {
      return title + suffix;
    }

    return title.substring(0, maxLength - 3) + '...' + suffix;
  }

  /**
   * توليد وصف الميتا
   * Requirements: 6.4
   */
  private generateMetaDescription(
    topic: string,
    analysis: TopicAnalysis
  ): string {
    const templates: Record<TopicCategory, string[]> = {
      zodiac: [
        `اكتشف كل ما تريد معرفته عن ${topic}. صفاته، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليد هذا البرج.`,
      ],
      birthday: [
        `دليلك الشامل لـ ${topic}. أفكار للاحتفال، هدايا مميزة، ونصائح لجعل اليوم مميزاً.`,
      ],
      health: [
        `معلومات صحية موثوقة عن ${topic}. نصائح عملية وإرشادات مفيدة للحفاظ على صحتك.`,
      ],
      dates: [
        `تعرف على ${topic}. معلومات تاريخية، أحداث مهمة، وحقائق مثيرة للاهتمام.`,
      ],
      general: [
        `دليل شامل عن ${topic}. معلومات مفيدة، نصائح عملية، وكل ما تحتاج معرفته.`,
      ],
    };

    const categoryTemplates = templates[analysis.category] || templates.general;
    let description =
      categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];

    // Ensure length is 150-160 characters
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    } else if (description.length < 150) {
      description += ' اقرأ المزيد على موقع ميلادك.';
    }

    return description;
  }

  /**
   * توليد الكلمات المفتاحية
   */
  private generateKeywords(
    topic: string,
    analysis: TopicAnalysis,
    includeKeywords?: string[]
  ): string[] {
    const keywords = new Set<string>();

    // Add topic as keyword
    keywords.add(topic);

    // Add analysis keywords
    analysis.keywords.forEach((kw) => keywords.add(kw));

    // Add included keywords
    if (includeKeywords) {
      includeKeywords.forEach((kw) => keywords.add(kw));
    }

    // Add category-specific keywords
    switch (analysis.category) {
      case 'zodiac':
        keywords.add('أبراج');
        keywords.add('برج');
        keywords.add('فلك');
        break;
      case 'birthday':
        keywords.add('عيد ميلاد');
        keywords.add('احتفال');
        keywords.add('تهنئة');
        break;
      case 'health':
        keywords.add('صحة');
        keywords.add('نصائح صحية');
        break;
      case 'dates':
        keywords.add('تاريخ');
        keywords.add('تقويم');
        break;
    }

    return Array.from(keywords).slice(0, 10);
  }

  /**
   * حساب جودة المحتوى
   */
  private calculateQuality(
    content: string,
    analysis: TopicAnalysis,
    keywords: string[]
  ): QualityReport {
    const diversityScore = this.calculateDiversityScore(content);
    const keywordDensity = this.calculateKeywordDensity(content, keywords);
    const readabilityScore = this.calculateReadabilityScore(content);
    const structureScore = this.calculateStructureScore(content);

    const overallScore =
      diversityScore * 0.25 +
      keywordDensity * 0.25 +
      readabilityScore * 0.25 +
      structureScore * 0.25;

    const suggestions: string[] = [];

    if (diversityScore < 70) {
      suggestions.push('زيادة تنوع المفردات المستخدمة');
    }
    if (keywordDensity < 50 || keywordDensity > 80) {
      suggestions.push('تعديل كثافة الكلمات المفتاحية');
    }
    if (readabilityScore < 70) {
      suggestions.push('تبسيط بعض الجمل الطويلة');
    }
    if (structureScore < 70) {
      suggestions.push('تحسين هيكل المقال');
    }

    return {
      overallScore,
      diversityScore,
      keywordDensity,
      readabilityScore,
      structureScore,
      suggestions,
      passed: overallScore >= 70,
    };
  }

  /**
   * حساب درجة التنوع
   */
  private calculateDiversityScore(content: string): number {
    const words = content.split(/\s+/).filter((w) => w.length > 2);
    const uniqueWords = new Set(words);

    if (words.length === 0) return 0;

    const ratio = uniqueWords.size / words.length;
    return Math.min(ratio * 150, 100); // Scale to 0-100
  }

  /**
   * حساب كثافة الكلمات المفتاحية
   */
  private calculateKeywordDensity(content: string, keywords: string[]): number {
    const words = content.split(/\s+/);
    const totalWords = words.length;

    if (totalWords === 0 || keywords.length === 0) return 0;

    let keywordCount = 0;
    const lowerContent = content.toLowerCase();

    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerContent.match(regex);
      keywordCount += matches ? matches.length : 0;
    });

    const density = (keywordCount / totalWords) * 100;

    // Optimal density is 2-4%
    if (density >= 2 && density <= 4) return 100;
    if (density >= 1 && density <= 5) return 80;
    if (density > 5) return Math.max(0, 100 - (density - 5) * 10);
    return density * 40; // Below 1%
  }

  /**
   * حساب درجة قابلية القراءة
   */
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.،؟!]/);
    const words = content.split(/\s+/);

    if (sentences.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;

    // Optimal is 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) return 100;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) return 80;
    if (avgWordsPerSentence < 10) return 60;
    return Math.max(0, 100 - (avgWordsPerSentence - 25) * 3);
  }

  /**
   * حساب درجة الهيكل
   */
  private calculateStructureScore(content: string): number {
    let score = 0;

    // Check for headings
    if (content.includes('<h2>')) score += 30;
    if (content.includes('<h3>')) score += 10;

    // Check for lists
    if (content.includes('<ul>') || content.includes('<ol>')) score += 20;

    // Check for paragraphs
    const paragraphs = content.split('</p>').length - 1;
    if (paragraphs >= 5) score += 20;
    else if (paragraphs >= 3) score += 10;

    // Check for FAQ section
    if (content.includes('الأسئلة الشائعة')) score += 10;

    // Check for conclusion
    if (content.includes('الخاتمة') || content.includes('في الختام'))
      score += 10;

    return Math.min(score, 100);
  }

  /**
   * عد الكلمات
   */
  private countWords(content: string): number {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  }

  /**
   * تحضير المتغيرات للقوالب
   */
  private prepareVariables(
    topic: string,
    analysis: TopicAnalysis
  ): Record<string, any> {
    return {
      topic,
      site_name: 'ميلادك',
      category: analysis.category,
      keywords: analysis.keywords.join('، '),
      name: analysis.extractedEntities.names[0] || '',
      age: analysis.extractedEntities.ages[0] || '',
      zodiac: analysis.extractedEntities.zodiacSigns[0] || '',
      date: analysis.extractedEntities.dates[0] || '',
    };
  }

  /**
   * الحصول على عنوان القسم
   */
  private getSectionTitle(sectionType: string): string {
    const titles: Record<string, string> = {
      traits: 'الصفات والخصائص',
      compatibility: 'التوافق',
      strengths: 'نقاط القوة',
      weaknesses: 'نقاط الضعف',
      love: 'الحب والعلاقات',
      career: 'العمل والمهنة',
      'health-tips': 'نصائح صحية',
      celebrities: 'مشاهير',
      'celebration-ideas': 'أفكار للاحتفال',
      wishes: 'تهاني وأمنيات',
      'gift-ideas': 'أفكار هدايا',
      traditions: 'تقاليد وعادات',
      'party-planning': 'تخطيط الحفلة',
      importance: 'الأهمية',
      tips: 'نصائح',
      prevention: 'الوقاية',
      nutrition: 'التغذية',
      exercise: 'الرياضة',
      'mental-health': 'الصحة النفسية',
      'historical-events': 'أحداث تاريخية',
      significance: 'الأهمية',
      'calendar-info': 'معلومات التقويم',
      celebrations: 'الاحتفالات',
      overview: 'نظرة عامة',
      details: 'التفاصيل',
      facts: 'حقائق مهمة',
      benefits: 'الفوائد',
    };

    return titles[sectionType] || 'معلومات إضافية';
  }

  /**
   * الحصول على محتوى القسم
   */
  private getSectionContent(
    sectionType: string,
    analysis: TopicAnalysis,
    knowledge: any
  ): string {
    if (!knowledge) return '';

    // For zodiac
    if (
      analysis.category === 'zodiac' &&
      analysis.extractedEntities.zodiacSigns.length > 0
    ) {
      const sign = analysis.extractedEntities.zodiacSigns[0];
      const signData = knowledge[sign];

      if (signData) {
        switch (sectionType) {
          case 'traits':
            return signData.traits?.join('، ') || '';
          case 'strengths':
            return signData.strengths?.join('، ') || '';
          case 'weaknesses':
            return signData.weaknesses?.join('، ') || '';
          case 'compatibility':
            return signData.compatibility?.join('، ') || '';
          case 'facts':
            return signData.facts?.slice(0, 3).join(' ') || '';
        }
      }
    }

    return '';
  }

  /**
   * توليد قسم افتراضي
   */
  private generateDefaultSection(
    sectionType: string,
    variables: Record<string, any>
  ): string {
    const title = this.getSectionTitle(sectionType);
    return `<h2>${title}</h2>\n<p>نقدم لكم معلومات مفيدة حول ${variables.topic}.</p>`;
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
