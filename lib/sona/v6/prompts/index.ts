/**
 * SONA v6 - Prompts Manager
 * إدارة واختيار Prompts المتخصصة
 */

import { TopicCategory } from '../types';
import birthdayPrompts from './birthday';
import zodiacPrompts from './zodiac';
import pregnancyPrompts from './pregnancy';
import agePrompts from './age';

export interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
  category: TopicCategory;
}

/**
 * الحصول على Prompt المناسب للموضوع
 */
export function getPromptForTopic(
  topic: string,
  category?: TopicCategory,
  params?: Record<string, any>
): PromptResult {
  // تحديد الفئة تلقائياً إذا لم تُحدد
  const detectedCategory = category || detectCategory(topic);

  switch (detectedCategory) {
    case 'birthday':
      return {
        systemPrompt: birthdayPrompts.systemPrompt,
        userPrompt: birthdayPrompts.generatePrompt(
          params?.name || extractName(topic),
          params?.age || extractAge(topic),
          params?.relation
        ),
        category: 'birthday',
      };

    case 'zodiac':
      return {
        systemPrompt: zodiacPrompts.systemPrompt,
        userPrompt: zodiacPrompts.generatePrompt(
          params?.sign || extractZodiacSign(topic),
          params?.topic
        ),
        category: 'zodiac',
      };

    case 'pregnancy':
      return {
        systemPrompt: pregnancyPrompts.systemPrompt,
        userPrompt: pregnancyPrompts.generateWeekPrompt(
          params?.week || extractPregnancyWeek(topic)
        ),
        category: 'pregnancy',
      };

    case 'dates':
    case 'health':
      return {
        systemPrompt: agePrompts.systemPrompt,
        userPrompt: agePrompts.generateAgeArticlePrompt(
          params?.age || extractAge(topic)
        ),
        category: detectedCategory,
      };

    default:
      return getGeneralPrompt(topic);
  }
}

/**
 * Prompt عام للمواضيع غير المصنفة
 */
function getGeneralPrompt(topic: string): PromptResult {
  return {
    systemPrompt: `أنت كاتب محتوى عربي محترف. اكتب مقالات شاملة ومفيدة.

قواعد صارمة:
- محتوى فريد وغير مكرر
- معلومات دقيقة ومفيدة
- لغة عربية سليمة
- تنسيق HTML نظيف
- الحد الأدنى للمقال: 1500 كلمة

⚠️ تحذير مهم جداً:
- لا تكتب أي كلمات برمجية أو كودية في المحتوى المرئي
- لا تكتب كلمات مثل: JSON, HTML, CSS, JavaScript, code, script, function
- لا تكتب أي تاغات HTML كنص مرئي (مثل كتابة "<p>" كنص)
- المحتوى يجب أن يكون للقارئ العادي وليس للمبرمجين`,
    userPrompt: `اكتب مقالاً شاملاً ومفصلاً عن: ${topic}

⚠️ مهم جداً - الحد الأدنى: 1500 كلمة

المحتوى المطلوب:
1. مقدمة جذابة ومفصلة (4-5 فقرات)
2. 8-10 أقسام رئيسية بعناوين <h2>، كل قسم به 3-4 فقرات على الأقل
3. قوائم ونقاط مفصلة حيث مناسب
4. أمثلة وتفاصيل عملية
5. خاتمة شاملة (2-3 فقرات)

قواعد التنسيق:
- استخدم <h2> للعناوين
- استخدم <p> للفقرات
- استخدم <ul> و <li> للقوائم
- لا تستخدم \\n

⚠️ تحذير: لا تكتب أي كلمات برمجية أو تقنية في المحتوى!

أرجع JSON:
{
  "title": "عنوان جذاب",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["كلمة1", "كلمة2"]
}`,
    category: 'general',
  };
}

/**
 * تحديد فئة الموضوع تلقائياً
 */
export function detectCategory(topic: string): TopicCategory {
  const lowerTopic = topic.toLowerCase();

  // عيد ميلاد
  if (
    lowerTopic.includes('عيد ميلاد') ||
    lowerTopic.includes('تهنئة') ||
    lowerTopic.includes('birthday') ||
    lowerTopic.includes('هدية') ||
    lowerTopic.includes('احتفال')
  ) {
    return 'birthday';
  }

  // أبراج
  const zodiacKeywords = [
    'برج',
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
    'zodiac',
  ];
  if (zodiacKeywords.some((k) => lowerTopic.includes(k))) {
    return 'zodiac';
  }

  // حمل
  if (
    lowerTopic.includes('حمل') ||
    lowerTopic.includes('جنين') ||
    lowerTopic.includes('أسبوع') ||
    lowerTopic.includes('pregnancy') ||
    lowerTopic.includes('حامل')
  ) {
    return 'pregnancy';
  }

  // صحة
  if (
    lowerTopic.includes('صحة') ||
    lowerTopic.includes('طبي') ||
    lowerTopic.includes('علاج') ||
    lowerTopic.includes('health')
  ) {
    return 'health';
  }

  // تواريخ وعمر
  if (
    lowerTopic.includes('عمر') ||
    lowerTopic.includes('سنة') ||
    lowerTopic.includes('تاريخ') ||
    lowerTopic.includes('age')
  ) {
    return 'dates';
  }

  return 'general';
}

/**
 * استخراج العمر من النص
 */
function extractAge(topic: string): number {
  const match = topic.match(/(\d+)\s*(سنة|عام|year)/i);
  return match ? parseInt(match[1]) : 25;
}

/**
 * استخراج الاسم من النص
 */
function extractName(topic: string): string {
  // محاولة استخراج اسم بعد "عيد ميلاد"
  const match = topic.match(/عيد ميلاد\s+(\S+)/);
  return match ? match[1] : 'صديق';
}

/**
 * استخراج البرج من النص
 */
function extractZodiacSign(topic: string): string {
  const signs: Record<string, string> = {
    الحمل: 'aries',
    الثور: 'taurus',
    الجوزاء: 'gemini',
    السرطان: 'cancer',
    الأسد: 'leo',
    العذراء: 'virgo',
    الميزان: 'libra',
    العقرب: 'scorpio',
    القوس: 'sagittarius',
    الجدي: 'capricorn',
    الدلو: 'aquarius',
    الحوت: 'pisces',
  };

  for (const [ar, en] of Object.entries(signs)) {
    if (topic.includes(ar)) return en;
  }
  return 'aries';
}

/**
 * استخراج أسبوع الحمل من النص
 */
function extractPregnancyWeek(topic: string): number {
  const match = topic.match(/(?:الأسبوع|أسبوع)\s*(\d+)/);
  return match ? parseInt(match[1]) : 20;
}

export { birthdayPrompts, zodiacPrompts, pregnancyPrompts, agePrompts };

export default {
  getPromptForTopic,
  detectCategory,
  birthdayPrompts,
  zodiacPrompts,
  pregnancyPrompts,
  agePrompts,
};
