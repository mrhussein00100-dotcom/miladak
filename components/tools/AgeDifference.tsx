'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Clock, User } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, intervalToDuration } from 'date-fns';

export default function AgeDifference() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateDifference = () => {
    if (!date1 || !date2) return;

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Calculate difference
    const duration = intervalToDuration({
      start: d1 < d2 ? d1 : d2,
      end: d1 < d2 ? d2 : d1
    });

    const totalDays = Math.abs(differenceInDays(d1, d2));
    const isOlder = d1 < d2 ? (name1 || 'الشخص الأول') : (name2 || 'الشخص الثاني');
    const olderDate = d1 < d2 ? d1 : d2;
    const youngerDate = d1 < d2 ? d2 : d1;

    setResult({
      years: duration.years || 0,
      months: duration.months || 0,
      days: duration.days || 0,
      totalDays,
      older: isOlder,
      younger: d1 < d2 ? (name2 || 'الشخص الثاني') : (name1 || 'الشخص الأول'),
      olderDate,
      youngerDate
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-6 md:p-8 rounded-3xl mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Person 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <User className="w-5 h-5" />
              الشخص الأول
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="مثال: أحمد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Person 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <User className="w-5 h-5" />
              الشخص الثاني
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="مثال: سارة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button
          onClick={calculateDifference}
          disabled={!date1 || !date2}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          احسب الفرق
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Result */}
            <div className="glass p-8 rounded-3xl text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-white/50">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                الفرق بين العمرين هو
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm min-w-[100px]">
                  <span className="block text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                    {result.years}
                  </span>
                  <span className="text-sm text-gray-500">سنة</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm min-w-[100px]">
                  <span className="block text-3xl font-black text-pink-600 dark:text-pink-400 mb-1">
                    {result.months}
                  </span>
                  <span className="text-sm text-gray-500">شهر</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm min-w-[100px]">
                  <span className="block text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                    {result.days}
                  </span>
                  <span className="text-sm text-gray-500">يوم</span>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl inline-block">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-purple-600">{result.older}</span> أكبر من <span className="font-bold text-pink-600">{result.younger}</span>
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">إجمالي الأيام</h4>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {result.totalDays.toLocaleString()} يوم
                  </p>
                </div>
              </div>
              
              <div className="glass p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">إجمالي الساعات (تقريباً)</h4>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {(result.totalDays * 24).toLocaleString()} ساعة
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
