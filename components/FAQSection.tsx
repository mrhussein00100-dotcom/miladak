"use client";

import { motion } from "framer-motion";
import { Shield, FileText, Share2, Image, Users, Clipboard } from "lucide-react";

const faqs = [
  {
    icon: Shield,
    q: "هل تحفظ المنصة أي بيانات شخصية؟",
    a: "لا. جميع الحسابات تتم محلياً في متصفحك ولا نقوم بحفظ بياناتك.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    q: "هل يمكن حفظ النتائج كملف PDF؟",
    a: "نعم. يمكنك حفظ النتائج كملف PDF أو صورة عالية الجودة.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Share2,
    q: "كيف أشارك بطاقة النتائج؟",
    a: "يمكنك حفظ بطاقة مشاركة كصورة جاهزة ومشاركتها على وسائل التواصل.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Image,
    q: "كيف أحفظ النتائج كصورة؟",
    a: "من أزرار الإجراءات في قسم النتائج اختر \"حفظ الصورة\" لتحميل صورة عالية الجودة.",
    color: "from-sky-500 to-blue-500",
  },
  {
    icon: Users,
    q: "كيف أحسب لصديقي؟",
    a: "انتقل إلى قسم \"احسب لصديقك\" وأدخل الاسم وتاريخ الميلاد.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: Clipboard,
    q: "كيف أنسخ النتائج بسرعة؟",
    a: "من أزرار النتائج اختر \"نسخ\" لنسخ البيانات إلى الحافظة ومشاركتها فوراً.",
    color: "from-indigo-500 to-violet-500",
  },
];

export default function FAQSection() {
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
            <span className="gradient-text">الأسئلة الشائعة</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            أهم الأسئلة السريعة حول الاستخدام والطباعة والمشاركة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass p-6 rounded-2xl text-center relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-3 mx-auto`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {item.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
