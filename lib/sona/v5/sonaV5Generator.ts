/**
 * SONA v5 - Advanced Content Generator
 * المولد المتقدم للمحتوى العربي
 *
 * يجمع بين:
 * - سلاسل ماركوف للتوليد الطبيعي
 * - بنك عبارات ضخم (1000+)
 * - مركب جمل ذكي
 * - خلاط محتوى متقدم
 */

import { ArabicMarkovChain, arabicMarkov } from './markovChain';
import {
  ContentMixer,
  contentMixer,
  ContentBlock,
  MixerConfig,
} from './contentMixer';
import { SentenceComposer, sentenceComposer } from './sentenceComposer';
import {
  getRandomPhrase,
  getRandomTransition,
  getRandomConclusion,
  MASSIVE_INTROS,
} from './massivePhraseBank';
import { getAllCorpus, getCorpusByCategory } from './trainingCorpus';

// ============================================
// أنواع البيانات
// ============================================

export interface SonaV5Request {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  category?: 'birthday' | 'zodiac' | 'health' | 'dates' | 'general';
  includeKeywords?: string[];
  entities?: {
    names?: string[];
    ages?: number[];
    zodiacSigns?: string[];
  };
  maxRetries?: number;
  minQualityScore?: number;
}

export interface SonaV5Response {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  qualityScore: number;
  generationTime: number;
  provider: string;
}

// ============================================
// ثوابت
// ============================================

