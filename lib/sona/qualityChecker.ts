/**
 * SONA v4 Quality Checker
 * مدقق الجودة - يفحص جودة المحتوى المولد
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { TopicAnalysis, QualityReport } from './types';

/**
 * Quality thresholds
 */
const QUALITY_THRESHOLDS = {
  minOverallScore: 70,
  optimalKeywordDensity: { min: 2, max: 4 },
  optimalSentenceLength: { min: 15, max: 20 },
  minDiversityRatio: 0.4,
};

/**
 * Structure check result
 */
export interface StructureReport {
  hasIntro: boolean;
  hasConclusion: boolean;
  hasHeadings: boolean;
  hasLists: boolean;
  hasFAQ: boolean;
  paragraphCount: number;
  headingCount: number;
  score: number;
}

/**
 * Detailed quality analysis
 */
export interface DetailedQualityReport extends QualityReport {
  structureReport: StructureReport;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  uniqueWordsRatio: number;
  keywordOccurrences: Record<string, number>;
}

/**
 * Quality Checker Class
 * يفحص جودة المحتوى المولد ويقدم تقارير مفصلة
 */
export class QualityChecker {
  /**
   * فحص جودة المحتوى
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   */
  checkQuality(content: string, analysis: TopicAnalysis): QualityReport {
    const diversityScore = this.calculateDiversityScore(content);
    const keywordDensity = this.calculateKeywordDensity(
      content,
      analysis.keywords
    );
    const readabilityScore = this.calculateReadabilityScore(content);
    const structureScore = this.checkStructure(content).score;

    const overallScore = this.calculateOverallScore(
      diversityScore,
      keywordDensity,
      readabilityScore,
      structureScore
    );

    const suggestions = this.generateSuggestions(
      diversityScore,
      keywordDensity,
      readabilityScore,
      structureScore
    );

    return {
      overallScore,
      diversityScore,
      keywordDensity,
      readabilityScore,
      structureScore,
      suggestions,
      passed: overallScore >= QUALITY_THRESHOLDS.minOverallScore,
    };
  }

  /**
   * فحص جودة مفصل
   */
  checkQualityDetailed(
    content: string,
    analysis: TopicAnalysis
  ): DetailedQualityReport {
    const basicReport = this.checkQuality(content, analysis);
    const structureReport = this.checkStructure(content);

    const words = this.getWords(content);
    const sentences = this.getSentences(content);
    const uniqueWords = new Set(words);

    return {
      ...basicReport,
      structureReport,
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength:
        sentences.length > 0 ? words.length / sentences.length : 0,
      uniqueWordsRatio: words.length > 0 ? uniqueWords.size / words.length : 0,
      keywordOccurrences: this.countKeywordOccurrences(
        content,
        analysis.keywords
      ),
    };
  }

  /**
   * حساب درجة التنوع
   * Requirements: 8.1
   */
  calculateDiversityScore(content: string): number {
    const words = this.getWords(content);

    if (words.length === 0) return 0;

    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const ratio = uniqueWords.size / words.length;

    // Scale ratio to 0-100
    // A ratio of 0.4+ is considered good diversity
    if (ratio >= 0.6) return 100;
    if (ratio >= 0.5) return 90;
    if (ratio >= 0.4) return 80;
    if (ratio >= 0.3) return 60;
    if (ratio >= 0.2) return 40;
    return ratio * 200; // Below 0.2
  }

