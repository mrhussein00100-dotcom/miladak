'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, ArrowLeftRight, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// خوارزمية Kuwaiti المحسنة للتحويل بين التقويمين الهجري والميلادي
// هذه الخوارزمية دقيقة ومستخدمة في الموقع القديم

// خوارزمية Kuwaiti المحسنة للتحويل من ميلادي إلى هجري (نفس الموقع القديم)
function gregorianToHijri(
  gregorianYear: number,
  gregorianMonth: number,
  gregorianDay: number
) {
  const a = Math.floor((14 - gregorianMonth) / 12);
  const y = gregorianYear - a;
  const m = gregorianMonth + 12 * a - 3;

  const jd =
    gregorianDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) +
    1721119.5;

  let l = Math.floor(jd - 1948440.5 + 10632);
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day };
}

// خوارزمية Kuwaiti المحسنة للتحويل من هجري إلى ميلادي (نفس الموقع القديم)
function hijriToGregorian(
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number
) {
  const jd =
    Math.floor((11 * hijriYear + 3) / 30) +
    354 * hijriYear +
    30 * hijriMonth -
    Math.floor((hijriMonth - 1) / 2) +
    hijriDay +
    1948440.5 -
    385;

  const a = Math.floor(jd + 0.5) + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

const hijriMonths = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const gregorianMonths = [
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
const toArabicNumerals = (num: number) => {
  return String(num)
    .split('')
    .map((d) => String.fromCharCode(0x0660 + parseInt(d)))
    .join('');
};

export default function DateConverterPage() {
  const [conversionType, setConversionType] = useState<
    'toHijri' | 'toGregorian'
  >('toHijri');
  const [inputDate, setInputDate] = useState('');
  const [result, setResult] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  // حالة وضع الإدخال
  const [inputMode, setInputMode] = useState<'calendar' | 'simple'>('simple');
  const [simpleYear, setSimpleYear] = useState('');
  const [simpleMonth, setSimpleMonth] = useState('');
  const [simpleDay, setSimpleDay] = useState('');

  // توليد السنوات
  const currentYearVal = new Date().getFullYear();
  const minYear = conversionType === 'toHijri' ? 1900 : 1300;
  const maxYear = conversionType === 'toHijri' ? currentYearVal : 1500;

  const years = useMemo(() => {
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
      const year = maxYear - i;
      return { value: String(year), label: toArabicNumerals(year) };
    });
  }, [maxYear, minYear]);

  // أسماء الشهور حسب نوع التحويل
  const monthNames =
    conversionType === 'toHijri' ? gregorianMonths : hijriMonths;
  const months = monthNames.map((label, i) => ({
    value: String(i + 1),
    label,
  }));

  // توليد الأيام حسب الشهر والسنة
  const daysCount = useMemo(() => {
    if (simpleYear && simpleMonth) {
      if (conversionType === 'toHijri') {
        return new Date(Number(simpleYear), Number(simpleMonth), 0).getDate();
      } else {
        // للتقويم الهجري - تقريبي
        const month = Number(simpleMonth);
        return month % 2 === 1 ? 30 : 29;
      }
    }
    return 30;
  }, [simpleYear, simpleMonth, conversionType]);

  const days = useMemo(() => {
    return Array.from({ length: daysCount }, (_, i) => ({
      value: String(i + 1),
      label: toArabicNumerals(i + 1),
    }));
  }, [daysCount]);

  // مزامنة القيمة مع الحقول
  useEffect(() => {
    if (inputDate) {
      const [y, m, d] = inputDate.split('-');
      if (y && m && d) {
        setSimpleYear(y);
        setSimpleMonth(String(Number(m)));
        setSimpleDay(String(Number(d)));
      }
    }
  }, [inputDate]);

  // تحديث القيمة عند تغيير الحقول البسيطة
  useEffect(() => {
    if (simpleYear && simpleMonth && simpleDay) {
      const dateStr = `${simpleYear}-${String(Number(simpleMonth)).padStart(
        2,
        '0'
      )}-${String(Number(simpleDay)).padStart(2, '0')}`;
      if (dateStr !== inputDate) {
        setInputDate(dateStr);
      }
    }
  }, [simpleYear, simpleMonth, simpleDay]);

  // إعادة تعيين عند تغيير نوع التحويل
  useEffect(() => {
    setInputDate('');
    setSimpleYear('');
    setSimpleMonth('');
    setSimpleDay('');
    setResult(null);
  }, [conversionType]);

  const handleConvert = () => {
    if (!inputDate) return;
    const [year, month, day] = inputDate.split('-').map(Number);
    if (conversionType === 'toHijri') {
      const hijri = gregorianToHijri(year, month, day);
      setResult(hijri);
    } else {
      const gregorian = hijriToGregorian(year, month, day);
      setResult(gregorian);
    }
  };

  const formatResult = () => {
    if (!result) return '';
    if (conversionType === 'toHijri') {
      return `${result.day} ${hijriMonths[result.month - 1]} ${result.year} هـ`;
    } else {
      return `${result.day} ${gregorianMonths[result.month - 1]} ${
        result.year
      } م`;
    }
  };

  return (
    <ToolPageLayout
      toolName="محول التاريخ الهجري والميلادي"
      toolSlug="date-converter"
      toolDescription="حول التاريخ بين التقويم الهجري والميلادي بسهولة ودقة"
      toolIcon="📅"
      gradient="from-indigo-500 to-blue-500"
      showKeywords={true}
      keywords={[
        'محول التاريخ',
        'تحويل هجري ميلادي',
        'التقويم الهجري',
        'التقويم الميلادي',
      ]}
      seoContent={<SEOContentSection />}
    >
      <div className="max-w-2xl mx-auto">
        {/* اختيار نوع التحويل */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => {
              setConversionType('toHijri');
              setResult(null);
            }}
            variant={conversionType === 'toHijri' ? 'default' : 'outline'}
            className={`flex-1 ${
              conversionType === 'toHijri'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                : ''
            }`}
          >
            <Sun className="w-4 h-4 ml-2" />
            ميلادي → هجري
          </Button>
          <Button
            onClick={() => {
              setConversionType('toGregorian');
              setResult(null);
            }}
            variant={conversionType === 'toGregorian' ? 'default' : 'outline'}
            className={`flex-1 ${
              conversionType === 'toGregorian'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                : ''
            }`}
          >
            <Moon className="w-4 h-4 ml-2" />
            هجري → ميلادي
          </Button>
        </div>

        {/* إدخال التاريخ */}
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Label و Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                {conversionType === 'toHijri'
                  ? 'التاريخ الميلادي'
                  : 'التاريخ الهجري'}
              </label>
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

            {/* حقول الإدخال */}
            <motion.div
              key={`${inputMode}-${conversionType}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {inputMode === 'calendar' ? (
                <div>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    max={
                      conversionType === 'toHijri'
                        ? new Date().toISOString().split('T')[0]
                        : undefined
                    }
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200 text-lg"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {/* اليوم */}
                  <select
                    value={simpleDay}
                    onChange={(e) => setSimpleDay(e.target.value)}
                    className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200 text-base cursor-pointer"
                    dir="rtl"
                  >
                    <option value="">اليوم</option>
                    {days.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* الشهر */}
                  <select
                    value={simpleMonth}
                    onChange={(e) => setSimpleMonth(e.target.value)}
                    className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200 text-base cursor-pointer"
                    dir="rtl"
                  >
                    <option value="">الشهر</option>
                    {months.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* السنة */}
                  <select
                    value={simpleYear}
                    onChange={(e) => setSimpleYear(e.target.value)}
                    className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200 text-base cursor-pointer"
                    dir="rtl"
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
            </motion.div>

            {/* معلومة مساعدة */}
            {inputDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                {conversionType === 'toHijri' ? '📅' : '🌙'} التاريخ المحدد:{' '}
                {inputDate}
              </motion.div>
            )}
          </div>

          <Button
            onClick={handleConvert}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
            disabled={!inputDate}
          >
            <ArrowLeftRight className="w-4 h-4 ml-2" />
            تحويل
          </Button>
        </div>

        {/* النتيجة */}
        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {conversionType === 'toHijri'
                ? 'التاريخ الهجري'
                : 'التاريخ الميلادي'}
            </p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatResult()}
            </p>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              التقويم الميلادي
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              يعتمد على دورة الشمس ويتكون من 365 يوماً (366 في السنة الكبيسة)
            </p>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <h3 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <Moon className="w-5 h-5" />
              التقويم الهجري
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              يعتمد على دورة القمر ويتكون من 354 أو 355 يوماً
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}

// مكون المحتوى النصي الشامل - يُعرض أسفل الصفحة
function SEOContentSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* العنوان الرئيسي */}
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent text-center mb-6">
            دليلك الشامل لمحول التاريخ الهجري والميلادي
          </h2>

          <p className="text-xl text-center mb-10 text-gray-600 dark:text-gray-400 leading-relaxed">
            اكتشف كيفية تحويل التواريخ بين التقويم الميلادي والهجري بدقة
            متناهية، وتعرف على أهمية كل تقويم في حياتنا اليومية
          </p>

          {/* مقدمة */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-2xl not-prose">📅</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ما هو محول التاريخ الهجري والميلادي؟
              </span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              محول التاريخ هو أداة رقمية متطورة ومجانية تمكنك من تحويل أي تاريخ
              بين التقويم الميلادي (الغريغوري) والتقويم الهجري (الإسلامي) بدقة
              عالية وسرعة فائقة. تعتمد هذه الأداة على خوارزميات رياضية دقيقة
              تضمن لك الحصول على نتائج صحيحة في كل مرة، سواء كنت تحتاج لمعرفة
              تاريخ مناسبة دينية، أو تخطط لحدث مهم، أو تجري بحثاً تاريخياً.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يستخدم محول التاريخ خوارزمية Kuwaiti المحسنة التي تعتبر من أدق
              الخوارزميات المتاحة لتحويل التواريخ، حيث تأخذ في الاعتبار جميع
              الفروقات الدقيقة بين التقويمين وتضمن دقة النتائج حتى للتواريخ
              التاريخية القديمة.
            </p>
          </div>

          {/* كيفية الاستخدام */}
          <div className="mb-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-2xl not-prose">🔄</span>
              <span className="bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                كيفية استخدام محول التاريخ
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    اختر نوع التحويل
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    حدد ما إذا كنت تريد التحويل من ميلادي إلى هجري أو العكس
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    أدخل التاريخ
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    يمكنك استخدام التقويم المرئي أو إدخال التاريخ يدوياً
                    بالأرقام
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    احصل على النتيجة
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    انقر على زر "تحويل" للحصول على التاريخ المحول فوراً
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الفرق بين التقويمين */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-2xl not-prose">⚖️</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                الفرق بين التقويم الهجري والميلادي
              </span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <h4 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                  <Sun className="w-6 h-6" />
                  التقويم الميلادي (الشمسي)
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> يعتمد على دورة
                    الأرض حول الشمس
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> السنة تتكون من
                    365.25 يوماً
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> 12 شهراً بأيام
                    ثابتة تقريباً
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> يبدأ من ميلاد
                    السيد المسيح
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> مستخدم عالمياً في
                    المعاملات الرسمية
                  </li>
                </ul>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                <h4 className="text-xl font-bold text-pink-700 dark:text-pink-400 mb-4 flex items-center gap-2">
                  <Moon className="w-6 h-6" />
                  التقويم الهجري (القمري)
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">•</span> يعتمد على دورة
                    القمر حول الأرض
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">•</span> السنة تتكون من 354
                    أو 355 يوماً
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">•</span> 12 شهراً قمرياً
                    (29-30 يوماً)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">•</span> يبدأ من هجرة النبي
                    محمد ﷺ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">•</span> مستخدم في العالم
                    الإسلامي
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border-r-4 border-orange-500">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-orange-700 dark:text-orange-400">
                  💡 معلومة مهمة:
                </strong>{' '}
                الفرق بين السنة الهجرية والميلادية حوالي 11 يوماً، مما يعني أن
                كل 33 سنة هجرية تقريباً تساوي 32 سنة ميلادية.
              </p>
            </div>
          </div>

          {/* أهمية التقويم الهجري */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-2xl not-prose">🌙</span>
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                أهمية التقويم الهجري في الحياة الإسلامية
              </span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              يحتل التقويم الهجري مكانة خاصة في حياة المسلمين حول العالم، فهو
              ليس مجرد نظام لحساب الأيام والشهور، بل هو جزء أساسي من الهوية
              الإسلامية والتراث الديني. يرتبط التقويم الهجري بالعديد من الشعائر
              والمناسبات الدينية المهمة التي يحرص المسلمون على إحيائها كل عام.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  شهر رمضان المبارك
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  شهر الصيام والعبادة، الشهر التاسع في التقويم الهجري
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-2">
                  موسم الحج
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  في شهر ذي الحجة، الركن الخامس من أركان الإسلام
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">
                  عيد الفطر
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  أول شوال، احتفال بانتهاء شهر رمضان
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  عيد الأضحى
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  10 ذي الحجة، يوم النحر والتضحية
                </p>
              </div>
            </div>
          </div>

          {/* استخدامات عملية */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-2xl not-prose">💼</span>
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                استخدامات محول التاريخ في الحياة العملية
              </span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              لا يقتصر استخدام محول التاريخ على المناسبات الدينية فحسب، بل يمتد
              ليشمل العديد من المجالات العملية والأكاديمية والتجارية. إليك أبرز
              الاستخدامات:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">📚</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    البحث الأكاديمي والتاريخي
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    تحويل التواريخ التاريخية لدراسة الأحداث الإسلامية والعربية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    المعاملات القانونية
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    توثيق العقود والوثائق الرسمية بالتقويمين
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">🏢</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    التخطيط التجاري
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    تحديد مواعيد الحملات التسويقية في المناسبات الإسلامية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">🎂</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    المناسبات الشخصية
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    معرفة تاريخ الميلاد بالهجري أو تحديد ذكرى الزواج
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الأسئلة الشائعة */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-2xl not-prose">❓</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                الأسئلة الشائعة حول تحويل التاريخ
              </span>
            </h3>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border-r-4 border-purple-500">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">
                  لماذا السنة الهجرية أقصر من الميلادية؟
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  لأن التقويم الهجري يعتمد على دورة القمر حول الأرض (29.5 يوم
                  للشهر الواحد تقريباً)، بينما التقويم الميلادي يعتمد على دورة
                  الأرض حول الشمس. هذا يجعل السنة الهجرية أقصر بحوالي 11 يوماً.
                </p>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-xl border-r-4 border-pink-500">
                <h4 className="font-bold text-pink-700 dark:text-pink-400 mb-2">
                  هل يمكن الاعتماد على المحول لتحديد المناسبات الدينية؟
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  المحول يعطي تواريخ دقيقة فلكياً، لكن للمناسبات الدينية مثل
                  بداية رمضان والأعياد، يُنصح بالرجوع للجهات الدينية المختصة لأن
                  بعض الدول تعتمد على الرؤية البصرية للهلال.
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border-r-4 border-orange-500">
                <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">
                  ما مدى دقة هذا المحول؟
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  يستخدم المحول خوارزمية Kuwaiti المحسنة التي تعتبر من أدق
                  الخوارزميات المتاحة، وتوفر دقة عالية جداً للتواريخ من عام
                  1900م وحتى اليوم.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border-r-4 border-purple-500">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">
                  كيف أعرف تاريخ ميلادي بالهجري؟
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  ببساطة اختر "ميلادي → هجري"، ثم أدخل تاريخ ميلادك بالميلادي،
                  وانقر على "تحويل" للحصول على تاريخ ميلادك بالتقويم الهجري
                  فوراً.
                </p>
              </div>
            </div>
          </div>

          {/* نصائح */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl not-prose">💡</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                نصائح لاستخدام محول التاريخ بفعالية
              </span>
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">✓</span>
                <span>احفظ هذه الصفحة في المفضلة للوصول السريع عند الحاجة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">✓</span>
                <span>
                  استخدم وضع "بالأرقام" لإدخال التواريخ الهجرية بسهولة
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span>تحقق من النتائج مع مصادر أخرى للتواريخ المهمة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">✓</span>
                <span>تذكر أن اليوم الهجري يبدأ من غروب الشمس</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
