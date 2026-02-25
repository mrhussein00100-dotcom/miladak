import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'حاسبة العمر الأساسية | ميلادك',
  description: 'احسب عمرك بدقة باستخدام حاسبة العمر الأساسية',
};

export default function BasicAgeCalculatorPage() {
  // توجيه المستخدم للصفحة الرئيسية حيث توجد حاسبة العمر
  redirect('/');
}