  /**
   * حساب كثافة الكلمات المفتاحية
   * Requirements: 8.2
   */
  calculateKeywordDensity(content: string, keywords: string[]): number {
    const words = this.getWords(content);
    const totalWords = words.length;

    if (totalWords === 0 || keywords.length === 0) return 0;

    const lowerContent = content.toLowerCase();
    let keywordCount = 0;

    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = lowerContent.match(regex);
      keywordCount += matches ? matches.length : 0;
    });

    const density = (keywordCount / totalWords) * 100;

    // Convert density to score (optimal is 2-4%)
    const { min, max } = QUALITY_THRESHOLDS.optimalKeywordDensity;

    if (density >= min && density <= max) return 100;
    if (density >= 1 && density <= 5) return 80;
    if (density > 5) return Math.max(0, 100 - (density - 5) * 15);
    if (density < 1) return density * 60;

    return 50;
  }

  /**
   * حساب درجة قابلية القراءة
   * Requirements: 8.3
   */
  calculateReadabilityScore(content: string): number {
    const sentences = this.getSentences(content);
    const words = this.getWords(content);

    if (sentences.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const { min, max } = QUALITY_THRESHOLDS.optimalSentenceLength;

    // Calculate sentence length variance
    const sentenceLengths = sentences.map((s) => this.getWords(s).length);
    const variance = this.calculateVariance(sentenceLengths);

    // Base score from average sentence length
    let score = 0;
    if (avgWordsPerSentence >= min && avgWordsPerSentence <= max) {
      score = 80;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      score = 60;
    } else if (avgWordsPerSentence < 10) {
      score = 40;
    } else {
      score = Math.max(0, 80 - (avgWordsPerSentence - 25) * 3);
    }

    // Bonus for sentence length variety (variance > 25 is good)
    if (variance > 25) score += 20;
    else if (variance > 15) score += 10;

    return Math.min(score, 100);
  }

  /**
   * فحص هيكل المحتوى
   */
  checkStructure(content: string): StructureReport {
    const hasIntro =
      content.includes('مقدمة') ||
      (content.includes('<h2>') && content.indexOf('<h2>') < 200);
    const hasConclusion =
      content.includes('الخاتمة') ||
      content.includes('في الختام') ||
      content.includes('ختاماً');
    const hasHeadings = content.includes('<h2>') || content.includes('<h3>');
    const hasLists =
      content.includes('<ul>') ||
      content.includes('<ol>') ||
      content.includes('<li>');
    const hasFAQ =
      content.includes('الأسئلة الشائعة') || content.includes('FAQ');

    const paragraphCount = (content.match(/<\/p>/g) || []).length;
    const headingCount = (content.match(/<h[2-6]>/g) || []).length;

    let score = 0;
    if (hasIntro) score += 15;
    if (hasConclusion) score += 15;
    if (hasHeadings) score += 20;
    if (hasLists) score += 15;
    if (hasFAQ) score += 10;
    if (paragraphCount >= 5) score += 15;
    else if (paragraphCount >= 3) score += 10;
    if (headingCount >= 3) score += 10;
    else if (headingCount >= 2) score += 5;

    return {
      hasIntro,
      hasConclusion,
      hasHeadings,
      hasLists,
      hasFAQ,
      paragraphCount,
      headingCount,
      score: Math.min(score, 100),
    };
  }

  /**
   * حساب الدرجة الإجمالية
   */
  private calculateOverallScore(
    diversityScore: number,
    keywordDensity: number,
    readabilityScore: number,
    structureScore: number
  ): number {
    // Weighted average
    const weights = {
      diversity: 0.25,
      keyword: 0.25,
      readability: 0.25,
      structure: 0.25,
    };

    return (
      diversityScore * weights.diversity +
      keywordDensity * weights.keyword +
      readabilityScore * weights.readability +
      structureScore * weights.structure
    );
  }

  /**
   * توليد اقتراحات التحسين
   */
  private generateSuggestions(
    diversityScore: number,
    keywordDensity: number,
    readabilityScore: number,
    structureScore: number
  ): string[] {
    const suggestions: string[] = [];

    if (diversityScore < 70) {
      suggestions.push('زيادة تنوع المفردات المستخدمة - استخدم مرادفات أكثر');
    }

    if (keywordDensity < 50) {
      suggestions.push('زيادة استخدام الكلمات المفتاحية في المحتوى');
    } else if (keywordDensity > 80) {
      suggestions.push('تقليل تكرار الكلمات المفتاحية لتجنب الحشو');
    }

    if (readabilityScore < 70) {
      suggestions.push('تحسين قابلية القراءة - تنويع طول الجمل');
    }

    if (structureScore < 70) {
      suggestions.push('تحسين هيكل المقال - إضافة عناوين فرعية وقوائم');
    }

    if (suggestions.length === 0) {
      suggestions.push('المحتوى جيد! يمكن نشره');
    }

    return suggestions;
  }

  /**
   * التحقق من اجتياز معايير الجودة
   * Requirements: 8.4
   */
  passesQualityThreshold(report: QualityReport): boolean {
    return report.overallScore >= QUALITY_THRESHOLDS.minOverallScore;
  }

  /**
   * الحصول على الكلمات من النص
   */
  private getWords(content: string): string[] {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, ' ');
    // Split by whitespace and filter empty
    return text.split(/\s+/).filter((w) => w.length > 0);
  }

  /**
   * الحصول على الجمل من النص
   */
  private getSentences(content: string): string[] {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, ' ');
    // Split by sentence endings
    return text.split(/[.،؟!]+/).filter((s) => s.trim().length > 0);
  }

  /**
   * حساب التباين
   */
  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  }

  /**
   * عد تكرارات الكلمات المفتاحية
   */
  private countKeywordOccurrences(
    content: string,
    keywords: string[]
  ): Record<string, number> {
    const occurrences: Record<string, number> = {};
    const lowerContent = content.toLowerCase();

    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = lowerContent.match(regex);
      occurrences[keyword] = matches ? matches.length : 0;
    });

    return occurrences;
  }

  /**
   * التحقق من كثافة الكلمات المفتاحية المثالية
   * Requirements: 6.1 - الكلمة المفتاحية 3-5 مرات
   */
  checkKeywordOccurrences(
    content: string,
    mainKeyword: string
  ): {
    count: number;
    isOptimal: boolean;
    suggestion: string;
  } {
    const lowerContent = content.toLowerCase();
    const regex = new RegExp(mainKeyword.toLowerCase(), 'g');
    const matches = lowerContent.match(regex);
    const count = matches ? matches.length : 0;

    const isOptimal = count >= 3 && count <= 5;
    let suggestion = '';

    if (count < 3) {
      suggestion = `زيادة استخدام "${mainKeyword}" (الحالي: ${count}، المطلوب: 3-5)`;
    } else if (count > 5) {
      suggestion = `تقليل استخدام "${mainKeyword}" (الحالي: ${count}، المطلوب: 3-5)`;
    } else {
      suggestion = `كثافة "${mainKeyword}" مثالية (${count} مرات)`;
    }

    return { count, isOptimal, suggestion };
  }

  /**
   * التحقق من طول وصف الميتا
   * Requirements: 6.4 - 150-160 حرف
   */
  checkMetaDescriptionLength(description: string): {
    length: number;
    isOptimal: boolean;
    suggestion: string;
  } {
    const length = description.length;
    const isOptimal = length >= 150 && length <= 160;
    let suggestion = '';

    if (length < 150) {
      suggestion = `وصف الميتا قصير جداً (${length} حرف). أضف ${
        150 - length
      } حرف.`;
    } else if (length > 160) {
      suggestion = `وصف الميتا طويل جداً (${length} حرف). احذف ${
        length - 160
      } حرف.`;
    } else {
      suggestion = `طول وصف الميتا مثالي (${length} حرف)`;
    }

    return { length, isOptimal, suggestion };
  }

  /**
   * مقارنة جودة محتويين
   */
  compareQuality(
    report1: QualityReport,
    report2: QualityReport
  ): {
    winner: 1 | 2 | 'tie';
    scoreDifference: number;
    comparison: Record<string, string>;
  } {
    const scoreDiff = report1.overallScore - report2.overallScore;

    let winner: 1 | 2 | 'tie' = 'tie';
    if (scoreDiff > 5) winner = 1;
    else if (scoreDiff < -5) winner = 2;

    const comparison: Record<string, string> = {
      diversity:
        report1.diversityScore > report2.diversityScore
          ? 'المحتوى 1 أفضل'
          : report1.diversityScore < report2.diversityScore
          ? 'المحتوى 2 أفضل'
          : 'متساويان',
      keywords:
        report1.keywordDensity > report2.keywordDensity
          ? 'المحتوى 1 أفضل'
          : report1.keywordDensity < report2.keywordDensity
          ? 'المحتوى 2 أفضل'
          : 'متساويان',
      readability:
        report1.readabilityScore > report2.readabilityScore
          ? 'المحتوى 1 أفضل'
          : report1.readabilityScore < report2.readabilityScore
          ? 'المحتوى 2 أفضل'
          : 'متساويان',
      structure:
        report1.structureScore > report2.structureScore
          ? 'المحتوى 1 أفضل'
          : report1.structureScore < report2.structureScore
          ? 'المحتوى 2 أفضل'
          : 'متساويان',
    };

    return {
      winner,
      scoreDifference: Math.abs(scoreDiff),
      comparison,
    };
  }
}

// Export singleton instance
export const qualityChecker = new QualityChecker();
