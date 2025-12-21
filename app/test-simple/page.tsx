/**
 * صفحة اختبار بسيطة بدون قاعدة بيانات
 */

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🎉 مرحباً!</h1>
        <p className="text-gray-600 mb-6">الموقع يعمل بشكل صحيح على Vercel</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>الوقت: {new Date().toLocaleString('ar-SA')}</p>
        </div>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          الذهاب للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
