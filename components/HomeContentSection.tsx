'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calculator,
  Calendar,
  Heart,
  Brain,
  Baby,
  Clock,
  ArrowLeft,
} from 'lucide-react';

const tools = [
  {
    icon: Calculator,
    title: 'حاسبة BMI',
    description: 'احسب مؤشر كتلة الجسم واعرف وزنك المثالي',
    href: '/tools/bmi-calculator',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'حاسبة السعرات',
    description: 'احسب احتياجاتك اليومية من السعرات الحرارية',
    href: '/tools/calorie-calculator',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Calendar,
    title: 'العد التنازلي',
    description: 'كم يوم متبقي لعيد ميلادك القادم؟',
    href: '/tools/birthday-countdown',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'الأيام بين تاريخين',
    description: 'احسب عدد الأيام بين أي تاريخين',
    href: '/tools/days-between',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'إحصاءات الحياة',
    description: 'اكتشف إحصاءات مذهلة عن حياتك',
    href: '/tools/life-statistics',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Baby,
    title: 'حاسبة عمر الطفل',
    description: 'تتبع نمو طفلك ومراحل تطوره',
    href: '/tools/child-age',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Heart,
    title: 'توافق الأبراج',
    description: 'اكتشف نسبة التوافق بينك وبين شريكك',
    href: '/tools/zodiac-compatibility',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Heart,
    title: 'حاسبة الحب',
    description: 'احسب نسبة الحب والتوافق بين الأسماء',
    href: '/tools/love-calculator',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'حاسبة فرق العمر',
    description: 'احسب الفارق الزمني الدقيق بين عمرين',
    href: '/tools/age-difference',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function HomeContentSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">أدوات مميزة</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف مجموعة من الأدوات الحسابية المفيدة لحياتك اليومية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={tool.href}>
                <div className="glass p-6 rounded-2xl group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                    <span>جرب الآن</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            عرض جميع الأدوات
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* SEO Content - Rich and Beautiful */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* Main SEO Section */}
          <div className="glass p-8 md:p-12 rounded-3xl mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl not-prose">🎂</span>
              <span className="gradient-text">
                حاسبة العمر - كل ما تحتاج معرفته
              </span>
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                موقع <strong>ميلادك</strong> هو أفضل حاسبة عمر عربية تقدم لك
                حسابات دقيقة لعمرك بالسنوات والأشهر والأيام والساعات والدقائق
                والثواني. سواء كنت تريد معرفة عمرك الدقيق أو حساب الأيام
                المتبقية لعيد ميلادك القادم، فإن ميلادك يوفر لك كل ذلك وأكثر.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">حساب العمر بدقة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                احسب عمرك بالسنوات والأشهر والأيام والساعات والدقائق والثواني
                بدقة متناهية
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌙</span>
              </div>
              <h3 className="text-xl font-bold mb-2">التقويم الهجري</h3>
              <p className="text-gray-600 dark:text-gray-400">
                تحويل تاريخ ميلادك للتقويم الهجري ومعرفة عمرك بالتقويمين
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold mb-2">الأبراج الفلكية</h3>
              <p className="text-gray-600 dark:text-gray-400">
                اكتشف برجك الغربي والصيني وخصائص شخصيتك الفلكية
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">إحصاءات ممتعة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                اكتشف كم نبضة قلب نبض قلبك وكم مرة تنفست منذ ولادتك
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold mb-2">العد التنازلي</h3>
              <p className="text-gray-600 dark:text-gray-400">
                اعرف كم يوم متبقي لعيد ميلادك القادم واحتفل بشكل مميز
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧮</span>
              </div>
              <h3 className="text-xl font-bold mb-2">أدوات متنوعة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                أكثر من 17 أداة حسابية مجانية للصحة والعمر والتواريخ
              </p>
            </div>
          </div>

          {/* Detailed SEO Content - Enhanced */}
          <div className="glass p-8 md:p-12 rounded-3xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-500">🔢</span>
                  كيف تعمل حاسبة العمر؟
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  تعتمد حاسبة العمر على حسابات رياضية دقيقة تأخذ في الاعتبار
                  السنوات الكبيسة والأشهر المختلفة الأطوال. كل ما عليك فعله هو
                  إدخال تاريخ ميلادك وستحصل فوراً على عمرك بالتفصيل.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    حسابات دقيقة 100%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    نتائج فورية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    مجاني بالكامل
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-500">🎯</span>
                  لماذا ميلادك؟
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  ميلادك ليس مجرد حاسبة عمر عادية، بل هو موقع شامل يقدم لك تجربة
                  فريدة لاكتشاف كل ما يتعلق بعمرك وحياتك.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">★</span>
                    واجهة عربية سهلة الاستخدام
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">★</span>
                    متوافق مع جميع الأجهزة
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">★</span>
                    بدون إعلانات مزعجة
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional SEO Content */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
                <span className="text-2xl not-prose">📖</span>
                <span className="gradient-text">دليل حساب العمر الشامل</span>
              </h3>

              <div className="space-y-6">
                <div className="glass p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <h4 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">
                    🗓️ حساب العمر بالتقويم الميلادي
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    التقويم الميلادي (الغريغوري) هو الأكثر استخداماً عالمياً.
                    يعتمد على دورة الشمس ويتكون من 365 يوماً (366 في السنة
                    الكبيسة). حاسبة ميلادك تحسب عمرك بدقة متناهية مع مراعاة
                    السنوات الكبيسة والأشهر المختلفة الأطوال.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">
                    🌙 حساب العمر بالتقويم الهجري
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    التقويم الهجري (القمري) يعتمد على دورة القمر ويتكون من 354
                    أو 355 يوماً. لذلك عمرك بالهجري يكون أكبر من عمرك بالميلادي.
                    ميلادك يحسب لك عمرك بالتقويمين معاً بدقة عالية.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <h4 className="text-xl font-bold mb-3 text-amber-700 dark:text-amber-300">
                    ⭐ الأبراج الفلكية وتاريخ الميلاد
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    تاريخ ميلادك يحدد برجك الفلكي الغربي (12 برج) والصيني (12
                    حيوان). كل برج له صفات وخصائص مميزة. اكتشف برجك وصفاتك
                    الشخصية من خلال حاسبة ميلادك.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
                  <h4 className="text-xl font-bold mb-3 text-rose-700 dark:text-rose-300">
                    ❤️ إحصاءات الحياة المذهلة
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    هل تعلم كم مرة نبض قلبك منذ ولادتك؟ كم نفس تنفست؟ كم ساعة
                    نمت؟ حاسبة ميلادك تقدم لك إحصاءات مذهلة عن حياتك بناءً على
                    عمرك الدقيق.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Mini Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
                <span className="text-2xl not-prose">❓</span>
                <span className="gradient-text">أسئلة شائعة</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    هل حاسبة العمر دقيقة؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    نعم، حاسبة ميلادك تستخدم خوارزميات دقيقة تأخذ في الاعتبار
                    السنوات الكبيسة وفروق الأشهر لتقديم نتائج دقيقة 100%.
                  </p>
                </div>
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    هل الموقع مجاني؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    نعم، جميع أدوات ميلادك مجانية بالكامل ولا تحتاج لتسجيل أو
                    اشتراك.
                  </p>
                </div>
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    هل يمكنني حساب العمر بالهجري؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    نعم، ميلادك يحسب عمرك بالتقويم الميلادي والهجري معاً بدقة
                    عالية.
                  </p>
                </div>
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    ما هي الأدوات المتاحة؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    أكثر من 17 أداة تشمل حاسبة BMI، السعرات، الحمل، العد
                    التنازلي، والمزيد.
                  </p>
                </div>
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    كيف أعرف برجي الفلكي؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    أدخل تاريخ ميلادك في الحاسبة وستظهر لك معلومات برجك الغربي
                    والصيني.
                  </p>
                </div>
                <div className="glass p-4 rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">
                    هل يمكنني مشاركة النتائج؟
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    نعم، يمكنك مشاركة نتائج حساب عمرك على وسائل التواصل
                    الاجتماعي بسهولة.
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords Section for SEO */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <span className="not-prose">🔍</span>
                <span>كلمات مفتاحية ذات صلة</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  // حاسبات العمر الأساسية
                  'حاسبة العمر',
                  'حساب العمر بالهجري',
                  'حساب العمر بالميلادي',
                  'كم عمري',
                  'حاسبة تاريخ الميلاد',
                  'حساب العمر بالأيام',
                  'العمر بالساعات',
                  'العمر بالدقائق',
                  'العمر بالثواني',
                  'حساب العمر الدقيق',
                  // الأبراج والفلك
                  'حاسبة الأبراج',
                  'البرج الفلكي',
                  'البرج الصيني',
                  'برج الحمل',
                  'برج الثور',
                  'برج الجوزاء',
                  'برج السرطان',
                  'برج الأسد',
                  'برج العذراء',
                  'برج الميزان',
                  'برج العقرب',
                  'برج القوس',
                  'برج الجدي',
                  'برج الدلو',
                  'برج الحوت',
                  // حاسبات الصحة
                  'حاسبة BMI',
                  'حاسبة السعرات',
                  'حاسبة كتلة الجسم',
                  'حاسبة الوزن المثالي',
                  'حاسبة السعرات الحرارية',
                  'حاسبة نمو الطفل',
                  'حاسبة الحمل',
                  'حاسبة مراحل الحمل',
                  // أدوات التاريخ
                  'العد التنازلي لعيد الميلاد',
                  'حاسبة الأيام بين تاريخين',
                  'تحويل التاريخ الهجري',
                  'تحويل التاريخ الميلادي',
                  'معرفة يوم الميلاد',
                  'حاسبة الأعياد',
                  'حاسبة المناسبات',
                  // معلومات الميلاد
                  'حجر الميلاد',
                  'زهرة الميلاد',
                  'اللون المحظوظ',
                  'الرقم المحظوظ',
                  'فصل الميلاد',
                  'مشاهير يوم ميلادي',
                  'أحداث تاريخية يوم ميلادي',
                  // أدوات متنوعة
                  'حاسبة فرق العمر',
                  'مقارنة الأعمار',
                  'حاسبة الجيل',
                  'حاسبة المنطقة الزمنية',
                  'حاسبة العد التنازلي',
                  'حاسبة إحصاءات الحياة',
                  // كلمات بحث شائعة
                  'احسب عمري',
                  'كم عمري بالضبط',
                  'عمري كم يوم',
                  'عمري كم شهر',
                  'عمري كم أسبوع',
                  'تاريخ ميلادي بالهجري',
                  'تاريخ ميلادي بالميلادي',
                  'موعد عيد ميلادي',
                  'كم باقي على عيد ميلادي',
                  // معلومات صحية
                  'العمر الصحي',
                  'متوسط العمر',
                  'العمر المتوقع',
                  'نصائح صحية حسب العمر',
                  'تغذية حسب العمر',
                  // أدوات الأطفال
                  'حاسبة عمر الطفل',
                  'مراحل نمو الطفل',
                  'تطور الطفل',
                  'وزن الطفل المثالي',
                  'طول الطفل المثالي',
                  // التقويم والتواريخ
                  'التقويم الهجري',
                  'التقويم الميلادي',
                  'الأشهر الهجرية',
                  'الأشهر الميلادية',
                  'تحويل التواريخ',
                  // كلمات إضافية
                  'حاسبة العمر أونلاين',
                  'حاسبة العمر مجانية',
                  'أفضل حاسبة عمر',
                  'حاسبة العمر بالعربي',
                  'موقع حساب العمر',
                  'تطبيق حساب العمر',
                  'حساب العمر من تاريخ الميلاد',
                  'معرفة العمر الحقيقي',
                  'حساب السن',
                  'كم سني',
                  'عمري الحقيقي',
                  'بطاقة عيد الميلاد',
                  'مشاركة العمر',
                  'طباعة بطاقة الميلاد',
                ].map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
