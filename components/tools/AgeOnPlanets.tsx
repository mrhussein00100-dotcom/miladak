'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Calendar, Globe, Info } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const planets = [
  {
    id: 'mercury',
    name: 'عطارد',
    period: 0.2408467,
    color: 'from-gray-400 to-gray-600',
    icon: '☿️',
    description: 'أقرب الكواكب للشمس، سنة واحدة هنا تساوي 88 يوم أرضي فقط!',
  },
  {
    id: 'venus',
    name: 'الزهرة',
    period: 0.61519726,
    color: 'from-yellow-400 to-orange-500',
    icon: '♀️',
    description: 'توأم الأرض، اليوم فيه أطول من السنة!',
  },
  {
    id: 'mars',
    name: 'المريخ',
    period: 1.8808158,
    color: 'from-red-500 to-red-700',
    icon: '♂️',
    description: 'الكوكب الأحمر، السنة هنا تقريباً ضعف السنة الأرضية.',
  },
  {
    id: 'jupiter',
    name: 'المشتري',
    period: 11.862615,
    color: 'from-orange-300 to-orange-500',
    icon: '♃',
    description: 'عملاق المجموعة الشمسية، دورته تستغرق حوالي 12 سنة أرضية.',
  },
  {
    id: 'saturn',
    name: 'زحل',
    period: 29.447498,
    color: 'from-yellow-200 to-yellow-400',
    icon: '♄',
    description: 'سيد الخواتم، السنة هنا طويلة جداً وتساوي 29.5 سنة أرضية.',
  },
  {
    id: 'uranus',
    name: 'أورانوس',
    period: 84.016846,
    color: 'from-cyan-300 to-cyan-500',
    icon: '♅',
    description: 'الكوكب الجليدي، قد تعيش حياتك كلها قبل أن يكمل دورة واحدة!',
  },
  {
    id: 'neptune',
    name: 'نبتون',
    period: 164.79132,
    color: 'from-blue-500 to-blue-700',
    icon: '♆',
    description: 'الكوكب الأزرق البعيد، السنة هنا أطول من عمر الإنسان الطبيعي.',
  },
  {
    id: 'pluto',
    name: 'بلوتو',
    period: 247.92065,
    color: 'from-indigo-400 to-purple-600',
    icon: '♇',
    description: 'الكوكب القزم، لم يكمل دورة واحدة منذ اكتشافه عام 1930!',
  },
];

export default function AgeOnPlanets() {
  const [birthDate, setBirthDate] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateAge = () => {
    if (!birthDate) return;
    setShowResults(true);
  };

  const getPlanetAge = (period: number) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInDays = differenceInDays(today, birth);
    const ageInYears = ageInDays / 365.25;
    return (ageInYears / period).toFixed(2);
  };

  const getNextBirthday = (period: number) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInDays = differenceInDays(today, birth);
    const earthDaysPerYear = 365.25 * period;
    
    // Calculate how many planetary years have passed
    const planetaryAge = ageInDays / earthDaysPerYear;
    
    // Calculate when the next integer age will be reached
    const nextAge = Math.floor(planetaryAge) + 1;
    
    // Calculate total days needed for next age
    const totalDaysForNextAge = nextAge * earthDaysPerYear;
    
    // Remaining days
    const remainingDays = Math.ceil(totalDaysForNextAge - ageInDays);
    
    return remainingDays;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="glass p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
          <Rocket className="w-6 h-6 text-purple-500" />
          أدخل تاريخ ميلادك للانطلاق
        </h2>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <div className="relative w-full">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setShowResults(false);
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
          
          <button
            onClick={calculateAge}
            disabled={!birthDate}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 min-w-[150px]"
          >
            احسب الآن 🚀
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Earth Card (Reference) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-2xl border-2 border-green-400/30 relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-24 h-24" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🌍</span>
                  <div>
                    <h3 className="text-xl font-bold">الأرض</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">كوكبنا الأم</p>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <span className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {getPlanetAge(1)}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">سنة</p>
                </div>
              </div>
            </motion.div>

            {/* Other Planets */}
            {planets.map((planet, index) => (
              <motion.div
                key={planet.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * (index + 2) }}
                className="glass p-6 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl filter drop-shadow-lg">{planet.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{planet.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full w-fit mt-1">
                          <Info className="w-3 h-3" />
                          <span>السنة = {planet.period} سنة أرضية</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-6 bg-white/30 dark:bg-black/20 rounded-xl mb-4 backdrop-blur-sm">
                    <span className={`text-4xl font-black bg-gradient-to-r ${planet.color} bg-clip-text text-transparent`}>
                      {getPlanetAge(planet.period)}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">سنة</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">عيد ميلادك القادم بعد:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {getNextBirthday(planet.period)} يوم
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic border-t pt-3 border-gray-200 dark:border-gray-700">
                      {planet.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
