
import { query } from '@/lib/db/database';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'تشخيص المحتوى | ميلادك',
  robots: {
    index: false,
    follow: false,
  },
};

interface ArticleStats {
  id: number;
  title: string;
  slug: string;
  content_length: number;
  has_image: boolean;
  published: boolean;
  views: number;
  updated_at: string;
}

export default async function ContentDiagnosisPage() {
  let articles: ArticleStats[] = [];
  let error = '';

  try {
    // جلب الإحصائيات مع حساب طول المحتوى
    articles = await query<ArticleStats>(`
      SELECT 
        id,
        title,
        slug,
        LENGTH(COALESCE(content, '')) as content_length,
        CASE WHEN featured_image IS NOT NULL AND featured_image != '' THEN true ELSE false END as has_image,
        published,
        views,
        updated_at
      FROM articles
      ORDER BY content_length ASC
    `);
  } catch (e: any) {
    error = e.message;
  }

  // تصنيف المقالات
  const thinContent = articles.filter(a => a.content_length < 3000); // أقل من ~500 كلمة (تقريباً 6 أحرف للكلمة)
  const goodContent = articles.filter(a => a.content_length >= 3000);
  const noImage = articles.filter(a => !a.has_image);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">🕵️ تشخيص جودة المحتوى (Content Audit)</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">خطأ في الاتصال بقاعدة البيانات</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">إجمالي المقالات</h3>
            <p className="text-4xl font-bold text-blue-600">{articles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">محتوى ضعيف (أقل من 500 كلمة)</h3>
            <p className={`text-4xl font-bold ${thinContent.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {thinContent.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">بدون صورة بارزة</h3>
            <p className={`text-4xl font-bold ${noImage.length > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {noImage.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">⚠️ مقالات تحتاج لتحسين (المحتوى الضعيف)</h2>
            <span className="text-sm text-gray-500">الأولوية القصوى للإصلاح</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="p-4">العنوان</th>
                  <th className="p-4">حجم المحتوى (أحرف)</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">صورة</th>
                  <th className="p-4">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {thinContent.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{article.title}</td>
                    <td className="p-4 text-red-600 font-bold">{article.content_length}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {article.published ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="p-4">
                      {article.has_image ? '✅' : '❌'}
                    </td>
                    <td className="p-4">
                      <Link href={`/articles/${article.slug}`} className="text-blue-600 hover:underline text-sm" target="_blank">
                        عرض المقال ↗
                      </Link>
                    </td>
                  </tr>
                ))}
                {thinContent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      ممتاز! لا توجد مقالات ضعيفة المحتوى.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">📋 جميع المقالات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="p-4">العنوان</th>
                  <th className="p-4">حجم المحتوى</th>
                  <th className="p-4">المشاهدات</th>
                  <th className="p-4">تاريخ التحديث</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {goodContent.slice(0, 10).map(article => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{article.title}</td>
                    <td className="p-4 text-green-600 font-bold">{article.content_length}</td>
                    <td className="p-4 text-gray-600">{article.views}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(article.updated_at).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {goodContent.length > 10 && (
              <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-100">
                ... وعرض {goodContent.length - 10} مقال آخر بجودة جيدة
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
