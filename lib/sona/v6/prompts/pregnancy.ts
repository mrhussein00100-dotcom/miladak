/**
 * SONA v6 - Pregnancy Prompts
 * Prompts طبية متخصصة للحمل
 */

export const PREGNANCY_SYSTEM_PROMPT = `أنت طبيب متخصص في صحة الحمل والأمومة.

قواعد صارمة:
- قدم معلومات طبية دقيقة وموثوقة
- اذكر تطور الجنين في كل أسبوع بدقة
- قدم نصائح صحية للأم مبنية على أدلة علمية
- تجنب المعلومات المضللة أو غير الموثقة
- أضف تنبيهات عند الحاجة لاستشارة الطبيب
- استخدم لغة واضحة ومفهومة للأم
- الحد الأدنى للمقال: 1500 كلمة

⚠️ تحذير مهم جداً:
- لا تكتب أي كلمات برمجية أو كودية في المحتوى المرئي
- لا تكتب كلمات مثل: JSON, HTML, CSS, JavaScript, code, script
- المحتوى للأم الحامل وليس للمبرمجين`;

export const PREGNANCY_TRIMESTERS = {
  first: {
    weeks: [1, 13],
    ar: 'الثلث الأول',
    focus: ['تكوين الأعضاء', 'الغثيان', 'الفيتامينات'],
  },
  second: {
    weeks: [14, 27],
    ar: 'الثلث الثاني',
    focus: ['نمو الجنين', 'حركة الجنين', 'الفحوصات'],
  },
  third: {
    weeks: [28, 40],
    ar: 'الثلث الثالث',
    focus: ['الاستعداد للولادة', 'وضع الجنين', 'علامات المخاض'],
  },
};

export const FETAL_DEVELOPMENT = {
  4: { size: 'بذرة خشخاش', development: 'بداية تكوين الأنبوب العصبي' },
  8: { size: 'حبة فاصوليا', development: 'تشكل الأطراف والأصابع' },
  12: { size: 'ليمونة', development: 'اكتمال الأعضاء الرئيسية' },
  16: { size: 'أفوكادو', development: 'بداية حركة الجنين' },
  20: { size: 'موزة', development: 'يمكن معرفة الجنس' },
  24: { size: 'ذرة', development: 'تطور السمع' },
  28: { size: 'باذنجان', development: 'فتح العينين' },
  32: { size: 'جوز هند', development: 'اكتمال الرئتين تقريباً' },
  36: { size: 'بطيخ صغير', development: 'استعداد للولادة' },
  40: { size: 'بطيخ', development: 'مكتمل النمو' },
};

export function getTrimester(week: number): keyof typeof PREGNANCY_TRIMESTERS {
  if (week <= 13) return 'first';
  if (week <= 27) return 'second';
  return 'third';
}

export function generatePregnancyWeekPrompt(week: number): string {
  const trimester = getTrimester(week);
  const trimesterInfo = PREGNANCY_TRIMESTERS[trimester];

  // البحث عن أقرب معلومة تطور
  const developmentWeeks = Object.keys(FETAL_DEVELOPMENT).map(Number);
  const closestWeek = developmentWeeks.reduce((prev, curr) =>
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  const development =
    FETAL_DEVELOPMENT[closestWeek as keyof typeof FETAL_DEVELOPMENT];

  return `اكتب مقالاً طبياً شاملاً ومفصلاً عن الأسبوع ${week} من الحمل.

⚠️ مهم جداً - الحد الأدنى: 1500 كلمة

معلومات:
- الثلث: ${trimesterInfo.ar}
- حجم الجنين التقريبي: ${development?.size || 'غير محدد'}
- التطور الرئيسي: ${development?.development || 'غير محدد'}
- المواضيع المهمة: ${trimesterInfo.focus.join(', ')}

المحتوى المطلوب (مفصل جداً):
1. مقدمة شاملة عن الأسبوع ${week} (3-4 فقرات)
2. تطور الجنين في هذا الأسبوع (قسم مفصل جداً)
   - الحجم والوزن التقريبي بالتفصيل
   - التطورات الجسدية (10+ نقاط)
   - تطور الأعضاء والأجهزة
   - تطور الحواس
3. التغيرات في جسم الأم (قسم مفصل)
   - التغيرات الجسدية (10+ نقاط)
   - التغيرات الهرمونية
   - التغيرات النفسية
4. الأعراض المتوقعة وكيفية التعامل معها (10+ عرض)
5. نصائح صحية وغذائية مفصلة
   - الأطعمة المفيدة (10+ أطعمة)
   - الأطعمة الممنوعة (10+ أطعمة)
   - المكملات الغذائية المطلوبة
6. التمارين المناسبة (5-7 تمارين مع الشرح)
7. الفحوصات الطبية المطلوبة
8. متى يجب استشارة الطبيب (تنبيهات مهمة مفصلة)
9. نصائح للأب (5-7 نصائح)
10. أسئلة شائعة وإجاباتها
11. خاتمة تشجيعية (2-3 فقرات)

قواعد التنسيق:
- استخدم <h2> للعناوين الرئيسية
- استخدم <h3> للعناوين الفرعية
- استخدم <p> لكل فقرة
- استخدم <ul> و <li> للقوائم
- استخدم <div class="warning"> للتنبيهات المهمة
- لا تستخدم \\n - استخدم HTML فقط

⚠️ تحذير: لا تكتب أي كلمات برمجية أو تقنية في المحتوى!

أرجع JSON:
{
  "title": "الأسبوع ${week} من الحمل: دليل شامل",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["الأسبوع ${week}", "الحمل", "تطور الجنين"]
}`;
}

export function generatePregnancySymptomPrompt(symptom: string): string {
  return `اكتب مقالاً طبياً عن عرض "${symptom}" أثناء الحمل.

المحتوى المطلوب:
1. ما هو هذا العرض ولماذا يحدث
2. في أي مرحلة من الحمل يظهر عادة
3. هل هو طبيعي أم يستدعي القلق
4. طرق التخفيف والعلاج الآمنة
5. متى يجب استشارة الطبيب
6. نصائح وقائية

أرجع JSON:
{
  "title": "عنوان جذاب",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["كلمة1", "كلمة2"]
}`;
}

export default {
  systemPrompt: PREGNANCY_SYSTEM_PROMPT,
  trimesters: PREGNANCY_TRIMESTERS,
  fetalDevelopment: FETAL_DEVELOPMENT,
  getTrimester,
  generateWeekPrompt: generatePregnancyWeekPrompt,
  generateSymptomPrompt: generatePregnancySymptomPrompt,
};
