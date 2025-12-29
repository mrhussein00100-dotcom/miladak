/**
 * SONA v6 - Quality Analyzer
 * محلل جودة المحتوى
 */

import {
  QualityReport,
  QualityDetails,
  WeakPart,
  RepetitionReport,
  DiversityReport,
  GenericReport,
} from './types';

// قائمة الجمل العامة المكررة
const GENERIC_PHRASES = [
  'من المهم أن',
  'يجب أن نعرف',
  'في هذا المقال',
  'سوف نتحدث عن',
  'كما نعلم جميعاً',
  'من الضروري',
  'لا شك أن',
  'بالتأكيد',
  'في الواقع',
  'على أي حال',
  'بشكل عام',
  'في النهاية',
  'وفي الختام',
  'مما لا شك فيه',
  'من الجدير بالذكر',
];

// الحد الأدنى للجودة
const QUALITY_THRESHOLD = 70;

/**
 * تحليل جودة المحتوى
 */
export function analyze(content: string, topic: string): QualityReport {
  const cleanContent = stripHtml(content);

  const repetitionReport = checkRepetition(cleanContent);
  const diversityReport = checkDiversity(cleanContent);
  const genericReport = checkGenericContent(cleanContent);
  const grammarScore = estimateGrammarScore(cleanContent);
  const coherenceScore = estimateCoherence(cleanContent, topic);

  // حساب الدرجة الإجمالية
  const overallScore = calculateOverallScore({
    repetition: repetitionReport.score,
    diversity: diversityReport.score,
    generic: genericReport.score,
    grammar: grammarScore,
    coherence: coherenceScore,
  });

  // تحديد الأجزاء الضعيفة
  const weakParts = findWeakParts(cleanContent, {
    repetitionReport,
    genericReport,
  });

  // توليد الاقتراحات
  const suggestions = generateSuggestions({
    repetitionReport,
    diversityReport,
    genericReport,
    grammarScore,
    coherenceScore,
  });

  return {
    score: overallScore,
    passed: overallScore >= QUALITY_THRESHOLD,
    repetitionScore: repetitionReport.score,
    diversityScore: diversityReport.score,
    genericScore: genericReport.score,
    grammarScore,
    coherenceScore,
    weakParts,
    suggestions,
    details: {
      totalWords: cleanContent.split(/\s+/).filter(Boolean).length,
      uniqueWords: new Set(cleanContent.split(/\s+/).filter(Boolean)).size,
      sentenceCount: cleanContent.split(/[.!?؟]+/).filter(Boolean).length,
      avgSentenceLength: calculateAvgSentenceLength(cleanContent),
      repeatedPhrases: repetitionReport.repeatedPhrases.map((p) => p.phrase),
      genericSentences: genericReport.genericSentences.map((s) => s.sentence),
      grammarErrors: [],
    },
  };
}

/**
 * فحص التكرار
 */
export function checkRepetition(content: string): RepetitionReport {
  const words = content.split(/\s+/).filter(Boolean);
  const phrases: Map<string, number[]> = new Map();

  // البحث عن عبارات مكررة (3-5 كلمات)
  for (let len = 3; len <= 5; len++) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(' ');
      if (!phrases.has(phrase)) {
        phrases.set(phrase, []);
      }
      phrases.get(phrase)!.push(i);
    }
  }

  const repeatedPhrases = Array.from(phrases.entries())
    .filter(([_, positions]) => positions.length > 1)
    .map(([phrase, positions]) => ({
      phrase,
      count: positions.length,
      positions,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // حساب درجة التكرار (100 = لا تكرار)
  const repetitionRatio =
    repeatedPhrases.reduce((sum, p) => sum + p.count - 1, 0) /
    Math.max(words.length / 10, 1);
  const score = Math.max(0, 100 - repetitionRatio * 20);

  return { score, repeatedPhrases };
}

/**
 * فحص تنوع المفردات
 */
export function checkDiversity(content: string): DiversityReport {
  const words = content.split(/\s+/).filter((w) => w.length > 2);
  const uniqueWords = new Set(words);

  const ratio = uniqueWords.size / Math.max(words.length, 1);
  const score = Math.min(100, ratio * 150); // تطبيع للحصول على درجة من 100

  const suggestions: string[] = [];
  if (ratio < 0.5) {
    suggestions.push('استخدم مرادفات أكثر تنوعاً');
  }
  if (ratio < 0.4) {
    suggestions.push('تجنب تكرار نفس الكلمات');
  }

  return {
    score,
    uniqueWords: uniqueWords.size,
    totalWords: words.length,
    ratio,
    suggestions,
  };
}

/**
 * فحص الجمل العامة
 */
export function checkGenericContent(content: string): GenericReport {
  const sentences = content.split(/[.!?؟]+/).filter(Boolean);
  const genericSentences: Array<{
    sentence: string;
    position: number;
    suggestion: string;
  }> = [];

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    for (const phrase of GENERIC_PHRASES) {
      if (trimmed.includes(phrase)) {
        genericSentences.push({
          sentence: trimmed.substring(0, 100),
          position: index,
          suggestion: `استبدل "${phrase}" بمعلومة محددة`,
        });
        break;
      }
    }
  });

  const genericRatio = genericSentences.length / Math.max(sentences.length, 1);
  const score = Math.max(0, 100 - genericRatio * 200);

  return { score, genericSentences };
}

