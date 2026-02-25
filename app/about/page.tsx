
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { JsonLd } from '@/components/SEO/JsonLd';

export const metadata: Metadata = {
  title: 'من نحن | ميلادك - قصة شغف بالأرقام والتواريخ',
  description: 'تعرف على فريق ميلادك ورؤيتنا لتقديم أدوات حسابية دقيقة ومحتوى عربي موثوق. نحن نجمع بين التكنولوجيا الحديثة والدقة العلمية.',
  keywords: ['من نحن', 'فريق ميلادك', 'رؤية ميلادك', 'دقة الحسابات', 'أدوات عربية'],
  openGraph: {
    title: 'من نحن | ميلادك',
    description: 'تعرف على قصة ميلادك ورؤيتنا للمستقبل',
    url: 'https://miladak.com/about',
    type: 'website',
  },
};

const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'من نحن - ميلادك',
  description: 'تعرف على فريق ميلادك ورؤيتنا لتقديم أدوات حسابية دقيقة ومحتوى عربي موثوق.',
  publisher: {
    '@type': 'Organization',
    name: 'ميلادك',
    url: 'https://miladak.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://miladak.com/icon-192.png'
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <JsonLd data={aboutStructuredData} />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              قصة ميلادك
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            أكثر من مجرد حاسبة عمر.. نحن منصة عربية متكاملة تهدف لإثراء المحتوى العربي بأدوات دقيقة ومعلومات موثوقة.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Story */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-bl-full opacity-50"></div>
            
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              كيف بدأنا؟
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                انطلقت فكرة "ميلادك" من حاجة بسيطة: عدم وجود أدوات حسابية عربية دقيقة وسهلة الاستخدام تجمع بين جمال التصميم ودقة النتائج.
                لاحظنا أن معظم الأدوات المتاحة إما قديمة، مليئة بالإعلانات المزعجة، أو تفتقر للدقة العلمية.
              </p>
              <p>
                في عام 2024، قررنا تغيير هذا الواقع. قمنا بتطوير منصة شاملة لا تكتفي بحساب العمر فحسب، بل تقدم تحليلات عميقة
                حول الوقت، الصحة، والفلك، كل ذلك في واجهة عربية عصرية تحترم عقل المستخدم.
              </p>
            </div>
          </section>

          {/* Our Values Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 text-2xl">
                  🎯
                </div>
                <CardTitle className="text-xl">الدقة العلمية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  نحن لا نعتمد على التقديرات العشوائية. جميع أدواتنا مبنية على خوارزميات دقيقة ومعادلات علمية موثقة، سواء في حسابات التواريخ المعقدة أو المؤشرات الصحية.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4 text-2xl">
                  🛡️
                </div>
                <CardTitle className="text-xl">الخصوصية أولاً</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  نحترم خصوصيتك بقدسية تامة. جميع العمليات الحسابية تتم محلياً على جهازك. نحن لا نخزن تواريخ ميلادك ولا بياناتك الصحية في خوادمنا.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Features List */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-8 text-center">لماذا يثق بنا الآلاف؟</h2>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "واجهة عربية 100% تدعم اتجاه RTL بشكل مثالي",
                "دعم كامل للتقويم الهجري (أم القرى) والميلادي",
                "أدوات مجانية تماماً بدون تكاليف خفية",
                "تصميم متجاوب يعمل بسلاسة على الجوال والكمبيوتر",
                "تحديثات مستمرة وإضافة أدوات جديدة أسبوعياً",
                "محتوى تعليمي وتثقيفي يرافق كل أداة"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✔</span>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Contact CTA */}
          <section className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">لديك فكرة أو اقتراح؟</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              نحن نبني هذه المنصة من أجلك. يسعدنا سماع أفكارك لتطوير أدوات جديدة.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              تواصل معنا
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
