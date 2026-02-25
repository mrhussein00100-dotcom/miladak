'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// استخدام textarea عادي بدلاً من مكون مخصص
import { Badge } from '@/components/ui/Badge';

interface Birthstone {
  id?: number;
  month: number;
  stone_name: string;
  stone_name_ar: string;
  description: string;
}

interface BirthFlower {
  id?: number;
  month: number;
  flower_name: string;
  flower_name_ar: string;
  description: string;
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

export default function BirthstonesFlowersAdmin() {
  const [birthstones, setBirthstones] = useState<Birthstone[]>([]);
  const [birthFlowers, setBirthFlowers] = useState<BirthFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [editingStone, setEditingStone] = useState<Birthstone | null>(null);
  const [editingFlower, setEditingFlower] = useState<BirthFlower | null>(null);

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

      const stonesData: Birthstone[] = [];
      const flowersData: BirthFlower[] = [];

      results.forEach((result, index) => {
        if (result.success && result.data) {
          if (result.data.birthstone) {
            stonesData.push({
              month: index + 1,
              stone_name: result.data.birthstone.nameEn || '',
              stone_name_ar: result.data.birthstone.name || '',
              description: result.data.birthstone.properties || '',
            });
          }

          if (result.data.birthFlower) {
            flowersData.push({
              month: index + 1,
              flower_name: result.data.birthFlower.nameEn || '',
              flower_name_ar: result.data.birthFlower.name || '',
              description: result.data.birthFlower.meaning || '',
            });
          }
        }
      });

      setBirthstones(stonesData);
      setBirthFlowers(flowersData);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ حجر الميلاد
  const saveBirthstone = async (stone: Birthstone) => {
    try {
      const response = await fetch(`/api/admin/birthstones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stone),
      });

      if (response.ok) {
        await fetchData();
        setEditingStone(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ حجر الميلاد:', error);
    }
  };

  // حفظ زهرة الميلاد
  const saveBirthFlower = async (flower: BirthFlower) => {
    try {
      const response = await fetch(`/api/admin/birth-flowers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flower),
      });

      if (response.ok) {
        await fetchData();
        setEditingFlower(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ زهرة الميلاد:', error);
    }
  };

  // الحصول على بيانات الشهر المحدد
  const getMonthStone = (month: number) =>
    birthstones.find((s) => s.month === month);

  const getMonthFlower = (month: number) =>
    birthFlowers.find((f) => f.month === month);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* زر الرجوع */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground text-sm transition-colors border border-border shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">العودة للوحة التحكم</span>
          <span className="sm:hidden">رجوع</span>
        </Link>
      </div>

      {/* العنوان */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            💎 إدارة أحجار وزهور الميلاد
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            إدارة أحجار وزهور الميلاد لكل شهر
          </p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          className="w-full sm:w-auto"
        >
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

      {/* تعديل بيانات الشهر المحدد */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* حجر الميلاد */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💎 حجر شهر {MONTH_NAMES[selectedMonth - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const stone = getMonthStone(selectedMonth);
              const editing = editingStone?.month === selectedMonth;

              if (editing) {
                return (
                  <div className="space-y-4">
                    <Input
                      placeholder="اسم الحجر بالإنجليزية"
                      value={editingStone?.stone_name || ''}
                      onChange={(e) =>
                        setEditingStone((prev) =>
                          prev ? { ...prev, stone_name: e.target.value } : null
                        )
                      }
                    />
                    <Input
                      placeholder="اسم الحجر بالعربية"
                      value={editingStone?.stone_name_ar || ''}
                      onChange={(e) =>
                        setEditingStone((prev) =>
                          prev
                            ? { ...prev, stone_name_ar: e.target.value }
                            : null
                        )
                      }
                    />
                    <textarea
                      placeholder="وصف الحجر وخصائصه"
                      value={editingStone?.description || ''}
                      onChange={(e) =>
                        setEditingStone((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          editingStone && saveBirthstone(editingStone)
                        }
                      >
                        💾 حفظ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingStone(null)}
                      >
                        ❌ إلغاء
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {stone ? (
                    <>
                      <div>
                        <Badge variant="secondary">{stone.stone_name}</Badge>
                        <h3 className="text-lg font-semibold mt-2">
                          {stone.stone_name_ar}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {stone.description}
                        </p>
                      </div>
                      <Button
                        onClick={() => setEditingStone(stone)}
                        variant="outline"
                        size="sm"
                      >
                        ✏️ تعديل
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        لا يوجد حجر محدد لهذا الشهر
                      </p>
                      <Button
                        onClick={() =>
                          setEditingStone({
                            month: selectedMonth,
                            stone_name: '',
                            stone_name_ar: '',
                            description: '',
                          })
                        }
                        variant="outline"
                      >
                        ➕ إضافة حجر
                      </Button>
                    </>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* زهرة الميلاد */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌸 زهرة شهر {MONTH_NAMES[selectedMonth - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const flower = getMonthFlower(selectedMonth);
              const editing = editingFlower?.month === selectedMonth;

              if (editing) {
                return (
                  <div className="space-y-4">
                    <Input
                      placeholder="اسم الزهرة بالإنجليزية"
                      value={editingFlower?.flower_name || ''}
                      onChange={(e) =>
                        setEditingFlower((prev) =>
                          prev ? { ...prev, flower_name: e.target.value } : null
                        )
                      }
                    />
                    <Input
                      placeholder="اسم الزهرة بالعربية"
                      value={editingFlower?.flower_name_ar || ''}
                      onChange={(e) =>
                        setEditingFlower((prev) =>
                          prev
                            ? { ...prev, flower_name_ar: e.target.value }
                            : null
                        )
                      }
                    />
                    <textarea
                      placeholder="معنى الزهرة ودلالتها"
                      value={editingFlower?.description || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEditingFlower((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          editingFlower && saveBirthFlower(editingFlower)
                        }
                      >
                        💾 حفظ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingFlower(null)}
                      >
                        ❌ إلغاء
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {flower ? (
                    <>
                      <div>
                        <Badge variant="secondary">{flower.flower_name}</Badge>
                        <h3 className="text-lg font-semibold mt-2">
                          {flower.flower_name_ar}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {flower.description}
                        </p>
                      </div>
                      <Button
                        onClick={() => setEditingFlower(flower)}
                        variant="outline"
                        size="sm"
                      >
                        ✏️ تعديل
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        لا توجد زهرة محددة لهذا الشهر
                      </p>
                      <Button
                        onClick={() =>
                          setEditingFlower({
                            month: selectedMonth,
                            flower_name: '',
                            flower_name_ar: '',
                            description: '',
                          })
                        }
                        variant="outline"
                      >
                        ➕ إضافة زهرة
                      </Button>
                    </>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات */}
      <Card>
        <CardHeader>
          <CardTitle>📊 الإحصائيات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {birthstones.length}
              </div>
              <div className="text-sm text-muted-foreground">أحجار محددة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {birthFlowers.length}
              </div>
              <div className="text-sm text-muted-foreground">زهور محددة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {12 - birthstones.length}
              </div>
              <div className="text-sm text-muted-foreground">أحجار مفقودة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {12 - birthFlowers.length}
              </div>
              <div className="text-sm text-muted-foreground">زهور مفقودة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
