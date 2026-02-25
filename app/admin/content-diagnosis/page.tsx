
import React from 'react';
import unifiedDb from '@/lib/db/unified-connection';

export const dynamic = 'force-dynamic';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  published: boolean;
  views: number;
  updated_at: string;
}

async function getArticles() {
  await unifiedDb.initialize();
  
  const articles = await unifiedDb.query<Article>(`
    SELECT id, title, slug, content, meta_description, published, views, updated_at
    FROM articles
    ORDER BY created_at DESC
  `);
  
  return articles;
}

export default async function ContentDiagnosisPage() {
  const articles = await getArticles();

  // Analysis Logic
  const analyzedArticles = articles.map(article => {
    // Strip HTML for word count
    const text = article.content 
      ? article.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() 
      : '';
    const wordCount = text.split(' ').length;
    
    // Check issues
    const issues: string[] = [];
    if (wordCount < 300) issues.push('محتوى قصير جداً (<300 كلمة)');
    else if (wordCount < 600) issues.push('محتوى قصير (<600 كلمة)');
    
    if (!article.meta_description) issues.push('لا يوجد وصف ميتا');
    else if (article.meta_description.length < 50) issues.push('وصف ميتا قصير');
    
    // Check keyword density (simple check for title words in content)
    const titleWords = article.title.split(' ').filter(w => w.length > 3);
    const contentLower = text.toLowerCase();
    const missingKeywords = titleWords.filter(w => !contentLower.includes(w.toLowerCase()));
    if (missingKeywords.length > titleWords.length / 2) {
      issues.push('الكلمات المفتاحية في العنوان غير موجودة في المحتوى');
    }

    return {
      ...article,
      wordCount,
      issues,
      status: issues.length === 0 ? 'good' : (issues.some(i => i.includes('جداً') || i.includes('لا يوجد')) ? 'critical' : 'warning')
    };
  });

  const criticalCount = analyzedArticles.filter(a => a.status === 'critical').length;
  const warningCount = analyzedArticles.filter(a => a.status === 'warning').length;
  const goodCount = analyzedArticles.filter(a => a.status === 'good').length;

  return (
    <div className="p-8 font-sans rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">تشخيص جودة المحتوى (Content Diagnosis)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{goodCount}</div>
          <div className="text-green-800">مقالات جيدة</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{warningCount}</div>
          <div className="text-yellow-800">تحتاج تحسين</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
          <div className="text-red-800">مشاكل حرجة (محتوى غير ذي قيمة)</div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الكلمات</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشاهدات</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشاكل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analyzedArticles.map((article) => (
              <tr key={article.id} className={article.status === 'critical' ? 'bg-red-50' : article.status === 'warning' ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500">/articles/{article.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.wordCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${article.status === 'good' ? 'bg-green-100 text-green-800' : 
                      article.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {article.status === 'good' ? 'جيد' : article.status === 'warning' ? 'متوسط' : 'حرج'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {article.issues.map((issue, idx) => (
                      <li key={idx} className="text-red-600">{issue}</li>
                    ))}
                    {article.issues.length === 0 && <span className="text-green-600">لا توجد مشاكل ظاهرة</span>}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/articles/${article.slug}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 ml-4">عرض</a>
                  {/* <a href={`/admin/articles/${article.id}/edit`} className="text-blue-600 hover:text-blue-900">تعديل</a> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
