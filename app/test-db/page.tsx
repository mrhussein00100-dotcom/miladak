/**
 * صفحة اختبار قاعدة البيانات
 */

import { query } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export default async function TestDbPage() {
  let dbStatus = 'غير متصل';
  let toolsCount = 0;
  let articlesCount = 0;
  let error = null;

  try {
    // اختبار الاتصال
    const tools = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM tools'
    );
    const articles = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM articles'
    );

    toolsCount = parseInt(tools[0]?.count || '0');
    articlesCount = parseInt(articles[0]?.count || '0');
    dbStatus = 'متصل ✅';
  } catch (e: any) {
    error = e.message;
    dbStatus = 'خطأ ❌';
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          اختبار قاعدة البيانات
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="font-medium">حالة الاتصال:</span>
            <span
              className={
                dbStatus.includes('✅') ? 'text-green-600' : 'text-red-600'
              }
            >
              {dbStatus}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="font-medium">عدد الأدوات:</span>
            <span className="text-blue-600 font-bold">{toolsCount}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="font-medium">عدد المقالات:</span>
            <span className="text-blue-600 font-bold">{articlesCount}</span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded">
              <strong>خطأ:</strong> {error}
            </div>
          )}

          <div className="p-4 bg-blue-50 text-blue-700 rounded text-sm">
            <strong>معلومات البيئة:</strong>
            <ul className="mt-2 space-y-1">
              <li>NODE_ENV: {process.env.NODE_ENV}</li>
              <li>DATABASE_TYPE: {process.env.DATABASE_TYPE || 'غير محدد'}</li>
              <li>VERCEL: {process.env.VERCEL ? 'نعم' : 'لا'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
