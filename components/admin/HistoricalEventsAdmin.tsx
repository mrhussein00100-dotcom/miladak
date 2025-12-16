'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// استخدام textarea عادي بدلاً من مكون مخصص
import { Badge } from '@/components/ui/Badge';

interface HistoricalEvent {
  id?: number;
  day: number;
  month: number;
  year?: number;
  title: string;
  description: string;
  category: string;
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

const CATEGORIES = [
  'تاريخي',
  'سياسي',
  'علمي',
  'ثقافي',
  'رياضي',
  'اقتصادي',
  'اجتماعي',
  'ديني',
  'عام',
];

export default function HistoricalEventsAdmin() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [editingEvent, setEditingEvent] = useState<HistoricalEvent | null>(
    null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);

  // جلب البيانات
  useEffect(() => {
    fetchEvents();
  }, [selectedMonth, selectedDay]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/historical-events?month=${selectedMonth}&day=${selectedDay}`
      );
      const data = await response.json();

      if (data.success) {
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الأحداث:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ الحدث
  const saveEvent = async (event: HistoricalEvent) => {
    try {
      const method = event.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/historical-events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        await fetchEvents();
        setEditingEvent(null);
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error('خطأ في حفظ الحدث:', error);
    }
  };

  // حذف الحدث
  const deleteEvent = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحدث؟')) return;

    try {
      const response = await fetch(`/api/admin/historical-events?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('خطأ في حذف الحدث:', error);
    }
  };

  // إنشاء حدث جديد
  const createNewEvent = () => {
    setEditingEvent({
      day: selectedDay,
      month: selectedMonth,
      title: '',
      description: '',
      category: 'عام',
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            📜 إدارة الأحداث التاريخية
          </h1>
          <p className="text-gray-400 mt-2">
            إدارة الأحداث التاريخية اليومية والسنوية
          </p>
        </div>
        <Button onClick={fetchEvents} variant="outline">
          🔄 تحديث البيانات
        </Button>
      </div>

      {/* اختيار التاريخ */}
      <Card>
        <CardHeader>
          <CardTitle>اختر التاريخ</CardTitle>
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
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* إضافة حدث جديد */}
            <div className="flex items-end">
              <Button onClick={createNewEvent} className="w-full">
                ➕ إضافة حدث
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج التعديل/الإضافة */}
      {(editingEvent || isAddingNew) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAddingNew ? 'إضافة حدث جديد' : 'تعديل الحدث'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="اليوم"
                  value={editingEvent?.day || ''}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
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
                  value={editingEvent?.month || ''}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
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
                  placeholder="السنة (اختياري)"
                  value={editingEvent?.year || ''}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            year: parseInt(e.target.value) || undefined,
                          }
                        : null
                    )
                  }
                />
              </div>

              <Input
                placeholder="عنوان الحدث"
                value={editingEvent?.title || ''}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />

              <textarea
                placeholder="وصف الحدث"
                value={editingEvent?.description || ''}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg resize-none bg-gray-800 text-white placeholder-gray-500"
              />

              <select
                value={editingEvent?.category || 'عام'}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev ? { ...prev, category: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <Button
                  onClick={() => editingEvent && saveEvent(editingEvent)}
                  disabled={!editingEvent?.title}
                >
                  💾 حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingEvent(null);
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

      {/* قائمة الأحداث */}
      <Card>
        <CardHeader>
          <CardTitle>
            أحداث {selectedDay} {MONTH_NAMES[selectedMonth - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              لا توجد أحداث في هذا التاريخ
            </p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{event.category}</Badge>
                        {event.year && (
                          <Badge variant="outline">{event.year}</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEvent(event)}
                      >
                        ✏️ تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => event.id && deleteEvent(event.id)}
                        className="text-red-600 hover:bg-red-50"
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
                {events.length}
              </div>
              <div className="text-sm text-gray-400">أحداث اليوم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {events.filter((e) => e.year).length}
              </div>
              <div className="text-sm text-gray-400">أحداث مؤرخة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {new Set(events.map((e) => e.category)).size}
              </div>
              <div className="text-sm text-gray-400">فئات مختلفة</div>
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
