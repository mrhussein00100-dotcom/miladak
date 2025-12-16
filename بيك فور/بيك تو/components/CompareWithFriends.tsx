'use client';

import { motion } from 'framer-motion';
import { formatArabicNumber } from '@/lib/formatArabic';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { AgeData } from '@/types';

interface FriendResult {
  name: string;
  age: AgeData;
}

interface CompareWithFriendsProps {
  you: AgeData;
  friends: FriendResult[];
}

export function CompareWithFriends({ you, friends }: CompareWithFriendsProps) {
  const rows = [
    {
      label: 'العمر (سنوات)',
      icon: '🎂',
      you: formatArabicNumber(you.years),
      friends: friends.map((f) => formatArabicNumber(f.age.years)),
    },
    {
      label: 'إجمالي الأيام',
      icon: '📅',
      you: formatArabicNumber(you.totalDays),
      friends: friends.map((f) => formatArabicNumber(f.age.totalDays)),
    },
    {
      label: 'يوم الميلاد',
      icon: '📆',
      you: you.dayOfWeek,
      friends: friends.map((f) => f.age.dayOfWeek),
    },
    {
      label: 'البرج',
      icon: '⭐',
      you: you.zodiacSign,
      friends: friends.map((f) => f.age.zodiacSign),
    },
    {
      label: 'المتبقي لعيد الميلاد',
      icon: '🎁',
      you: `${formatArabicNumber(you.nextBirthday.daysUntil)} يوم`,
      friends: friends.map(
        (f) => `${formatArabicNumber(f.age.nextBirthday.daysUntil)} يوم`
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span className="text-gradient">مقارنة الأعمار</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">
                    البند
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full">
                      👤 أنت
                    </span>
                  </th>
                  {friends.map((f, idx) => (
                    <th
                      key={idx}
                      className="text-center py-3 px-4 text-sm font-medium"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary rounded-full">
                        👤 {f.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition"
                  >
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span>{row.icon}</span>
                        {row.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-lg">{row.you}</span>
                    </td>
                    {row.friends.map((val, j) => (
                      <td key={j} className="py-4 px-4 text-center">
                        <span className="font-bold text-lg">{val}</span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
