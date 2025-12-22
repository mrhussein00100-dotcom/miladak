import { Metadata } from 'next';
import { CategoriesPageClient } from '@/components/CategoriesPageClient';
import { getCategories as getArticleCategories } from '@/lib/db/categories';

// جعل الصفحة ديناميكية لجلب البيانات في كل طلب
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'تصنيفات المقالات - ميلادك',
  description:
    'تصفح جميع تصنيفات المقالات في موقع ميلادك - الصحة والعافية، التطوير الذاتي، العلاقات الاجتماعية، الثقافة والمعرفة، ونصائح وإرشادات مفيدة',
  keywords: [
    'تصنيفات المقالات',
    'فئات المقالات',
    'الصحة والعافية',
    'التطوير الذاتي',
    'العلاقات الاجتماعية',
    'الثقافة والمعرفة',
    'نصائح وإرشادات',
    'مقالات ميلادك',
    'محتوى عربي',
    'مواضيع متنوعة',
  ],
  openGraph: {
    title: 'تصنيفات المقالات - ميلادك',
    description:
      'اكتشف مجموعة متنوعة من المقالات المفيدة مقسمة حسب التصنيفات في موقع ميلادك',
    type: 'website',
  },
};

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  image?: string;
  color: string;
  article_count: number;
}

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await getArticleCategories();

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoriesPageClient categories={categories} />;
}
