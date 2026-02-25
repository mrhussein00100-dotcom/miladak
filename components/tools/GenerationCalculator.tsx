"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Sparkles, Star } from "lucide-react";

const generations = [
  { name: "الجيل الصامت", nameEn: "Silent Generation", start: 1928, end: 1945, emoji: "👴", color: "from-gray-500 to-gray-600" },
  { name: "جيل طفرة المواليد", nameEn: "Baby Boomers", start: 1946, end: 1964, emoji: "👨‍👩‍👧‍👦", color: "from-blue-500 to-blue-600" },
  { name: "الجيل X", nameEn: "Generation X", start: 1965, end: 1980, emoji: "🎸", color: "from-green-500 to-green-600" },
  { name: "جيل الألفية", nameEn: "Millennials", start: 1981, end: 1996, emoji: "💻", color: "from-purple-500 to-purple-600" },
  { name: "الجيل Z", nameEn: "Generation Z", start: 1997, end: 2012, emoji: "📱", color: "from-pink-500 to-pink-600" },
  { name: "جيل ألفا", nameEn: "Generation Alpha", start: 2013, end: 2025, emoji: "🤖", color: "from-cyan-500 to-cyan-600" },
];

export default function GenerationCalculator() {
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<{
    generation: typeof generations[0];
    age: number;
    traits: string[];
  } | null>(null);

  const calculate = () => {
    const year = parseInt(birthYear);
    if (!year || year < 1920 || year > new Date().getFullYear()) return;

    const generation = generations.find(g => year >= g.start && year <= g.end);
    if (!generation) return;

    const age = new Date().getFullYear() - year;

    const traitsMap: Record<string, string[]> = {
      "الجيل الصامت": ["الانضباط والعمل الجاد", "احترام التقاليد", "التوفير والادخار"],
      "جيل طفرة المواليد": ["التفاؤل والطموح", "الولاء للعمل", "التركيز على الأسرة"],
      "الجيل X": ["الاستقلالية", "التوازن بين العمل والحياة", "التكيف مع التغيير"],
      "جيل الألفية": ["الإبداع والابتكار", "التواصل الرقمي", "البحث عن المعنى"],
      "الجيل Z": ["الأصالة الرقمية", "التنوع والشمولية", "ريادة الأعمال"],
      "جيل ألفا": ["النشأة مع الذكاء الاصطناعي", "التعلم التفاعلي", "الوعي البيئي"],
    };

    setResult({
      generation,
      age,
      traits: traitsMap[generation.name] || [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          سنة الميلاد
        </label>
        <input
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="مثال: 1995"
          min="1920"
          max={new Date().getFullYear()}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={calculate}
          className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <Users className="inline-block w-6 h-6 ml-2" />
          اكتشف جيلك
        </button>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass p-8 rounded-3xl text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${result.generation.color} rounded-full mb-4`}>
              <span className="text-5xl">{result.generation.emoji}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              أنت من {result.generation.name}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {result.generation.nameEn}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500">
              ({result.generation.start} - {result.generation.end})
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-2xl text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.age}</div>
              <div className="text-gray-600 dark:text-gray-400">عمرك الحالي</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{birthYear}</div>
              <div className="text-gray-600 dark:text-gray-400">سنة الميلاد</div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              خصائص جيلك
            </h3>
            <ul className="space-y-3">
              {result.traits.map((trait, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