/**
 * تقدير درجة القواعد (بسيط)
 */
function estimateGrammarScore(content: string): number {
  let score = 100;

  // فحوصات بسيطة
  const issues = [
    { pattern: /\s{2,}/g, penalty: 2 }, // مسافات متعددة
    { pattern: /[،,]{2,}/g, penalty: 3 }, // فواصل متكررة
    { pattern: /[.!?؟]{2,}/g, penalty: 3 }, // علامات ترقيم متكررة
    { pattern: /^\s+|\s+$/gm, penalty: 1 }, // مسافات في البداية/النهاية
  ];

  for (const issue of issues) {
    const matches = content.match(issue.pattern);
    if (matches) {
      score -= matches.length * issue.penalty;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * تقدير الترابط
 */
function estimateCoherence(content: string, topic: string): number {
  const topicWords = topic.split(/\s+/).filter((w) => w.length > 2);
  const contentLower = content.toLowerCase();

  // التحقق من ذكر الموضوع
  let topicMentions = 0;
  for (const word of topicWords) {
    const regex = new RegExp(word, 'gi');
    const matches = contentLower.match(regex);
    topicMentions += matches?.length || 0;
  }

  // التحقق من وجود روابط
  const connectors = [
    'و',
    'أو',
    'لكن',
    'لذلك',
    'بالإضافة',
    'كما',
    'أيضاً',
    'علاوة',
  ];
  let connectorCount = 0;
  for (const connector of connectors) {
    const regex = new RegExp(`\\b${connector}\\b`, 'g');
    const matches = content.match(regex);
    connectorCount += matches?.length || 0;
  }

  const sentences = content.split(/[.!?؟]+/).filter(Boolean).length;
  const topicScore = Math.min(
    50,
    (topicMentions / Math.max(sentences, 1)) * 25
  );
  const connectorScore = Math.min(
    50,
    (connectorCount / Math.max(sentences, 1)) * 30
  );

  return topicScore + connectorScore;
}

/**
 * حساب الدرجة الإجمالية
 */
function calculateOverallScore(scores: {
  repetition: number;
  diversity: number;
  generic: number;
  grammar: number;
  coherence: number;
}): number {
  const weights = {
    repetition: 0.2,
    diversity: 0.25,
    generic: 0.2,
    grammar: 0.15,
    coherence: 0.2,
  };

  return Math.round(
    scores.repetition * weights.repetition +
      scores.diversity * weights.diversity +
      scores.generic * weights.generic +
      scores.grammar * weights.grammar +
      scores.coherence * weights.coherence
  );
}

/**
 * تحديد الأجزاء الضعيفة
 */
function findWeakParts(
  content: string,
  reports: { repetitionReport: RepetitionReport; genericReport: GenericReport }
): WeakPart[] {
  const weakParts: WeakPart[] = [];

  // إضافة الجمل العامة
  for (const generic of reports.genericReport.genericSentences) {
    weakParts.push({
      startIndex: 0,
      endIndex: generic.sentence.length,
      text: generic.sentence,
      reason: 'جملة عامة',
      severity: 'medium',
      suggestion: generic.suggestion,
    });
  }

  // إضافة العبارات المكررة
  for (const repeated of reports.repetitionReport.repeatedPhrases.slice(0, 5)) {
    weakParts.push({
      startIndex: 0,
      endIndex: repeated.phrase.length,
      text: repeated.phrase,
      reason: `مكررة ${repeated.count} مرات`,
      severity: repeated.count > 3 ? 'high' : 'low',
      suggestion: 'استخدم صياغة مختلفة',
    });
  }

  return weakParts;
}

/**
 * توليد الاقتراحات
 */
function generateSuggestions(scores: {
  repetitionReport: RepetitionReport;
  diversityReport: DiversityReport;
  genericReport: GenericReport;
  grammarScore: number;
  coherenceScore: number;
}): string[] {
  const suggestions: string[] = [];

  if (scores.repetitionReport.score < 70) {
    suggestions.push('قلل من تكرار العبارات - استخدم صياغات مختلفة');
  }

  if (scores.diversityReport.score < 60) {
    suggestions.push('نوّع في المفردات - استخدم مرادفات أكثر');
  }

  if (scores.genericReport.score < 70) {
    suggestions.push('استبدل الجمل العامة بمعلومات محددة ومفيدة');
  }

  if (scores.grammarScore < 80) {
    suggestions.push('راجع علامات الترقيم والمسافات');
  }

  if (scores.coherenceScore < 60) {
    suggestions.push('حسّن الترابط بين الفقرات باستخدام روابط مناسبة');
  }

  return suggestions;
}

/**
 * حساب متوسط طول الجملة
 */
function calculateAvgSentenceLength(content: string): number {
  const sentences = content.split(/[.!?؟]+/).filter(Boolean);
  if (sentences.length === 0) return 0;

  const totalWords = sentences.reduce(
    (sum, s) => sum + s.split(/\s+/).filter(Boolean).length,
    0
  );
  return Math.round(totalWords / sentences.length);
}

/**
 * إزالة HTML
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default {
  analyze,
  checkRepetition,
  checkDiversity,
  checkGenericContent,
  QUALITY_THRESHOLD,
};
