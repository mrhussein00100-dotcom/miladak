"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, TrendingUp, Award, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "حساب فوري ودقيق",
    description: "احصل على نتائج دقيقة بالثانية في لحظات",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "خصوصية كاملة",
    description: "بياناتك آمنة ولا نحفظ أي معلومات شخصية",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Smartphone,
    title: "متوافق مع جميع الأجهزة",
    description: "يعمل بكفاءة على الهاتف والتابلت والكمبيوتر",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "إحصاءات مذهلة",
    description: "اكتشف أكثر من 50 إحصائية ممتعة عن حياتك",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "تصميم احترافي",
    description: "واجهة حديثة وجذابة مع تأثيرات متحركة",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "باللغة العربية",
    description: "محتوى عربي فصيح مع دعم كامل للغة",
    color: "from-indigo-500 to-purple-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text leading-normal pb-2 mb-4">
            لماذا تختار منصتنا؟
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            نقدم لك تجربة فريدة لحساب عمرك بطريقة ممتعة وذكية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 mx-auto`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
