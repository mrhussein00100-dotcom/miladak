import { Metadata } from 'next';
import DateDetailPageClient from '@/components/pages/DateDetailPage';

const MONTHS = [
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

interface PageProps {
  params: Promise<{ month: string; day: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { month, day } = await params;
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);
  const monthName = MONTHS[monthNum - 1] || '';

  return {
    title: `${dayNum} ${monthName} | ميلادك - أحداث ومشاهير`,
    description: `اكتشف الأحداث التاريخية والمشاهير الذين ولدوا في ${dayNum} ${monthName}. معلومات شاملة عن هذا اليوم.`,
    keywords: [
      `${dayNum} ${monthName}`,
      'أحداث تاريخية',
      'مشاهير',
      'يوم الميلاد',
      'ميلادك',
    ],
  };
}

export default async function DateDetailPage({ params }: PageProps) {
  const { month, day } = await params;
  return <DateDetailPageClient month={parseInt(month)} day={parseInt(day)} />;
}
