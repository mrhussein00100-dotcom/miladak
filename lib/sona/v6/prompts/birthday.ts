/**
 * SONA v6 - Birthday Prompts
 * Prompts متخصصة لعيد الميلاد والتهاني
 */

export const BIRTHDAY_SYSTEM_PROMPT = `أنت كاتب محتوى متخصص في التهاني والاحتفالات العربية.

قواعد صارمة:
- اكتب تهاني صادقة ومؤثرة وفريدة
- خصص المحتوى للعمر والمناسبة
- قدم أفكار هدايا واحتفالات مناسبة
- استخدم لغة دافئة وإيجابية
- تجنب التكرار والجمل العامة
- كل تهنئة يجب أن تكون مختلفة عن الأخرى
- الحد الأدنى للمقال: 1500 كلمة

⚠️ تحذير مهم جداً:
- لا تكتب أي كلمات برمجية أو كودية في المحتوى المرئي
- لا تكتب كلمات مثل: JSON, HTML, CSS, JavaScript, code, script
- لا تكتب أي تاغات HTML كنص مرئي
- المحتوى للقارئ العادي وليس للمبرمجين`;

export const AGE_CATEGORIES = {
  child: {
    range: [1, 12],
    ar: 'طفل',
    themes: ['ألعاب', 'حفلات', 'شخصيات كرتونية'],
  },
  teen: { range: [13, 19], ar: 'مراهق', themes: ['تقنية', 'موضة', 'رياضة'] },
  youngAdult: {
    range: [20, 35],
    ar: 'شاب',
    themes: ['نجاح', 'طموح', 'مستقبل'],
  },
  adult: { range: [36, 55], ar: 'بالغ', themes: ['إنجازات', 'عائلة', 'حكمة'] },
  senior: { range: [56, 100], ar: 'كبير', themes: ['تقدير', 'ذكريات', 'صحة'] },
};

export function getAgeCategory(age: number): keyof typeof AGE_CATEGORIES {
  for (const [key, value] of Object.entries(AGE_CATEGORIES)) {
    if (age >= value.range[0] && age <= value.range[1]) {
      return key as keyof typeof AGE_CATEGORIES;
    }
  }
  return 'adult';
}

export function generateBirthdayPrompt(
  name: string,
  age: number,
  relation?: string
): string {
  const category = getAgeCategory(age);
  const categoryInfo = AGE_CATEGORIES[category];

  return `اكتب مقالاً شاملاً ومفصلاً عن عيد ميلاد ${name} الذي يبلغ ${age} عاماً${
    relation ? ` (${relation})` : ''
  }.

⚠️ مهم جداً - الحد الأدنى: 1500 كلمة

معلومات:
- الفئة العمرية: ${categoryInfo.ar}
- المواضيع المناسبة: ${categoryInfo.themes.join(', ')}

المحتوى المطلوب (مفصل جداً):
1. مقدمة احتفالية مفصلة (4-5 فقرات)
2. تهنئة مميزة ومؤثرة مخصصة للعمر (3-4 فقرات)
3. 15-20 رسالة تهنئة متنوعة (قصيرة ومتوسطة وطويلة)
4. أفكار هدايا مناسبة للعمر (15-20 فكرة مع شرح لكل فكرة)
5. أفكار للاحتفال (10 أفكار مع تفاصيل)
6. كلمات وعبارات جميلة للمناسبة (10-15 عبارة)
7. نصائح مفصلة لجعل اليوم مميزاً (7-10 نصائح)
8. أفكار للكيك والحلويات
9. أفكار للديكور والزينة
10. خاتمة دافئة ومؤثرة (2-3 فقرات)

قواعد التنسيق:
- استخدم <h2> للعناوين الرئيسية
- استخدم <p> لكل فقرة
- استخدم <ul> و <li> للقوائم
- استخدم <blockquote> للتهاني المميزة
- لا تستخدم \\n - استخدم HTML فقط

⚠️ تحذير: لا تكتب أي كلمات برمجية أو تقنية في المحتوى!

أرجع JSON:
{
  "title": "عنوان جذاب يتضمن العمر",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["عيد ميلاد", "تهنئة", "كلمة1"]
}`;
}

export function generateWishesPrompt(
  occasion: string,
  count: number = 20
): string {
  return `اكتب ${count} رسالة تهنئة فريدة ومؤثرة لمناسبة: ${occasion}

المتطلبات:
- كل رسالة مختلفة تماماً عن الأخرى
- تنوع في الطول (قصيرة، متوسطة، طويلة)
- تنوع في الأسلوب (رسمي، ودود، شعري)
- مناسبة للنشر على وسائل التواصل
- خالية من الأخطاء اللغوية

أرجع JSON:
{
  "wishes": [
    {"text": "الرسالة", "type": "short|medium|long", "style": "formal|friendly|poetic"}
  ]
}`;
}

export function generateGiftIdeasPrompt(
  age: number,
  gender?: string,
  budget?: string
): string {
  const category = getAgeCategory(age);
  const categoryInfo = AGE_CATEGORIES[category];

  return `اقترح 20 فكرة هدية لشخص عمره ${age} سنة${
    gender ? ` (${gender})` : ''
  }${budget ? ` بميزانية ${budget}` : ''}.

الفئة العمرية: ${categoryInfo.ar}
المواضيع المناسبة: ${categoryInfo.themes.join(', ')}

المتطلبات:
- أفكار متنوعة وعملية
- مناسبة للعمر والاهتمامات
- تشمل هدايا بأسعار مختلفة
- أفكار إبداعية وغير تقليدية

أرجع JSON:
{
  "gifts": [
    {"name": "اسم الهدية", "description": "وصف قصير", "priceRange": "منخفض|متوسط|مرتفع", "category": "الفئة"}
  ]
}`;
}

export default {
  systemPrompt: BIRTHDAY_SYSTEM_PROMPT,
  ageCategories: AGE_CATEGORIES,
  getAgeCategory,
  generatePrompt: generateBirthdayPrompt,
  generateWishesPrompt,
  generateGiftIdeasPrompt,
};
