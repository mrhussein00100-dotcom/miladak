'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArabicDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// أسماء الأيام بالعربية
const ARABIC_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

// أسماء الشهور بالعربية
const ARABIC_MONTHS = [
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

// تحويل الأرقام للعربية
const toArabicNum = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
};

// الحصول على عدد أيام الشهر
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// الحصول على أول يوم في الشهر
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// مكون منفصل للتقويم المنبثق باستخدام Portal
function CalendarPopup({
  containerRef,
  children,
  onClose,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const popupHeight = 350;
      const popupWidth = 280;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top: number;
      let left: number;

      if (spaceBelow >= popupHeight + 8) {
        top = rect.bottom + 8;
      } else if (spaceAbove >= popupHeight + 8) {
        top = rect.top - popupHeight - 8;
      } else {
        top = Math.max(8, (viewportHeight - popupHeight) / 2);
      }

      left = rect.left;
      if (left + popupWidth > viewportWidth - 8) {
        left = viewportWidth - popupWidth - 8;
      }
      if (left < 8) {
        left = 8;
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [containerRef]);

  // إغلاق عند النقر خارج التقويم
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // تحقق من أن النقر ليس داخل التقويم أو الزر
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, containerRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={popupRef}
      className="fixed z-[99999]"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body
  );
}

