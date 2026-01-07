/**
 * SONA v6 - Zodiac Prompts
 * Prompts متخصصة للأبراج
 */

export const ZODIAC_SYSTEM_PROMPT = `أنت خبير في الأبراج والفلك العربي. اكتب محتوى عربي احترافي عن الأبراج.

قواعد صارمة:
- قدم معلومات دقيقة ومتخصصة عن كل برج
- اذكر صفات البرج، توافقاته، حجره الكريم، لونه المحظوظ
- تجنب الجمل العامة والتكرار تماماً
- استخدم لغة عربية فصحى سليمة وجذابة
- كل فقرة يجب أن تحتوي معلومة جديدة ومفيدة
- لا تكرر نفس المعلومة بصياغات مختلفة
- الحد الأدنى للمقال: 1500 كلمة

⚠️ قواعد التنسيق RTL (إلزامية):
- استخدم: <p class="text-right leading-relaxed mb-4" dir="rtl">
- استخدم: <h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">
- استخدم: <h3 class="text-xl font-semibold mt-6 mb-3 text-right" dir="rtl">
- استخدم: <ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
- استخدم: <li class="text-right leading-relaxed">

⚠️ تحذير مهم جداً:
- لا تكتب أي كلمات برمجية أو كودية في المحتوى المرئي
- لا تكتب كلمات مثل: JSON, HTML, CSS, JavaScript, code, script
- المحتوى للقارئ العادي وليس للمبرمجين`;

export const ZODIAC_SIGNS = {
  aries: {
    ar: 'الحمل',
    element: 'نار',
    planet: 'المريخ',
    dates: '21 مارس - 19 أبريل',
  },
  taurus: {
    ar: 'الثور',
    element: 'تراب',
    planet: 'الزهرة',
    dates: '20 أبريل - 20 مايو',
  },
  gemini: {
    ar: 'الجوزاء',
    element: 'هواء',
    planet: 'عطارد',
    dates: '21 مايو - 20 يونيو',
  },
  cancer: {
    ar: 'السرطان',
    element: 'ماء',
    planet: 'القمر',
    dates: '21 يونيو - 22 يوليو',
  },
  leo: {
    ar: 'الأسد',
    element: 'نار',
    planet: 'الشمس',
    dates: '23 يوليو - 22 أغسطس',
  },
  virgo: {
    ar: 'العذراء',
    element: 'تراب',
    planet: 'عطارد',
    dates: '23 أغسطس - 22 سبتمبر',
  },
  libra: {
    ar: 'الميزان',
    element: 'هواء',
    planet: 'الزهرة',
    dates: '23 سبتمبر - 22 أكتوبر',
  },
  scorpio: {
    ar: 'العقرب',
    element: 'ماء',
    planet: 'بلوتو',
    dates: '23 أكتوبر - 21 نوفمبر',
  },
  sagittarius: {
    ar: 'القوس',
    element: 'نار',
    planet: 'المشتري',
    dates: '22 نوفمبر - 21 ديسمبر',
  },
  capricorn: {
    ar: 'الجدي',
    element: 'تراب',
    planet: 'زحل',
    dates: '22 ديسمبر - 19 يناير',
  },
  aquarius: {
    ar: 'الدلو',
    element: 'هواء',
    planet: 'أورانوس',
    dates: '20 يناير - 18 فبراير',
  },
  pisces: {
    ar: 'الحوت',
    element: 'ماء',
    planet: 'نبتون',
    dates: '19 فبراير - 20 مارس',
  },
};

export function generateZodiacPrompt(sign: string, topic?: string): string {
  const signInfo = ZODIAC_SIGNS[sign as keyof typeof ZODIAC_SIGNS];
  const signName = signInfo?.ar || sign;

  return `اكتب مقالاً شاملاً ومتخصصاً عن برج ${signName}${
    topic ? ` - ${topic}` : ''
  }.

⚠️ مهم جداً - الحد الأدنى: 1500 كلمة

معلومات البرج:
- العنصر: ${signInfo?.element || 'غير محدد'}
- الكوكب الحاكم: ${signInfo?.planet || 'غير محدد'}
- الفترة: ${signInfo?.dates || 'غير محدد'}

المحتوى المطلوب (مفصل جداً):
1. مقدمة جذابة ومفصلة عن برج ${signName} (4-5 فقرات)
2. الصفات الشخصية لمواليد البرج (قسم كامل مع 10+ صفات)
3. نقاط القوة (10 نقاط على الأقل مع شرح)
4. نقاط الضعف (10 نقاط على الأقل مع شرح)
5. التوافق العاطفي مع كل برج من الأبراج الـ12
6. التوافق في العمل والصداقة
7. الحجر الكريم واللون المحظوظ والأرقام (مع شرح مفصل)
8. مشاهير من هذا البرج (10 أشخاص على الأقل)
9. نصائح للتعامل مع مواليد هذا البرج (10 نصائح)
10. خاتمة شاملة (2-3 فقرات)

⚠️ قواعد التنسيق RTL (إلزامية):
- استخدم: <p class="text-right leading-relaxed mb-4" dir="rtl">
- استخدم: <h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">
- استخدم: <ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
- استخدم: <li class="text-right leading-relaxed">
- استخدم: <strong>
- لا تستخدم \\n - استخدم HTML فقط

⚠️ تحذير: لا تكتب أي كلمات برمجية أو تقنية في المحتوى!

أرجع JSON:
{
  "title": "عنوان جذاب",
  "content": "<p class=\\"text-right leading-relaxed mb-4\\" dir=\\"rtl\\">المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["كلمة1", "كلمة2"]
}`;
}

export function generateZodiacCompatibilityPrompt(
  sign1: string,
  sign2: string
): string {
  const sign1Info = ZODIAC_SIGNS[sign1 as keyof typeof ZODIAC_SIGNS];
  const sign2Info = ZODIAC_SIGNS[sign2 as keyof typeof ZODIAC_SIGNS];

  return `اكتب مقالاً عن توافق برج ${sign1Info?.ar || sign1} مع برج ${
    sign2Info?.ar || sign2
  }.

المحتوى المطلوب:
1. مقدمة عن التوافق بين البرجين
2. التوافق العاطفي والرومانسي
3. التوافق في الصداقة
4. التوافق في العمل
5. نقاط القوة في العلاقة
6. التحديات المحتملة
7. نصائح لنجاح العلاقة
8. خاتمة

أرجع JSON:
{
  "title": "عنوان جذاب",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["كلمة1", "كلمة2"]
}`;
}

export default {
  systemPrompt: ZODIAC_SYSTEM_PROMPT,
  signs: ZODIAC_SIGNS,
  generatePrompt: generateZodiacPrompt,
  generateCompatibilityPrompt: generateZodiacCompatibilityPrompt,
};
