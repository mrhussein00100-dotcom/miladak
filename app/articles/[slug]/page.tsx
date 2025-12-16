import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePageClient from '@/components/ArticlePageClient';
import { JsonLd } from '@/components/SEO/JsonLd';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/jsonld';
import type { Article } from '@/types';
import Database from 'better-sqlite3';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function getArticle(slug: string): Article | null {
  let db: Database.Database | null = null;
  try {
    db = new Database('database.sqlite');

    const article = db
      .prepare(
        `
      SELECT a.*, c.name as category_name, c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.published = 1
    `
      )
      .get(slug) as Article | undefined;

    if (article) {
      try {
        db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(
          article.id
        );
      } catch (e) {
        console.error('Error updating views:', e);
      }
    }

    return article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  } finally {
    if (db) db.close();
  }
}

function getRelatedArticles(categoryId: number, currentId: number): Article[] {
  let db: Database.Database | null = null;
  try {
    db = new Database('database.sqlite');

    return db
      .prepare(
        `
      SELECT a.id, a.title, a.slug, a.excerpt, a.image, a.featured_image, a.read_time, a.category_id,
             c.name as category_name, c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ? AND a.id != ? AND a.published = 1
      ORDER BY a.created_at DESC
      LIMIT 3
    `
      )
      .all(categoryId, currentId) as Article[];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  } finally {
    if (db) db.close();
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  // Decode the slug in case it's URL encoded (Arabic characters)
  const decodedSlug = decodeURIComponent(slug);
  const article = getArticle(decodedSlug);

  if (!article) {
    return { title: 'المقال غير موجود - ميلادك' };
  }

  const featuredImage = article.featured_image || article.image;

  return {
    title: `${article.title} - ميلادك`,
    description: article.excerpt,
    keywords: article.meta_keywords || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: [article.author || 'فريق ميلادك'],
      images: featuredImage ? [{ url: featuredImage, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: featuredImage ? [featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  // Decode the slug in case it's URL encoded (Arabic characters)
  const decodedSlug = decodeURIComponent(slug);
  const article = getArticle(decodedSlug);

  // Server-side debug logging
  console.log('=== SERVER DEBUG ===');
  console.log('Slug:', decodedSlug);
  console.log('Article found:', !!article);
  if (article) {
    console.log('Article ID:', article.id);
    console.log('Article featured_image:', article.featured_image);
    console.log('Article image:', article.image);
  }
  console.log('====================');

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(
    article.category_id ?? 0,
    article.id
  );

  // Generate Article JSON-LD schema
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt || '',
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
    { name: article.title },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <ArticlePageClient
        article={{
          ...article,
          image: article.image ?? undefined,
          featured_image: article.featured_image ?? undefined,
          category_id: article.category_id ?? 0,
          category_name: article.category_name ?? 'عام',
        }}
        relatedArticles={relatedArticles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          image: (a.featured_image || a.image) ?? undefined,
          read_time: a.read_time,
        }))}
      />
    </>
  );
}
