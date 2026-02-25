'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoveCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const calculateLove = () => {
    if (!name1.trim() || !name2.trim()) {
      setError('الرجاء إدخال الاسمين');
      return;
    }
    setError('');
    setIsCalculating(true);
    setResult(null);

    // Simulate calculation time for effect
    setTimeout(() => {
      // Deterministic algorithm based on names
      const combinedNames = (name1 + name2).toLowerCase().replace(/\s/g, '');
      let sum = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        sum += combinedNames.charCodeAt(i);
      }
      
      // Add some randomness based on the day to keep it interesting but consistent for the day
      const today = new Date().getDate();
      const calculatedPercentage = (sum * today) % 101;
      
      // Ensure it's between 0 and 100, but bias towards higher numbers for fun
      const finalPercentage = calculatedPercentage < 40 ? calculatedPercentage + 30 : calculatedPercentage;
      
      setResult(finalPercentage > 100 ? 100 : finalPercentage);
      setIsCalculating(false);
    }, 1500);
  };

  const getMessage = (percentage: number) => {
    if (percentage >= 90) return 'علاقة مثالية! أنتما خلقما لبعضكما البعض ❤️';
    if (percentage >= 80) return 'توافق رائع! علاقة قوية ومليئة بالحب 💕';
    if (percentage >= 70) return 'نسبة جيدة جداً! هناك انسجام كبير بينكما 💖';
    if (percentage >= 60) return 'توافق جيد! مع بعض الجهد ستكون علاقة ممتازة 💗';
    if (percentage >= 50) return 'بداية موفقة! الحب يحتاج للاهتمام لينمو 💓';
    return 'الحب يصنع المعجزات! لا تعتمد على الأرقام فقط 😉';
  };

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-4 animate-pulse">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          حاسبة الحب
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          أدخل اسمك واسم شريكك لاكتشاف نسبة الحب والتوافق بينكما
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-900/20">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الأول
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="مثال: أحمد"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center text-lg"
            />
          </div>

          <div className="flex items-center justify-center md:pt-6">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500 font-bold text-xl">
              +
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الثاني
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="مثال: سارة"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center text-lg"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!result && !isCalculating && (
          <Button
            onClick={calculateLove}
            className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <Heart className="w-6 h-6 mr-2 fill-white" />
            احسب نسبة الحب
          </Button>
        )}

        {isCalculating && (
          <div className="text-center py-8 space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
              <Heart className="absolute inset-0 m-auto w-8 h-8 text-red-500 animate-pulse fill-red-500" />
            </div>
            <p className="text-lg font-medium text-gray-600 animate-pulse">
              جاري تحليل مشاعر القلوب...
            </p>
          </div>
        )}

        {result !== null && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Circular Progress Background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - result / 100)}
                  className="text-red-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-gray-800 dark:text-white">
                  {result}%
                </span>
                <Heart className="w-8 h-8 text-red-500 fill-red-500 mt-2 animate-bounce" />
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                {getMessage(result)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {name1} + {name2}
              </p>
            </div>

            <Button
              onClick={reset}
              variant="outline"
              className="mt-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              حساب جديد
            </Button>
          </motion.div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              كيف تعمل الحاسبة؟
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              تستخدم هذه الأداة خوارزمية رقمية تعتمد على حروف الأسماء لتقدير نسبة التوافق. تذكر دائماً أن الحب الحقيقي لا يقاس بالأرقام، بل بالاهتمام والتفاهم والاحترام المتبادل! ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
