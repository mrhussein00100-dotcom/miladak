'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatArabicNumber } from '@/lib/formatArabic';
import { Card, CardContent } from './ui/Card';
import type { AgeData } from '@/types';

interface FriendResult {
  name: string;
  age: AgeData;
}

interface FriendsSectionProps {
  friends: FriendResult[];
  onRemove?: (index: number) => void;
}

export function FriendsSection({ friends, onRemove }: FriendsSectionProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'upcoming' | 'name' | 'added'>(
    'upcoming'
  );

  const displayFriends = useMemo(() => {
    let arr = [...friends];
    const q = query.trim().toLowerCase();

    if (q) {
      arr = arr.filter((f) => f.name.toLowerCase().includes(q));
    }

    if (sortKey === 'upcoming') {
      arr.sort(
        (a, b) => a.age.nextBirthday.daysUntil - b.age.nextBirthday.daysUntil
      );
    } else if (sortKey === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    }

    return arr;
  }, [friends, query, sortKey]);

  if (friends.length === 0) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">👥</span>
        <h3 className="text-2xl font-bold text-gradient">أصدقاؤك المحفوظون</h3>
        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
          {formatArabicNumber(friends.length)}
        </span>
      </motion.div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 ابحث بالاسم..."
          className="input-festive flex-1 h-12 px-4"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
          className="input-festive h-12 px-4 sm:w-56"
        >
          <option value="upcoming">🎂 أقرب عيد ميلاد</option>
          <option value="name">🔤 ترتيب أبجدي</option>
          <option value="added">📝 ترتيب الإضافة</option>
        </select>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {displayFriends.map((friend) => {
            const origIndex = friends.indexOf(friend);
            return (
              <motion.div
                key={origIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div className="font-bold text-lg">{friend.name}</div>
                      </div>
                      {onRemove && (
                        <button
                          onClick={() => onRemove(origIndex)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    {/* Age Info */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <div className="font-bold text-primary">
                          {formatArabicNumber(friend.age.years)}
                        </div>
                        <div className="text-xs text-muted-foreground">سنة</div>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <div className="font-bold text-secondary">
                          {formatArabicNumber(friend.age.months)}
                        </div>
                        <div className="text-xs text-muted-foreground">شهر</div>
                      </div>
                      <div className="p-2 rounded-lg bg-accent/10">
                        <div className="font-bold text-accent">
                          {formatArabicNumber(friend.age.days)}
                        </div>
                        <div className="text-xs text-muted-foreground">يوم</div>
                      </div>
                    </div>

                    {/* Next Birthday */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
                      <div className="text-sm text-muted-foreground">
                        عيد ميلاده القادم
                      </div>
                      <div className="font-bold">
                        بعد{' '}
                        <span className="text-primary">
                          {formatArabicNumber(
                            friend.age.nextBirthday.daysUntil
                          )}
                        </span>{' '}
                        يوم 🎂
                      </div>
                    </div>

                    {/* Extra Info */}
                    <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                      <span>⭐ {friend.age.zodiacSign}</span>
                      <span>📅 {friend.age.dayOfWeek}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {displayFriends.length === 0 && query && (
        <div className="text-center py-8 text-muted-foreground">
          <span className="text-4xl mb-2 block">🔍</span>
          لم يتم العثور على نتائج لـ &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
