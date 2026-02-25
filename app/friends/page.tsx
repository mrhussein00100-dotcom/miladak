'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgeCalculator } from '@/components/AgeCalculator';
import { FriendCalculator } from '@/components/FriendCalculator';
import { FriendsSection } from '@/components/FriendsSection';
import { CompareWithFriends } from '@/components/CompareWithFriends';
import { Card, CardContent, StatCard } from '@/components/ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';
import type { AgeData } from '@/types';

interface FriendResult {
  name: string;
  age: AgeData;
}

export default function FriendsPage() {
  const [you, setYou] = useState<AgeData | null>(null);
  const [friends, setFriends] = useState<FriendResult[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const rawFriends = localStorage.getItem('miladak_friends');
      if (rawFriends) setFriends(JSON.parse(rawFriends));
      const rawYou = localStorage.getItem('miladak_you');
      if (rawYou) setYou(JSON.parse(rawYou));
    } catch {}
  }, []);

  // Save friends
  useEffect(() => {
    try {
      localStorage.setItem('miladak_friends', JSON.stringify(friends));
    } catch {}
  }, [friends]);

  // Save you
  useEffect(() => {
    try {
      if (you) localStorage.setItem('miladak_you', JSON.stringify(you));
    } catch {}
  }, [you]);

  const handleAddFriend = (res: FriendResult) => {
    setFriends((prev) => [res, ...prev]);
  };

  const handleRemoveFriend = (index: number) => {
    setFriends((prev) => prev.filter((_, i) => i !== index));
  };

  // Insights
  const upcoming = useMemo(
    () =>
      [...friends]
        .sort(
          (a, b) => a.age.nextBirthday.daysUntil - b.age.nextBirthday.daysUntil
        )
        .slice(0, 5),
    [friends]
  );

  const oldest = useMemo(
    () =>
      friends.length
        ? friends.reduce((m, f) => (f.age.totalDays > m.age.totalDays ? f : m))
        : null,
    [friends]
  );

  const youngest = useMemo(
    () =>
      friends.length
        ? friends.reduce((m, f) => (f.age.totalDays < m.age.totalDays ? f : m))
        : null,
    [friends]
  );

  const totals = useMemo(() => {
    const totalDays = friends.reduce((s, f) => s + f.age.totalDays, 0);
    const avgYears = friends.length
      ? Math.round(totalDays / friends.length / 365.2425)
      : 0;
    return { count: friends.length, totalDays, avgYears };
  }, [friends]);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gradient">الأصدقاء</span> 🎉
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            أضف أصدقاءك، تابع أعياد ميلادهم القادمة، وقارن أعماركم مع أفكار
            تفاعلية ممتعة
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="sticky top-16 z-40">
          <Card variant="glass" className="p-2">
            <div className="flex items-center gap-2 overflow-x-auto text-sm">
              <a
                href="#calculators"
                className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium whitespace-nowrap transition"
              >
                🧮 الحاسبات
              </a>
              <a
                href="#insights"
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium whitespace-nowrap transition"
              >
                📊 الرؤى
              </a>
              <a
                href="#friends-list"
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium whitespace-nowrap transition"
              >
                👥 القائمة
              </a>
              <a
                href="#compare"
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium whitespace-nowrap transition"
              >
                ⚖️ المقارنة
              </a>
            </div>
          </Card>
        </div>

        {/* Calculators Section */}
        <section
          id="calculators"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-32"
        >
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👤</span> احسب عمرك (للمقارنة)
            </h2>
            <AgeCalculator
              onCalculate={setYou}
              title="احسب عمرك"
              showFeatures={false}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👥</span> احسب لصديقك
            </h2>
            <FriendCalculator onResult={handleAddFriend} />
          </div>
        </section>

        {/* Insights Section */}
        {friends.length > 0 && (
          <section id="insights" className="space-y-8 scroll-mt-32">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold flex items-center gap-3"
            >
              <span>📊</span>
              <span className="text-gradient">رؤى وإحصاءات</span>
            </motion.h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="🎁"
                value={upcoming[0]?.name || '—'}
                label={`أقرب عيد ميلاد (${
                  upcoming[0]
                    ? formatArabicNumber(
                        upcoming[0].age.nextBirthday.daysUntil
                      ) + ' يوم'
                    : ''
                })`}
                color="primary"
              />
              <StatCard
                icon="🏆"
                value={oldest?.name || '—'}
                label={`أكبر صديق (${
                  oldest ? formatArabicNumber(oldest.age.years) + ' سنة' : ''
                })`}
                color="secondary"
              />
              <StatCard
                icon="🌟"
                value={youngest?.name || '—'}
                label={`أصغر صديق (${
                  youngest
                    ? formatArabicNumber(youngest.age.years) + ' سنة'
                    : ''
                })`}
                color="accent"
              />
              <StatCard
                icon="👥"
                value={formatArabicNumber(totals.count)}
                label={`صديق (متوسط ${formatArabicNumber(
                  totals.avgYears
                )} سنة)`}
                color="primary"
              />
            </div>

            {/* Upcoming Birthdays */}
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🎂</span> أعياد الميلاد القادمة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcoming.map((f, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
                    >
                      <div className="font-bold text-lg">{f.name}</div>
                      <div className="text-sm text-muted-foreground">
                        بعد{' '}
                        <span className="text-primary font-bold">
                          {formatArabicNumber(f.age.nextBirthday.daysUntil)}
                        </span>{' '}
                        يوم
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Friends List */}
        {friends.length > 0 && (
          <section id="friends-list" className="scroll-mt-32">
            <FriendsSection friends={friends} onRemove={handleRemoveFriend} />
          </section>
        )}

        {/* Compare Section */}
        {you && friends.length > 0 && (
          <section id="compare" className="scroll-mt-32">
            <CompareWithFriends you={you} friends={friends.slice(0, 5)} />
          </section>
        )}

        {/* Empty State */}
        {friends.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-6xl mb-4 block">👥</span>
            <h3 className="text-xl font-bold mb-2">لم تضف أي أصدقاء بعد</h3>
            <p className="text-muted-foreground">
              استخدم حاسبة الأصدقاء أعلاه لإضافة أصدقائك ومتابعة أعياد ميلادهم
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
