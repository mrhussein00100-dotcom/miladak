"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowLeftRight } from "lucide-react";

const cities = [
  { name: "الرياض", timezone: "Asia/Riyadh", flag: "🇸🇦" },
  { name: "دبي", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { name: "القاهرة", timezone: "Africa/Cairo", flag: "🇪🇬" },
  { name: "لندن", timezone: "Europe/London", flag: "🇬🇧" },
  { name: "باريس", timezone: "Europe/Paris", flag: "🇫🇷" },
  { name: "نيويورك", timezone: "America/New_York", flag: "🇺🇸" },
  { name: "لوس أنجلوس", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { name: "طوكيو", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "سيدني", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { name: "موسكو", timezone: "Europe/Moscow", flag: "🇷🇺" },
  { name: "بكين", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { name: "إسطنبول", timezone: "Europe/Istanbul", flag: "🇹🇷" },
];

export default function TimezoneCalculator() {
  const [fromCity, setFromCity] = useState(cities[0]);
  const [toCity, setToCity] = useState(cities[3]);
  const [currentTimes, setCurrentTimes] = useState<{ from: string; to: string }>({ from: "", to: "" });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      const fromTime = now.toLocaleTimeString('ar-SA', {
        timeZone: fromCity.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      
      const toTime = now.toLocaleTimeString('ar-SA', {
        timeZone: toCity.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      setCurrentTimes({ from: fromTime, to: toTime });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [fromCity, toCity]);

  const getTimeDifference = () => {
    const now = new Date();
    const fromOffset = new Date(now.toLocaleString('en-US', { timeZone: fromCity.timezone })).getTime();
    const toOffset = new Date(now.toLocaleString('en-US', { timeZone: toCity.timezone })).getTime();
    const diffHours = (toOffset - fromOffset) / (1000 * 60 * 60);
    return diffHours;
  };

  const timeDiff = getTimeDifference();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl mb-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* From City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              من مدينة
            </label>
            <select
              value={fromCity.name}
              onChange={(e) => setFromCity(cities.find(c => c.name === e.target.value) || cities[0])}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.flag} {city.name}
                </option>
              ))}
            </select>
            
            <div className="mt-4 p-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl text-white text-center">
              <div className="text-sm opacity-80 mb-1">{fromCity.flag} {fromCity.name}</div>
              <div className="text-4xl font-bold font-mono">{currentTimes.from}</div>
            </div>
          </div>

          {/* To City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              إلى مدينة
            </label>
            <select
              value={toCity.name}
              onChange={(e) => setToCity(cities.find(c => c.name === e.target.value) || cities[3])}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.flag} {city.name}
                </option>
              ))}
            </select>
            
            <div className="mt-4 p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white text-center">
              <div className="text-sm opacity-80 mb-1">{toCity.flag} {toCity.name}</div>
              <div className="text-4xl font-bold font-mono">{currentTimes.to}</div>
            </div>
          </div>
        </div>

        {/* Time Difference */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <ArrowLeftRight className="w-6 h-6 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">فرق التوقيت</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {timeDiff > 0 ? '+' : ''}{timeDiff} ساعة
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* World Clocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-8 rounded-3xl"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          الوقت حول العالم
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.slice(0, 8).map((city) => {
            const time = new Date().toLocaleTimeString('ar-SA', {
              timeZone: city.timezone,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            return (
              <div key={city.name} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                <div className="text-2xl mb-1">{city.flag}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{city.name}</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white font-mono">{time}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
