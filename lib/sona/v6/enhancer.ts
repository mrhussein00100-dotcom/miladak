/**
 * SONA v6 - Content Enhancer
 * محسن المحتوى باستخدام AI + Lexicon
 */

import {
  EnhanceOptions,
  EnhanceResult,
  EnhanceFocusArea,
  AIProviderName,
} from './types';
import providers from './providers';
import analyzer from './analyzer';

// إعدادات التحسين الافتراضية
const DEFAULT_ENHANCE_OPTIONS: EnhanceOptions = {
  targetQuality: 80,
  maxIterations: 3,
  focusAreas: ['repetition', 'vocabulary', 'specificity'],
  useAI: true,
  useLexicon: true,
};

/**
 * تحسين المحتوى
 */
export async function enhance(
  content: string,
  topic: string,
  options: Partial<EnhanceOptions> = {}
): Promise<EnhanceResult> {
  const opts = { ...DEFAULT_ENHANCE_OPTIONS, ...options };

  let currentContent = content;
  let iterations = 0;
  const improvements: string[] = [];

  // تحليل الجودة الأولية
  const initialReport = analyzer.analyze(currentContent, topic);
  let currentScore = initialReport.score;

  console.log(`🔧 SONA v6 Enhancer: الجودة الأولية ${currentScore}%`);

  // حلقة التحسين
  while (currentScore < opts.targetQuality && iterations < opts.maxIterations) {
    iterations++;
    console.log(`🔄 SONA v6 Enhancer: المحاولة ${iterations}...`);

    // تحديد مجالات التحسين
    const focusAreas = determineFocusAreas(initialReport, opts.focusAreas);

    if (opts.useAI) {
      // تحسين باستخدام AI
      const aiResult = await enhanceWithAI(currentContent, topic, focusAreas);
      if (aiResult.improved) {
        currentContent = aiResult.content;
        improvements.push(...aiResult.improvements);
      }
    }

    // تحسينات محلية
    currentContent = applyLocalEnhancements(currentContent, focusAreas);

    // إعادة التحليل
    const newReport = analyzer.analyze(currentContent, topic);

    if (newReport.score > currentScore) {
      improvements.push(
        `تحسين الجودة من ${currentScore}% إلى ${newReport.score}%`
      );
      currentScore = newReport.score;
    } else {
      // لا تحسن، توقف
      break;
    }
  }

  console.log(
    `✅ SONA v6 Enhancer: الجودة النهائية ${currentScore}% بعد ${iterations} محاولات`
  );

  return {
    original: content,
    enhanced: currentContent,
    iterations,
    improvements,
    qualityBefore: initialReport.score,
    qualityAfter: currentScore,
  };
}

/**
 * تحسين باستخدام AI
 */
async function enhanceWithAI(
  content: string,
  topic: string,
  focusAreas: EnhanceFocusArea[]
): Promise<{ improved: boolean; content: string; improvements: string[] }> {
  const instructions = generateEnhanceInstructions(focusAreas);

  try {
    const response = await providers.enhance(content, instructions);

    // التحقق من أن التحسين فعلي
    if (
      response.content &&
      response.content !== content &&
      response.content.length > content.length * 0.8
    ) {
      return {
        improved: true,
        content: response.content,
        improvements: [`تحسين AI: ${focusAreas.join(', ')}`],
      };
    }
  } catch (error: any) {
    console.warn('⚠️ SONA v6 Enhancer: فشل تحسين AI:', error.message);
  }

  return { improved: false, content, improvements: [] };
}

/**
 * توليد تعليمات التحسين
 */
