'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgeCalculator } from './AgeCalculator';
import { HeaderAd, InContentAd, FooterAd } from './AdSense/AdSenseSlot';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import {
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Gift,
  Crown,
  Flame,
  Brain,
  Gem,
} from 'lucide-react';

export function CalculateBirthdayClient() {
  const [showExtraContent, setShowExtraContent] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Hero Section - مبهر وجذاب */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-blue-600/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Crown className="w-12 h-12 text-yellow-500" />
              <h1 className="text-5xl md:text-7xl font-bold gradient-text">
                احسب ميلادك
              </h1>
              <Gem className="w-12 h-12 text-cyan-500" />
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-2xl not-prose">✨</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                اكتشف أسرار حياتك المذهلة
              </span>
              <span className="text-2xl not-prose">✨</span>
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              أكثر من 150 معلومة مثيرة عن عمرك، شخصيتك، وحياتك!
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                {
                  icon: <Flame className="w-6 h-6" />,
                  text: 'دقة 100%',
                  color: 'from-red-500 to-orange-500',
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  text: 'نتائج فورية',
                  color: 'from-yellow-500 to-amber-500',
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  text: 'محبوب من الملايين',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  text: 'الأفضل عربياً',
                  color: 'from-purple-500 to-indigo-500',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className={`glass p-4 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 border-2 border-white/20 hover:scale-105 transition-transform`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`text-white bg-gradient-to-br ${item.color} p-2 rounded-lg`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-center">
                      {item.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <HeaderAd className="my-8" />

      {/* Main Calculator */}
      <section className="container mx-auto px-4 py-8">
        <AgeCalculator
          title="🎯 ابدأ رحلة الاكتشاف الآن"
          showFeatures={true}
          onCalculate={() => setShowExtraContent(true)}
        />
      </section>

      {/* Extra Engaging Content */}
      <AnimatePresence>
        {showExtraContent && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="container mx-auto px-4 py-12"
          >
            <InContentAd className="mb-12" />

            {/* Fun Facts Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl not-prose">🎉</span>
                <span className="gradient-text">حقائق مذهلة عن حياتك</span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Brain className="w-8 h-8" />,
                    title: 'قوة عقلك',
                    desc: 'عقلك معالج أفكار أقوى من أي كمبيوتر!',
                    color: 'from-purple-500 to-indigo-500',
                  },
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: 'قلبك النابض',
                    desc: 'قلبك ضخ ملايين اللترات من الدم!',
                    color: 'from-red-500 to-pink-500',
                  },
                  {
                    icon: <Sparkles className="w-8 h-8" />,
                    title: 'طاقتك الإيجابية',
                    desc: 'أنت مصدر إلهام لمن حولك!',
                    color: 'from-yellow-500 to-orange-500',
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: 'إنجازاتك',
                    desc: 'حققت آلاف الأهداف الصغيرة والكبيرة!',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    icon: <Award className="w-8 h-8" />,
                    title: 'تميزك الفريد',
                    desc: 'لا يوجد شخص مثلك في العالم!',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: 'نموك المستمر',
                    desc: 'كل يوم تصبح نسخة أفضل من نفسك!',
                    color: 'from-indigo-500 to-purple-500',
                  },
                ].map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="glass p-6 rounded-2xl border-2 border-white/20 hover:shadow-2xl transition-all"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fact.color} flex items-center justify-center text-white mb-4 mx-auto`}
                    >
                      {fact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">
                      {fact.title}
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      {fact.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Personality Insights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card className="glass border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                    <Gem className="w-8 h-8 text-cyan-500" />
                    اكتشف شخصيتك الفريدة
                    <Star className="w-8 h-8 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary">
                        💪 نقاط قوتك
                      </h4>
                      <ul className="space-y-3">
                        {[
                          'قدرة عالية على التكيف مع التحديات',
                          'ذكاء عاطفي متميز في التعامل',
                          'إبداع فريد في حل المشكلات',
                          'قيادة طبيعية تلهم الآخرين',
                        ].map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg"
                          >
                            <span className="text-2xl">✨</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-secondary">
                        🎯 فرص النمو
                      </h4>
                      <ul className="space-y-3">
                        {[
                          'تطوير مهارات جديدة كل يوم',
                          'بناء علاقات أقوى وأعمق',
                          'تحقيق التوازن بين العمل والحياة',
                          'استكشاف شغفك الحقيقي',
                        ].map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg"
                          >
                            <span className="text-2xl">🚀</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Life Milestones */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl not-prose">🏆</span>
                <span className="gradient-text">معالم حياتك المميزة</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    emoji: '🎓',
                    title: 'التعليم والمعرفة',
                    desc: 'سنوات من التعلم والنمو',
                  },
                  {
                    emoji: '💼',
                    title: 'الإنجازات المهنية',
                    desc: 'خطوات نحو النجاح',
                  },
                  {
                    emoji: '❤️',
                    title: 'العلاقات والحب',
                    desc: 'روابط قوية مع الأحباء',
                  },
                  {
                    emoji: '🌟',
                    title: 'اللحظات السعيدة',
                    desc: 'ذكريات لا تُنسى',
                  },
                  {
                    emoji: '💪',
                    title: 'التحديات المتغلب عليها',
                    desc: 'قوة وصمود',
                  },
                  {
                    emoji: '🎯',
                    title: 'الأحلام المحققة',
                    desc: 'طموحات أصبحت واقعاً',
                  },
                ].map((milestone, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="glass p-6 rounded-2xl text-center border-2 border-white/20 hover:border-primary/50 transition-all"
                  >
                    <div className="text-6xl mb-4">{milestone.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {milestone.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Your Life in Numbers - أرقام حياتك */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl not-prose">🔢</span>
                <span className="gradient-text">حياتك بالأرقام المذهلة</span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    number: '~2.5 مليار',
                    label: 'نبضة قلب',
                    icon: '💓',
                    color: 'from-red-500 to-pink-500',
                  },
                  {
                    number: '~700 مليون',
                    label: 'نفس',
                    icon: '🫁',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    number: '~100 ألف',
                    label: 'ساعة استيقاظ',
                    icon: '⏰',
                    color: 'from-yellow-500 to-orange-500',
                  },
                  {
                    number: '~50 ألف',
                    label: 'وجبة طعام',
                    icon: '🍽️',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    number: '~10 ملايين',
                    label: 'خطوة مشي',
                    icon: '👣',
                    color: 'from-purple-500 to-indigo-500',
                  },
                  {
                    number: '~500 مليون',
                    label: 'رمشة عين',
                    icon: '👁️',
                    color: 'from-pink-500 to-rose-500',
                  },
                  {
                    number: '~30 ألف',
                    label: 'ساعة نوم',
                    icon: '😴',
                    color: 'from-indigo-500 to-purple-500',
                  },
                  {
                    number: '~1 مليون',
                    label: 'ابتسامة',
                    icon: '😊',
                    color: 'from-amber-500 to-yellow-500',
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + i * 0.05 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`glass p-6 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 border-2 border-white/20 text-center`}
                  >
                    <div className="text-5xl mb-3">{stat.icon}</div>
                    <div className="text-2xl font-bold mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Fun Comparisons - مقارنات ممتعة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl not-prose">🎭</span>
                <span className="gradient-text">مقارنات ممتعة ومثيرة</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: '🌍 رحلة حول العالم',
                    desc: 'لو جمعت كل خطواتك، لكنت طفت حول الأرض عدة مرات!',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    title: '📚 مكتبة ضخمة',
                    desc: 'عقلك يحتوي على معلومات تعادل آلاف الكتب!',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    title: '⚡ طاقة هائلة',
                    desc: 'جسمك أنتج طاقة تكفي لإضاءة مدينة صغيرة!',
                    color: 'from-yellow-500 to-orange-500',
                  },
                  {
                    title: '💧 محيط من الماء',
                    desc: 'شربت من الماء ما يملأ حمام سباحة أولمبي!',
                    color: 'from-cyan-500 to-blue-500',
                  },
                  {
                    title: '🎬 أفلام لا تنتهي',
                    desc: 'ذكرياتك تساوي آلاف الأفلام الوثائقية!',
                    color: 'from-red-500 to-pink-500',
                  },
                  {
                    title: '🌟 نجم مضيء',
                    desc: 'أثرت في حياة مئات الأشخاص بطريقة إيجابية!',
                    color: 'from-amber-500 to-yellow-500',
                  },
                ].map((comparison, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + i * 0.1 }}
                    className={`glass p-6 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${comparison.color} bg-opacity-5 hover:bg-opacity-10 transition-all`}
                  >
                    <h3 className="text-2xl font-bold mb-3">
                      {comparison.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comparison.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Future Predictions - توقعات المستقبل */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mb-12"
            >
              <Card className="glass border-2 border-secondary/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                    <span className="text-3xl not-prose">🔮</span>
                    <span>نظرة على مستقبلك المشرق</span>
                    <Star className="w-8 h-8 text-cyan-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        age: 'في الـ 30',
                        title: '🚀 ذروة الطاقة والإبداع',
                        desc: 'ستكون في أوج قوتك وإبداعك، مستعد لتحقيق أحلامك الكبرى!',
                      },
                      {
                        age: 'في الـ 40',
                        title: '🎯 الحكمة والخبرة',
                        desc: 'ستمتلك حكمة السنين وخبرة الحياة، قائد ملهم للآخرين!',
                      },
                      {
                        age: 'في الـ 50',
                        title: '👑 النضج والإنجاز',
                        desc: 'ستحصد ثمار جهودك، وتستمتع بإنجازاتك العظيمة!',
                      },
                      {
                        age: 'في الـ 60+',
                        title: '✨ السعادة والسلام',
                        desc: 'ستعيش أجمل أيامك محاطاً بالحب والتقدير من الجميع!',
                      },
                    ].map((prediction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.9 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {prediction.age}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2">
                            {prediction.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {prediction.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Special Talents - مواهبك الخاصة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl not-prose">🎨</span>
                <span className="gradient-text">مواهبك وقدراتك الفريدة</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🎭',
                    title: 'التواصل الاجتماعي',
                    desc: 'قدرة رائعة على بناء العلاقات',
                  },
                  {
                    icon: '🧩',
                    title: 'حل المشكلات',
                    desc: 'عقل تحليلي يجد الحلول الإبداعية',
                  },
                  {
                    icon: '🎨',
                    title: 'الإبداع والفن',
                    desc: 'خيال واسع وذوق فني رفيع',
                  },
                  {
                    icon: '📊',
                    title: 'التخطيط والتنظيم',
                    desc: 'مهارة في إدارة الوقت والموارد',
                  },
                  {
                    icon: '💡',
                    title: 'الابتكار',
                    desc: 'أفكار جديدة ورؤية مستقبلية',
                  },
                  {
                    icon: '🤝',
                    title: 'القيادة',
                    desc: 'قدرة على إلهام وتحفيز الآخرين',
                  },
                ].map((talent, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 2.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="glass p-6 rounded-2xl border-2 border-white/20 text-center hover:border-primary/50 transition-all"
                  >
                    <div className="text-6xl mb-4">{talent.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{talent.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {talent.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Motivational Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-3xl border-2 border-primary/30 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🌟</span>
            <span className="gradient-text">أنت رائع كما أنت</span>
            <span className="text-4xl not-prose">🌟</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            كل يوم عشته هو إنجاز، كل تحدٍ تغلبت عليه هو نصر، وكل لحظة سعادة هي
            كنز. استمر في رحلتك المذهلة! 💫
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              '💪 قوي',
              '🧠 ذكي',
              '❤️ محبوب',
              '⭐ مميز',
              '🚀 طموح',
              '✨ ملهم',
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-bold shadow-lg"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Did You Know Section - هل تعلم */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">💡</span>
            <span className="gradient-text">هل تعلم؟ حقائق مذهلة عنك!</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              '🧠 عقلك يحتوي على 86 مليار خلية عصبية!',
              '💪 عضلاتك تقوى كل يوم مع كل حركة تقوم بها',
              '🌟 أنت فريد من نوعك - لا يوجد شخص مثلك في العالم',
              '❤️ قلبك ضخ ملايين اللترات من الدم حتى الآن',
              '👁️ عيناك ترى ملايين الألوان والتفاصيل',
              '🎯 حققت آلاف الأهداف الصغيرة والكبيرة',
              '🌈 كل يوم تتعلم شيئاً جديداً يثري حياتك',
              '💫 أثرت إيجابياً في حياة العشرات من الناس',
              '🚀 لديك إمكانيات لا محدودة للنمو والتطور',
            ].map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="glass p-6 rounded-2xl border-2 border-white/20 hover:border-primary/50 transition-all text-center"
              >
                <p className="text-lg font-medium">{fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Life Advice - نصائح الحياة */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🌟</span>
            <span className="gradient-text">نصائح ذهبية لحياة أفضل</span>
          </h2>

          <div className="space-y-6">
            {[
              {
                emoji: '🌅',
                title: 'ابدأ كل يوم بامتنان',
                desc: 'اشكر على النعم الصغيرة قبل الكبيرة، فالامتنان يجلب السعادة',
              },
              {
                emoji: '💪',
                title: 'استثمر في صحتك',
                desc: 'جسمك هو بيتك الوحيد، اعتني به بالرياضة والغذاء الصحي',
              },
              {
                emoji: '📚',
                title: 'لا تتوقف عن التعلم',
                desc: 'كل يوم فرصة لاكتساب معرفة جديدة تثري حياتك',
              },
              {
                emoji: '❤️',
                title: 'اهتم بعلاقاتك',
                desc: 'العلاقات القوية هي كنز الحياة الحقيقي',
              },
              {
                emoji: '🎯',
                title: 'حدد أهدافك',
                desc: 'الأهداف الواضحة تعطي حياتك معنى واتجاه',
              },
              {
                emoji: '😊',
                title: 'ابتسم أكثر',
                desc: 'الابتسامة تحسن مزاجك وتنشر السعادة حولك',
              },
            ].map((advice, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl border-2 border-white/20 flex items-start gap-4 hover:border-primary/50 transition-all"
              >
                <div className="text-5xl flex-shrink-0">{advice.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{advice.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {advice.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Your Cosmic Connection - اتصالك الكوني */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🌌</span>
            <span className="gradient-text">اتصالك بالكون والطبيعة</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🌙',
                title: 'دورات القمر',
                desc: 'شهدت أكثر من 300 دورة قمرية كاملة',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: '🌍',
                title: 'دوران الأرض',
                desc: 'سافرت مع الأرض ملايين الكيلومترات في الفضاء',
                color: 'from-blue-500 to-green-500',
              },
              {
                icon: '⭐',
                title: 'ضوء النجوم',
                desc: 'رأيت ضوء نجوم سافر ملايين السنين ليصلك',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: '🌊',
                title: 'المد والجزر',
                desc: 'شاهدت آلاف دورات المد والجزر الطبيعية',
                color: 'from-cyan-500 to-blue-500',
              },
            ].map((cosmic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 3 }}
                className={`glass p-6 rounded-2xl bg-gradient-to-br ${cosmic.color} bg-opacity-10 border-2 border-white/20 text-center`}
              >
                <div className="text-5xl mb-4">{cosmic.icon}</div>
                <h3 className="text-xl font-bold mb-2">{cosmic.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cosmic.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Your Impact on Others - تأثيرك على الآخرين */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">💝</span>
            <span className="gradient-text">تأثيرك الإيجابي على العالم</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'العائلة والأصدقاء',
                stats: ['أكثر من 50 شخص', 'تأثير مباشر', 'ذكريات جميلة'],
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: '🌍',
                title: 'المجتمع',
                stats: ['مئات الأشخاص', 'تأثير غير مباشر', 'أعمال خيرية'],
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: '🔮',
                title: 'الأجيال القادمة',
                stats: ['تأثير دائم', 'إرث إيجابي', 'قدوة حسنة'],
                color: 'from-purple-500 to-indigo-500',
              },
            ].map((impact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`glass p-8 rounded-2xl border-2 border-white/20 text-center bg-gradient-to-br ${impact.color} bg-opacity-5`}
              >
                <div className="text-6xl mb-4">{impact.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{impact.title}</h3>
                <div className="space-y-2">
                  {impact.stats.map((stat, j) => (
                    <div
                      key={j}
                      className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium"
                    >
                      {stat}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Life Seasons - فصول حياتك */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🌸</span>
            <span className="gradient-text">فصول حياتك الأربعة</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                season: 'ربيع الطفولة',
                icon: '🌱',
                age: '0-12 سنة',
                desc: 'البراءة والاكتشاف والنمو السريع',
                color: 'from-green-400 to-emerald-500',
                memories: ['أول كلمة', 'أول خطوة', 'أول يوم مدرسة'],
              },
              {
                season: 'صيف الشباب',
                icon: '☀️',
                age: '13-25 سنة',
                desc: 'الطاقة والأحلام والمغامرات',
                color: 'from-yellow-400 to-orange-500',
                memories: ['الصداقات', 'التعليم', 'الأحلام الكبيرة'],
              },
              {
                season: 'خريف النضج',
                icon: '🍂',
                age: '26-50 سنة',
                desc: 'الإنجازات والمسؤوليات والحكمة',
                color: 'from-orange-500 to-red-500',
                memories: ['المهنة', 'العائلة', 'الإنجازات'],
              },
              {
                season: 'شتاء الحكمة',
                icon: '❄️',
                age: '50+ سنة',
                desc: 'السلام والتأمل ونقل الخبرات',
                color: 'from-blue-400 to-indigo-500',
                memories: ['الحكمة', 'الإرث', 'السلام الداخلي'],
              },
            ].map((season, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`glass p-6 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${season.color} bg-opacity-10`}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{season.icon}</div>
                  <h3 className="text-xl font-bold">{season.season}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {season.age}
                  </p>
                </div>
                <p className="text-sm mb-4 text-center">{season.desc}</p>
                <div className="space-y-1">
                  {season.memories.map((memory, j) => (
                    <div
                      key={j}
                      className="text-xs bg-white/20 rounded px-2 py-1 text-center"
                    >
                      {memory}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Your Superpowers - قواك الخارقة */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🦸‍♂️</span>
            <span className="gradient-text">قواك الخارقة الحقيقية</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                power: 'قوة الشفاء الذاتي',
                icon: '🩹',
                desc: 'جسمك يشفي نفسه من الجروح والأمراض تلقائياً',
                level: '95%',
              },
              {
                power: 'قوة التكيف',
                icon: '🔄',
                desc: 'تتكيف مع أي بيئة أو ظرف جديد بمرونة عالية',
                level: '88%',
              },
              {
                power: 'قوة التعلم',
                icon: '🧠',
                desc: 'تمتص المعلومات وتطور مهارات جديدة باستمرار',
                level: '92%',
              },
              {
                power: 'قوة التأثير',
                icon: '✨',
                desc: 'تؤثر إيجابياً في حياة الآخرين بمجرد وجودك',
                level: '85%',
              },
              {
                power: 'قوة الصمود',
                icon: '💪',
                desc: 'تتغلب على التحديات وتخرج أقوى من كل تجربة',
                level: '90%',
              },
              {
                power: 'قوة الحب',
                icon: '❤️',
                desc: 'تنشر الحب والإيجابية أينما ذهبت',
                level: '97%',
              },
            ].map((power, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-6 rounded-2xl border-2 border-white/20 hover:border-primary/50 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{power.icon}</div>
                  <h3 className="text-lg font-bold">{power.power}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  {power.desc}
                </p>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: power.level }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    />
                  </div>
                  <div className="text-center mt-2 text-sm font-bold text-primary">
                    {power.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Age-Specific Insights - رؤى خاصة بعمرك */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🎯</span>
            <span className="gradient-text">رؤى مخصصة لمرحلتك العمرية</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* للأطفال والمراهقين (5-17) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-2xl border-2 border-green-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🌱</div>
                <h3 className="text-xl font-bold text-green-600">
                  مرحلة النمو
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  5-17 سنة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🧠 دماغك ينمو بسرعة مذهلة
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    📚 تتعلم أسرع من أي وقت آخر
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🎮 اللعب يطور مهاراتك</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    👥 تكوّن صداقات مدى الحياة
                  </p>
                </div>
              </div>
            </motion.div>

            {/* للشباب (18-30) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-2xl border-2 border-orange-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🚀</div>
                <h3 className="text-xl font-bold text-orange-600">
                  مرحلة الانطلاق
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  18-30 سنة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">💪 في ذروة قوتك البدنية</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🎯 تحدد مسار حياتك المهنية
                  </p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    ❤️ تبني علاقات عاطفية عميقة
                  </p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🌍 تستكشف العالم والثقافات
                  </p>
                </div>
              </div>
            </motion.div>

            {/* للبالغين (31-50) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-2xl border-2 border-blue-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">👑</div>
                <h3 className="text-xl font-bold text-blue-600">
                  مرحلة الإنجاز
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  31-50 سنة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🏆 تحقق أهدافك الكبرى</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">👨‍👩‍👧‍👦 تبني عائلة مستقرة</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">💼 تصل لمناصب قيادية</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🧠 تمتلك خبرة وحكمة عميقة
                  </p>
                </div>
              </div>
            </motion.div>

            {/* لكبار السن (51+) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-2xl border-2 border-purple-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🌟</div>
                <h3 className="text-xl font-bold text-purple-600">
                  مرحلة الحكمة
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  51+ سنة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🎓 تنقل خبراتك للأجيال</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🕊️ تستمتع بالسلام الداخلي
                  </p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    👴👵 تصبح مرجعاً للعائلة
                  </p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">📖 تكتب قصة حياة ملهمة</p>
                </div>
              </div>
            </motion.div>

            {/* للنساء - خصائص فريدة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-2xl border-2 border-pink-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">👸</div>
                <h3 className="text-xl font-bold text-pink-600">
                  القوة الأنثوية
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  خصائص مميزة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-pink-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">💝 ذكاء عاطفي استثنائي</p>
                </div>
                <div className="bg-pink-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🤱 قدرة فريدة على الرعاية
                  </p>
                </div>
                <div className="bg-pink-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🎨 إبداع وحس فني راقي</p>
                </div>
                <div className="bg-pink-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🌸 قوة داخلية لا تُقهر</p>
                </div>
              </div>
            </motion.div>

            {/* للرجال - خصائص فريدة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-2xl border-2 border-cyan-500/30"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🤴</div>
                <h3 className="text-xl font-bold text-cyan-600">
                  القوة الذكورية
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  خصائص مميزة
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🎯 تركيز وتصميم قوي</p>
                </div>
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    🛡️ غريزة الحماية والدفاع
                  </p>
                </div>
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">🔧 مهارة في حل المشاكل</p>
                </div>
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">⚡ طاقة وحيوية عالية</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Health & Wellness by Age - الصحة والعافية حسب العمر */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🏥</span>
            <span className="gradient-text">دليل الصحة المخصص لعمرك</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-emerald-600 mb-4">
                💪 نصائح صحية لعمرك
              </h3>
              <div className="space-y-4">
                <div className="glass p-4 rounded-xl border-l-4 border-green-500">
                  <h4 className="font-bold text-green-600 mb-2">
                    🥗 التغذية المثلى
                  </h4>
                  <p className="text-sm">
                    في عمرك، جسمك يحتاج لبروتينات عالية الجودة وفيتامينات متنوعة
                  </p>
                </div>
                <div className="glass p-4 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-600 mb-2">
                    🏃‍♂️ النشاط البدني
                  </h4>
                  <p className="text-sm">
                    30 دقيقة يومياً من التمارين تحافظ على لياقتك وصحة قلبك
                  </p>
                </div>
                <div className="glass p-4 rounded-xl border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-600 mb-2">
                    😴 النوم الصحي
                  </h4>
                  <p className="text-sm">
                    7-8 ساعات نوم يومياً ضرورية لتجديد خلايا جسمك وعقلك
                  </p>
                </div>
                <div className="glass p-4 rounded-xl border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-600 mb-2">
                    🧘‍♀️ الصحة النفسية
                  </h4>
                  <p className="text-sm">
                    التأمل والاسترخاء يقللان التوتر ويحسنان جودة حياتك
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-teal-600 mb-4">
                📊 مؤشراتك الصحية
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'مستوى الطاقة', value: 85, color: 'bg-yellow-500' },
                  { label: 'صحة القلب', value: 92, color: 'bg-red-500' },
                  { label: 'قوة العضلات', value: 78, color: 'bg-blue-500' },
                  { label: 'المرونة', value: 70, color: 'bg-green-500' },
                  { label: 'الذاكرة', value: 88, color: 'bg-purple-500' },
                ].map((metric, i) => (
                  <div key={i} className="glass p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{metric.label}</span>
                      <span className="font-bold">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={`${metric.color} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Career & Life Goals by Age - المهنة والأهداف حسب العمر */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🎯</span>
            <span className="gradient-text">خارطة طريق النجاح لعمرك</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <div className="space-y-12">
                {[
                  {
                    age: '20-25',
                    title: 'بناء الأساس',
                    icon: '🎓',
                    goals: [
                      'إنهاء التعليم',
                      'اكتساب خبرة عملية',
                      'بناء شبكة علاقات',
                      'تطوير المهارات',
                    ],
                    side: 'right',
                  },
                  {
                    age: '26-35',
                    title: 'التطوير والنمو',
                    icon: '🚀',
                    goals: [
                      'التقدم المهني',
                      'زيادة الدخل',
                      'بناء عائلة',
                      'شراء منزل',
                    ],
                    side: 'left',
                  },
                  {
                    age: '36-45',
                    title: 'الاستقرار والقيادة',
                    icon: '👑',
                    goals: [
                      'مناصب قيادية',
                      'استثمارات ذكية',
                      'تربية الأطفال',
                      'تحقيق الأحلام',
                    ],
                    side: 'right',
                  },
                  {
                    age: '46-60',
                    title: 'الحكمة والإرشاد',
                    icon: '🌟',
                    goals: [
                      'نقل الخبرات',
                      'التخطيط للتقاعد',
                      'السفر والاستمتاع',
                      'العطاء المجتمعي',
                    ],
                    side: 'left',
                  },
                ].map((stage, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: stage.side === 'right' ? 50 : -50,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className={`flex items-center ${
                      stage.side === 'left' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        stage.side === 'left' ? 'pr-8' : 'pl-8'
                      }`}
                    >
                      <div className="glass p-6 rounded-2xl border-2 border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">{stage.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold">{stage.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {stage.age} سنة
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {stage.goals.map((goal, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span className="text-sm">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Timeline Dot */}
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Relationship Insights by Age - رؤى العلاقات حسب العمر */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-rose-500/5 to-pink-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">💕</span>
            <span className="gradient-text">دليل العلاقات لمرحلتك العمرية</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'العلاقات العائلية',
                icon: '👨‍👩‍👧‍👦',
                insights: [
                  'تقدر أهمية الوقت مع العائلة أكثر',
                  'تصبح مصدر دعم للأجيال الأصغر',
                  'تفهم تضحيات والديك بشكل أعمق',
                  'تبني ذكريات جميلة مع أطفالك',
                ],
                color: 'from-blue-500 to-indigo-500',
              },
              {
                title: 'الصداقات',
                icon: '👥',
                insights: [
                  'تختار الأصدقاء بعناية أكبر',
                  'تقدر الجودة على الكمية',
                  'تحافظ على صداقات عمر طويلة',
                  'تكوّن صداقات مبنية على القيم المشتركة',
                ],
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'العلاقات العاطفية',
                icon: '💑',
                insights: [
                  'تبحث عن الاستقرار والأمان',
                  'تقدر التفاهم والاحترام المتبادل',
                  'تركز على بناء مستقبل مشترك',
                  'تتعلم من تجاربك السابقة',
                ],
                color: 'from-pink-500 to-rose-500',
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-6 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${category.color} bg-opacity-5`}
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="space-y-3">
                  {category.insights.map((insight, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-white/10 rounded-lg"
                    >
                      <span className="text-yellow-500 mt-0.5">✨</span>
                      <span className="text-sm">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Time Travel Imagination - رحلة عبر الزمن */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">⏰</span>
            <span className="gradient-text">لو سافرت عبر الزمن...</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl border-2 border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                🔙 رسالة للماضي
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "لا تقلق كثيراً، كل شيء سيكون بخير"
                  </p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "استمتع باللحظات الصغيرة، فهي الأهم"
                  </p>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "ثق بنفسك أكثر، أنت أقوى مما تعتقد"
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl border-2 border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                🔮 رسالة من المستقبل
              </h3>
              <div className="space-y-4">
                <div className="bg-yellow-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "أنت فخور بكل ما حققته حتى الآن"
                  </p>
                </div>
                <div className="bg-pink-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "الأفضل لم يأت بعد، استمر في المحاولة"
                  </p>
                </div>
                <div className="bg-cyan-500/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    "كل خطوة تخطوها الآن تقودك للنجاح"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Life Challenges & Solutions by Age - تحديات ونصائح حسب العمر */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🎭</span>
            <span className="gradient-text">
              تحديات عمرك وكيفية التغلب عليها
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                ageGroup: 'الشباب (18-30)',
                icon: '🌟',
                challenges: [
                  {
                    challenge: 'اختيار المسار المهني',
                    solution: 'جرب مجالات مختلفة واكتشف شغفك',
                  },
                  {
                    challenge: 'إدارة الأموال',
                    solution: 'ضع ميزانية واستثمر في تعليمك',
                  },
                  {
                    challenge: 'بناء العلاقات',
                    solution: 'كن صادقاً وأظهر اهتماماً حقيقياً بالآخرين',
                  },
                  {
                    challenge: 'ضغط المجتمع',
                    solution: 'ثق بقراراتك ولا تقارن نفسك بالآخرين',
                  },
                ],
                color: 'from-orange-500 to-red-500',
              },
              {
                ageGroup: 'البالغون (31-50)',
                icon: '⚖️',
                challenges: [
                  {
                    challenge: 'التوازن بين العمل والحياة',
                    solution: 'حدد أولوياتك وتعلم قول "لا"',
                  },
                  {
                    challenge: 'تربية الأطفال',
                    solution: 'كن قدوة واستمع لأطفالك بصبر',
                  },
                  {
                    challenge: 'الضغوط المالية',
                    solution: 'خطط للمستقبل وادخر بانتظام',
                  },
                  {
                    challenge: 'أزمة منتصف العمر',
                    solution: 'اكتشف هوايات جديدة وحدد أهداف جديدة',
                  },
                ],
                color: 'from-blue-500 to-purple-500',
              },
              {
                ageGroup: 'كبار السن (51+)',
                icon: '🌅',
                challenges: [
                  {
                    challenge: 'التقاعد والفراغ',
                    solution: 'ابحث عن أنشطة تطوعية ومفيدة',
                  },
                  {
                    challenge: 'الصحة والشيخوخة',
                    solution: 'حافظ على نشاطك البدني والذهني',
                  },
                  {
                    challenge: 'الوحدة',
                    solution: 'ابق على تواصل مع الأصدقاء والعائلة',
                  },
                  {
                    challenge: 'التكيف مع التكنولوجيا',
                    solution: 'تعلم بصبر واطلب المساعدة',
                  },
                ],
                color: 'from-green-500 to-teal-500',
              },
              {
                ageGroup: 'المراهقون (13-17)',
                icon: '🎯',
                challenges: [
                  {
                    challenge: 'الهوية والانتماء',
                    solution: 'اكتشف نفسك وكن فخوراً بشخصيتك',
                  },
                  {
                    challenge: 'ضغط الأقران',
                    solution: 'اختر أصدقاء يدعمونك ويحترمونك',
                  },
                  {
                    challenge: 'القلق من المستقبل',
                    solution: 'ركز على الحاضر وخطط خطوة بخطوة',
                  },
                  {
                    challenge: 'التغيرات الجسدية',
                    solution: 'تقبل التغيير كجزء طبيعي من النمو',
                  },
                ],
                color: 'from-pink-500 to-purple-500',
              },
            ].map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-6 rounded-2xl border-2 bg-gradient-to-br ${
                  group.color
                } bg-opacity-10 hover:bg-opacity-15 transition-all ${
                  group.color.includes('orange') || group.color.includes('red')
                    ? 'border-orange-300/30 hover:border-orange-400/50'
                    : group.color.includes('blue') ||
                      group.color.includes('purple')
                    ? 'border-blue-300/30 hover:border-blue-400/50'
                    : group.color.includes('green') ||
                      group.color.includes('teal')
                    ? 'border-teal-300/30 hover:border-teal-400/50'
                    : 'border-pink-300/30 hover:border-pink-400/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{group.icon}</span>
                  <h3
                    className={`text-xl font-bold ${
                      group.color.includes('orange') ||
                      group.color.includes('red')
                        ? 'text-gray-800 dark:text-white'
                        : group.color.includes('blue') ||
                          group.color.includes('purple')
                        ? 'text-gray-800 dark:text-white'
                        : group.color.includes('green') ||
                          group.color.includes('teal')
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-800 dark:text-white'
                    }`}
                  >
                    {group.ageGroup}
                  </h3>
                </div>
                <div className="space-y-4">
                  {group.challenges.map((item, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30"
                    >
                      <h4 className="font-bold mb-2 text-gray-900 dark:text-gray-50">
                        ⚠️ {item.challenge}
                      </h4>
                      <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                        💡 {item.solution}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Personality Traits by Birth Month - صفات الشخصية حسب شهر الميلاد */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🌙</span>
            <span className="gradient-text">صفات شخصيتك حسب شهر ميلادك</span>
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                month: 'يناير',
                traits: ['قيادي', 'طموح', 'منظم'],
                color: 'from-blue-500 to-cyan-500',
                emoji: '❄️',
              },
              {
                month: 'فبراير',
                traits: ['مبدع', 'مستقل', 'مفكر'],
                color: 'from-purple-500 to-pink-500',
                emoji: '💜',
              },
              {
                month: 'مارس',
                traits: ['شجاع', 'نشيط', 'مغامر'],
                color: 'from-green-500 to-emerald-500',
                emoji: '🌱',
              },
              {
                month: 'أبريل',
                traits: ['متفائل', 'اجتماعي', 'مرح'],
                color: 'from-yellow-500 to-orange-500',
                emoji: '🌸',
              },
              {
                month: 'مايو',
                traits: ['صبور', 'عملي', 'موثوق'],
                color: 'from-green-600 to-teal-500',
                emoji: '🌺',
              },
              {
                month: 'يونيو',
                traits: ['ذكي', 'فضولي', 'متكيف'],
                color: 'from-cyan-500 to-blue-500',
                emoji: '☀️',
              },
              {
                month: 'يوليو',
                traits: ['عاطفي', 'حنون', 'حدسي'],
                color: 'from-red-500 to-pink-500',
                emoji: '🦀',
              },
              {
                month: 'أغسطس',
                traits: ['واثق', 'كريم', 'مؤثر'],
                color: 'from-orange-500 to-red-500',
                emoji: '🦁',
              },
              {
                month: 'سبتمبر',
                traits: ['دقيق', 'مساعد', 'تحليلي'],
                color: 'from-green-500 to-yellow-500',
                emoji: '🍂',
              },
              {
                month: 'أكتوبر',
                traits: ['متوازن', 'دبلوماسي', 'جميل'],
                color: 'from-pink-500 to-purple-500',
                emoji: '⚖️',
              },
              {
                month: 'نوفمبر',
                traits: ['عميق', 'قوي', 'غامض'],
                color: 'from-purple-500 to-indigo-500',
                emoji: '🦂',
              },
              {
                month: 'ديسمبر',
                traits: ['مغامر', 'فلسفي', 'حر'],
                color: 'from-blue-500 to-purple-500',
                emoji: '🏹',
              },
            ].map((monthData, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`glass p-4 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${monthData.color} bg-opacity-10 text-center`}
              >
                <div className="text-4xl mb-2">{monthData.emoji}</div>
                <h3 className="text-lg font-bold mb-3">{monthData.month}</h3>
                <div className="space-y-1">
                  {monthData.traits.map((trait, j) => (
                    <div
                      key={j}
                      className="text-xs bg-white/20 rounded-full px-2 py-1"
                    >
                      {trait}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Life Achievements Tracker - متتبع إنجازات الحياة */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🏆</span>
            <span className="gradient-text">إنجازاتك المذهلة عبر السنين</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                category: 'التعلم والنمو',
                icon: '📚',
                achievements: [
                  'تعلمت المشي والكلام',
                  'أنهيت المراحل الدراسية',
                  'اكتسبت مهارات جديدة',
                  'طورت مواهبك الخاصة',
                ],
                color: 'from-blue-500 to-indigo-500',
              },
              {
                category: 'العلاقات الاجتماعية',
                icon: '👥',
                achievements: [
                  'كونت صداقات مميزة',
                  'بنيت علاقات عائلية قوية',
                  'ساعدت أشخاص آخرين',
                  'أثرت إيجابياً في حياة الآخرين',
                ],
                color: 'from-green-500 to-emerald-500',
              },
              {
                category: 'التحديات والصمود',
                icon: '💪',
                achievements: [
                  'تغلبت على مخاوفك',
                  'واجهت صعوبات وتجاوزتها',
                  'تعلمت من أخطائك',
                  'أصبحت أقوى وأكثر حكمة',
                ],
                color: 'from-red-500 to-pink-500',
              },
              {
                category: 'الإبداع والمساهمة',
                icon: '🎨',
                achievements: [
                  'عبرت عن إبداعك بطرق مختلفة',
                  'ساهمت في مجتمعك',
                  'شاركت معرفتك مع الآخرين',
                  'تركت بصمة إيجابية',
                ],
                color: 'from-purple-500 to-pink-500',
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-6 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${category.color} bg-opacity-5`}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{category.icon}</div>
                  <h3 className="text-lg font-bold">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.achievements.map((achievement, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                    >
                      <span className="text-green-500 text-sm">✅</span>
                      <span className="text-xs">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Future Potential & Dreams - إمكانياتك المستقبلية */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">🚀</span>
            <span className="gradient-text">إمكانياتك اللامحدودة للمستقبل</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                area: 'التطوير المهني',
                icon: '💼',
                potentials: [
                  'قيادة فرق عمل كبيرة',
                  'إطلاق مشروعك الخاص',
                  'أن تصبح خبيراً في مجالك',
                  'التأثير في صناعتك',
                ],
                color: 'from-blue-500 to-indigo-500',
              },
              {
                area: 'النمو الشخصي',
                icon: '🌟',
                potentials: [
                  'اكتساب مهارات جديدة',
                  'السفر واستكشاف العالم',
                  'تعلم لغات جديدة',
                  'تطوير هوايات مثيرة',
                ],
                color: 'from-purple-500 to-pink-500',
              },
              {
                area: 'التأثير الاجتماعي',
                icon: '🌍',
                potentials: [
                  'مساعدة المجتمع',
                  'إلهام الأجيال القادمة',
                  'حل مشاكل مهمة',
                  'ترك إرث إيجابي',
                ],
                color: 'from-green-500 to-emerald-500',
              },
              {
                area: 'الصحة والعافية',
                icon: '💚',
                potentials: [
                  'تحقيق لياقة بدنية مثالية',
                  'الحفاظ على صحة نفسية ممتازة',
                  'العيش حياة متوازنة',
                  'أن تكون مثالاً للآخرين',
                ],
                color: 'from-teal-500 to-green-500',
              },
              {
                area: 'الإبداع والفن',
                icon: '🎨',
                potentials: [
                  'إنتاج أعمال فنية مميزة',
                  'الكتابة والتأليف',
                  'الابتكار في مجالك',
                  'التعبير عن نفسك بطرق جديدة',
                ],
                color: 'from-orange-500 to-red-500',
              },
              {
                area: 'العلاقات والحب',
                icon: '❤️',
                potentials: [
                  'بناء علاقات عميقة ومعنوية',
                  'أن تكون مصدر دعم للآخرين',
                  'تربية جيل واعٍ ومتميز',
                  'نشر الحب والإيجابية',
                ],
                color: 'from-pink-500 to-rose-500',
              },
            ].map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass p-6 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${area.color} bg-opacity-10`}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{area.icon}</div>
                  <h3 className="text-xl font-bold">{area.area}</h3>
                </div>
                <div className="space-y-3">
                  {area.potentials.map((potential, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                    >
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm">{potential}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Share Your Results - شارك نتائجك */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-3xl border-2 border-primary/30 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="text-4xl not-prose">📱</span>
            <span className="gradient-text">شارك نتائجك المذهلة</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            اكتشف أصدقاؤك وعائلتك معلومات مثيرة عن أعمارهم أيضاً!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                name: 'واتساب',
                icon: '💬',
                color: 'from-green-500 to-emerald-500',
              },
              { name: 'تويتر', icon: '🐦', color: 'from-blue-500 to-cyan-500' },
              {
                name: 'فيسبوك',
                icon: '👥',
                color: 'from-blue-600 to-indigo-600',
              },
              {
                name: 'نسخ الرابط',
                icon: '🔗',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((social, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 bg-gradient-to-r ${social.color} text-white rounded-full font-bold shadow-lg flex items-center gap-2`}
              >
                <span className="text-xl">{social.icon}</span>
                <span>{social.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      <FooterAd className="my-8" />
    </div>
  );
}
