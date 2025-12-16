// حسابات المناطق الزمنية المبسطة

export interface Timezone {
  id: string;
  name: string;
  offset: number;
  flag: string;
}

export const timezones: Timezone[] = [
  { id: 'mecca', name: 'مكة المكرمة', offset: 3, flag: '🇸🇦' },
  { id: 'cairo', name: 'القاهرة', offset: 2, flag: '🇪🇬' },
  { id: 'dubai', name: 'دبي', offset: 4, flag: '🇦🇪' },
  { id: 'london', name: 'لندن', offset: 0, flag: '🇬🇧' },
  { id: 'new_york', name: 'نيويورك', offset: -5, flag: '🇺🇸' }
];

export function getTimezoneById(id: string): Timezone | null {
  return timezones.find(tz => tz.id === id) || null;
}

export function toArabicNumerals(num: number): string {
  return String(num).replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d)));
}