import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db/database';

// التصنيفات من قاعدة البيانات المحلية
const CATEGORIES = [
  {
    id: 38,
    name: 'حساب العمر',
    slug: 'age-calculation',
    color: '#3B82F6',
    description: '',
  },
  {
    id: 39,
    name: 'أعياد الميلاد',
    slug: 'birthdays',
    color: '#EC4899',
    description: '',
  },
  {
    id: 40,
    name: 'الأرقام والإحصاءات',
    slug: 'numbers-statistics',
    color: '#8B5CF6',
    description: '',
  },
  {
    id: 41,
    name: 'التواريخ المهمة',
    slug: 'important-dates',
    color: '#EF4444',
    description: '',
  },
  {
    id: 42,
    name: 'الصحة والعمر',
    slug: 'health-age',
    color: '#10B981',
    description: '',
  },
  {
    id: 43,
    name: 'الذكريات والذكرى السنوية',
    slug: 'anniversaries',
    color: '#06B6D4',
    description: '',
  },
  {
    id: 44,
    name: 'معلومات تاريخية',
    slug: 'historical-info',
    color: '#6366F1',
    description: '',
  },
  {
    id: 45,
    name: 'الحمل والولادة',
    slug: 'pregnancy-birth',
    color: '#EC4899',
    description: '',
  },
  {
    id: 46,
    name: 'مراحل العمر',
    slug: 'age-stages',
    color: '#14B8A6',
    description: '',
  },
  {
    id: 47,
    name: 'حقائق ممتعة',
    slug: 'fun-facts',
    color: '#F97316',
    description: '',
  },
  {
    id: 48,
    name: 'المواسم والفصول',
    slug: 'seasons',
    color: '#84CC16',
    description: '',
  },
  {
    id: 49,
    name: 'الأيام الخاصة',
    slug: 'special-days',
    color: '#A855F7',
    description: '',
  },
  {
    id: 50,
    name: 'التقويم الهجري',
    slug: 'hijri-calendar',
    color: '#059669',
    description: '',
  },
  {
    id: 51,
    name: 'الشخصيات المشهورة',
    slug: 'famous-people',
    color: '#DC2626',
    description: '',
  },
  {
    id: 52,
    name: 'الأسماء ومعانيها',
    slug: 'names-meanings',
    color: '#7C3AED',
    description: '',
  },
  {
    id: 53,
    name: 'نصائح للآباء',
    slug: 'parenting-tips',
    color: '#0891B2',
    description: '',
  },
  {
    id: 54,
    name: 'العادات والتقاليد',
    slug: 'traditions',
    color: '#EA580C',
    description: '',
  },
  {
    id: 55,
    name: 'الطب والعلوم',
    slug: 'medicine-science',
    color: '#2563EB',
    description: '',
  },
  {
    id: 56,
    name: 'الأجيال',
    slug: 'generations',
    color: '#7C2D12',
    description: '',
  },
  {
    id: 57,
    name: 'الذكاء الاصطناعي والتكنولوجيا',
    slug: 'ai-technology',
    color: '#4F46E5',
    description: '',
  },
  {
    id: 58,
    name: 'التطور والنمو',
    slug: 'development-growth',
    color: '#16A34A',
    description: '',
  },
  {
    id: 59,
    name: 'السفر والرحلات',
    slug: 'travel',
    color: '#0EA5E9',
    description: '',
  },
  {
    id: 60,
    name: 'الموضة والأزياء',
    slug: 'fashion',
    color: '#DB2777',
    description: '',
  },
  {
    id: 61,
    name: 'التعليم والتطوير الذاتي',
    slug: 'education-self-development',
    color: '#CA8A04',
    description: '',
  },
  {
    id: 62,
    name: 'الرياضة واللياقة',
    slug: 'sports-fitness',
    color: '#DC2626',
    description: '',
  },
  {
    id: 63,
    name: 'التغذية السليمة',
    slug: 'healthy-nutrition',
    color: '#65A30D',
    description: '',
  },
  {
    id: 64,
    name: 'الذكاء العاطفي',
    slug: 'emotional-intelligence',
    color: '#DB2777',
    description: '',
  },
  {
    id: 65,
    name: 'المال والاستثمار',
    slug: 'money-investment',
    color: '#059669',
    description: '',
  },
  {
    id: 66,
    name: 'الهوايات والاهتمامات',
    slug: 'hobbies-interests',
    color: '#7C3AED',
    description: '',
  },
  {
    id: 67,
    name: 'الإنتاجية وإدارة الوقت',
    slug: 'productivity-time',
    color: '#0284C7',
    description: '',
  },
  {
    id: 68,
    name: 'الحياة المهنية',
    slug: 'career-life',
    color: '#4338CA',
    description: '',
  },
  {
    id: 69,
    name: 'العلاقات الأسرية',
    slug: 'family-relationships',
    color: '#BE185D',
    description: '',
  },
  {
    id: 70,
    name: 'الصداقة والعلاقات الاجتماعية',
    slug: 'friendship-social',
    color: '#0D9488',
    description: '',
  },
  {
    id: 71,
    name: 'التقاعد والشيخوخة',
    slug: 'retirement-aging',
    color: '#92400E',
    description: '',
  },
  {
    id: 72,
    name: 'الإبداع والفنون',
    slug: 'creativity-arts',
    color: '#BE123C',
    description: '',
  },
  {
    id: 73,
    name: 'اللغات والثقافات',
    slug: 'languages-cultures',
    color: '#1E40AF',
    description: '',
  },
  {
    id: 74,
    name: 'البيئة والاستدامة',
    slug: 'environment-sustainability',
    color: '#15803D',
    description: '',
  },
  {
    id: 75,
    name: 'القراءة والكتب',
    slug: 'reading-books',
    color: '#B45309',
    description: '',
  },
  {
    id: 76,
    name: 'الأمن السيبراني',
    slug: 'cybersecurity',
    color: '#991B1B',
    description: '',
  },
  {
    id: 77,
    name: 'ريادة الأعمال',
    slug: 'entrepreneurship',
    color: '#9333EA',
    description: '',
  },
  {
    id: 78,
    name: 'السفر والمغامرات',
    slug: 'travel-adventures',
    color: '#0369A1',
    description: '',
  },
  {
    id: 79,
    name: 'التطوع والعمل الخيري',
    slug: 'volunteering-charity',
    color: '#C2410C',
    description: '',
  },
  {
    id: 80,
    name: 'الذاكرة والتركيز',
    slug: 'memory-focus',
    color: '#6D28D9',
    description: '',
  },
  {
    id: 81,
    name: 'السعادة والإيجابية',
    slug: 'happiness-positivity',
    color: '#FCD34D',
    description: '',
  },
  {
    id: 82,
    name: 'علم النفس',
    slug: 'psychology',
    color: '#8B5CF6',
    description: '',
  },
  { id: 83, name: 'ثقافة', slug: 'culture', color: '#10B981', description: '' },
  {
    id: 84,
    name: 'علم الفلك',
    slug: 'astronomy',
    color: '#F59E0B',
    description: '',
  },
  {
    id: 85,
    name: 'نمط الحياة',
    slug: 'lifestyle',
    color: '#EF4444',
    description: '',
  },
  {
    id: 86,
    name: 'علم الأعداد',
    slug: 'numerology',
    color: '#6366F1',
    description: '',
  },
];

