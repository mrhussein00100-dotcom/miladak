/**
 * عمليات قوالب المولد المحلي
 * إنشاء جدول جديد للقوالب في قاعدة البيانات الموحدة
 */

import { execute, query, queryOne } from './database';

// أنواع البيانات
export interface AITemplate {
  id: number;
  name: string;
  category: 'birthday' | 'zodiac' | 'age' | 'events' | 'general';
  template_content: string;
  variables: string[]; // JSON array
  min_words: number;
  max_words: number;
  is_active: boolean;
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

interface AITemplateRow {
  id: number;
  name: string;
  category: AITemplate['category'];
  template_content: string;
  variables: unknown;
  min_words: number | null;
  max_words: number | null;
  is_active: unknown;
  created_at: string;
}

function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 't'
  );
}

function parseVariables(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function mapTemplateRow(row: AITemplateRow): AITemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    template_content: row.template_content,
    variables: parseVariables(row.variables),
    min_words: Number(row.min_words ?? 500),
    max_words: Number(row.max_words ?? 2000),
    is_active: toBoolean(row.is_active),
    created_at: row.created_at,
  };
}

let templatesInitialized = false;

// إنشاء جدول القوالب إذا لم يكن موجوداً
export async function initTemplatesTable(): Promise<void> {
  if (templatesInitialized) return;

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    templatesInitialized = true;
    return;
  }

  templatesInitialized = true;

  try {
    // إضافة قوالب افتراضية إذا كان الجدول فارغاً
    const countRow = await queryOne<{ count: number | string }>(
      'SELECT COUNT(*) as count FROM ai_templates'
    );
    const count = Number((countRow as any)?.count ?? 0);
    if (count === 0) {
      await insertDefaultTemplates();
    }
  } catch {
    // تجاهل
  }
}

// إدراج القوالب الافتراضية
async function insertDefaultTemplates(): Promise<void> {
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

  for (const template of templates) {
    await createTemplateInternal(template);
  }
}

// جلب جميع القوالب
export async function getTemplates(
  options: {
    category?: AITemplate['category'];
    activeOnly?: boolean;
  } = {}
): Promise<AITemplate[]> {
  await initTemplatesTable();

  const { category, activeOnly = true } = options;

  let sql = 'SELECT * FROM ai_templates WHERE 1=1';
  const params: any[] = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (activeOnly) {
    sql += " AND CAST(is_active AS TEXT) IN ('1', 'true', 't')";
  }

  sql += ' ORDER BY name ASC';

  const rows = await query<AITemplateRow>(sql, params);
  return rows.map(mapTemplateRow);
}

// جلب قالب واحد
export async function getTemplateById(
  id: number
): Promise<AITemplate | undefined> {
  await initTemplatesTable();
  const row = await queryOne<AITemplateRow>(
    'SELECT * FROM ai_templates WHERE id = ?',
    [id]
  );
  return row ? mapTemplateRow(row) : undefined;
}

// إنشاء قالب جديد (داخلي - بدون تهيئة)
async function createTemplateInternal(input: AITemplateInput): Promise<number> {
  const variables = JSON.stringify(input.variables || []);
  const minWords = input.min_words ?? 500;
  const maxWords = input.max_words ?? 2000;
  const isActive = input.is_active !== false;

  try {
    const row = await queryOne<{ id: number }>(
      `INSERT INTO ai_templates (
        name, category, template_content, variables, min_words, max_words, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [
        input.name,
        input.category,
        input.template_content,
        variables,
        minWords,
        maxWords,
        isActive,
      ]
    );

    if (row?.id !== undefined) return Number(row.id);
  } catch {
    // تجاهل
  }

  const result = await execute(
    `INSERT INTO ai_templates (
      name, category, template_content, variables, min_words, max_words, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.category,
      input.template_content,
      variables,
      minWords,
      maxWords,
      isActive,
    ]
  );

  return result.lastInsertRowid;
}

// إنشاء قالب جديد (خارجي - مع تهيئة)
export async function createTemplate(input: AITemplateInput): Promise<number> {
  await initTemplatesTable();
  return await createTemplateInternal(input);
}

// تحديث قالب
export async function updateTemplate(
  id: number,
  input: Partial<AITemplateInput>
): Promise<boolean> {
  const template = await getTemplateById(id);
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
    params.push(input.is_active);
  }

  if (updates.length === 0) return true;

  params.push(id);
  await execute(
    `UPDATE ai_templates SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return true;
}

// حذف قالب
export async function deleteTemplate(id: number): Promise<boolean> {
  const result = await execute('DELETE FROM ai_templates WHERE id = ?', [id]);
  return result.changes > 0;
}

// تفعيل/تعطيل قالب
export async function toggleTemplate(id: number): Promise<boolean> {
  const template = await getTemplateById(id);
  if (!template) return false;

  await execute('UPDATE ai_templates SET is_active = ? WHERE id = ?', [
    !template.is_active,
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
