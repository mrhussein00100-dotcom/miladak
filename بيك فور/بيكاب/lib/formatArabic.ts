/**
 * تنسيق الأرقام بالعربية
 */
export function formatArabicNumber(num: number): string {
  if (isNaN(num)) return '٠';
  return new Intl.NumberFormat('ar-EG').format(num);
}

export function formatGregorianDateArabic(dateInput: string | Date): string {
  const d =
    typeof dateInput === 'string'
      ? new Date(dateInput + 'T00:00:00Z')
      : dateInput;
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();

  // Use consistent formatting to avoid hydration errors
  const formatNumber = (num: number): string => {
    if (isNaN(num)) return 'ليس رقم';
    return num.toString();
  };

  return `${formatNumber(day)}/${formatNumber(month)}/${formatNumber(year)}`;
}

// Deterministic Islamic (civil) calendar conversion (no ICU dependence)
function gregorianToJD(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

function islamicToJD(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    1948439
  );
}

function jdToIslamicCivil(jd: number): {
  year: number;
  month: number;
  day: number;
} {
  const year = Math.floor((30 * (jd - 1948440) + 10646) / 10631);
  const month = Math.min(
    12,
    Math.ceil((jd - (29 + islamicToJD(year, 1, 1))) / 29.5) + 1
  );
  const day = jd - islamicToJD(year, month, 1) + 1;
  return { year, month, day };
}

function normalizeUTC(dateInput: string | Date): {
  y: number;
  m: number;
  d: number;
} {
  let d: Date;
  if (typeof dateInput === 'string') {
    d = new Date(dateInput + 'T00:00:00Z');
  } else {
    d = new Date(
      Date.UTC(
        dateInput.getFullYear(),
        dateInput.getMonth(),
        dateInput.getDate()
      )
    );
  }
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

export function gregorianToHijriCivil(
  dateInput: string | Date,
  offsetDays: number = 0
): { year: number; month: number; day: number } {
  const { y, m, d } = normalizeUTC(dateInput);
  const jd = gregorianToJD(y, m, d) + offsetDays;
  return jdToIslamicCivil(jd);
}

export function formatHijriDateArabic(
  dateInput: string | Date,
  offsetDays: number = 0
): string {
  const { year, month, day } = gregorianToHijriCivil(dateInput, offsetDays);
  const months = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  // Use consistent formatting to avoid hydration errors
  const formatNumber = (num: number): string => {
    if (isNaN(num)) return 'ليس رقم';
    return Math.floor(num).toString();
  };

  return `${formatNumber(day)} ${months[month - 1]} ${formatNumber(year)} هـ`;
}
