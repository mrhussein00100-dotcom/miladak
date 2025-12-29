import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  Clock,
  MessageSquare,
  HelpCircle,
  Send,
  Shield,
  Zap,
  Heart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'اتصل بنا | ميلادك - تواصل معنا',
  description:
    'تواصل مع فريق ميلادك لأي استفسارات أو اقتراحات أو دعم تقني. نحن هنا لمساعدتك!',
  openGraph: {
    title: 'اتصل بنا | ميلادك',
    description: 'تواصل مع فريق ميلادك لأي استفسارات أو اقتراحات',
    url: 'https://miladak.com/contact',
  },
};

const features = [
  {
    icon: Zap,
    title: 'رد سريع',
    description: 'نسعى للرد على جميع الرسائل خلال 24-48 ساعة',
    color: 'text-yellow-500',
  },
  {
    icon: Shield,
    title: 'خصوصية تامة',
    description: 'بياناتك آمنة ولا نشاركها مع أي طرف ثالث',
    color: 'text-green-500',
  },
  {
    icon: Heart,
    title: 'دعم ودود',
    description: 'فريقنا متحمس لمساعدتك وحل مشاكلك',
    color: 'text-pink-500',
  },
];

const faqs = [
  {
    question: 'هل الموقع مجاني؟',
    answer: 'نعم، جميع أدوات ميلادك مجانية تماماً بدون أي رسوم أو اشتراكات.',
  },
  {
    question: 'هل تحتفظون ببياناتي؟',
    answer:
      'لا، جميع الحسابات تتم محلياً في متصفحك ولا نحتفظ بأي بيانات شخصية.',
  },
  {
    question: 'كيف يمكنني اقتراح أداة جديدة؟',
    answer:
      'راسلنا على contact@miladak.com مع وصف الأداة المقترحة وسنقوم بدراستها.',
  },
  {
    question: 'هل يمكنني استخدام الأدوات على الجوال؟',
    answer:
      'نعم، جميع أدواتنا متوافقة مع الجوال وتعمل بشكل مثالي على جميع الأجهزة.',
  },
  {
    question: 'كيف أبلغ عن خطأ في الموقع؟',
    answer:
      'يمكنك إرسال تفاصيل المشكلة إلى بريدنا الإلكتروني وسنعمل على إصلاحها في أقرب وقت.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/25">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              تواصل معنا
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك! سواء كان لديك سؤال، اقتراح، أو تحتاج دعماً تقنياً،
            فريقنا جاهز للرد عليك.
          </p>
        </div>

        {/* Contact Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  راسلنا عبر البريد الإلكتروني
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  للاستفسارات العامة، الاقتراحات، الدعم التقني، أو الإبلاغ عن
                  مشاكل
                </p>
                <a
                  href="mailto:contact@miladak.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                  <Send className="w-5 h-5" />
                  <span>contact@miladak.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-1">
                  أوقات الرد المتوقعة
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                  نسعى للرد على جميع الرسائل خلال <strong>24-48 ساعة</strong> في
                  أيام العمل. قد يستغرق الرد وقتاً أطول في عطلات نهاية الأسبوع
                  والأعياد. شكراً لصبرك!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <HelpCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              الأسئلة الشائعة
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              إجابات سريعة على الأسئلة الأكثر شيوعاً
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm text-purple-600 dark:text-purple-400 font-bold">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 pr-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-10 text-white">
            <h3 className="text-2xl font-bold mb-3">لم تجد إجابة لسؤالك؟</h3>
            <p className="text-purple-100 mb-6">
              لا تتردد في التواصل معنا مباشرة وسنكون سعداء بمساعدتك
            </p>
            <a
              href="mailto:contact@miladak.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>أرسل رسالة</span>
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span>←</span>
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
