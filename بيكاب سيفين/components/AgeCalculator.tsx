'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateAge,
  validateBirthDate,
  calculateLifeStats,
  type AgeData,
  type LifeStats,
} from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';
import { getPersonalityInsights } from '@/lib/personalityInsights';
import { Button, CelebrationButton } from './ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CelebrationCard,
  StatCard,
} from './ui/Card';
import { BirthdayDecoration } from './ui/BirthdayDecoration';
import { cn } from '@/lib/utils';
import { Brain, Sun, Clock, Users, Briefcase, Heart } from 'lucide-react';
import AgeGreeting from './sections/AgeGreeting';
import HijriAge from './sections/HijriAge';
import LifeJourney from './sections/LifeJourney';
import BirthdayCountdownWidget from './sections/BirthdayCountdownWidget';
import LuckyNumbers from './sections/LuckyNumbers';
import BirthdayCard from './BirthdayCard';
import ShareableCard from './ShareableCard';
import ShareButtons from './ShareButtons';
import ArabicDatePicker from './ui/ArabicDatePicker';

interface EnhancedBirthdayData {
  birthstone: { name: string; description: string } | null;
  birthFlower: { name: string; description: string } | null;
  season: { name: string; description: string } | null;
  luckyColor: { name: string; hex: string } | null;
  chineseZodiac: { name: string; description: string } | null;
  yearInfo: { facts: string; worldStats: string } | null;
  dailyEvents: { title: string; description: string; category: string }[];
  famousBirthdays: { name: string; profession: string; birth_year: number }[];
}

interface AgeCalculatorProps {
  onCalculate?: (ageData: AgeData) => void;
  title?: string;
  showFeatures?: boolean;
}

