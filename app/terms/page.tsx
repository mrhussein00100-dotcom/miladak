
import { Metadata } from 'next';
import { ScrollText, CheckCircle, AlertTriangle, Scale, Mail, ShieldAlert } from 'lucide-react';
import { JsonLd } from '@/components/SEO/JsonLd';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | ميلادك',
  description: 'شروط وأحكام استخدام موقع ميلادك. يرجى قراءة هذه الشروط بعناية قبل استخدام الموقع.',
  openGraph: {
    title: 'شروط الاستخدام | ميلادك',
    description: 'شروط وأحكام استخدام موقع ميلادك.',
    url: 'https://miladak.com/terms',
    type: 'website',
  },
};

const termsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'شروط الاستخدام - ميلادك',
  description: 'شروط وأحكام استخدام موقع ميلادك.',
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 md:py-16 font-sans" dir="rtl">
      <JsonLd data={termsStructuredData} />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 shadow-lg">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">شروط الاستخدام</h1>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                أهلاً بك في ميلادك. استخدامك للموقع يعني موافقتك على هذه الشروط، لذا يرجى قراءتها بعناية.
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
                <Scale className="w-6 h-6 text-purple-500" />
                مقدمة
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                مرحباً بك في موقع ميلادك (<strong>miladak.com</strong>). تحكم هذه الشروط والأحكام استخدامك لموقعنا وخدماتنا. من خلال الوصول إلى الموقع واستخدامه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط.
              </p>
            </section>

            {/* Usage */}
            <section className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 md:p-8 border border-purple-100 dark:border-purple-900/30">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-500" />
                الاستخدام المقبول
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">الاستخدام الشخصي</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      يُسمح لك باستخدام الموقع والأدوات المتاحة فيه للأغراض الشخصية والتعليمية وغير التجارية.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">الاستخدام المحظور</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      يُمنع استخدام الموقع لأي غرض غير قانوني، أو محاولة اختراق الموقع، أو نسخ المحتوى وإعادة نشره دون إذن كتابي صريح.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accuracy */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                دقة المعلومات وإخلاء المسؤولية
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                نحن نبذل قصارى جهدنا لضمان دقة الأدوات والمعلومات المقدمة على الموقع، ولكننا لا نقدم أي ضمانات صريحة أو ضمنية بشأن:
              </p>
              <ul className="space-y-3 pr-5 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>دقة النتائج الحسابية بنسبة 100% في جميع الحالات.</li>
                <li>خلو الموقع من الأخطاء البرمجية أو التقنية.</li>
                <li>استمرارية عمل الموقع دون انقطاع.</li>
              </ul>
              <div className="mt-4 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
                استخدامك للموقع يكون على مسؤوليتك الخاصة. لا يتحمل "ميلادك" أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدامك للموقع.
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-blue-500" />
                الملكية الفكرية
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                جميع حقوق الملكية الفكرية المتعلقة بالمحتوى، التصميم، الشعارات، والأكواد البرمجية في هذا الموقع هي ملك لموقع "ميلادك" ومحمية بموجب قوانين حقوق النشر. لا يجوز لك نسخ، تعديل، توزيع، أو استغلال أي جزء من الموقع لأغراض تجارية دون الحصول على إذن مسبق.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <ScrollText className="w-6 h-6 text-pink-500" />
                التعديلات
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                نحتفظ بالحق في تعديل أو تحديث هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد إجراء أي تغييرات يعني قبولك للشروط المعدلة.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-500" />
                اتصل بنا
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                إذا كان لديك أي أسئلة أو استفسارات بخصوص شروط الاستخدام، يسعدنا تواصلك معنا.
              </p>
              <a 
                href="mailto:contact@miladak.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-medium"
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
