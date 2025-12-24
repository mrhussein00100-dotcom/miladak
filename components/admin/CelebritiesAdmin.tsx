'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Celebrity {
  id?: number;
  day: number;
  month: number;
  birth_year: number;
  name: string;
  profession: string;
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

export default function CelebritiesAdmin() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(
    null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);

  // جلب البيانات
  useEffect(() => {
    fetchCelebrities();
  }, [selectedMonth, selectedDay]);

  const fetchCelebrities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/celebrities?month=${selectedMonth}&day=${selectedDay}`
      );
      const data = await response.json();

      if (data.success) {
        setCelebrities(data.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب المشاهير:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ المشهور
  const saveCelebrity = async (celebrity: Celebrity) => {
    try {
      const method = celebrity.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/celebrities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(celebrity),
      });

      if (response.ok) {
        await fetchCelebrities();
        setEditingCelebrity(null);
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error('خطأ في حفظ المشهور:', error);
    }
  };

  // حذف المشهور
  const deleteCelebrity = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشهور؟')) return;

    try {
      const response = await fetch(`/api/admin/celebrities?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCelebrities();
      }
    } catch (error) {
      console.error('خطأ في حذف المشهور:', error);
    }
  };

  // إنشاء مشهور جديد
  const createNewCelebrity = () => {
    setEditingCelebrity({
      day: selectedDay,
      month: selectedMonth,
      birth_year: new Date().getFullYear() - 30,
      name: '',
      profession: '',
    });
    setIsAddingNew(true);
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            ⭐ إدارة المشاهير
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            إدارة قاعدة بيانات المشاهير وتواريخ ميلادهم
          </p>
        </div>
        <Button
          onClick={fetchCelebrities}
          variant="outline"
          className="w-full sm:w-auto"
        >
          🔄 تحديث البيانات
        </Button>
      </div>

      {/* اختيار التاريخ */}
      <Card>
        <CardHeader>
          <CardTitle>اختر تاريخ الميلاد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* اختيار الشهر */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                الشهر
              </label>
              <select
                value={selectedMonth}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMonth(parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              >
                {MONTH_NAMES.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* اختيار اليوم */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                اليوم
              </label>
              <select
                value={selectedDay}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedDay(parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* إضافة مشهور جديد */}
            <div className="flex items-end">
              <Button onClick={createNewCelebrity} className="w-full">
                ➕ إضافة مشهور
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج التعديل/الإضافة */}
      {(editingCelebrity || isAddingNew) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAddingNew ? 'إضافة مشهور جديد' : 'تعديل المشهور'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="اليوم"
                  value={editingCelebrity?.day || ''}
                  onChange={(e) =>
                    setEditingCelebrity((prev) =>
                      prev
                        ? { ...prev, day: parseInt(e.target.value) || 1 }
                        : null
                    )
                  }
                  min="1"
                  max="31"
                />
                <Input
                  type="number"
                  placeholder="الشهر"
                  value={editingCelebrity?.month || ''}
                  onChange={(e) =>
                    setEditingCelebrity((prev) =>
                      prev
                        ? { ...prev, month: parseInt(e.target.value) || 1 }
                        : null
                    )
                  }
                  min="1"
                  max="12"
                />
                <Input
                  type="number"
                  placeholder="سنة الميلاد"
                  value={editingCelebrity?.birth_year || ''}
                  onChange={(e) =>
                    setEditingCelebrity((prev) =>
                      prev
                        ? {
                            ...prev,
                            birth_year: parseInt(e.target.value) || 1990,
                          }
                        : null
                    )
                  }
                  min="1900"
                  max="2024"
                />
              </div>

              <Input
                placeholder="اسم المشهور"
                value={editingCelebrity?.name || ''}
                onChange={(e) =>
                  setEditingCelebrity((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />

              <Input
                placeholder="المهنة أو التخصص"
                value={editingCelebrity?.profession || ''}
                onChange={(e) =>
                  setEditingCelebrity((prev) =>
                    prev ? { ...prev, profession: e.target.value } : null
                  )
                }
              />

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    editingCelebrity && saveCelebrity(editingCelebrity)
                  }
                  disabled={!editingCelebrity?.name}
                >
                  💾 حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCelebrity(null);
                    setIsAddingNew(false);
                  }}
                >
                  ❌ إلغاء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة المشاهير */}
      <Card>
        <CardHeader>
          <CardTitle>
            مشاهير {selectedDay} {MONTH_NAMES[selectedMonth - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {celebrities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              لا يوجد مشاهير في هذا التاريخ
            </p>
          ) : (
            <div className="space-y-4">
              {celebrities.map((celebrity) => (
                <div
                  key={celebrity.id}
                  className="border border-gray-700 rounded-lg p-3 sm:p-4 bg-gray-800/50"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {celebrity.birth_year}
                        </Badge>
                        <Badge variant="info">{celebrity.profession}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1 text-white">
                        {celebrity.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {celebrity.profession} • ولد في {celebrity.birth_year}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-0 sm:mr-4 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCelebrity(celebrity)}
                        className="flex-1 sm:flex-none"
                      >
                        ✏️ تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          celebrity.id && deleteCelebrity(celebrity.id)
                        }
                        className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                      >
                        🗑️ حذف
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                {celebrities.length}
              </div>
              <div className="text-sm text-gray-400">مشاهير اليوم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(celebrities.map((c) => c.profession)).size}
              </div>
              <div className="text-sm text-gray-400">مهن مختلفة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.min(...celebrities.map((c) => c.birth_year)) || 0}
              </div>
              <div className="text-sm text-gray-400">أقدم مولود</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {selectedDay}/{selectedMonth}
              </div>
              <div className="text-sm text-gray-400">التاريخ المحدد</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
