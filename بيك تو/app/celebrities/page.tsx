import { Metadata } from 'next';
import CelebritiesPageClient from '@/components/pages/CelebritiesPage';

export const metadata: Metadata = {
  title: 'مشاهير ولدوا في يومك | ميلادك',
  description:
    'اكتشف المشاهير الذين ولدوا في نفس يوم ميلادك. تصفح قائمة المشاهير حسب تاريخ الميلاد.',
  keywords: [
    'مشاهير يوم الميلاد',
    'من ولد في يومي',
    'مشاهير ولدوا اليوم',
    'أعياد ميلاد المشاهير',
    'ميلادك',
  ],
};

export default function CelebritiesPage() {
  return <CelebritiesPageClient />;
}
