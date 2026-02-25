"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const holidays = [
  { name: "رأس السنة الميلادية", date: "01-01", emoji: "🎆" },
  { name: "عيد الحب", date: "02-14", emoji: "❤️" },
  { name: "يوم المرأة العالمي", date: "03-08", emoji: "👩" },
  { name: "يوم الأم", date: "03-21", emoji: "💐" },
  { name: "يوم الأب", date: "06-21", emoji: "👨" },
  { name: "اليوم الوطني السعودي", date: "09-23", emoji: "🇸🇦" },
  { name: "الهالوين", date: "10-31", emoji: "🎃" },
  { name: "عيد الميلاد", date: "12-25", emoji: "🎄" },
  { name: "ليلة رأس السنة", date: "12-31", emoji: "🎊" },
];

export default function HolidaysCalculator() {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Array<{
    name: string;
    emoji: string;
    date: Date;
    daysRemaining: number;
  }>>([]);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const upcoming = holidays.map(holiday => {
      const [month, day] = holiday.date.split('-').map(Number);
      let holidayDate = new Date(currentYear, month - 1, day);
      
      if (holidayDate < today) {
        holidayDate = new Date(currentYear + 1, month - 1, day);
      }

      const daysRemaining = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        name: holiday.name,
        emoji: holiday.emoji,
        date: holidayDate,
        daysRemaining,
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);

    setUpcomingHolidays(upcoming);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8 text-center"
      >
        <Gift className="w-16 h-16 mx-auto mb-4 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          العطلات والمناسبات القادمة
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          اكتشف كم يوم متبقي لكل مناسبة
        </p>
      </motion.div>

      <div className="grid gap-4">
        {upcomingHolidays.map((holiday, index) => (
          <motion.div
            key={holiday.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{holiday.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {holiday.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {holiday.date.toLocaleDateString('ar-SA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                holiday.daysRemaining <= 7 ? 'text-green-500' : 
                holiday.daysRemaining <= 30 ? 'text-amber-500' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {holiday.daysRemaining}
              </div>
              <div className="text-sm text-gray-500">يوم متبقي</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
