/**
 * SONA Enhanced Generator - المولد المحسّن
 * يدمج جميع المكونات المحسّنة لتوليد محتوى عالي الجودة
 *
 * Requirements: جميع المتطلبات من spec sona-quality-enhancement
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  EnhancedTopicAnalyzer,
  enhancedTopicAnalyzer,
  DeepTopicAnalysis,
} from './enhancedTopicAnalyzer';
import {
  DynamicContentBuilder,
  dynamicContentBuilder,
  ContentSection,
  KnowledgeEntry,
} from './dynamicContentBuilder';
import { PhraseVariator, phraseVariator } from './phraseVariator';
import {
  EnhancedQualityValidator,
  enhancedQualityValidator,
  EnhancedQualityReport,
} from './enhancedQualityValidator';
import { ArticleLength, TopicCategory } from './types';

// ============================================
// أنواع البيانات
// ============================================

export interface EnhancedGenerationRequest {
  topic: string;
  length: ArticleLength;
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: TopicCategory;
  maxRetries?: number;
  minQualityScore?: number;
}

export interface EnhancedGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  qualityReport: EnhancedQualityReport;
  analysis: DeepTopicAnalysis;
  generationTime: number;
  retryCount: number;
}

// ============================================
// ثوابت
// ============================================

const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

const WORD_COUNT_TARGETS: Record<ArticleLength, { min: number; max: number }> =
  {
    short: { min: 400, max: 700 },
    medium: { min: 800, max: 1200 },
    long: { min: 1500, max: 2500 },
    comprehensive: { min: 2500, max: 4000 },
  };

const DEFAULT_CONFIG = {
  maxRetries: 3,
  minQualityScore: 70,
};

// ============================================
// فئة المولد المحسّن
// ============================================

export class EnhancedGenerator {
  private topicAnalyzer: EnhancedTopicAnalyzer;
  private contentBuilder: DynamicContentBuilder;
  private phraseVariator: PhraseVariator;
  private qualityValidator: EnhancedQualityValidator;
  private knowledgeCache: Map<string, KnowledgeEntry> = new Map();

  constructor() {
    this.topicAnalyzer = enhancedTopicAnalyzer;
    this.contentBuilder = dynamicContentBuilder;
    this.phraseVariator = phraseVariator;
    this.qualityValidator = enhancedQualityValidator;
  }

  /**
   * توليد محتوى محسّن مع ضمان الجودة
   */
  async generate(
    request: EnhancedGenerationRequest
  ): Promise<EnhancedGenerationResponse> {
    const startTime = Date.now();
    const maxRetries = request.maxRetries || DEFAULT_CONFIG.maxRetries;
    const minQualityScore =
      request.minQualityScore || DEFAULT_CONFIG.minQualityScore;

    console.log('🚀 SONA Enhanced: بدء التوليد المحسّن...');
    console.log('📝 الموضوع:', request.topic);
    console.log('📏 الطول:', request.length);

    // تحليل الموضوع بعمق
    const analysis = this.topicAnalyzer.analyzeTopicDeep(
      request.topic,
      request.length
    );
    if (request.category) {
      analysis.category = request.category;
    }

    console.log('🎯 التصنيف:', analysis.category);
    console.log('🔑 الكلمات المفتاحية:', analysis.primaryKeywords.slice(0, 5));
    console.log('📊 درجة الثقة:', (analysis.confidence * 100).toFixed(1) + '%');

    // تحميل قاعدة المعرفة
    const knowledge = this.loadKnowledge(analysis.category);

    let bestResult: EnhancedGenerationResponse | null = null;
    let bestScore = 0;
    let retryCount = 0;

    // محاولة التوليد مع إعادة المحاولة
    while (retryCount < maxRetries) {
      try {
        // إعادة تعيين الحالة
        this.contentBuilder.reset();
        this.phraseVariator.reset();

        // بناء المحتوى
        const result = await this.generateContent(request, analysis, knowledge);

        // فحص الجودة
        const qualityReport = this.qualityValidator.validateContent(
          result.content,
          request.topic,
          {
            requiredKeywords:
              request.includeKeywords || analysis.primaryKeywords.slice(0, 5),
            targetLength: request.length,
          }
        );

        const response: EnhancedGenerationResponse = {
          ...result,
          qualityReport,
          analysis,
          generationTime: Date.now() - startTime,
          retryCount,
        };

        // التحقق من الجودة
        if (qualityReport.passed && qualityReport.score >= minQualityScore) {
          console.log('✅ SONA Enhanced: نجح التوليد!');
          console.log('📊 درجة الجودة:', qualityReport.score);
          return response;
        }

        // حفظ أفضل نتيجة
        if (qualityReport.score > bestScore) {
          bestScore = qualityReport.score;
          bestResult = response;
        }

        retryCount++;
        console.log(
          `⚠️ محاولة ${retryCount}: درجة الجودة ${qualityReport.score}% - إعادة التوليد...`
        );
      } catch (error) {
        console.error(`❌ خطأ في المحاولة ${retryCount + 1}:`, error);
        retryCount++;
      }
    }

    // إرجاع أفضل نتيجة
    if (bestResult) {
      console.log('⚠️ SONA Enhanced: إرجاع أفضل نتيجة متاحة');
      bestResult.generationTime = Date.now() - startTime;
      return bestResult;
    }

    throw new Error('فشل توليد المحتوى بعد عدة محاولات');
  }

  /**
   * توليد المحتوى الفعلي
   */
  private async generateContent(
    request: EnhancedGenerationRequest,
    analysis: DeepTopicAnalysis,
    knowledge: KnowledgeEntry | null
  ): Promise<
    Omit<
      EnhancedGenerationResponse,
      'qualityReport' | 'analysis' | 'generationTime' | 'retryCount'
    >
  > {
    // بناء الهيكل الديناميكي
    const sections = this.contentBuilder.buildDynamicStructure({
      topic: request.topic,
      analysis,
      knowledge,
      length: request.length,
      entities: analysis.entities,
    });

    // تجميع المحتوى
    let content = this.assembleSections(sections);

    // تطبيق تنويع العبارات
    content = this.applyPhraseVariation(content);

    // التأكد من عدد الكلمات
    const targets = WORD_COUNT_TARGETS[request.length];
    content = this.adjustWordCount(content, targets.min, targets.max, analysis);

    // توليد العنوان والميتا
    const title = this.generateTitle(request.topic, analysis);
    const metaTitle = this.generateMetaTitle(title);
    const metaDescription = this.generateMetaDescription(
      request.topic,
      content,
      analysis
    );
    const keywords = this.generateKeywords(
      request.topic,
      analysis,
      request.includeKeywords
    );
    const wordCount = this.countWords(content);

    return {
      content,
      title,
      metaTitle,
      metaDescription,
      keywords,
      wordCount,
    };
  }

  // ============================================
  // دوال مساعدة
  // ============================================

  private assembleSections(sections: ContentSection[]): string {
    // ترتيب الأقسام: مقدمة أولاً، خاتمة أخيراً
    const intro = sections.find((s) => s.type === 'intro');
    const conclusion = sections.find((s) => s.type === 'conclusion');
    const middle = sections.filter(
      (s) => s.type !== 'intro' && s.type !== 'conclusion'
    );

    const orderedSections: ContentSection[] = [];
    if (intro) orderedSections.push(intro);
    orderedSections.push(...middle.sort((a, b) => b.priority - a.priority));
    if (conclusion) orderedSections.push(conclusion);

    return orderedSections.map((s) => s.content).join('\n\n');
  }

  private applyPhraseVariation(content: string): string {
    // استبدال العبارات العامة
    let varied = this.phraseVariator.replaceAllGenericPhrases(content);
    return varied;
  }

  private adjustWordCount(
    content: string,
    minWords: number,
    maxWords: number,
    analysis: DeepTopicAnalysis
  ): string {
    let currentCount = this.countWords(content);

    // توسيع إذا كان قصيراً جداً
    while (currentCount < minWords) {
      const expansion = this.generateExpansion(analysis);
      content = this.insertExpansion(content, expansion);
      currentCount = this.countWords(content);

      // منع الحلقة اللانهائية
      if (expansion.length === 0) break;
    }

    // تقليص إذا كان طويلاً جداً
    if (currentCount > maxWords) {
      content = this.trimContent(content, maxWords);
    }

    return content;
  }

  private generateExpansion(analysis: DeepTopicAnalysis): string {
    const expansions: string[] = [];
    const category = analysis.category;

    // إضافة نصائح إضافية
    const tips = [
      'من المهم أيضاً الانتباه إلى التفاصيل الصغيرة التي قد تحدث فرقاً كبيراً.',
      'يُنصح بالتخطيط المسبق لضمان أفضل النتائج.',
      'لا تتردد في طلب المساعدة من المختصين عند الحاجة.',
      'التجربة والممارسة هما أفضل طريقة للتعلم والتحسن.',
      'شارك هذه المعلومات مع من يهمه الأمر لتعم الفائدة.',
    ];

    // إضافة معلومات حسب الفئة
    if (category === 'birthday') {
      expansions.push(
        '<p>تذكر أن أهم شيء في الاحتفال هو إظهار الحب والاهتمام للشخص المحتفى به. الهدايا المادية مهمة، لكن الوقت والاهتمام أثمن.</p>'
      );
    } else if (category === 'zodiac') {
      expansions.push(
        '<p>تذكر أن الأبراج تقدم توجيهات عامة وليست قواعد صارمة. كل شخص فريد بصفاته وتجاربه.</p>'
      );
    } else if (category === 'health') {
      expansions.push(
        '<p>استشر طبيباً أو أخصائياً قبل اتخاذ أي قرارات صحية مهمة. المعلومات المقدمة هنا للتثقيف العام فقط.</p>'
      );
    }

    // إضافة نصيحة عشوائية
    expansions.push(`<p>${tips[Math.floor(Math.random() * tips.length)]}</p>`);

    return expansions.join('\n');
  }

  private insertExpansion(content: string, expansion: string): string {
    // إدراج التوسيع قبل الخاتمة
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

  private trimContent(content: string, maxWords: number): string {
    const sections = content.split(/<h2>/);
    let result = sections[0]; // المقدمة
    let currentCount = this.countWords(result);

    for (let i = 1; i < sections.length; i++) {
      const section = '<h2>' + sections[i];
      const sectionWords = this.countWords(section);

      if (currentCount + sectionWords <= maxWords) {
        result += section;
        currentCount += sectionWords;
      } else if (section.includes('الخاتمة')) {
        // دائماً نحتفظ بالخاتمة
        result += section;
        break;
      }
    }

    return result;
  }

  private generateTitle(topic: string, analysis: DeepTopicAnalysis): string {
    const { names, ages, zodiacSigns } = analysis.entities;
    const name = names?.[0] || '';
    const age = ages?.[0] || 0;
    const sign = zodiacSigns?.[0] || '';

    if (analysis.category === 'birthday') {
      if (name && age)
        return `عيد ميلاد سعيد ${name} - ${age} عاماً من العطاء والتميز`;
      if (name) return `عيد ميلاد سعيد ${name} - أجمل التهاني والأمنيات`;
      return `عيد ميلاد سعيد - أفكار وتهاني مميزة`;
    }

    if (analysis.category === 'zodiac' && sign) {
      return `برج ${sign}: صفاته وتوافقه ونصائح مهمة`;
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
    content: string,
    analysis: DeepTopicAnalysis
  ): string {
    const { names, ages, zodiacSigns } = analysis.entities;
    const name = names?.[0] || '';
    const age = ages?.[0] || 0;
    const sign = zodiacSigns?.[0] || '';

    if (analysis.category === 'birthday') {
      if (name && age) {
        return `عيد ميلاد سعيد ${name}! اكتشف أجمل التهاني وأفكار الهدايا المناسبة لعمر ${age} سنة. نصائح للاحتفال وعبارات تهنئة مميزة.`;
      }
      return `أفكار رائعة للاحتفال بعيد الميلاد. تهاني مميزة، أفكار هدايا، ونصائح لحفلة لا تُنسى. اقرأ المزيد على موقع ميلادك.`;
    }

    if (analysis.category === 'zodiac' && sign) {
      return `اكتشف كل ما تريد معرفته عن برج ${sign}. صفاته، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليد هذا البرج.`;
    }

    // استخراج من المحتوى
    const cleanContent = content.replace(/<[^>]*>/g, ' ').trim();
    return cleanContent.substring(0, 155) + '...';
  }

  private generateKeywords(
    topic: string,
    analysis: DeepTopicAnalysis,
    includeKeywords?: string[]
  ): string[] {
    const keywords = new Set<string>([topic]);

    // الكلمات المفتاحية من التحليل
    analysis.primaryKeywords.forEach((kw) => keywords.add(kw));
    analysis.secondaryKeywords.forEach((kw) => keywords.add(kw));

    // الكلمات المطلوبة
    includeKeywords?.forEach((kw) => keywords.add(kw));

    // الكيانات
    const { names, zodiacSigns } = analysis.entities;
    names?.forEach((n) => keywords.add(n));
    zodiacSigns?.forEach((z) => keywords.add(z));

    // كلمات حسب الفئة
    if (analysis.category === 'birthday') {
      keywords.add('عيد ميلاد');
      keywords.add('تهنئة');
      keywords.add('احتفال');
    } else if (analysis.category === 'zodiac') {
      keywords.add('أبراج');
      keywords.add('برج');
      keywords.add('فلك');
    }

    // إضافة ميلادك
    keywords.add('ميلادك');

    return Array.from(keywords).slice(0, 15);
  }

  private countWords(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText.split(/\s+/).filter((w) => w.length > 0).length;
  }

  private loadKnowledge(category: TopicCategory): KnowledgeEntry | null {
    // تحويل الفئة لاسم الملف
    const categoryToFile: Record<string, string> = {
      birthday: 'birthday-ideas',
      zodiac: 'zodiac-detailed',
      health: 'age-calculator',
      dates: 'age-calculator',
      general: 'age-calculator',
    };

    const fileName = categoryToFile[category] || 'age-calculator';

    if (this.knowledgeCache.has(fileName)) {
      return this.knowledgeCache.get(fileName) || null;
    }

    const filePath = path.join(SONA_DATA_PATH, 'knowledge', `${fileName}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        this.knowledgeCache.set(fileName, data);
        return data;
      }
    } catch (error) {
      console.error(`Error loading knowledge for ${category}:`, error);
    }
    return null;
  }
}

// تصدير نسخة واحدة
export const enhancedGenerator = new EnhancedGenerator();

// دالة مساعدة للتوليد السريع
export async function generateEnhancedArticle(
  request: EnhancedGenerationRequest
): Promise<EnhancedGenerationResponse> {
  return enhancedGenerator.generate(request);
}
