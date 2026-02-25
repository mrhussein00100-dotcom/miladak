"use client";

import { motion } from "framer-motion";
import { Calendar, Calculator, Share2 } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "أدخل تاريخ ميلادك",
    desc: "اختر تاريخ ميلادك بدقة لبدء الحساب",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calculator,
    title: "نحسب كل شيء",
    desc: "نحوّل عمرك إلى سنوات وأشهر وأيام وساعات مع إحصاءات ممتعة",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Share2,
    title: "اطبع وشارك",
    desc: "احفظ النتائج كصورة أو PDF وشاركها مع أصدقائك",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">كيف يعمل؟</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ثلاث خطوات بسيطة لنتائج دقيقة وممتعة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass p-6 rounded-2xl text-center relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4 mx-auto`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
