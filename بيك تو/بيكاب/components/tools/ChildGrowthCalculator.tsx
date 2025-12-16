"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Scale, TrendingUp, Baby } from "lucide-react";

export default function ChildGrowthCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [ageMonths, setAgeMonths] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{
    weightStatus: string;
    heightStatus: string;
    bmi: number;
    bmiStatus: string;
    tips: string[];
  } | null>(null);

  const calculate = () => {
    const age = parseInt(ageMonths);
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!age || !w || !h) return;

    // Simplified growth assessment
    const bmi = w / ((h / 100) ** 2);
    
    let weightStatus = "طبيعي";
    let heightStatus = "طبيعي";
    let bmiStatus = "طبيعي";
    let tips: string[] = [];

    // Simple assessment based on age
    if (age <= 12) {
      if (w < 7) weightStatus = "أقل من الطبيعي";
      else if (w > 12) weightStatus = "أعلى من الطبيعي";
      
      if (h < 65) heightStatus = "أقل من الطبيعي";
      else if (h > 80) heightStatus = "أعلى من الطبيعي";
    } else if (age <= 24) {
      if (w < 9) weightStatus = "أقل من الطبيعي";
      else if (w > 15) weightStatus = "أعلى من الطبيعي";
      
      if (h < 75) heightStatus = "أقل من الطبيعي";
      else if (h > 95) heightStatus = "أعلى من الطبيعي";
    } else {
      if (bmi < 14) bmiStatus = "نحيف";
      else if (bmi > 18) bmiStatus = "زيادة في الوزن";
    }

    tips = [
      "تأكدي من حصول طفلك على تغذية متوازنة",
      "شجعي النشاط البدني المناسب لعمره",
      "تابعي مع طبيب الأطفال بانتظام",
      "احرصي على نوم كافٍ لطفلك",
    ];

    setResult({ weightStatus, heightStatus, bmi, bmiStatus, tips });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الجنس
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  gender === "male"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                👦 ذكر
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  gender === "female"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                👧 أنثى
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العمر (بالأشهر)
            </label>
            <input
              type="number"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              placeholder="مثال: 18"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوزن (كجم)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="مثال: 10.5"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الطول (سم)
            </label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="مثال: 80"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          <TrendingUp className="inline-block w-6 h-6 ml-2" />
          تحليل النمو
        </button>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass p-6 rounded-2xl text-center">
              <Scale className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold text-gray-800 dark:text-white mb-1">الوزن</div>
              <div className={`font-medium ${
                result.weightStatus === "طبيعي" ? "text-green-500" : "text-amber-500"
              }`}>
                {result.weightStatus}
              </div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Ruler className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-bold text-gray-800 dark:text-white mb-1">الطول</div>
              <div className={`font-medium ${
                result.heightStatus === "طبيعي" ? "text-green-500" : "text-amber-500"
              }`}>
                {result.heightStatus}
              </div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Baby className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <div className="text-lg font-bold text-gray-800 dark:text-white mb-1">BMI</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {result.bmi.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">نصائح للنمو الصحي 💡</h3>
            <ul className="space-y-3">
              {result.tips.map((tip, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
