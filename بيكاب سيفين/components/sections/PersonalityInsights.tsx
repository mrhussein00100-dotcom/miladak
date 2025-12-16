'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sun, Clock, Users, Briefcase, Heart } from 'lucide-react';
import { AgeData } from '@/types';
import { getPersonalityInsights } from '@/lib/personalityInsights';

interface Props {
  ageData: AgeData;
}

export default function PersonalityInsights({ ageData }: Props) {
  const insights = useMemo(
    () => getPersonalityInsights(ageData),
    [ageData.years, ageData.months, ageData.days, ageData.totalDays]
  );

  const cards = [
    { key: 'season', icon: Sun },
    { key: 'chronotype', icon: Clock },
    { key: 'generation', icon: Users },
    { key: 'strengths', icon: Brain },
    { key: 'work', icon: Briefcase },
    { key: 'wellbeing', icon: Heart },
  ] as const;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-3xl md:text-4xl font-extrabold mb-2">
          <span className="text-gradient">تحليل شخصيتك</span>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          مؤشرات عامة مستندة إلى دراسات؛ تختلف فرديًا وليست تشخيصًا.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className={`glass p-6 rounded-2xl bg-gradient-to-br ${
                card.color ?? 'from-gray-500/5 to-gray-500/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5">
                  <Icon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                </div>
                {card.tag && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/60 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-white/10"
                    dir="auto"
                  >
                    {card.tag}
                  </span>
                )}
              </div>
              <div
                className="text-lg font-bold text-gray-800 dark:text-white mb-1"
                dir="auto"
              >
                {card.title}
              </div>
              <div
                className="text-sm text-gray-700 dark:text-gray-300 mb-3"
                dir="auto"
              >
                {card.summary}
              </div>
              {Array.isArray(card.bullets) && card.bullets.length > 0 && (
                <ul
                  className="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                  dir="auto"
                >
                  {card.bullets.slice(0, 5).map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
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