const WORD_COUNT_TARGETS: Record<string, { min: number; max: number }> = {
  short: { min: 400, max: 700 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  comprehensive: { min: 2500, max: 4000 },
};

// ============================================
// فئة المولد الرئيسي
// ============================================

export class SonaV5Generator {
  private markov: ArabicMarkovChain;
  private mixer: ContentMixer;
  private composer: SentenceComposer;
  private initialized: boolean = false;

  constructor() {
    this.markov = arabicMarkov;
    this.mixer = contentMixer;
    this.composer = sentenceComposer;
  }

  /**
   * تهيئة المولد
   */
  initialize(): void {
    if (this.initialized) return;

    // تدريب نموذج ماركوف على جميع النصوص
    const fullCorpus = getAllCorpus();
    this.markov.train(fullCorpus);
    this.initialized = true;

    console.log('✅ SONA v5 initialized successfully');
    console.log(`📊 Markov model size: ${this.markov.getModelSize()} states`);
  }

  /**
   * تهيئة المولد لفئة معينة
   */
  initializeForCategory(category: string): void {
    const categoryCorpus = getCorpusByCategory(category);
    this.markov.train(categoryCorpus);
    console.log(`📊 Trained on ${category} corpus`);
  }

  /**
   * توليد مقال كامل
   */
  async generate(request: SonaV5Request): Promise<SonaV5Response> {
    const startTime = Date.now();

    // التهيئة إذا لم تتم
    if (!this.initialized) {
      this.initialize();
    }

    console.log('🚀 SONA v5: بدء التوليد...');
    console.log('📝 الموضوع:', request.topic);
    console.log('📏 الطول:', request.length);

    // إعادة تعيين الحالة
    this.mixer.reset();
    this.composer.reset();

    // تحديد الفئة
    const category = request.category || this.detectCategory(request.topic);
    console.log('🎯 الفئة:', category);

    // استخراج الكيانات
    const entities = request.entities || this.extractEntities(request.topic);

    // تكوين الخلاط
    const mixerConfig: MixerConfig = {
      topic: request.topic,
      category,
      style: this.mapStyle(request.style || 'formal'),
      length: request.length,
      entities,
    };

    // توليد المحتوى
    const blocks = this.mixer.mix(mixerConfig);

    // تجميع المحتوى
    let content = this.assembleContent(blocks);

    // تحسين المحتوى بماركوف
    content = this.enhanceWithMarkov(content);

    // ضبط عدد الكلمات
    const targets = WORD_COUNT_TARGETS[request.length];
    content = this.adjustWordCount(content, targets.min, targets.max, request);

    // توليد العنوان والميتا
    const title = this.generateTitle(request.topic, category, entities);
    const metaTitle = this.generateMetaTitle(title);
    const metaDescription = this.generateMetaDescription(
      request.topic,
      content,
      category
    );
    const keywords = this.generateKeywords(
      request.topic,
      category,
      request.includeKeywords
    );

    // حساب الجودة
    const wordCount = this.countWords(content);
    const qualityScore = this.calculateQuality(content, request);

    const generationTime = Date.now() - startTime;

    console.log('✅ SONA v5: اكتمل التوليد!');
    console.log('📊 عدد الكلمات:', wordCount);
    console.log('⭐ درجة الجودة:', qualityScore + '%');
    console.log('⏱️ وقت التوليد:', generationTime + 'ms');

    return {
      content,
      title,
      metaTitle,
      metaDescription,
      keywords,
      wordCount,
      qualityScore,
      generationTime,
      provider: 'sona-v5',
    };
  }

  /**
   * تجميع المحتوى من الكتل
   */
  private assembleContent(blocks: ContentBlock[]): string {
    // ترتيب الكتل حسب الأولوية
    const sorted = [...blocks].sort((a, b) => b.priority - a.priority);

    // تجميع المحتوى
    return sorted.map((block) => block.content).join('\n\n');
  }

  /**
   * تحسين المحتوى باستخدام ماركوف
   */
  private enhanceWithMarkov(content: string): string {
    if (!this.markov.isTrained()) return content;

    // إضافة جمل ماركوف في أماكن مناسبة
    const paragraphs = content.split('</p>');
    const enhanced: string[] = [];

    for (let i = 0; i < paragraphs.length; i++) {
      enhanced.push(paragraphs[i]);

      // إضافة جملة ماركوف كل 3 فقرات
      if (i > 0 && i % 3 === 0 && i < paragraphs.length - 1) {
        const markovSentence = this.markov.generate(20);
        if (markovSentence && markovSentence.length > 20) {
          enhanced.push(`<p>${getRandomTransition()} ${markovSentence}</p>`);
        }
      }
    }

    return enhanced.join('</p>');
  }

  /**
   * ضبط عدد الكلمات
   */
  private adjustWordCount(
    content: string,
    minWords: number,
    maxWords: number,
    request: SonaV5Request
  ): string {
    let currentCount = this.countWords(content);

    // توسيع إذا كان قصيراً
    while (currentCount < minWords) {
      const expansion = this.generateExpansion(request);
      content = this.insertExpansion(content, expansion);
      currentCount = this.countWords(content);

      // منع الحلقة اللانهائية
      if (expansion.length === 0) break;
    }

    // تقليص إذا كان طويلاً
    if (currentCount > maxWords) {
      content = this.trimContent(content, maxWords);
    }

    return content;
  }

  /**
   * توليد توسيع للمحتوى
   */
  private generateExpansion(request: SonaV5Request): string {
    const expansions: string[] = [];
    const category = request.category || 'general';

    // جمل توسيع عامة
    const generalExpansions = [
      'من المهم أيضاً الانتباه إلى التفاصيل الصغيرة التي قد تحدث فرقاً كبيراً في النتائج.',
      'يُنصح بالتخطيط المسبق والتحضير الجيد لضمان أفضل النتائج الممكنة.',
      'لا تتردد في طلب المساعدة من المختصين والخبراء عند الحاجة.',
      'التجربة والممارسة المستمرة هما أفضل طريقة للتعلم والتحسن.',
      'شارك هذه المعلومات القيمة مع من يهمه الأمر لتعم الفائدة على الجميع.',
      'تذكر دائماً أن النجاح يأتي بالصبر والمثابرة والعمل الدؤوب.',
      'استفد من تجارب الآخرين وتعلم من أخطائهم لتوفير الوقت والجهد.',
    ];

    // جمل حسب الفئة
    const categoryExpansions: Record<string, string[]> = {
      birthday: [
        'تذكر أن أهم شيء في الاحتفال هو إظهار الحب والاهتمام للشخص المحتفى به.',
        'الهدايا المادية مهمة، لكن الوقت والاهتمام أثمن وأغلى.',
        'اجعل هذا اليوم مميزاً بلمساتك الشخصية وأفكارك الإبداعية.',
      ],
      zodiac: [
        'تذكر أن الأبراج تقدم توجيهات عامة وليست قواعد صارمة تحدد مصيرك.',
        'كل شخص فريد بصفاته وتجاربه بغض النظر عن برجه الفلكي.',
        'استخدم معرفتك بالأبراج لفهم نفسك والآخرين بشكل أفضل.',
      ],
      health: [
        'استشر طبيباً أو أخصائياً قبل اتخاذ أي قرارات صحية مهمة.',
        'المعلومات المقدمة هنا للتثقيف العام فقط وليست بديلاً عن الاستشارة الطبية.',
        'الوقاية خير من العلاج، فاحرص على نمط حياة صحي.',
      ],
      dates: [
        'استخدم الأدوات الموثوقة للتحويل بين التقويمات المختلفة.',
        'تأكد دائماً من صحة التواريخ قبل الاعتماد عليها في أمور مهمة.',
      ],
      general: generalExpansions,
    };

    // اختيار توسيعات عشوائية
    const catExpansions = categoryExpansions[category] || generalExpansions;
    const allExpansions = [...catExpansions, ...generalExpansions];

    const shuffled = this.shuffleArray(allExpansions);
    expansions.push(shuffled[0]);

    return `<p>${expansions.join(' ')}</p>`;
  }

  /**
   * إدراج التوسيع في المحتوى
   */
  private insertExpansion(content: string, expansion: string): string {
    const conclusionIndex = content.lastIndexOf('<h2>الخاتمة</h2>');
    if (conclusionIndex > 0) {
      return (
        content.slice(0, conclusionIndex) +
        expansion +
        '\n\n' +
        content.slice(conclusionIndex)
      );
    }
    return content + '\n\n' + expansion;
  }

  /**
   * تقليص المحتوى
   */
  private trimContent(content: string, maxWords: number): string {
    const sections = content.split(/<h2>/);
    let result = sections[0];
    let currentCount = this.countWords(result);

    for (let i = 1; i < sections.length; i++) {
      const section = '<h2>' + sections[i];
      const sectionWords = this.countWords(section);

      if (currentCount + sectionWords <= maxWords) {
        result += section;
        currentCount += sectionWords;
      } else if (section.includes('الخاتمة')) {
        result += section;
        break;
      }
    }

    return result;
  }

  /**
   * توليد العنوان
   */
  private generateTitle(
    topic: string,
    category: string,
    entities?: { names?: string[]; ages?: number[]; zodiacSigns?: string[] }
  ): string {
    const name = entities?.names?.[0] || '';
    const age = entities?.ages?.[0] || 0;
    const sign = entities?.zodiacSigns?.[0] || '';

    if (category === 'birthday') {
      if (name && age)
        return `عيد ميلاد سعيد ${name} - ${age} عاماً من العطاء والتميز`;
      if (name) return `عيد ميلاد سعيد ${name} - أجمل التهاني والأمنيات`;
      return `عيد ميلاد سعيد - أفكار وتهاني مميزة`;
    }

    if (category === 'zodiac' && sign) {
      return `برج ${sign}: صفاته وتوافقه ونصائح مهمة`;
    }

    return `${topic} - دليل شامل ومفصل`;
  }

  /**
   * توليد عنوان الميتا
   */
  private generateMetaTitle(title: string): string {
    const suffix = ' | ميلادك';
    const maxLength = 60 - suffix.length;
    return title.length <= maxLength
      ? title + suffix
      : title.substring(0, maxLength - 3) + '...' + suffix;
  }

  /**
   * توليد وصف الميتا
   */
  private generateMetaDescription(
    topic: string,
    content: string,
    category: string
  ): string {
    const descriptions: Record<string, string> = {
      birthday: `أفكار رائعة للاحتفال بعيد الميلاد. تهاني مميزة، أفكار هدايا، ونصائح لحفلة لا تُنسى. اقرأ المزيد على موقع ميلادك.`,
      zodiac: `اكتشف كل ما تريد معرفته عن الأبراج. صفاتها، توافقها مع الأبراج الأخرى، ونصائح مهمة لمواليدها.`,
      health: `معلومات صحية موثوقة ونصائح عملية للحفاظ على صحتك. اقرأ المزيد على موقع ميلادك.`,
      dates: `أدوات ومعلومات مفيدة عن التواريخ والتقويمات. تحويل التاريخ وحساب الأيام بسهولة.`,
      general: `معلومات شاملة ونصائح عملية. اكتشف المزيد على موقع ميلادك.`,
    };

    return descriptions[category] || descriptions.general;
  }

  /**
   * توليد الكلمات المفتاحية
   */
  private generateKeywords(
    topic: string,
    category: string,
    includeKeywords?: string[]
  ): string[] {
    const keywords = new Set<string>([topic]);

    // كلمات حسب الفئة
    const categoryKeywords: Record<string, string[]> = {
      birthday: ['عيد ميلاد', 'تهنئة', 'احتفال', 'هدايا', 'كعكة'],
      zodiac: ['أبراج', 'برج', 'فلك', 'توافق', 'صفات'],
      health: ['صحة', 'نصائح صحية', 'عافية', 'رياضة', 'تغذية'],
      dates: ['تاريخ', 'تقويم', 'هجري', 'ميلادي', 'تحويل'],
      general: ['معلومات', 'نصائح', 'دليل', 'شامل'],
    };

    const catKeywords = categoryKeywords[category] || categoryKeywords.general;
    catKeywords.forEach((kw) => keywords.add(kw));

    // الكلمات المطلوبة
    includeKeywords?.forEach((kw) => keywords.add(kw));

    // إضافة ميلادك
    keywords.add('ميلادك');

    return Array.from(keywords).slice(0, 15);
  }

  /**
   * حساب درجة الجودة
   */
  private calculateQuality(content: string, request: SonaV5Request): number {
    let score = 70; // درجة أساسية

    const wordCount = this.countWords(content);
    const targets = WORD_COUNT_TARGETS[request.length];

    // نقاط عدد الكلمات
    if (wordCount >= targets.min && wordCount <= targets.max) {
      score += 10;
    } else if (wordCount >= targets.min * 0.8) {
      score += 5;
    }

    // نقاط الهيكل
    if (content.includes('<h2>')) score += 5;
    if (content.includes('<ul>') || content.includes('<ol>')) score += 5;
    if (content.includes('<strong>')) score += 3;

    // نقاط التنوع
    const uniqueWords = new Set(content.split(/\s+/)).size;
    const diversityRatio = uniqueWords / wordCount;
    if (diversityRatio > 0.4) score += 5;
    if (diversityRatio > 0.5) score += 2;

    return Math.min(100, score);
  }

  /**
   * اكتشاف الفئة من الموضوع
   */
  private detectCategory(
    topic: string
  ): 'birthday' | 'zodiac' | 'health' | 'dates' | 'general' {
    const lower = topic.toLowerCase();

    if (
      lower.includes('عيد ميلاد') ||
      lower.includes('ميلاد') ||
      lower.includes('birthday')
    ) {
      return 'birthday';
    }
    if (
      lower.includes('برج') ||
      lower.includes('أبراج') ||
      lower.includes('zodiac')
    ) {
      return 'zodiac';
    }
    if (
      lower.includes('صحة') ||
      lower.includes('طبي') ||
      lower.includes('health')
    ) {
      return 'health';
    }
    if (
      lower.includes('تاريخ') ||
      lower.includes('تقويم') ||
      lower.includes('date')
    ) {
      return 'dates';
    }

    return 'general';
  }

  /**
   * استخراج الكيانات من الموضوع
   */
  private extractEntities(topic: string): {
    names?: string[];
    ages?: number[];
    zodiacSigns?: string[];
  } {
    const entities: {
      names?: string[];
      ages?: number[];
      zodiacSigns?: string[];
    } = {};

    // استخراج الأعمار
    const ageMatch = topic.match(/(\d+)\s*(سنة|عام|عاماً)/);
    if (ageMatch) {
      entities.ages = [parseInt(ageMatch[1])];
    }

    // استخراج الأبراج
    const zodiacSigns = [
      'الحمل',
      'الثور',
      'الجوزاء',
      'السرطان',
      'الأسد',
      'العذراء',
      'الميزان',
      'العقرب',
      'القوس',
      'الجدي',
      'الدلو',
      'الحوت',
    ];
    for (const sign of zodiacSigns) {
      if (topic.includes(sign)) {
        entities.zodiacSigns = [sign];
        break;
      }
    }

    // استخراج الأسماء (بسيط)
    const namePatterns = [
      /عيد ميلاد\s+(\S+)/,
      /ميلاد\s+(\S+)/,
      /تهنئة\s+(\S+)/,
    ];
    for (const pattern of namePatterns) {
      const match = topic.match(pattern);
      if (match && match[1] && !['سعيد', 'مبارك', 'جميل'].includes(match[1])) {
        entities.names = [match[1]];
        break;
      }
    }

    return entities;
  }

  /**
   * تحويل الأسلوب
   */
  private mapStyle(
    style: string
  ): 'formal' | 'casual' | 'educational' | 'analytical' {
    const mapping: Record<
      string,
      'formal' | 'casual' | 'educational' | 'analytical'
    > = {
      formal: 'formal',
      casual: 'casual',
      seo: 'formal',
      academic: 'analytical',
    };
    return mapping[style] || 'formal';
  }

  /**
   * عد الكلمات
   */
  private countWords(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText.split(/\s+/).filter((w) => w.length > 0).length;
  }

  /**
   * خلط المصفوفة
   */
  private shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// نسخة جاهزة للاستخدام
export const sonaV5Generator = new SonaV5Generator();

// دالة مساعدة للتوليد السريع
export async function generateWithSonaV5(
  request: SonaV5Request
): Promise<SonaV5Response> {
  return sonaV5Generator.generate(request);
}
