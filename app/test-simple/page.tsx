
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'فحص بسيط',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * صفحة اختبار بسيطة بدون قاعدة بيانات
 * الغرض: التحقق من أن Vercel يعمل بشكل صحيح وأن المشكلة ليست في الـ Build
 */

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🎉 مرحباً!</h1>
        <p className="text-gray-600 mb-6">الموقع يعمل بشكل صحيح على Vercel</p>
        
        <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-left" dir="ltr">
          <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-sm text-gray-400 mb-4">روابط مفيدة للتشخيص:</p>
           <div className="flex flex-col gap-2">
             <a href="/" className="text-blue-600 hover:underline">الرئيسية</a>
             <a href="/tools" className="text-blue-600 hover:underline">الأدوات</a>
             <a href="/articles" className="text-blue-600 hover:underline">المقالات</a>
           </div>
        </div>
      </div>
    </div>
  );
}
