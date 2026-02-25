"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Baby, Clock, Heart, Star, Sparkles } from "lucide-react";

interface ChildAge {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: number;
  stage: string;
  stageDescription: string;
}

export default function ChildAgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [childName, setChildName] = useState("");
  const [result, setResult] = useState<ChildAge | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const weeks = Math.floor((totalDays % 30) / 7);

    // Calculate days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Determine developmental stage
    let stage = "";
    let stageDescription = "";
    
    if (totalMonths < 1) {
      stage = "حديث الولادة";
      stageDescription = "مرحلة التكيف مع العالم الخارجي";
    } else if (totalMonths < 3) {
      stage = "رضيع صغير";
      stageDescription = "بداية الابتسامات والتفاعل";
    } else if (totalMonths < 6) {
      stage = "رضيع";
      stageDescription = "تطور المهارات الحركية";
    } else if (totalMonths < 12) {
      stage = "رضيع متقدم";
      stageDescription = "بداية الحبو والاستكشاف";
    } else if (years < 2) {
      stage = "طفل صغير";
      stageDescription = "تعلم المشي والكلمات الأولى";
    } else if (years < 3) {
      stage = "طفل دارج";
      stageDescription = "تطور اللغة والاستقلالية";
    } else if (years < 6) {
      stage = "طفل ما قبل المدرسة";
      stageDescription = "تطور المهارات الاجتماعية";
    } else if (years < 12) {
      stage = "طفل في سن المدرسة";
      stageDescription = "التعلم والنمو المعرفي";
    } else {
      stage = "مراهق";
      stageDescription = "مرحلة التغيرات والنضج";
    }

    setResult({
      years,
      months,
      weeks,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: daysUntilBirthday,
      stage,
      stageDescription,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Calculator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الطفل (اختياري)
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="أدخل اسم الطفل"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ الميلاد
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={calculateAge}
          className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:-translate-y-1 shadow-lg"
        >
          <Baby className="inline-block w-6 h-6 ml-2" />
          احسب عمر الطفل
        </button>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stage Card */}
          <div className="glass p-8 rounded-3xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {childName || "طفلك"} في مرحلة
            </h2>
            <p className="text-2xl font-bold gradient-text mb-2">{result.stage}</p>
            <p className="text-gray-600 dark:text-gray-400">{result.stageDescription}</p>
          </div>

          {/* Age Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-6 rounded-2xl text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.years}</div>
              <div className="text-gray-600 dark:text-gray-400">سنة</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.months}</div>
              <div className="text-gray-600 dark:text-gray-400">شهر</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.weeks}</div>
              <div className="text-gray-600 dark:text-gray-400">أسبوع</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{result.days}</div>
              <div className="text-gray-600 dark:text-gray-400">يوم</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              إحصاءات ممتعة 🎉
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.totalDays.toLocaleString('ar-SA')}
                </div>
                <div className="text-gray-600 dark:text-gray-400">يوم منذ الولادة</div>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {result.totalWeeks.toLocaleString('ar-SA')}
                </div>
                <div className="text-gray-600 dark:text-gray-400">أسبوع منذ الولادة</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.totalMonths.toLocaleString('ar-SA')}
                </div>
                <div className="text-gray-600 dark:text-gray-400">شهر منذ الولادة</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {result.nextBirthday}
                </div>
                <div className="text-gray-600 dark:text-gray-400">يوم حتى عيد الميلاد القادم</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
