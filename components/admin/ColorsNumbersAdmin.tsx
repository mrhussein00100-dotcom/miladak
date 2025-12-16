'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// استخدام textarea عادي بدلاً من مكون مخصص
import { Badge } from '@/components/ui/Badge';

interface LuckyColor {
  month: number;
  color: string;
  colorEn: string;
  meaning: string;
  hex?: string;
}

const MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const COLOR_HEX_MAP: Record<string, string> = {
  الأبيض: '#FFFFFF',
  الأرجواني: '#8B5CF6',
  الأخضر: '#10B981',
  الوردي: '#EC4899',
  الأصفر: '#F59E0B',
  الأزرق: '#3B82F6',
  الأحمر: '#EF4444',
  البرتقالي: '#F97316',
  الذهبي: '#D4AF37',
  البني: '#92400E',
  الفضي: '#9CA3AF',
  'الأزرق الداكن': '#1E40AF',
};

export default function ColorsNumbersAdmin() {
  const [luckyColors, setLuckyColors] = useState<LuckyColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [editingColor, setEditingColor] = useState<LuckyColor | null>(null);

  // جلب البيانات
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب بيانات جميع الأشهر
      const promises = Array.from({ length: 12 }, (_, i) =>
        fetch(`/api/monthly-info/${i + 1}`).then((res) => res.json())
      );

      const results = await Promise.all(promises);

      const colorsData: LuckyColor[] = [];

      results.forEach((result, index) => {
        if (result.success && result.data?.luckyColor) {
          colorsData.push({
            month: index + 1,
            color: result.data.luckyColor.color,
            colorEn: result.data.luckyColor.colorEn,
            meaning: result.data.luckyColor.meaning,
            hex: COLOR_HEX_MAP[result.data.luckyColor.color],
          });
        }
      });

      setLuckyColors(colorsData);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ اللون المحظوظ
  const saveLuckyColor = async (color: LuckyColor) => {
    try {
      const response = await fetch(`/api/admin/lucky-colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(color),
      });

      if (response.ok) {
        await fetchData();
        setEditingColor(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ اللون المحظوظ:', error);
    }
  };

  // الحصول على لون الشهر المحدد
  const getMonthColor = (month: number) =>
    luckyColors.find((c) => c.month === month);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            🎨 إدارة الألوان والأرقام المحظوظة
          </h1>
          <p className="text-gray-400 mt-2">
            إدارة الألوان المحظوظة لكل شهر والأرقام المحظوظة للأبراج
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          🔄 تحديث البيانات
        </Button>
      </div>

      {/* اختيار الشهر */}
      <Card>
        <CardHeader>
          <CardTitle>اختر الشهر للتعديل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {MONTH_NAMES.map((monthName, index) => (
              <Button
                key={index}
                variant={selectedMonth === index + 1 ? 'default' : 'outline'}
                onClick={() => setSelectedMonth(index + 1)}
                className="text-sm"
              >
                {monthName}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تعديل اللون المحظوظ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎨 اللون المحظوظ لشهر {MONTH_NAMES[selectedMonth - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const color = getMonthColor(selectedMonth);
            const editing = editingColor?.month === selectedMonth;

            if (editing) {
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="اسم اللون بالعربية"
                      value={editingColor?.color || ''}
                      onChange={(e) =>
                        setEditingColor((prev) =>
                          prev ? { ...prev, color: e.target.value } : null
                        )
                      }
                    />
                    <Input
                      placeholder="اسم اللون بالإنجليزية"
                      value={editingColor?.colorEn || ''}
                      onChange={(e) =>
                        setEditingColor((prev) =>
                          prev ? { ...prev, colorEn: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <Input
                    type="color"
                    value={editingColor?.hex || '#8B5CF6'}
                    onChange={(e) =>
                      setEditingColor((prev) =>
                        prev ? { ...prev, hex: e.target.value } : null
                      )
                    }
                    className="w-20 h-10"
                  />
                  <textarea
                    placeholder="معنى اللون ودلالته"
                    value={editingColor?.meaning || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditingColor((prev) =>
                        prev ? { ...prev, meaning: e.target.value } : null
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg resize-none bg-gray-800 text-white placeholder-gray-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        editingColor && saveLuckyColor(editingColor)
                      }
                    >
                      💾 حفظ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingColor(null)}
                    >
                      ❌ إلغاء
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {color ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary">{color.colorEn}</Badge>
                          <Badge>{color.hex}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mt-2">
                          {color.color}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {color.meaning}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setEditingColor(color)}
                      variant="outline"
                      size="sm"
                    >
                      ✏️ تعديل
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">لا يوجد لون محدد لهذا الشهر</p>
                    <Button
                      onClick={() =>
                        setEditingColor({
                          month: selectedMonth,
                          color: '',
                          colorEn: '',
                          meaning: '',
                          hex: '#8B5CF6',
                        })
                      }
                      variant="outline"
                    >
                      ➕ إضافة لون
                    </Button>
                  </>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* عرض جميع الألوان */}
      <Card>
        <CardHeader>
          <CardTitle>🌈 جميع الألوان المحظوظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MONTH_NAMES.map((monthName, index) => {
              const monthColor = getMonthColor(index + 1);
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all cursor-pointer"
                  onClick={() => setSelectedMonth(index + 1)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: monthColor?.hex || '#374151' }}
                    />
                    <div>
                      <div className="font-medium text-sm text-white">
                        {monthName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {monthColor?.color || 'غير محدد'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* معلومات الأبراج الصينية */}
      <Card>
        <CardHeader>
          <CardTitle>🐉 الأبراج الصينية والأرقام المحظوظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
            <p className="text-sm text-blue-300">
              ℹ️ الأرقام المحظوظة للأبراج الصينية يتم إدارتها من خلال ملف
              <code className="mx-1 px-2 py-1 bg-blue-800/50 rounded">
                lib/calculations/zodiacCalculations.ts
              </code>
              ولا تحتاج لتعديل من قاعدة البيانات.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات */}
      <Card>
        <CardHeader>
          <CardTitle>📊 الإحصائيات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {luckyColors.length}
              </div>
              <div className="text-sm text-gray-400">ألوان محددة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {12 - luckyColors.length}
              </div>
              <div className="text-sm text-gray-400">ألوان مفقودة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">12</div>
              <div className="text-sm text-gray-400">أبراج صينية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">100%</div>
              <div className="text-sm text-gray-400">اكتمال النظام</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
