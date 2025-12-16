import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePageClient from '@/components/ArticlePageClient';
import { StructuredData } from '@/components/SEO/StructuredData';
import type { Article } from '@/types';
import Database from 'better-sqlite3';

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
      SELECT a.id, a.title, a.slug, a.excerpt, a.image, a.read_time, a.category_id,
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
      images: article.image ? [{ url: article.image, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  // Decode the slug in case it's URL encoded (Arabic characters)
  const decodedSlug = decodeURIComponent(slug);
  const article = getArticle(decodedSlug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(
    article.category_id ?? 0,
    article.id
  );

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author || 'فريق ميلادك',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ميلادك',
      url: 'https://miladak.com',
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://miladak.com/articles/${article.slug}`,
    },
  };

  return (
    <>
      <StructuredData data={articleStructuredData} />
      <ArticlePageClient
        article={{
          ...article,
          image: article.image ?? undefined,
          category_id: article.category_id ?? 0,
          category_name: article.category_name ?? 'عام',
        }}
        relatedArticles={relatedArticles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          image: a.image ?? undefined,
          read_time: a.read_time,
        }))}
      />
    </>
  );
}
