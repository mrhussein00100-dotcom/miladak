/**
 * SONA v6 - Age Calculator Prompts
 * Prompts متخصصة لحساب العمر
 */

export const AGE_SYSTEM_PROMPT = `أنت خبير في حساب العمر والتقويمات والإحصائيات.

قواعد صارمة:
- قدم معلومات دقيقة عن حساب العمر
- اشرح الفروقات بين التقويمات (ميلادي، هجري، شمسي)
- قدم حقائق مثيرة ومعلومات إحصائية
- استخدم أرقام وإحصائيات حقيقية
- تجنب المعلومات العامة والمكررة
- الحد الأدنى للمقال: 1500 كلمة

⚠️ قواعد التنسيق RTL مع ضبط المحاذاة (إلزامية):
- استخدم للفقرات: <p class="text-justify leading-relaxed mb-4" dir="rtl" style="text-align-last: right;">
- استخدم للعناوين: <h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">
- استخدم للعناوين الفرعية: <h3 class="text-xl font-semibold mt-6 mb-3 text-right" dir="rtl">
- استخدم للقوائم: <ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
- استخدم لعناصر القوائم: <li class="text-justify leading-relaxed" style="text-align-last: right;">

⚠️ تحذير مهم جداً:
- لا تكتب أي كلمات برمجية أو كودية في المحتوى المرئي
- لا تكتب كلمات مثل: JSON, HTML, CSS, JavaScript, code, script
- المحتوى للقارئ العادي وليس للمبرمجين`;

export const LIFE_STAGES = {
  infant: {
    range: [0, 1],
    ar: 'رضيع',
    milestones: ['المشي الأول', 'الكلمة الأولى'],
  },
  toddler: {
    range: [1, 3],
    ar: 'طفل صغير',
    milestones: ['الكلام', 'الاستقلالية'],
  },
  child: { range: [3, 12], ar: 'طفل', milestones: ['المدرسة', 'الصداقات'] },
  teen: { range: [13, 19], ar: 'مراهق', milestones: ['البلوغ', 'الهوية'] },
  youngAdult: {
    range: [20, 35],
    ar: 'شاب',
    milestones: ['التعليم', 'العمل', 'الزواج'],
  },
  middleAge: {
    range: [36, 55],
    ar: 'منتصف العمر',
    milestones: ['الاستقرار', 'الإنجازات'],
  },
  senior: { range: [56, 75], ar: 'كبير', milestones: ['التقاعد', 'الحكمة'] },
  elderly: { range: [76, 120], ar: 'مسن', milestones: ['الراحة', 'الذكريات'] },
};

export function getLifeStage(age: number): keyof typeof LIFE_STAGES {
  for (const [key, value] of Object.entries(LIFE_STAGES)) {
    if (age >= value.range[0] && age <= value.range[1]) {
      return key as keyof typeof LIFE_STAGES;
    }
  }
  return 'middleAge';
}