function generateEnhanceInstructions(focusAreas: EnhanceFocusArea[]): string {
  const instructions: string[] = ['حسّن هذا النص العربي مع التركيز على:'];

  for (const area of focusAreas) {
    switch (area) {
      case 'repetition':
        instructions.push('- إزالة التكرار واستخدام صياغات مختلفة');
        break;
      case 'vocabulary':
        instructions.push('- تنويع المفردات واستخدام مرادفات غنية');
        break;
      case 'specificity':
        instructions.push('- استبدال الجمل العامة بمعلومات محددة ومفيدة');
        break;
      case 'grammar':
        instructions.push('- تصحيح الأخطاء اللغوية والنحوية');
        break;
      case 'coherence':
        instructions.push('- تحسين الترابط بين الفقرات');
        break;
    }
  }

  instructions.push('');
  instructions.push('قواعد مهمة:');
  instructions.push('- حافظ على المعنى الأصلي');
  instructions.push('- حافظ على تنسيق HTML');
  instructions.push('- لا تقصر المحتوى');

  return instructions.join('\n');
}

/**
 * تحديد مجالات التحسين
 */
function determineFocusAreas(
  report: ReturnType<typeof analyzer.analyze>,
  allowedAreas: EnhanceFocusArea[]
): EnhanceFocusArea[] {
  const areas: EnhanceFocusArea[] = [];

  if (allowedAreas.includes('repetition') && report.repetitionScore < 70) {
    areas.push('repetition');
  }
  if (allowedAreas.includes('vocabulary') && report.diversityScore < 60) {
    areas.push('vocabulary');
  }
  if (allowedAreas.includes('specificity') && report.genericScore < 70) {
    areas.push('specificity');
  }
  if (allowedAreas.includes('grammar') && report.grammarScore < 80) {
    areas.push('grammar');
  }
  if (allowedAreas.includes('coherence') && report.coherenceScore < 60) {
    areas.push('coherence');
  }

  return areas.length > 0 ? areas : ['vocabulary'];
}

/**
 * تحسينات محلية (بدون AI)
 */
function applyLocalEnhancements(
  content: string,
  focusAreas: EnhanceFocusArea[]
): string {
  let enhanced = content;

  // تنظيف المسافات
  enhanced = enhanced.replace(/\s{2,}/g, ' ');
  enhanced = enhanced.replace(/>\s+</g, '><');

  // تحسين علامات الترقيم
  enhanced = enhanced.replace(/،{2,}/g, '،');
  enhanced = enhanced.replace(/\.{2,}/g, '.');

  // إضافة مسافة بعد علامات الترقيم
  enhanced = enhanced.replace(/([،؛:])(\S)/g, '$1 $2');

  return enhanced;
}

/**
 * إعادة صياغة جملة واحدة
 */
export async function rephraseSentence(
  sentence: string,
  preferredProvider?: AIProviderName
): Promise<string> {
  const instructions = `أعد صياغة هذه الجملة بطريقة مختلفة تماماً مع الحفاظ على المعنى:
"${sentence}"

أرجع الجملة المعاد صياغتها فقط.`;

  try {
    const response = await providers.enhance(sentence, instructions);
    if (response.content && response.content !== sentence) {
      return response.content.trim();
    }
  } catch {
    // fallback
  }

  return sentence;
}

/**
 * إضافة تفاصيل للمحتوى
 */
export async function addDetails(
  content: string,
  topic: string
): Promise<string> {
  const instructions = `أضف تفاصيل ومعلومات إضافية مفيدة لهذا المحتوى عن "${topic}".

المحتوى:
${content}

أضف:
- معلومات محددة وحقائق
- أمثلة توضيحية
- نصائح عملية

أرجع المحتوى المحسن بالكامل.`;

  try {
    const response = await providers.enhance(content, instructions);
    if (response.content && response.content.length > content.length) {
      return response.content;
    }
  } catch {
    // fallback
  }

  return content;
}

/**
 * تحسين الترابط
 */
export async function improveCoherence(content: string): Promise<string> {
  const instructions = `حسّن الترابط بين فقرات هذا النص:

${content}

أضف:
- روابط منطقية بين الفقرات
- انتقالات سلسة
- تسلسل منطقي للأفكار

أرجع النص المحسن.`;

  try {
    const response = await providers.enhance(content, instructions);
    if (response.content) {
      return response.content;
    }
  } catch {
    // fallback
  }

  return content;
}

export default {
  enhance,
  rephraseSentence,
  addDetails,
  improveCoherence,
};
