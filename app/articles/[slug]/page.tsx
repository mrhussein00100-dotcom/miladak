import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePageClient from '@/components/ArticlePageClient';
import { JsonLd } from '@/components/SEO/JsonLd';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/jsonld';
import type { Article } from '@/types';
import { execute, query, queryOne } from '@/lib/db/database';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// دالة موحدة لإصلاح ترميز النص العربي
function fixArabicEncoding(text: string | null | undefined): string {
  if (!text) return '';

  // إذا كان النص يحتوي على أحرف عربية صحيحة، أعده كما هو
  if (/[\u0600-\u06FF]/.test(text)) {
    return text;
  }

  // إذا كان النص يحتوي على علامات استفهام متتالية، حاول إصلاحه
  if (text.includes('??????') || text.includes('????')) {
    try {
      // محاولة فك الترميز من latin1 إلى utf8
      const decoded = Buffer.from(text, 'latin1').toString('utf8');
      if (/[\u0600-\u06FF]/.test(decoded)) {
        return decoded;
      }
    } catch {
      // تجاهل الخطأ
    }
  }

  return text;
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    // Debug: Log the slug being searched
    console.log('🔍 Searching for article with slug:', slug);

    // Try multiple query approaches for compatibility
    let article = await queryOne<Article>(
      `
        SELECT a.*, c.name as category_name, c.color as category_color
        FROM articles a
        LEFT JOIN article_categories c ON CAST(a.category_id AS INTEGER) = c.id
        WHERE a.slug = ?
      `,
      [slug]
    );

    // If not found, try without category join
    if (!article) {
      console.log('📄 Trying without category join...');
      article = await queryOne<Article>(
        `SELECT * FROM articles WHERE slug = ?`,
        [slug]
      );
    }

    console.log('📄 Article found:', article ? 'Yes' : 'No');
    if (article) {
      console.log('📄 Article published status:', article.published);

      // Check if published - convert to string for comparison
      const pubValue = String(article.published);
      const isPublished = pubValue === '1' || pubValue === 'true';

      if (!isPublished) {
        console.log('📄 Article is not published');
        return null;
      }
    }

    if (article) {
      try {
        await execute('UPDATE articles SET views = views + 1 WHERE id = ?', [
          article.id,
        ]);
      } catch (e) {
        console.error('Error updating views:', e);
      }
    }

    return article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(
  categoryId: number,
  currentId: number
): Promise<Article[]> {
  try {
    return await query<Article>(
      `
        SELECT a.id, a.title, a.slug, a.excerpt, a.image, a.featured_image, a.read_time, a.category_id,
               c.name as category_name, c.color as category_color
        FROM articles a
        LEFT JOIN article_categories c ON CAST(a.category_id AS INTEGER) = c.id
        WHERE CAST(a.category_id AS INTEGER) = ? AND a.id != ? AND CAST(a.published AS TEXT) IN ('1', 'true')
        ORDER BY a.created_at DESC
        LIMIT 3
      `,
      [categoryId, currentId]
    );
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  // Decode the slug in case it's URL encoded (Arabic characters)
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticle(decodedSlug);

  if (!article) {
    return { title: 'المقال غير موجود - ميلادك' };
  }

  const featuredImage = article.featured_image || article.image;
  const cleanTitle = fixArabicEncoding(article.title);
  const cleanExcerpt = fixArabicEncoding(article.excerpt);

  return {
    title: `${cleanTitle} - ميلادك`,
    description: cleanExcerpt,
    keywords: article.meta_keywords || '',
    openGraph: {
      title: cleanTitle,
      description: cleanExcerpt,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: [article.author || 'فريق ميلادك'],
      images: featuredImage ? [{ url: featuredImage, alt: cleanTitle }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanExcerpt,
      images: featuredImage ? [featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  // Decode the slug in case it's URL encoded (Arabic characters)
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticle(decodedSlug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(
    article.category_id ?? 0,
    article.id
  );
  const relatedArticlesResult = await relatedArticles;

  // Generate Article JSON-LD schema
  const articleSchema = generateArticleSchema({
    title: fixArabicEncoding(article.title),
    description: fixArabicEncoding(article.excerpt),
    slug: article.slug,
    image: article.featured_image || article.image,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: article.author,
    keywords: article.meta_keywords,
    category: article.category_name,
    wordCount: article.content?.split(/\s+/).length,
  });

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: 'https://miladak.com' },
    { name: 'المقالات', url: 'https://miladak.com/articles' },
    { name: fixArabicEncoding(article.title) },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <ArticlePageClient
        article={{
          ...article,
          title: fixArabicEncoding(article.title),
          content: fixArabicEncoding(article.content),
          excerpt: fixArabicEncoding(article.excerpt),
          image: article.image ?? undefined,
          featured_image: article.featured_image ?? undefined,
          category_id: article.category_id ?? 0,
          category_name: article.category_name ?? 'عام',
          author: article.author || 'فريق ميلادك',
        }}
        relatedArticles={relatedArticlesResult.map((a) => ({
          id: a.id,
          title: fixArabicEncoding(a.title),
          slug: a.slug,
          excerpt: fixArabicEncoding(a.excerpt),
          image: (a.featured_image || a.image) ?? undefined,
          read_time: a.read_time,
        }))}
      />
    </>
  );
}
