/**
 * عمليات قوالب المولد المحلي
 * إنشاء جدول جديد للقوالب في قاعدة البيانات الموحدة
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from './unified-database';

// أنواع البيانات
export interface AITemplate {
  id: number;
  name: string;
  category: 'birthday' | 'zodiac' | 'age' | 'events' | 'general';
  template_content: string;
  variables: string; // JSON array
  min_words: number;
  max_words: number;
  is_active: number;
  created_at: string;
}

export interface AITemplateInput {
  name: string;
  category: AITemplate['category'];
  template_content: string;
  variables?: string[];
  min_words?: number;
  max_words?: number;
  is_active?: boolean;
}

// إنشاء جدول القوالب إذا لم يكن موجوداً
export function initTemplatesTable(): void {
  const db = getUnifiedDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('birthday', 'zodiac', 'age', 'events', 'general')),
      template_content TEXT NOT NULL,
      variables TEXT DEFAULT '[]',
      min_words INTEGER DEFAULT 500,
      max_words INTEGER DEFAULT 2000,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إضافة قوالب افتراضية إذا كان الجدول فارغاً
  const count = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM ai_templates'
  );
  if (count?.count === 0) {
    insertDefaultTemplates();
  }
}

// إدراج القوالب الافتراضية
function insertDefaultTemplates(): void {
  const templates: AITemplateInput[] = [
    {
      name: 'مقال عيد ميلاد شامل',
      category: 'birthday',
      template_content: `# {{title}}

## مقدمة عن عيد الميلاد

عيد الميلاد هو يوم مميز في حياة كل إنسان، فهو يمثل بداية رحلة جديدة في الحياة. {{name}} يحتفل اليوم بعيد ميلاده {{age}}، وهذا يوم يستحق الاحتفال والفرح.

## معلومات عن تاريخ الميلاد

ولد {{name}} في {{birthDate}}، وهذا يعني أنه من مواليد برج {{zodiacSign}}. يتميز مواليد هذا البرج بـ{{zodiacTraits}}.

## الأحداث التاريخية في هذا اليوم

في مثل هذا اليوم من التاريخ، حدثت العديد من الأحداث المهمة:
{{historicalEvents}}

## المشاهير الذين يشاركونك يوم ميلادك

هناك العديد من المشاهير الذين ولدوا في نفس اليوم:
{{celebrities}}

## حجر الميلاد وزهرة الشهر

حجر ميلادك هو {{birthstone}} الذي يرمز إلى {{birthstoneSymbol}}.
زهرة شهر ميلادك هي {{birthFlower}} التي تعبر عن {{birthFlowerMeaning}}.

## الأرقام والألوان المحظوظة

رقمك المحظوظ هو {{luckyNumber}}، ولونك المحظوظ هو {{luckyColor}}.

## خاتمة

نتمنى لك عيد ميلاد سعيد مليء بالفرح والسعادة. عام جديد مليء بالنجاحات والإنجازات!`,
      variables: [
        'name',
        'age',
        'birthDate',
        'zodiacSign',
        'zodiacTraits',
        'historicalEvents',
        'celebrities',
        'birthstone',
        'birthstoneSymbol',
        'birthFlower',
        'birthFlowerMeaning',
        'luckyNumber',
        'luckyColor',
        'title',
      ],
      min_words: 500,
      max_words: 2000,
    },
    {
      name: 'مقال برج الحظ',
      category: 'zodiac',
      template_content: `# برج {{zodiacSign}} - كل ما تريد معرفته

## نظرة عامة على برج {{zodiacSign}}

برج {{zodiacSign}} هو أحد الأبراج {{zodiacElement}}، ويمتد من {{zodiacStartDate}} إلى {{zodiacEndDate}}. يتميز مواليد هذا البرج بالعديد من الصفات المميزة.

## صفات برج {{zodiacSign}}

### الصفات الإيجابية
{{positiveTraits}}

### الصفات السلبية
{{negativeTraits}}

## التوافق مع الأبراج الأخرى

{{compatibility}}

## الحجر الكريم والألوان

الحجر الكريم لبرج {{zodiacSign}} هو {{gemstone}}، والألوان المحظوظة هي {{luckyColors}}.

## نصائح لمواليد برج {{zodiacSign}}

{{tips}}`,
      variables: [
        'zodiacSign',
        'zodiacElement',
        'zodiacStartDate',
        'zodiacEndDate',
        'positiveTraits',
        'negativeTraits',
        'compatibility',
        'gemstone',
        'luckyColors',
        'tips',
      ],
      min_words: 400,
      max_words: 1500,
    },
    {
      name: 'مقال حساب العمر',
      category: 'age',
      template_content: `# حساب العمر - {{name}} في عمر {{age}}

## كم عمرك بالتفصيل؟

إذا كنت من مواليد {{birthDate}}، فإن عمرك الآن هو:
- {{ageYears}} سنة
- {{ageMonths}} شهر
- {{ageDays}} يوم
- {{ageHours}} ساعة

## معلومات مثيرة عن عمرك

- عدد نبضات قلبك منذ ولادتك: {{heartbeats}}
- عدد مرات التنفس: {{breaths}}
- عدد الأيام التي عشتها: {{totalDays}}

## ماذا يعني أن تكون في عمر {{age}}؟

{{ageInsights}}

## أهداف للعام القادم

{{goals}}`,
      variables: [
        'name',
        'age',
        'birthDate',
        'ageYears',
        'ageMonths',
        'ageDays',
        'ageHours',
        'heartbeats',
        'breaths',
        'totalDays',
        'ageInsights',
        'goals',
      ],
      min_words: 300,
      max_words: 1000,
    },
    {
      name: 'مقال أحداث تاريخية',
      category: 'events',
      template_content: `# أحداث تاريخية في {{date}}

## ماذا حدث في مثل هذا اليوم؟

يوم {{date}} هو يوم مميز في التاريخ، شهد العديد من الأحداث المهمة التي غيرت مجرى التاريخ.

## أهم الأحداث التاريخية

{{events}}

## مواليد مشهورون في هذا اليوم

{{birthdays}}

## وفيات مشهورة في هذا اليوم

{{deaths}}

## حقائق مثيرة

{{facts}}`,
      variables: ['date', 'events', 'birthdays', 'deaths', 'facts'],
      min_words: 400,
      max_words: 1500,
    },
    {
      name: 'مقال عام',
      category: 'general',
      template_content: `# {{title}}

## مقدمة

{{introduction}}

## المحتوى الرئيسي

{{mainContent}}

## معلومات إضافية

{{additionalInfo}}

## خاتمة

{{conclusion}}`,
      variables: [
        'title',
        'introduction',
        'mainContent',
        'additionalInfo',
        'conclusion',
      ],
      min_words: 300,
      max_words: 2000,
    },
  ];

  templates.forEach((template) => {
    createTemplateInternal(template);
  });
}

// جلب جميع القوالب
export function getTemplates(
  options: {
    category?: AITemplate['category'];
    activeOnly?: boolean;
  } = {}
): AITemplate[] {
  initTemplatesTable();

  const { category, activeOnly = true } = options;

  let query = 'SELECT * FROM ai_templates WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (activeOnly) {
    query += ' AND is_active = 1';
  }

  query += ' ORDER BY name ASC';

  return queryAll<AITemplate>(query, params);
}

// جلب قالب واحد
export function getTemplateById(id: number): AITemplate | undefined {
  initTemplatesTable();
  return queryOne<AITemplate>('SELECT * FROM ai_templates WHERE id = ?', [id]);
}

// إنشاء قالب جديد (داخلي - بدون تهيئة)
function createTemplateInternal(input: AITemplateInput): number {
  const result = execute(
    `INSERT INTO ai_templates (
      name, category, template_content, variables, min_words, max_words, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.category,
      input.template_content,
      JSON.stringify(input.variables || []),
      input.min_words || 500,
      input.max_words || 2000,
      input.is_active !== false ? 1 : 0,
    ]
  );

  return result.lastInsertRowid as number;
}

// إنشاء قالب جديد (خارجي - مع تهيئة)
export function createTemplate(input: AITemplateInput): number {
  initTemplatesTable();
  return createTemplateInternal(input);
}

// تحديث قالب
export function updateTemplate(
  id: number,
  input: Partial<AITemplateInput>
): boolean {
  const template = getTemplateById(id);
  if (!template) return false;

  const updates: string[] = [];
  const params: any[] = [];

  if (input.name !== undefined) {
    updates.push('name = ?');
    params.push(input.name);
  }
  if (input.category !== undefined) {
    updates.push('category = ?');
    params.push(input.category);
  }
  if (input.template_content !== undefined) {
    updates.push('template_content = ?');
    params.push(input.template_content);
  }
  if (input.variables !== undefined) {
    updates.push('variables = ?');
    params.push(JSON.stringify(input.variables));
  }
  if (input.min_words !== undefined) {
    updates.push('min_words = ?');
    params.push(input.min_words);
  }
  if (input.max_words !== undefined) {
    updates.push('max_words = ?');
    params.push(input.max_words);
  }
  if (input.is_active !== undefined) {
    updates.push('is_active = ?');
    params.push(input.is_active ? 1 : 0);
  }

  if (updates.length === 0) return true;

  params.push(id);
  execute(`UPDATE ai_templates SET ${updates.join(', ')} WHERE id = ?`, params);

  return true;
}

// حذف قالب
export function deleteTemplate(id: number): boolean {
  const result = execute('DELETE FROM ai_templates WHERE id = ?', [id]);
  return result.changes > 0;
}

// تفعيل/تعطيل قالب
export function toggleTemplate(id: number): boolean {
  const template = getTemplateById(id);
  if (!template) return false;

  execute('UPDATE ai_templates SET is_active = ? WHERE id = ?', [
    template.is_active ? 0 : 1,
    id,
  ]);

  return true;
}

export default {
  initTemplatesTable,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplate,
};