// Confetti component for celebration - يعمل في جميع الأوضاع
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  // ألوان زاهية تظهر بوضوح في جميع الأوضاع
  const colors = [
    '#FF0080', // Magenta
    '#00D4FF', // Cyan
    '#ADFF2F', // Lime
    '#FFD700', // Gold
    '#FF6B8A', // Pink
    '#B794F6', // Purple
    '#4FD1C5', // Teal
    '#FF4500', // Orange Red
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2.5 + Math.random() * 2;
        const randomRotation = Math.random() * 720 - 360;
        const size = 8 + Math.random() * 10;
        const shape = Math.random() > 0.5 ? 'rounded-sm' : 'rounded-full';

        return (
          <motion.div
            key={i}
            className={`absolute ${shape}`}
            style={{
              backgroundColor: colors[i % colors.length],
              width: size,
              height: size,
              left: `${randomX}%`,
              top: -20,
              boxShadow: `0 0 10px ${colors[i % colors.length]}`,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              rotate: randomRotation,
              opacity: [1, 1, 0.8, 0],
              x: [0, (Math.random() - 0.5) * 150],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

export function AgeCalculator({
  onCalculate,
  title = 'احسب عمرك بدقة',
  showFeatures = true,
}: AgeCalculatorProps) {
  const [birthDate, setBirthDate] = useState('');
  const [ageData, setAgeData] = useState<AgeData | null>(null);
  const [lifeStats, setLifeStats] = useState<LifeStats | null>(null);
  const [enhancedData, setEnhancedData] = useState<EnhancedBirthdayData | null>(
    null
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Live seconds counter
  useEffect(() => {
    if (!ageData) return;
    const interval = setInterval(
      () => setLiveSeconds((prev) => prev + 1),
      1000
    );
    return () => clearInterval(interval);
  }, [ageData]);

  // مزامنة التاريخ المحدد مع birthDate
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setBirthDate(`${year}-${month}-${day}`);
    } else {
      setBirthDate('');
    }
  }, [selectedDate]);

  const handleCalculate = async () => {
    if (!birthDate) {
      setError('الرجاء إدخال تاريخ الميلاد');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const date = new Date(birthDate);
      const validation = validateBirthDate(date);

      if (!validation.valid) {
        setError(validation.error || 'تاريخ غير صحيح');
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const age = calculateAge(date);
      const stats = calculateLifeStats(age.totalDays);

      setAgeData(age);
      setLifeStats(stats);
      setLiveSeconds(0);

      // جلب البيانات المحسنة من قاعدة البيانات
      try {
        const response = await fetch('/api/birthday-info/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ birthDate }),
        });
        const result = await response.json();
        if (result.success && result.data) {
          setEnhancedData({
            birthstone: result.data.birthstone,
            birthFlower: result.data.birthFlower,
            season: result.data.season,
            luckyColor: result.data.luckyColor,
            chineseZodiac: result.data.chineseZodiac,
            yearInfo: result.data.yearInfo,
            dailyEvents: result.data.dailyEvents || [],
            famousBirthdays: result.data.famousBirthdays || [],
          });
        }
      } catch (e) {
        console.log('Enhanced data fetch failed:', e);
      }

      // Call onCalculate callback if provided
      onCalculate?.(age);

      // Show celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);

      try {
        localStorage.setItem('userBirthDate', birthDate);
      } catch {}

      setTimeout(() => {
        document
          .querySelector('#results')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('حدث خطأ في حساب العمر');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setSelectedDate(null);
    setAgeData(null);
    setLifeStats(null);
    setEnhancedData(null);
    setError('');
    try {
      localStorage.removeItem('userBirthDate');
    } catch {}
  };

  return (
    <div className="space-y-8" id="calculator">
      <Confetti show={showConfetti} />

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CelebrationCard
          icon="🎂"
          className="max-w-2xl mx-auto relative overflow-visible"
        >
          {/* زينة السقف الاحتفالية */}
          <BirthdayDecoration />

          <CardHeader className="text-center pb-2 pt-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <CardTitle className="text-2xl text-gradient">{title}</CardTitle>
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-sm text-muted-foreground">
              اكتشف إحصاءات مذهلة عن حياتك
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Welcome Message */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <p className="text-sm text-center">
                ابدأ الآن واكتشف رحلة حياتك بالتفصيل
              </p>
            </div>

            {/* Arabic Date Picker */}
            <ArabicDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              label="📅 تاريخ الميلاد"
              placeholder="اختر تاريخ ميلادك"
              maxDate={new Date()}
              minDate={new Date(1900, 0, 1)}
            />

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <CelebrationButton
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'جاري الحساب...' : 'احسب الآن 🎉'}
              </CelebrationButton>

              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                className="w-full"
              >
                مسح 🗑️
              </Button>
            </div>
          </CardContent>
        </CelebrationCard>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {ageData && (
          <motion.div
            id="results"
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {/* Age Greeting - مخاطبة المستخدم حسب العمر */}
            <AgeGreeting ageData={ageData} />

            {/* Age Breakdown */}
            <ResultCard title="عمرك بالتفصيل" icon="⏰" delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    value: ageData.years,
                    label: 'سنة',
                    icon: '🎂',
                    color: 'primary',
                  },
                  {
                    value: ageData.months,
                    label: 'شهر',
                    icon: '📅',
                    color: 'secondary',
                  },
                  {
                    value: ageData.days,
                    label: 'يوم',
                    icon: '☀️',
                    color: 'accent',
                  },
                  {
                    value: ageData.weeks,
                    label: 'أسبوع',
                    icon: '📆',
                    color: 'primary',
                  },
                ].map((item) => (
                  <StatCard
                    key={item.label}
                    icon={item.icon}
                    value={formatArabicNumber(item.value)}
                    label={item.label}
                    color={item.color as 'primary' | 'secondary' | 'accent'}
                  />
                ))}
              </div>
            </ResultCard>

            {/* Total Counts */}
            <ResultCard title="إجمالي عمرك" icon="✨" delay={0.2} badge="مباشر">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="يوم" value={ageData.totalDays} icon="📅" />
                <StatBox label="ساعة" value={ageData.totalHours} icon="⏰" />
                <StatBox label="دقيقة" value={ageData.totalMinutes} icon="⏱️" />
                <StatBox
                  label="ثانية"
                  value={ageData.totalSeconds + liveSeconds}
                  icon="⚡"
                  live
                />
              </div>
            </ResultCard>

            {/* Birth Info */}
            <ResultCard title="معلومات الميلاد" icon="⭐" delay={0.3}>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoBox
                  label="يوم الميلاد"
                  value={ageData.dayOfWeek}
                  icon="📆"
                />
                <InfoBox
                  label="التاريخ الهجري"
                  value={ageData.hijri.date}
                  icon="🌙"
                />
                <InfoBox
                  label="البرج الغربي"
                  value={ageData.zodiacSign}
                  icon="⭐"
                />
                <InfoBox
                  label="البرج الصيني"
                  value={ageData.chineseZodiac}
                  icon="🐉"
                />
              </div>
            </ResultCard>

            {/* Hijri Age - العمر بالهجري */}
            <HijriAge ageData={ageData} />

            {/* Birthday Countdown Widget - العد التنازلي المباشر */}
            <BirthdayCountdownWidget ageData={ageData} />

            {/* Lucky Numbers - الأرقام المحظوظة */}
            <LuckyNumbers ageData={ageData} />

            {/* Life Statistics */}
            {lifeStats && (
              <ResultCard title="إحصاءات حياتك الممتعة" icon="❤️" delay={0.5}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'نبضة قلب',
                      value: lifeStats.heartbeats,
                      icon: '❤️',
                    },
                    { label: 'نفس', value: lifeStats.breaths, icon: '💨' },
                    {
                      label: 'يوم نوم',
                      value: lifeStats.sleepDays,
                      icon: '😴',
                    },
                    { label: 'وجبة', value: lifeStats.meals, icon: '🍽️' },
                    { label: 'خطوة', value: lifeStats.stepsWalked, icon: '👣' },
                    { label: 'رمشة عين', value: lifeStats.blinks, icon: '👁️' },
                    { label: 'ضحكة', value: lifeStats.laughs, icon: '😄' },
                    {
                      label: 'لتر ماء',
                      value: lifeStats.waterLiters,
                      icon: '💧',
                    },
                  ].map((stat) => (
                    <StatBox key={stat.label} {...stat} />
                  ))}
                </div>
              </ResultCard>
            )}

            {/* Life Journey - رحلة حياتك */}
            <LifeJourney ageData={ageData} />

            {/* Personality Insights */}
            {ageData && (
              <ResultCard title="تحليل شخصيتك" icon="🧠" delay={0.55}>
                <PersonalityInsightsSection ageData={ageData} />
              </ResultCard>
            )}

            {/* Birthday Card */}
            <ResultCard title="بطاقة عيد ميلادك" icon="🎁" delay={0.56}>
              <BirthdayCard ageData={ageData} />
            </ResultCard>

            {/* Shareable Birthday Card - بطاقة قابلة للتحميل والمشاركة */}
            <ResultCard
              title="ميلادك :: بطاقة ومعلومات ميلادك للمشاركة"
              icon="🎴"
              delay={0.57}
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  أنشئ بطاقة جميلة بمعلومات ميلادك وشاركها مع أصدقائك أو حملها
                  على جهازك
                </p>
                <ShareableCard ageData={ageData} />
              </div>
            </ResultCard>

            {/* Quick Share Buttons - أزرار المشاركة السريعة */}
            <ResultCard title="شارك نتائجك مع الأصدقاء" icon="📤" delay={0.58}>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  شارك نتائج حساب عمرك مع أصدقائك على وسائل التواصل الاجتماعي
                </p>
                <ShareButtons ageData={ageData} />
              </div>
            </ResultCard>

            {/* Enhanced Birthday Data */}
            {enhancedData && (
              <>
                {/* Birth Symbols */}
                {(enhancedData.birthstone ||
                  enhancedData.birthFlower ||
                  enhancedData.luckyColor ||
                  enhancedData.season) && (
                  <ResultCard title="رموز ميلادك" icon="💎" delay={0.6}>
                    <div className="grid md:grid-cols-2 gap-4">
                      {enhancedData.birthstone && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">💎</span>
                            <span className="font-semibold">حجر الميلاد</span>
                          </div>
                          <div className="text-lg font-bold text-purple-500 mb-1">
                            {enhancedData.birthstone.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {enhancedData.birthstone.description}
                          </p>
                        </div>
                      )}
                      {enhancedData.birthFlower && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🌸</span>
                            <span className="font-semibold">زهرة الميلاد</span>
                          </div>
                          <div className="text-lg font-bold text-pink-500 mb-1">
                            {enhancedData.birthFlower.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {enhancedData.birthFlower.description}
                          </p>
                        </div>
                      )}
                      {enhancedData.luckyColor && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🎨</span>
                            <span className="font-semibold">اللون المحظوظ</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                              style={{
                                backgroundColor: enhancedData.luckyColor.hex,
                              }}
                            />
                            <span className="text-lg font-bold">
                              {enhancedData.luckyColor.name}
                            </span>
                          </div>
                        </div>
                      )}
                      {enhancedData.season && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🌿</span>
                            <span className="font-semibold">فصل الميلاد</span>
                          </div>
                          <div className="text-lg font-bold text-green-500 mb-1">
                            {enhancedData.season.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {enhancedData.season.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </ResultCard>
                )}

                {/* Chinese Zodiac Details */}
                {enhancedData.chineseZodiac && (
                  <ResultCard
                    title="البرج الصيني بالتفصيل"
                    icon="🐉"
                    delay={0.7}
                  >
                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 text-center">
                      <div className="text-4xl mb-3">🐉</div>
                      <div className="text-2xl font-bold text-red-500 mb-2">
                        {enhancedData.chineseZodiac.name}
                      </div>
                      <p className="text-muted-foreground">
                        {enhancedData.chineseZodiac.description}
                      </p>
                    </div>
                  </ResultCard>
                )}

                {/* Year Info */}
                {enhancedData.yearInfo && (
                  <ResultCard
                    title="ماذا حدث في سنة ميلادك؟"
                    icon="📜"
                    delay={0.8}
                  >
                    <div className="space-y-4">
                      {enhancedData.yearInfo.facts && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📰</span>
                            <span className="font-semibold">حقائق مهمة</span>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {enhancedData.yearInfo.facts}
                          </p>
                        </div>
                      )}
                      {enhancedData.yearInfo.worldStats && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🌍</span>
                            <span className="font-semibold">
                              إحصائيات العالم
                            </span>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {enhancedData.yearInfo.worldStats}
                          </p>
                        </div>
                      )}
                    </div>
                  </ResultCard>
                )}

                {/* Famous Birthdays */}
                {enhancedData.famousBirthdays.length > 0 && (
                  <ResultCard
                    title="مشاهير يشاركونك يوم ميلادك"
                    icon="⭐"
                    delay={0.9}
                  >
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {enhancedData.famousBirthdays.map((person, i) => (
                        <motion.div
                          key={i}
                          className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:scale-105 transition-transform"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                              ⭐
                            </div>
                            <div>
                              <div className="font-semibold">{person.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {person.profession}
                              </div>
                              <div className="text-xs text-primary">
                                {person.birth_year}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ResultCard>
                )}

                {/* Daily Events */}
                {enhancedData.dailyEvents.length > 0 && (
                  <ResultCard
                    title="أحداث تاريخية في يوم ميلادك"
                    icon="📅"
                    delay={1.0}
                  >
                    <div className="space-y-3">
                      {enhancedData.dailyEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + i * 0.1 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm flex-shrink-0">
                              📌
                            </div>
                            <div>
                              <div className="font-semibold">{event.title}</div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                              {event.category && (
                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
                                  {event.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ResultCard>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function ResultCard({
  title,
  icon,
  children,
  delay = 0,
  badge,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card variant="glass" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="text-gradient">{title}</span>
            {badge && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse mr-auto">
                {badge}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  icon,
  live,
}: {
  label: string;
  value: number;
  icon: string;
  live?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10',
        'hover:scale-105 transition-transform duration-300',
        live && 'ring-2 ring-green-500/50'
      )}
      whileHover={{ y: -2 }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div
        className={cn(
          'text-xl font-bold',
          live ? 'text-green-500 tabular-nums' : 'text-gradient'
        )}
      >
        {formatArabicNumber(value)}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:scale-[1.02] transition-transform"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="font-semibold text-lg">{value}</div>
    </motion.div>
  );
}

// Personality Insights Section Component
function PersonalityInsightsSection({ ageData }: { ageData: AgeData }) {
  const insights = useMemo(
    () => getPersonalityInsights(ageData),
    [ageData.years, ageData.months, ageData.days, ageData.totalDays]
  );

  const cards = [
    { key: 'season', icon: Sun, label: 'موسم الميلاد' },
    { key: 'chronotype', icon: Clock, label: 'الإيقاع اليومي' },
    { key: 'generation', icon: Users, label: 'الجيل' },
    { key: 'strengths', icon: Brain, label: 'نقاط القوة' },
    { key: 'work', icon: Briefcase, label: 'بيئة العمل' },
    { key: 'wellbeing', icon: Heart, label: 'الرفاهية' },
  ] as const;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center mb-4">
        مؤشرات عامة مستندة إلى دراسات؛ تختلف فرديًا وليست تشخيصًا.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, idx) => {
          const card = (
            insights as Record<
              string,
              {
                title: string;
                tag?: string;
                color?: string;
                summary: string;
                bullets: string[];
              }
            >
          )[c.key];
          const Icon = c.icon;
          return (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`p-4 rounded-xl bg-gradient-to-br ${
                card.color ?? 'from-gray-500/5 to-gray-500/10'
              } border border-primary/10`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5">
                  <Icon className="w-5 h-5 text-gray-800 dark:text-gray-100" />
                </div>
                {card.tag && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/60 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-white/10">
                    {card.tag}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-white mb-1">
                {card.title}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {card.summary}
              </div>
              {Array.isArray(card.bullets) && card.bullets.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {card.bullets.slice(0, 3).map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="mt-1 inline-block w-1 h-1 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
