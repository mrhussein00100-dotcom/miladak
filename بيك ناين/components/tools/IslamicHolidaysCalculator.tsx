"use client";

import { motion } from "framer-motion";
import { Moon, Star, Calendar } from "lucide-react";

const islamicHolidays = [
  { name: "رأس السنة الهجرية", hijriDate: "1 محرم", emoji: "🌙", description: "بداية العام الهجري الجديد" },
  { name: "عاشوراء", hijriDate: "10 محرم", emoji: "📿", description: "يوم صيام مستحب" },
  { name: "المولد النبوي", hijriDate: "12 ربيع الأول", emoji: "🕌", description: "ذكرى مولد النبي محمد ﷺ" },
  { name: "الإسراء والمعراج", hijriDate: "27 رجب", emoji: "✨", description: "ذكرى رحلة الإسراء والمعراج" },
  { name: "ليلة النصف من شعبان", hijriDate: "15 شعبان", emoji: "🌕", description: "ليلة مباركة" },
  { name: "بداية رمضان", hijriDate: "1 رمضان", emoji: "🌙", description: "بداية شهر الصيام المبارك" },
  { name: "ليلة القدر", hijriDate: "27 رمضان", emoji: "⭐", description: "خير من ألف شهر" },
  { name: "عيد الفطر", hijriDate: "1 شوال", emoji: "🎉", description: "عيد الفطر المبارك" },
  { name: "يوم عرفة", hijriDate: "9 ذو الحجة", emoji: "🕋", description: "أفضل أيام السنة" },
  { name: "عيد الأضحى", hijriDate: "10 ذو الحجة", emoji: "🐑", description: "عيد الأضحى المبارك" },
];

export default function IslamicHolidaysCalculator() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8 text-center"
      >
        <Moon className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          المناسبات الإسلامية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          تعرف على المناسبات الدينية المهمة في التقويم الهجري
        </p>
      </motion.div>

      <div className="grid gap-4">
        {islamicHolidays.map((holiday, index) => (
          <motion.div
            key={holiday.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{holiday.emoji}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {holiday.name}
                </h3>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{holiday.hijriDate}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {holiday.description}
                </p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass p-6 rounded-2xl mt-8 text-center"
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          ملاحظة: التواريخ الهجرية تعتمد على رؤية الهلال وقد تختلف من بلد لآخر
        </p>
      </motion.div>
    </div>
  );
}
