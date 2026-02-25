
import { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { JsonLd } from '@/components/SEO/JsonLd';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | ميلادك',
  description: 'سياسة الخصوصية لموقع ميلادك. تعرف على كيفية حمايتنا لبياناتك وخصوصيتك.',
  openGraph: {
    title: 'سياسة الخصوصية | ميلادك',
    description: 'نحن نلتزم بحماية خصوصيتك. تعرف على سياستنا.',
    url: 'https://miladak.com/privacy',
    type: 'website',
  },
};

const privacyStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'سياسة الخصوصية - ميلادك',
  description: 'سياسة الخصوصية لموقع ميلادك وكيفية التعامل مع بيانات المستخدمين.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 md:py-16 font-sans" dir="rtl">
      <JsonLd data={privacyStructuredData} />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">سياسة الخصوصية</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                في ميلادك، نأخذ خصوصيتك على محمل الجد. هذه الوثيقة تشرح بوضوح كيف نتعامل مع معلوماتك.
              </p>
              <div className="mt-6 inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                آخر تحديث: {lastUpdated}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-500" />
                مقدمة
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                مرحباً بك في ميلادك. نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية. توضح سياسة الخصوصية هذه أنواع المعلومات التي قد نجمعها منك أو التي قد تقدمها عند زيارة موقعنا الإلكتروني <strong>miladak.com</strong> وكيفية استخدامنا لتلك المعلومات.
              </p>
            </section>

            {/* Data Collection */}
            <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-900/30">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-500" />
                المعلومات التي نجمعها
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">المعالجة المحلية</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      معظم أدواتنا (مثل حاسبة العمر) تقوم بمعالجة البيانات محلياً في متصفحك. لا يتم إرسال تواريخ ميلادك إلى خوادمنا ولا نقوم بتخزينها.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">i</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">سجلات الخادم (Log Files)</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      مثل معظم المواقع، نقوم بجمع معلومات قياسية مثل عنوان IP، نوع المتصفح، ومزود الخدمة لأغراض الأمان وتحليل الأداء. هذه المعلومات لا تحدد هويتك الشخصية.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-500" />
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك، مثل حفظ تفضيلاتك (الوضع الليلي/النهاري). كما نستخدم خدمات طرف ثالث قد تستخدم الكوكيز:
              </p>
              <ul className="space-y-3 pr-5">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <strong>Google Analytics:</strong> لمساعدتنا في فهم كيفية استخدام الزوار للموقع.
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <strong>Google AdSense:</strong> لعرض إعلانات مخصصة تناسب اهتماماتك.
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
              </div>
            </section>

            {/* Third Party Links */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Globe className="w-6 h-6 text-indigo-500" />
                روابط لأطراف ثالثة
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لسنا مسؤولين عن ممارسات الخصوصية لهذه المواقع. نشجعك على قراءة سياسات الخصوصية الخاصة بكل موقع تزوره.
              </p>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-500" />
                أمان البيانات
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                نستخدم تقنيات أمان قياسية (مثل SSL/HTTPS) لحماية اتصالك بالموقع. ومع ذلك، لا يوجد نقل بيانات عبر الإنترنت آمن بنسبة 100%، لذا لا يمكننا ضمان الأمان المطلق.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Mail className="w-6 h-6 text-pink-500" />
                اتصل بنا
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                إذا كان لديك أي استفسارات حول سياسة الخصوصية هذه، لا تتردد في التواصل معنا.
              </p>
              <a 
                href="mailto:contact@miladak.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                contact@miladak.com
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