export function generateAgeArticlePrompt(age: number): string {
  const stage = getLifeStage(age);
  const stageInfo = LIFE_STAGES[stage];

  // حسابات العمر
  const days = age * 365;
  const hours = days * 24;
  const minutes = hours * 60;
  const seconds = minutes * 60;
  const heartbeats = Math.round(seconds * 1.2); // متوسط 72 نبضة/دقيقة
  const breaths = Math.round(minutes * 16); // متوسط 16 نفس/دقيقة

  return `اكتب مقالاً شاملاً ومفصلاً عن عمر ${age} سنة.

⚠️ مهم جداً - الحد الأدنى: 1500 كلمة

معلومات:
- مرحلة الحياة: ${stageInfo.ar}
- المعالم المهمة: ${stageInfo.milestones.join(', ')}

إحصائيات العمر:
- ${age} سنة = ${days.toLocaleString()} يوم
- ${hours.toLocaleString()} ساعة
- ${minutes.toLocaleString()} دقيقة
- ${seconds.toLocaleString()} ثانية
- ~${heartbeats.toLocaleString()} نبضة قلب
- ~${breaths.toLocaleString()} نفس

المحتوى المطلوب (مفصل جداً):
1. مقدمة شاملة عن عمر ${age} سنة (3-4 فقرات)
2. مرحلة الحياة وخصائصها (قسم مفصل)
3. إحصائيات مثيرة ومفصلة عن هذا العمر
   - بالأيام والساعات والدقائق والثواني
   - نبضات القلب والأنفاس
   - كمية الطعام والماء المستهلكة
   - المسافة المقطوعة مشياً
   - معلومات أخرى مثيرة (10+ معلومات)
4. إنجازات مشاهير في هذا العمر (10-15 مثال حقيقي مع التفاصيل)
5. نصائح صحية مفصلة لهذا العمر (10+ نصائح)
6. نصائح نفسية واجتماعية (10+ نصائح)
7. أهداف يمكن تحقيقها في هذا العمر (10+ أهداف)
8. حقائق مثيرة وغريبة عن هذا العمر (10+ حقائق)
9. مقارنة مع أعمار أخرى
10. خاتمة تحفيزية ملهمة (2-3 فقرات)

⚠️ قواعد التنسيق RTL مع ضبط المحاذاة (إلزامية):
- استخدم للفقرات: <p class="text-justify leading-relaxed mb-4" dir="rtl" style="text-align-last: right;">
- استخدم للعناوين: <h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">
- استخدم للقوائم: <ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
- استخدم لعناصر القوائم: <li class="text-justify leading-relaxed" style="text-align-last: right;">
- استخدم: <strong>
- لا تستخدم \\n - استخدم HTML فقط

⚠️ تحذير: لا تكتب أي كلمات برمجية أو تقنية في المحتوى!

أرجع JSON:
{
  "title": "عمر ${age} سنة: كل ما تريد معرفته",
  "content": "<p class=\\"text-justify leading-relaxed mb-4\\" dir=\\"rtl\\" style=\\"text-align-last: right;\\">المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["عمر ${age}", "حساب العمر", "كلمة1"]
}`;
}

export function generateAgeComparisonPrompt(
  age1: number,
  age2: number
): string {
  return `اكتب مقالاً يقارن بين عمر ${age1} سنة وعمر ${age2} سنة.

المحتوى المطلوب:
1. مقدمة عن المقارنة
2. الفرق بالأيام والساعات
3. اختلاف مراحل الحياة
4. اختلاف الاهتمامات والأولويات
5. نصائح لكل عمر
6. خاتمة

أرجع JSON:
{
  "title": "عنوان جذاب",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["كلمة1", "كلمة2"]
}`;
}

export function generateBirthdateFactsPrompt(
  day: number,
  month: number
): string {
  return `اكتب مقالاً عن مواليد يوم ${day}/${month}.

المحتوى المطلوب:
1. البرج الفلكي لهذا التاريخ
2. صفات مواليد هذا اليوم
3. مشاهير ولدوا في هذا التاريخ (5-10 أشخاص حقيقيين)
4. أحداث تاريخية في هذا التاريخ
5. الحجر الكريم والزهرة
6. الأرقام المحظوظة
7. نصائح لمواليد هذا اليوم

أرجع JSON:
{
  "title": "مواليد ${day}/${month}: صفاتهم ومشاهيرهم",
  "content": "<p>المحتوى بHTML</p>",
  "metaDescription": "وصف 160 حرف",
  "keywords": ["مواليد ${day}/${month}", "كلمة1"]
}`;
}

export default {
  systemPrompt: AGE_SYSTEM_PROMPT,
  lifeStages: LIFE_STAGES,
  getLifeStage,
  generateAgeArticlePrompt,
  generateAgeComparisonPrompt,
  generateBirthdateFactsPrompt,
};