const ArabicDatePicker = React.memo(function ArabicDatePicker({
  value,
  onChange,
  label,
  placeholder = 'اختر التاريخ',
  minDate,
  maxDate,
  className = '',
}: ArabicDatePickerProps) {
  const [inputMode, setInputMode] = useState<'calendar' | 'simple'>('simple');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value || new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [simpleDay, setSimpleDay] = useState('');
  const [simpleMonth, setSimpleMonth] = useState('');
  const [simpleYear, setSimpleYear] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // تم نقل handleClickOutside إلى CalendarPopup

  useEffect(() => {
    if (value) {
      setSimpleDay(String(value.getDate()));
      setSimpleMonth(String(value.getMonth() + 1));
      setSimpleYear(String(value.getFullYear()));
      setViewDate(value);
    } else {
      setSimpleDay('');
      setSimpleMonth('');
      setSimpleYear('');
    }
  }, [value]);

  useEffect(() => {
    if (simpleDay && simpleMonth && simpleYear && inputMode === 'simple') {
      const year = Number(simpleYear);
      const month = Number(simpleMonth);
      const day = Number(simpleDay);
      const maxDays = getDaysInMonth(year, month - 1);
      const validDay = Math.min(day, maxDays);
      const newDate = new Date(year, month - 1, validDay);
      if (!isNaN(newDate.getTime())) {
        if (!value || newDate.getTime() !== value.getTime()) {
          onChange(newDate);
        }
      }
    }
  }, [simpleDay, simpleMonth, simpleYear, inputMode, value, onChange]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const years = useMemo(() => {
    const min = minDate?.getFullYear() || 1900;
    const max = maxDate?.getFullYear() || new Date().getFullYear() + 50;
    const list = [];
    for (let y = max; y >= min; y--) {
      list.push({ value: String(y), label: toArabicNum(y) });
    }
    return list;
  }, [minDate, maxDate]);

  const months = useMemo(() => {
    return ARABIC_MONTHS.map((name, i) => ({
      value: String(i + 1),
      label: name,
    }));
  }, []);

  const days = useMemo(() => {
    const year = simpleYear ? Number(simpleYear) : new Date().getFullYear();
    const month = simpleMonth ? Number(simpleMonth) : 1;
    const daysCount = getDaysInMonth(year, month - 1);
    const list = [];
    for (let d = 1; d <= daysCount; d++) {
      list.push({ value: String(d), label: toArabicNum(d) });
    }
    return list;
  }, [simpleYear, simpleMonth]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysList: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) daysList.push(null);
    for (let d = 1; d <= daysInMonth; d++) daysList.push(d);
    return daysList;
  }, [currentYear, currentMonth]);

  const goToPrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const selectDay = useCallback(
    (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day);
      onChange(newDate);
      setIsCalendarOpen(false);
    },
    [currentYear, currentMonth, onChange]
  );

  const selectMonth = useCallback(
    (month: number) => {
      setViewDate(new Date(currentYear, month, 1));
      setViewMode('days');
    },
    [currentYear]
  );

  const selectYear = useCallback(
    (year: number) => {
      setViewDate(new Date(year, currentMonth, 1));
      setViewMode('months');
    },
    [currentMonth]
  );

  const isDateDisabled = useCallback(
    (day: number) => {
      const date = new Date(currentYear, currentMonth, day);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [currentYear, currentMonth, minDate, maxDate]
  );

  const isSelected = useCallback(
    (day: number) => {
      if (!value) return false;
      return (
        value.getDate() === day &&
        value.getMonth() === currentMonth &&
        value.getFullYear() === currentYear
      );
    },
    [value, currentMonth, currentYear]
  );

  const isToday = useCallback(
    (day: number) => {
      const today = new Date();
      return (
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear
      );
    },
    [currentMonth, currentYear]
  );

  const formattedDate = useMemo(() => {
    if (!value) return '';
    return `${toArabicNum(value.getDate())} ${
      ARABIC_MONTHS[value.getMonth()]
    } ${toArabicNum(value.getFullYear())}`;
  }, [value]);

  return (
    <div ref={containerRef} className={cn('space-y-3', className)}>
      {/* Label و Toggle */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setInputMode('calendar')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              inputMode === 'calendar'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            📅 التقويم
          </button>
          <button
            type="button"
            onClick={() => setInputMode('simple')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              inputMode === 'simple'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            🔢 بالأرقام
          </button>
        </div>
      </div>

      {/* وضع الإدخال البسيط */}
      {inputMode === 'simple' && (
        <div className="grid grid-cols-3 gap-3">
          <select
            value={simpleDay}
            onChange={(e) => setSimpleDay(e.target.value)}
            className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base cursor-pointer"
            dir="rtl"
            aria-label="اختر اليوم"
          >
            <option value="">اليوم</option>
            {days.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={simpleMonth}
            onChange={(e) => setSimpleMonth(e.target.value)}
            className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base cursor-pointer"
            dir="rtl"
            aria-label="اختر الشهر"
          >
            <option value="">الشهر</option>
            {months.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={simpleYear}
            onChange={(e) => setSimpleYear(e.target.value)}
            className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base cursor-pointer"
            dir="rtl"
            aria-label="اختر السنة"
          >
            <option value="">السنة</option>
            {years.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* وضع التقويم المرئي */}
      {inputMode === 'calendar' && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={cn(
              'w-full h-12 px-4 rounded-xl border text-right',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
              'hover:border-purple-400 dark:hover:border-purple-500',
              'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              'transition-all duration-200 flex items-center justify-between gap-2',
              isCalendarOpen && 'ring-2 ring-purple-500 border-transparent'
            )}
          >
            <Calendar className="w-5 h-5 text-gray-400" />
            <span
              className={cn(
                'flex-1 text-right',
                value ? 'text-gray-900 dark:text-white' : 'text-gray-400'
              )}
            >
              {formattedDate || placeholder}
            </span>
            {value && (
              <X
                className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              />
            )}
          </button>

          {isCalendarOpen && (
            <CalendarPopup
              containerRef={containerRef}
              onClose={() => setIsCalendarOpen(false)}
            >
              <div
                className={cn(
                  'min-w-[260px] max-w-[280px] bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-600 rounded-xl p-3'
                )}
                style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('months')}
                      className="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                    >
                      {ARABIC_MONTHS[currentMonth]}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('years')}
                      className="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                    >
                      {toArabicNum(currentYear)}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Days View */}
                {viewMode === 'days' && (
                  <>
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                      {ARABIC_DAYS.map((day) => (
                        <div
                          key={day}
                          className="text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {calendarDays.map((day, index) => (
                        <div key={index} className="aspect-square min-h-[28px]">
                          {day !== null && (
                            <button
                              type="button"
                              onClick={() => selectDay(day)}
                              disabled={isDateDisabled(day)}
                              className={cn(
                                'w-full h-full rounded-md text-xs font-medium transition-all duration-150',
                                'hover:bg-purple-100 dark:hover:bg-purple-900/30',
                                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                                isSelected(day) &&
                                  'bg-purple-500 text-white hover:bg-purple-600',
                                isToday(day) &&
                                  !isSelected(day) &&
                                  'border-2 border-purple-500',
                                !isSelected(day) &&
                                  'text-gray-700 dark:text-gray-300'
                              )}
                            >
                              {toArabicNum(day)}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Months View */}
                {viewMode === 'months' && (
                  <div className="grid grid-cols-3 gap-1">
                    {ARABIC_MONTHS.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => selectMonth(index)}
                        className={cn(
                          'py-2 px-1 rounded-lg text-xs font-medium transition-all',
                          'hover:bg-purple-100 dark:hover:bg-purple-900/30',
                          currentMonth === index &&
                            'bg-purple-500 text-white hover:bg-purple-600',
                          currentMonth !== index &&
                            'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}

                {/* Years View */}
                {viewMode === 'years' && (
                  <div className="h-48 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-1">
                      {years.map((year) => (
                        <button
                          key={year.value}
                          type="button"
                          onClick={() => selectYear(Number(year.value))}
                          className={cn(
                            'py-1.5 px-1 rounded-lg text-xs font-medium transition-all',
                            'hover:bg-purple-100 dark:hover:bg-purple-900/30',
                            currentYear === Number(year.value) &&
                              'bg-purple-500 text-white hover:bg-purple-600',
                            currentYear !== Number(year.value) &&
                              'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {year.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onChange(new Date());
                      setIsCalendarOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 transition-colors"
                  >
                    اليوم
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null);
                      setIsCalendarOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    مسح
                  </button>
                </div>
              </div>
            </CalendarPopup>
          )}
        </div>
      )}

      {/* عرض التاريخ المحدد */}
      {value && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          📅 التاريخ المحدد: {formattedDate}
        </div>
      )}
    </div>
  );
});

export default ArabicDatePicker;