export async function GET() {
  try {
    const now = new Date().toISOString();
    let inserted = 0;
    let errors: string[] = [];

    // حذف التصنيفات القديمة (الـ 6 الموجودة)
    await execute('DELETE FROM article_categories WHERE id < 38');

    for (const cat of CATEGORIES) {
      try {
        // محاولة الإدراج أو التحديث
        await execute(
          `
          INSERT INTO article_categories (id, name, slug, description, color, icon, sort_order, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            description = EXCLUDED.description,
            color = EXCLUDED.color,
            updated_at = EXCLUDED.updated_at
        `,
          [
            cat.id,
            cat.name,
            cat.slug,
            cat.description,
            cat.color,
            '',
            cat.id,
            now,
            now,
          ]
        );
        inserted++;
      } catch (err: any) {
        errors.push(`${cat.id}: ${err.message}`);
      }
    }

    // التحقق من العدد
    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM article_categories'
    );
    const totalCount = countResult[0]?.count || '0';

    // عرض عينة
    const sample = await query<any>(
      'SELECT id, name, slug, color FROM article_categories ORDER BY id LIMIT 10'
    );

    return NextResponse.json({
      success: true,
      message: `تم ترحيل ${inserted} تصنيف`,
      totalCategories: totalCount,
      errors: errors.length > 0 ? errors : undefined,
      sample,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
