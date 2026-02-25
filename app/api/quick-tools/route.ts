import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/database';

interface QuickToolRow {
  id: string;
  href: string;
  label: string;
  icon: string;
  color: string;
  emoji: string;
  is_scroll: boolean | number | string | null;
  display_order: number | string | null;
  is_active: boolean | number | string | null;
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

// الأدوات الافتراضية
const DEFAULT_QUICK_TOOLS = [
  {
    id: 'age-calculator',
    href: '#calculator',
    label: 'احسب عمرك',
    icon: 'Calculator',
    color: 'from-purple-500 to-indigo-600',
    emoji: '🎂',
    isScroll: true,
    order: 1,
    isActive: true,
  },
  {
    id: 'birthday-countdown',
    href: '/tools/birthday-countdown',
    label: 'العد التنازلي',
    icon: 'Calendar',
    color: 'from-pink-500 to-rose-600',
    emoji: '⏰',
    isScroll: false,
    order: 2,
    isActive: true,
  },
  {
    id: 'bmi-calculator',
    href: '/tools/bmi-calculator',
    label: 'حاسبة BMI',
    icon: 'Scale',
    color: 'from-emerald-500 to-teal-600',
    emoji: '⚖️',
    isScroll: false,
    order: 3,
    isActive: true,
  },
  {
    id: 'calorie-calculator',
    href: '/tools/calorie-calculator',
    label: 'السعرات الحرارية',
    icon: 'Flame',
    color: 'from-orange-500 to-red-600',
    emoji: '🔥',
    isScroll: false,
    order: 4,
    isActive: true,
  },
  {
    id: 'child-age',
    href: '/tools/child-age',
    label: 'عمر الطفل',
    icon: 'Baby',
    color: 'from-cyan-500 to-blue-600',
    emoji: '👶',
    isScroll: false,
    order: 5,
    isActive: true,
  },
];

// GET - جلب الأدوات السريعة
export async function GET() {
  try {
    const db = await getDatabase();

    // محاولة جلب من قاعدة البيانات
    const tools = await db.all<QuickToolRow>(`
      SELECT * FROM quick_tools 
      WHERE CAST(is_active AS TEXT) IN ('1', 'true', 't')
      ORDER BY display_order ASC
    `);

    if (tools && tools.length > 0) {
      const formattedTools = tools.map((tool: any) => ({
        id: tool.id,
        href: tool.href,
        label: tool.label,
        icon: tool.icon,
        color: tool.color,
        emoji: tool.emoji,
        isScroll: toBoolean(tool.is_scroll),
        order: Number(tool.display_order ?? 0),
        isActive: toBoolean(tool.is_active),
      }));

      return NextResponse.json({ success: true, tools: formattedTools });
    }

    // إرجاع الافتراضية إذا لم توجد في قاعدة البيانات
    return NextResponse.json({ success: true, tools: DEFAULT_QUICK_TOOLS });
  } catch (error) {
    // إرجاع الافتراضية في حالة الخطأ
    return NextResponse.json({ success: true, tools: DEFAULT_QUICK_TOOLS });
  }
}

// POST - إضافة أو تحديث أداة سريعة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, href, label, icon, color, emoji, isScroll, order, isActive } =
      body;

    if (typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'معرف الأداة مطلوب' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const displayOrder = Number(order ?? 0);

    // Upsert (PostgreSQL + SQLite)
    await db.run(
      `
      INSERT INTO quick_tools
        (id, href, label, icon, color, emoji, is_scroll, display_order, is_active, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        href = EXCLUDED.href,
        label = EXCLUDED.label,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        emoji = EXCLUDED.emoji,
        is_scroll = EXCLUDED.is_scroll,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
    `,
      [
        id,
        href,
        label,
        icon,
        color,
        emoji,
        toBoolean(isScroll),
        displayOrder,
        toBoolean(isActive),
      ]
    );

    return NextResponse.json({ success: true, message: 'تم حفظ الأداة بنجاح' });
  } catch (error) {
    console.error('Error saving quick tool:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ الأداة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف أداة سريعة
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الأداة مطلوب' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.run('DELETE FROM quick_tools WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'تم حذف الأداة بنجاح' });
  } catch (error) {
    console.error('Error deleting quick tool:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الأداة' },
      { status: 500 }
    );
  }
}
