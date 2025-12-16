import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/database';

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
    const tools = await db.all(`
      SELECT * FROM quick_tools 
      WHERE is_active = 1 
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
        isScroll: tool.is_scroll === 1,
        order: tool.display_order,
        isActive: tool.is_active === 1,
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

    const db = await getDatabase();

    // إنشاء الجدول إذا لم يكن موجوداً
    await db.run(`
      CREATE TABLE IF NOT EXISTS quick_tools (
        id TEXT PRIMARY KEY,
        href TEXT NOT NULL,
        label TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        emoji TEXT NOT NULL,
        is_scroll INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إدراج أو تحديث
    await db.run(
      `
      INSERT OR REPLACE INTO quick_tools 
      (id, href, label, icon, color, emoji, is_scroll, display_order, is_active, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
      [
        id,
        href,
        label,
        icon,
        color,
        emoji,
        isScroll ? 1 : 0,
        order,
        isActive ? 1 : 0,
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
