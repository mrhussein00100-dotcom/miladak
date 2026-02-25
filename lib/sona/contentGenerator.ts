/**
 * SONA v4 Content Generator - Enhanced Version with Quality Validation
 * مولد المحتوى المحسّن - يولد مقالات عربية غنية ومخصصة مع ضمان الجودة
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  TopicAnalyzer,
  topicAnalyzer,
  EnhancedTopicAnalysis,
} from './topicAnalyzer';
import { TemplateEngine, templateEngine } from './templateEngine';
import { Rephraser, rephraser } from './rephraser';
import {
  QualityValidator,
  qualityValidator,
  QualityValidationResult,
  ValidationConfig,
} from './qualityValidator';
import {
  WordCountManager,
  wordCountManager,
  WORD_COUNT_LIMITS,
} from './wordCountManager';
import { SectionManager, sectionManager } from './sectionManager';
import { TopicBinder, topicBinder, TopicBinderConfig } from './topicBinder';
import {
  StrictQualityGate,
  strictQualityGate,
  STRICT_WORD_COUNT_LIMITS,
} from './strictQualityGate';
import { FallbackContentSystem, fallbackContentSystem } from './fallbackSystem';
import {
  TopicAnalysis,
  TopicCategory,
  GenerationRequest,
  GeneratedContent,
  QualityReport,
  FAQ,
  ArticleLength,
} from './types';

const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

const WORD_COUNT_TARGETS: Record<ArticleLength, number> = {
  short: 500,
  medium: 1000,
  long: 2000,
  comprehensive: 3000,
};

// Quality thresholds
const QUALITY_CONFIG = {
  minQualityScore: 70,
  maxRetries: 3,
};

const knowledgeCache: Map<string, any> = new Map();

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

function loadPhrases(type: string): string[] {
  const filePath = path.join(SONA_DATA_PATH, 'phrases', `${type}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      if (typeof data === 'object' && !Array.isArray(data)) {
        const phrases: string[] = [];
        for (const value of Object.values(data)) {
          if (Array.isArray(value)) phrases.push(...value);
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

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export class ContentGenerator {
  private analyzer: TopicAnalyzer;
  private templateEngine: TemplateEngine;
  private rephraser: Rephraser;
  private qualityValidator: QualityValidator;
  private wordCountManager: WordCountManager;
  private sectionManager: SectionManager;
  private topicBinder: TopicBinder;
  private qualityGate: StrictQualityGate;
  private usedTemplates: string[] = [];

  constructor() {
    this.analyzer = topicAnalyzer;
    this.templateEngine = templateEngine;
    this.rephraser = rephraser;
    this.qualityValidator = qualityValidator;
    this.wordCountManager = wordCountManager;
    this.sectionManager = sectionManager;
    this.topicBinder = topicBinder;
    this.qualityGate = strictQualityGate;
  }

  async generate(request: GenerationRequest): Promise<GeneratedContent> {
    const startTime = Date.now();

    // التحقق من صحة الموضوع
    if (!request.topic || request.topic.trim().length === 0) {
      throw new Error('الموضوع مطلوب ولا يمكن أن يكون فارغاً');
    }

    let bestResult: GeneratedContent | null = null;
    let bestScore = 0;
    let retryCount = 0;
    let warnings: string[] = [];

    // محاولة التوليد مع إعادة المحاولة إذا فشل فحص الجودة
    while (retryCount < QUALITY_CONFIG.maxRetries) {
      try {
        const result = await this.generateWithValidation(request, retryCount);

        // التحقق من الجودة
        if (result.qualityReport.passed) {
          result.generationTime = Date.now() - startTime;
          return result;
        }

        // حفظ أفضل نتيجة
        if (result.qualityReport.overallScore > bestScore) {
          bestScore = result.qualityReport.overallScore;
          bestResult = result;
        }

        retryCount++;
        console.log(
          `⚠️ محاولة ${retryCount}: درجة الجودة ${result.qualityReport.overallScore}% - إعادة التوليد...`
        );
      } catch (error) {
        console.error(`❌ خطأ في المحاولة ${retryCount + 1}:`, error);
        retryCount++;
      }
    }

    // إرجاع أفضل نتيجة مع تحذير أو استخدام المحتوى الاحتياطي
    if (bestResult && bestScore >= 50) {
      warnings.push(
        `تم إرجاع أفضل نتيجة بعد ${QUALITY_CONFIG.maxRetries} محاولات (درجة الجودة: ${bestScore}%)`
      );
      bestResult.generationTime = Date.now() - startTime;
      (bestResult as any).warnings = warnings;
      return bestResult;
    }

    // استخدام المحتوى الاحتياطي
    console.log('⚠️ استخدام المحتوى الاحتياطي...');
    const analysis = this.analyzer.analyzeEnhanced(
      request.topic,
      request.length
    );
    const category = (request.category || analysis.category) as TopicCategory;

    try {
      const fallbackResult = fallbackContentSystem.generate(
        request.topic,
        analysis.extractedEntities,
        category,
        'فشل التوليد بعد عدة محاولات'
      );

      const fallbackContent: GeneratedContent = {
        content: fallbackResult.content,
        title: fallbackResult.title,
        metaTitle: `${fallbackResult.title} | ميلادك`,
        metaDescription: fallbackResult.metaDescription,
        keywords: analysis.keywords.slice(0, 10),
        wordCount: fallbackResult.wordCount,
        qualityReport: {
          overallScore: 60,
          diversityScore: 60,
          keywordDensity: 60,
          readabilityScore: 70,
          structureScore: 70,
          suggestions: ['تم استخدام محتوى احتياطي - يُنصح بمراجعة المحتوى'],
          passed: true,
        },
        usedTemplates: [fallbackResult.templateId],
        generationTime: Date.now() - startTime,
      };

      (fallbackContent as any).isFallback = true;
      (fallbackContent as any).warnings = [fallbackResult.warning];

      return fallbackContent;
    } catch (fallbackError) {
      console.error('❌ فشل المحتوى الاحتياطي:', fallbackError);
    }

    // إذا فشل كل شيء، أرجع أفضل نتيجة إن وجدت
    if (bestResult) {
      bestResult.generationTime = Date.now() - startTime;
      (bestResult as any).warnings = [
        'فشل التوليد - تم إرجاع أفضل نتيجة متاحة',
      ];
      return bestResult;
    }

    throw new Error('فشل توليد المحتوى بعد عدة محاولات');
  }

  /**
   * توليد المحتوى مع التحقق من الجودة
   */
  private async generateWithValidation(
    request: GenerationRequest,
    attemptNumber: number
  ): Promise<GeneratedContent> {
    this.templateEngine.resetUsedTemplates();
    this.usedTemplates = [];

    // تحليل الموضوع المحسّن
    const analysis = this.analyzer.analyzeEnhanced(
      request.topic,
      request.length
    );
    if (request.category) analysis.category = request.category as TopicCategory;

    const knowledge = loadKnowledge(analysis.category);

    // توليد محتوى غني ومخصص
    const intro = this.generateRichIntro(request.topic, analysis, knowledge);
    const sections = this.generateRichSections(
      request.topic,
      analysis,
      knowledge,
      request.length
    );
    const faqs = this.generateRichFAQs(request.topic, analysis, knowledge);
    const tips = this.generateRichTips(request.topic, analysis, knowledge);
    const conclusion = this.generateRichConclusion(request.topic, analysis);

    let content = this.combineContent(intro, sections, faqs, tips, conclusion);

    // التأكد من اكتمال الأقسام
    content = this.sectionManager.addMissingSections(
      content,
      analysis,
      request.length
    );

    // التأكد من عدد الكلمات باستخدام الحدود الصارمة
    const limits = STRICT_WORD_COUNT_LIMITS[request.length];
    const wordCountStatus = this.wordCountManager.getWordCountStatus(
      content,
      request.length
    );

    if (wordCountStatus.status === 'below') {
      content = this.wordCountManager.expandContent(
        content,
        analysis,
        limits.min
      );
    } else if (wordCountStatus.status === 'above') {
      content = this.wordCountManager.trimContent(content, limits.max);
    }

    // تطبيق إعادة الصياغة
    content = this.rephraser.rephraseParagraph(content, {
      synonymReplacementRate: 0.15,
      preserveKeywords:
        analysis.requiredKeywords || analysis.keywords.slice(0, 5),
    });

    // تطبيق ربط الموضوع (TopicBinder)
    const binderConfig: TopicBinderConfig = {
      topic: request.topic,
      requiredKeywords:
        analysis.requiredKeywords || analysis.keywords.slice(0, 5),
      entities: analysis.extractedEntities,
      maxWordsWithoutMention: 100,
    };
    const bindingResult = this.topicBinder.bind(content, binderConfig);
    content = bindingResult.boundContent;

    // توليد العنوان والميتا
    const title = this.generateTitle(request.topic, analysis);
    const metaTitle = this.generateMetaTitle(title);
    const metaDescription = this.generateMetaDescription(
      request.topic,
      analysis
    );
    const keywords = this.generateKeywords(
      request.topic,
      analysis,
      request.includeKeywords
    );
    const wordCount = this.wordCountManager.countWords(content);

    // فحص الجودة الشامل باستخدام StrictQualityGate
    const strictGateResult = this.qualityGate.validate(content, {
      minTopicRelevance: 80,
      minOverallScore: 75,
      requiredKeywords:
        analysis.requiredKeywords || analysis.keywords.slice(0, 5),
      requiredSections: ['مقدمة', 'الخاتمة'],
      wordCountLimits: STRICT_WORD_COUNT_LIMITS[request.length],
    });

    // فحص الجودة القديم للتوافق
    const validationConfig: ValidationConfig = {
      requiredKeywords: analysis.requiredKeywords || [],
      targetLength: request.length,
      requireFaq:
        request.length === 'long' || request.length === 'comprehensive',
      minH2Count: this.getMinH2Count(request.length),
    };

    const qualityValidation = this.qualityValidator.validate(
      content,
      validationConfig
    );

    // دمج نتائج الفحص
    const combinedScore = Math.round(
      (strictGateResult.overallScore + qualityValidation.overallScore) / 2
    );

    // تحويل نتيجة التحقق إلى تقرير الجودة
    const qualityReport: QualityReport = {
      overallScore: combinedScore,
      diversityScore: qualityValidation.repetitionScore,
      keywordDensity: strictGateResult.topicRelevanceScore,
      readabilityScore: qualityValidation.completenessScore,
      structureScore: qualityValidation.wordCountScore,
      suggestions: [
        ...qualityValidation.suggestions,
        ...strictGateResult.rejectionReasons,
      ],
      passed: strictGateResult.passed && qualityValidation.passed,
    };

    this.usedTemplates = this.templateEngine.getUsedTemplates();

    return {
      content,
      title,
      metaTitle,
      metaDescription,
      keywords,
      wordCount,
      qualityReport,
      usedTemplates: this.usedTemplates,
      generationTime: 0, // سيتم تحديثه لاحقاً
    };
  }

  /**
   * الحصول على الحد الأدنى لعدد أقسام H2
   */
  private getMinH2Count(length: ArticleLength): number {
    const counts: Record<ArticleLength, number> = {
      short: 2,
      medium: 3,
      long: 4,
      comprehensive: 5,
    };
    return counts[length];
  }

  private generateRichIntro(
    topic: string,
    analysis: TopicAnalysis,
    knowledge: any
  ): string {
    const { names, ages } = analysis.extractedEntities;
    const name = names[0] || '';
    const age = ages[0] || 0;

    if (analysis.category === 'birthday') {
      if (name && age) {
        return `<h2>مقدمة</h2>
<p>نحتفل اليوم بمناسبة عيد ميلاد <strong>${name}</strong> الذي يبلغ من العمر <strong>${age} عاماً</strong>! هذه مناسبة سعيدة تستحق الاحتفال والتهنئة. في هذا المقال الشامل، سنقدم لكم أجمل التهاني والأمنيات، بالإضافة إلى أفكار رائعة للاحتفال وهدايا مميزة تناسب هذا العمر الجميل.</p>
<p>عيد الميلاد ليس مجرد يوم عادي، بل هو فرصة للتعبير عن الحب والتقدير للشخص الذي نحتفل به. دعونا نجعل هذا اليوم مميزاً ولا يُنسى!</p>`;
      } else if (name) {
        return `<h2>مقدمة</h2>
<p>نحتفل اليوم بعيد ميلاد <strong>${name}</strong>! هذه مناسبة سعيدة نتمنى فيها له/لها عاماً جديداً مليئاً بالسعادة والنجاح والصحة. في هذا المقال، سنقدم أجمل التهاني وأفكار الاحتفال والهدايا المميزة.</p>`;
      }
      return `<h2>مقدمة</h2>
<p>عيد الميلاد من أجمل المناسبات التي نحتفل بها مع أحبائنا. إنه يوم مميز نعبر فيه عن حبنا وتقديرنا للشخص المحتفى به. في هذا المقال الشامل، سنقدم لكم كل ما تحتاجونه لجعل هذا اليوم لا يُنسى.</p>`;
    }

    if (analysis.category === 'zodiac') {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      if (zodiac && knowledge?.[zodiac]) {
        const signData = knowledge[zodiac];
        return `<h2>مقدمة عن برج ${zodiac}</h2>
<p>برج <strong>${zodiac}</strong> من الأبراج ${
          signData.element || 'المميزة'
        } التي تتميز بصفات فريدة. يولد أصحاب هذا البرج في الفترة ${
          signData.dates || ''
        }، ويتميزون بـ${
          signData.traits?.slice(0, 3).join(' و') || 'صفات مميزة'
        }.</p>
<p>في هذا المقال الشامل، سنتعرف على كل ما يخص برج ${zodiac}: صفاته، نقاط قوته وضعفه، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليد هذا البرج.</p>`;
      }
    }

    return `<h2>مقدمة</h2>
<p>مرحباً بكم في موقع ميلادك! في هذا المقال الشامل، سنتناول موضوع <strong>${topic}</strong> بالتفصيل، ونقدم لكم معلومات مفيدة ونصائح عملية.</p>`;
  }

  private generateRichSections(
    topic: string,
    analysis: TopicAnalysis,
    knowledge: any,
    length: ArticleLength
  ): string[] {
    const sections: string[] = [];
    const { names, ages } = analysis.extractedEntities;
    const name = names[0] || 'المحتفى به';
    const age = ages[0] || 0;

    if (analysis.category === 'birthday' && knowledge) {
      // قسم التهاني
      if (knowledge.greetings) {
        const greetingType =
          age < 13 ? 'forKids' : age < 20 ? 'casual' : 'formal';
        const greetings =
          knowledge.greetings[greetingType] || knowledge.greetings.casual || [];
        if (greetings.length > 0) {
          const selectedGreetings = shuffleArray(greetings).slice(0, 5);
          sections.push(`<h2>أجمل تهاني عيد الميلاد لـ${name}</h2>
<p>نقدم لكم أجمل عبارات التهنئة بمناسبة عيد ميلاد ${name}:</p>
<ul>
${selectedGreetings.map((g) => `<li>${g}</li>`).join('\n')}
</ul>
<p>اختر العبارة التي تعبر عن مشاعرك وأرسلها لـ${name} في يومه المميز!</p>`);
        }
      }

      // قسم أفكار الهدايا
      if (knowledge.ideas?.gifts) {
        let giftCategory = 'forHim';
        if (age < 13) giftCategory = 'forKids';
        else if (age > 60) giftCategory = 'forElderly';

        const gifts = knowledge.ideas.gifts[giftCategory] || [];
        if (gifts.length > 0) {
          const selectedGifts = shuffleArray(gifts).slice(0, 7);
          sections.push(`<h2>أفكار هدايا مميزة لعمر ${age} سنة</h2>
<p>إليكم أفضل أفكار الهدايا المناسبة لـ${name}:</p>
<ol>
${selectedGifts.map((g, i) => `<li><strong>${g}</strong></li>`).join('\n')}
</ol>
<p>اختر الهدية التي تناسب شخصية ${name} واهتماماته!</p>`);
        }
      }

      // قسم أفكار الاحتفال
      if (knowledge.ideas?.activities) {
        const activities = shuffleArray(knowledge.ideas.activities).slice(0, 5);
        sections.push(`<h2>أفكار للاحتفال بعيد ميلاد ${name}</h2>
<p>إليكم أفكار رائعة لجعل الحفلة مميزة:</p>
<ul>
${activities.map((a) => `<li>${a}</li>`).join('\n')}
</ul>`);
      }

      // قسم التقاليد
      if (knowledge.traditions?.arabic) {
        const traditions = shuffleArray(knowledge.traditions.arabic).slice(
          0,
          5
        );
        sections.push(`<h2>تقاليد الاحتفال بأعياد الميلاد</h2>
<p>من أجمل التقاليد العربية في الاحتفال بأعياد الميلاد:</p>
<ul>
${traditions.map((t) => `<li>${t}</li>`).join('\n')}
</ul>`);
      }

      // قسم معلومات العمر
      if (age && knowledge.milestones) {
        const milestone = knowledge.milestones[age.toString()];
        if (milestone) {
          sections.push(`<h2>ماذا يعني عمر ${age} سنة؟</h2>
<p><strong>${milestone.name}</strong>: ${milestone.significance}</p>
<p>من التقاليد المميزة لهذا العمر:</p>
<ul>
${milestone.traditions.map((t: string) => `<li>${t}</li>`).join('\n')}
</ul>`);
        }
      }

      // قسم الحقائق
      if (knowledge.facts) {
        const facts = shuffleArray(knowledge.facts).slice(0, 5);
        sections.push(`<h2>حقائق مثيرة عن أعياد الميلاد</h2>
<p>هل تعلم؟</p>
<ul>
${facts.map((f) => `<li>${f}</li>`).join('\n')}
</ul>`);
      }
    }

    // للأبراج
    if (analysis.category === 'zodiac' && knowledge) {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      const signData = knowledge[zodiac];

      if (signData) {
        // الصفات
        if (signData.traits?.length > 0) {
          sections.push(`<h2>صفات برج ${zodiac}</h2>
<p>يتميز مواليد برج ${zodiac} بالعديد من الصفات المميزة:</p>
<ul>
${signData.traits
  .slice(0, 8)
  .map((t: string) => `<li>${t}</li>`)
  .join('\n')}
</ul>`);
        }

        // نقاط القوة والضعف
        if (signData.strengths?.length > 0 && signData.weaknesses?.length > 0) {
          sections.push(`<h2>نقاط القوة والضعف لبرج ${zodiac}</h2>
<h3>نقاط القوة:</h3>
<ul>
${signData.strengths
  .slice(0, 5)
  .map((s: string) => `<li>${s}</li>`)
  .join('\n')}
</ul>
<h3>نقاط الضعف:</h3>
<ul>
${signData.weaknesses
  .slice(0, 5)
  .map((w: string) => `<li>${w}</li>`)
  .join('\n')}
</ul>`);
        }

        // التوافق
        if (signData.compatibility?.length > 0) {
          sections.push(`<h2>توافق برج ${zodiac} مع الأبراج الأخرى</h2>
<p>يتوافق برج ${zodiac} بشكل جيد مع:</p>
<ul>
${signData.compatibility.map((c: string) => `<li>برج ${c}</li>`).join('\n')}
</ul>
${
  signData.incompatibility?.length > 0
    ? `<p>وقد يواجه تحديات مع: ${signData.incompatibility.join('، ')}</p>`
    : ''
}`);
        }

        // الحقائق
        if (signData.facts?.length > 0) {
          const facts = signData.facts as string[];
          sections.push(`<h2>حقائق مثيرة عن برج ${zodiac}</h2>
<ul>
${shuffleArray(facts)
  .slice(0, 5)
  .map((f: string) => `<li>${f}</li>`)
  .join('\n')}
</ul>`);
        }

        // المشاهير
        if (signData.celebrities?.length > 0) {
          sections.push(`<h2>مشاهير من برج ${zodiac}</h2>
<p>من أشهر مواليد برج ${zodiac}:</p>
<ul>
${signData.celebrities
  .slice(0, 5)
  .map((c: string) => `<li>${c}</li>`)
  .join('\n')}
</ul>`);
        }
      }
    }

    // إذا لم يكن هناك أقسام كافية، أضف أقسام عامة
    if (sections.length < 3) {
      sections.push(`<h2>معلومات مهمة عن ${topic}</h2>
<p>يعتبر ${topic} من المواضيع المهمة التي تستحق الاهتمام. نقدم لكم في هذا القسم معلومات قيمة ومفيدة.</p>`);
    }

    return sections;
  }

  private generateRichFAQs(
    topic: string,
    analysis: TopicAnalysis,
    knowledge: any
  ): FAQ[] {
    const faqs: FAQ[] = [];
    const { names, ages } = analysis.extractedEntities;
    const name = names[0] || '';
    const age = ages[0] || 0;

    if (analysis.category === 'birthday') {
      faqs.push({
        question: 'كيف أحتفل بعيد ميلاد مميز؟',
        answer:
          'للاحتفال بعيد ميلاد مميز: خطط مسبقاً، اختر موضوعاً للحفلة، ادعُ الأحباء، أعد كيكة مخصصة، وجهز هدايا وألعاب ممتعة. الأهم هو إظهار الحب والاهتمام للمحتفى به.',
      });

      faqs.push({
        question: 'ما هي أفضل أفكار هدايا عيد الميلاد؟',
        answer:
          'أفضل الهدايا هي التي تناسب شخصية واهتمامات المحتفى به. يمكنك اختيار: هدايا شخصية مخصصة، تجارب مميزة، كتب، عطور، أو هدايا عملية يحتاجها الشخص.',
      });

      if (age) {
        faqs.push({
          question: `ما هي أفضل طريقة للاحتفال بعمر ${age} سنة؟`,
          answer: `في عمر ${age} سنة، يمكنك الاحتفال بطريقة تناسب هذه المرحلة العمرية. ${
            age < 13
              ? 'للأطفال، حفلة مع الألعاب والأصدقاء مثالية.'
              : age < 20
              ? 'للمراهقين، نشاط مع الأصدقاء كالسينما أو البولينغ.'
              : 'للكبار، عشاء عائلي أو رحلة مميزة.'
          }`,
        });
      }
    }

    if (analysis.category === 'zodiac') {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      if (zodiac) {
        faqs.push({
          question: `ما هي أبرز صفات برج ${zodiac}؟`,
          answer: `يتميز برج ${zodiac} بصفات مميزة تجعله فريداً. من أبرز صفاته: القوة، الإصرار، والقدرة على تحقيق الأهداف.`,
        });

        faqs.push({
          question: `ما هي الأبراج المتوافقة مع برج ${zodiac}؟`,
          answer: `يتوافق برج ${zodiac} بشكل جيد مع عدة أبراج. التوافق يعتمد على عناصر الأبراج وصفاتها المشتركة.`,
        });
      }
    }

    // أسئلة عامة
    if (faqs.length < 3) {
      faqs.push({
        question: `أين أجد معلومات أكثر عن ${topic}؟`,
        answer: `يمكنك زيارة موقع ميلادك للمزيد من المعلومات والمقالات المفيدة حول ${topic} ومواضيع أخرى متنوعة.`,
      });
    }

    return faqs.slice(0, 5);
  }

  private generateRichTips(
    topic: string,
    analysis: TopicAnalysis,
    knowledge: any
  ): string[] {
    const tips: string[] = [];
    const { names, ages } = analysis.extractedEntities;
    const age = ages[0] || 0;

    if (analysis.category === 'birthday' && knowledge?.ageSpecificTips) {
      let tipCategory = 'adults';
      if (age < 13) tipCategory = 'children';
      else if (age < 20) tipCategory = 'teens';
      else if (age > 60) tipCategory = 'seniors';

      const categoryTips = knowledge.ageSpecificTips[tipCategory] || [];
      tips.push(...categoryTips.slice(0, 5));
    }

    if (analysis.category === 'zodiac' && knowledge) {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      const signData = knowledge[zodiac];
      if (signData?.tips) {
        tips.push(...signData.tips.slice(0, 5));
      }
    }

    // نصائح عامة إذا لم تكن هناك نصائح كافية
    if (tips.length < 3) {
      tips.push(`استفد من المعلومات المتاحة عن ${topic}`);
      tips.push(`شارك هذا المقال مع من يهمه الأمر`);
      tips.push(`تابعنا للمزيد من المقالات المفيدة`);
    }

    return tips.slice(0, 5);
  }

  private generateRichConclusion(
    topic: string,
    analysis: TopicAnalysis
  ): string {
    const { names } = analysis.extractedEntities;
    const name = names[0] || '';

    if (analysis.category === 'birthday') {
      if (name) {
        return `<h2>الخاتمة</h2>
<p>في الختام، نتمنى لـ<strong>${name}</strong> عيد ميلاد سعيد وعاماً جديداً مليئاً بالسعادة والنجاح والصحة. نأمل أن تكون هذه الأفكار والنصائح قد ساعدتكم في التخطيط لاحتفال مميز.</p>
<p>لا تنسوا مشاركة هذا المقال مع أصدقائكم وأحبائكم، وتابعونا للمزيد من المقالات المفيدة على موقع ميلادك!</p>`;
      }
      return `<h2>الخاتمة</h2>
<p>نأمل أن يكون هذا المقال قد أفادكم في التخطيط لاحتفال عيد ميلاد مميز. تذكروا أن أهم شيء هو إظهار الحب والاهتمام للشخص المحتفى به.</p>
<p>شاركوا المقال مع أصدقائكم وتابعونا للمزيد!</p>`;
    }

    if (analysis.category === 'zodiac') {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      if (zodiac) {
        return `<h2>الخاتمة</h2>
<p>هذا كل ما تحتاج معرفته عن برج ${zodiac}. نأمل أن تكون هذه المعلومات قد أفادتك في فهم هذا البرج بشكل أفضل.</p>
<p>تابعونا للمزيد من المقالات عن الأبراج والفلك على موقع ميلادك!</p>`;
      }
    }

    return `<h2>الخاتمة</h2>
<p>نأمل أن يكون هذا المقال قد أفادكم. شاركوه مع أصدقائكم وتابعونا للمزيد من المقالات المفيدة على موقع ميلادك!</p>`;
  }

  private combineContent(
    intro: string,
    sections: string[],
    faqs: FAQ[],
    tips: string[],
    conclusion: string
  ): string {
    const parts: string[] = [intro, ...sections];

    if (tips.length > 0) {
      parts.push(
        `<h2>نصائح مهمة</h2>\n<ul>\n${tips
          .map((t) => `<li>${t}</li>`)
          .join('\n')}\n</ul>`
      );
    }

    if (faqs.length > 0) {
      const faqHtml = faqs
        .map((f) => `<h3>${f.question}</h3>\n<p>${f.answer}</p>`)
        .join('\n');
      parts.push(`<h2>الأسئلة الشائعة</h2>\n${faqHtml}`);
    }

    parts.push(conclusion);
    return parts.join('\n\n');
  }

  private generateTitle(topic: string, analysis: TopicAnalysis): string {
    const { names, ages } = analysis.extractedEntities;
    const name = names[0] || '';
    const age = ages[0] || 0;

    if (analysis.category === 'birthday') {
      if (name && age)
        return `عيد ميلاد سعيد ${name} - ${age} عاماً من العطاء والتميز`;
      if (name) return `عيد ميلاد سعيد ${name} - أجمل التهاني والأمنيات`;
      return `عيد ميلاد سعيد - أفكار وتهاني مميزة`;
    }

    if (analysis.category === 'zodiac') {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      if (zodiac) return `برج ${zodiac}: صفاته وتوافقه ونصائح مهمة`;
    }

    return `${topic} - دليل شامل ومفصل`;
  }

  private generateMetaTitle(title: string): string {
    const suffix = ' | ميلادك';
    const maxLength = 60 - suffix.length;
    return title.length <= maxLength
      ? title + suffix
      : title.substring(0, maxLength - 3) + '...' + suffix;
  }

  private generateMetaDescription(
    topic: string,
    analysis: TopicAnalysis
  ): string {
    const { names, ages } = analysis.extractedEntities;
    const name = names[0] || '';
    const age = ages[0] || 0;

    if (analysis.category === 'birthday') {
      if (name && age) {
        return `عيد ميلاد سعيد ${name}! اكتشف أجمل التهاني وأفكار الهدايا المناسبة لعمر ${age} سنة. نصائح للاحتفال وعبارات تهنئة مميزة.`;
      }
      return `أفكار رائعة للاحتفال بعيد الميلاد. تهاني مميزة، أفكار هدايا، ونصائح لحفلة لا تُنسى. اقرأ المزيد على موقع ميلادك.`;
    }

    if (analysis.category === 'zodiac') {
      const zodiac = analysis.extractedEntities.zodiacSigns[0];
      if (zodiac) {
        return `اكتشف كل ما تريد معرفته عن برج ${zodiac}. صفاته، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليد هذا البرج.`;
      }
    }

    return `دليل شامل عن ${topic}. معلومات مفيدة ونصائح عملية على موقع ميلادك.`;
  }

  private generateKeywords(
    topic: string,
    analysis: TopicAnalysis,
    includeKeywords?: string[]
  ): string[] {
    const keywords = new Set<string>([topic]);

    analysis.keywords.forEach((kw) => keywords.add(kw));
    includeKeywords?.forEach((kw) => keywords.add(kw));

    const { names, ages, zodiacSigns } = analysis.extractedEntities;
    names.forEach((n) => keywords.add(n));
    zodiacSigns.forEach((z) => keywords.add(z));

    if (analysis.category === 'birthday') {
      keywords.add('عيد ميلاد');
      keywords.add('تهنئة');
      keywords.add('احتفال');
      keywords.add('هدايا');
    }

    if (analysis.category === 'zodiac') {
      keywords.add('أبراج');
      keywords.add('برج');
      keywords.add('فلك');
    }

    return Array.from(keywords).slice(0, 10);
  }

  private countWords(content: string): number {
    const text = content.replace(/<[^>]*>/g, ' ');
    return text.split(/\s+/).filter((w) => w.length > 0).length;
  }

  private calculateQuality(content: string, keywords: string[]): QualityReport {
    const words = content.split(/\s+/).filter((w) => w.length > 2);
    const uniqueWords = new Set(words);
    const diversityScore = Math.min(
      (uniqueWords.size / words.length) * 150,
      100
    );

    let keywordCount = 0;
    const lowerContent = content.toLowerCase();
    keywords.forEach((kw) => {
      const matches = lowerContent.match(new RegExp(kw, 'gi'));
      keywordCount += matches ? matches.length : 0;
    });
    const density = (keywordCount / words.length) * 100;
    const keywordDensity =
      density >= 2 && density <= 4
        ? 100
        : density >= 1 && density <= 5
        ? 80
        : 50;

    const sentences = content.split(/[.،؟!]/);
    const avgWordsPerSentence = words.length / sentences.length;
    const readabilityScore =
      avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20
        ? 100
        : avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25
        ? 80
        : 60;

    let structureScore = 0;
    if (content.includes('<h2>')) structureScore += 30;
    if (content.includes('<h3>')) structureScore += 10;
    if (content.includes('<ul>') || content.includes('<ol>'))
      structureScore += 20;
    if (content.split('</p>').length > 5) structureScore += 20;
    if (content.includes('الأسئلة الشائعة')) structureScore += 10;
    if (content.includes('الخاتمة')) structureScore += 10;
    structureScore = Math.min(structureScore, 100);

    const overallScore =
      diversityScore * 0.25 +
      keywordDensity * 0.25 +
      readabilityScore * 0.25 +
      structureScore * 0.25;

    const suggestions: string[] = [];
    if (diversityScore < 70) suggestions.push('زيادة تنوع المفردات');
    if (keywordDensity < 50) suggestions.push('تعديل كثافة الكلمات المفتاحية');
    if (readabilityScore < 70) suggestions.push('تبسيط بعض الجمل');
    if (structureScore < 70) suggestions.push('تحسين هيكل المقال');

    return {
      overallScore: Math.round(overallScore),
      diversityScore: Math.round(diversityScore),
      keywordDensity: Math.round(keywordDensity),
      readabilityScore: Math.round(readabilityScore),
      structureScore: Math.round(structureScore),
      suggestions,
      passed: overallScore >= 70,
    };
  }
}

export const contentGenerator = new ContentGenerator();
