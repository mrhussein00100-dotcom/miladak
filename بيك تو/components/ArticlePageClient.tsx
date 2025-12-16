'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Eye, User, Calendar, Tag, Share2, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  author: string;
  read_time: number;
  views: number;
  category_id: number;
  category_name: string;
  category_color?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  read_time: number;
}

interface Props {
  article: Article;
  relatedArticles: RelatedArticle[];
}

export default function ArticlePageClient({ article, relatedArticles }: Props) {
  const formatDate = (d: string) => new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/">الرئيسية</Link>
          <ArrowRight size={14} />
          <Link href="/articles">المقالات</Link>
          <ArrowRight size={14} />
          <span className="truncate max-w-[200px]">{article.title}</span>
        </nav>

        <header className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full text-white text-sm mb-4" style={{ backgroundColor: article.category_color || '#8B5CF6' }}>
            {article.category_name}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><User size={16} />{article.author}</span>
            <span className="flex items-center gap-1"><Calendar size={16} />{formatDate(article.created_at)}</span>
            <span className="flex items-center gap-1"><Clock size={16} />{formatArabicNumber(article.read_time)} دقائق</span>
            <span className="flex items-center gap-1"><Eye size={16} />{formatArabicNumber(article.views)}</span>
          </div>
        </header>

        {article.image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        <article className="glass rounded-2xl p-6 md:p-10 mb-8">
          <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {article.tags && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4"><Tag size={20} /><h3 className="font-semibold">الكلمات المفتاحية</h3></div>
            <div className="flex flex-wrap gap-2">
              {article.tags.split(',').map((tag, i) => <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">{tag.trim()}</span>)}
            </div>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-6"><BookOpen size={24} /><h2 className="text-2xl font-bold">مقالات ذات صلة</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((r) => (
                <Link key={r.id} href={"/articles/" + r.slug}>
                  <Card className="h-full hover:shadow-lg transition-all group">
                    {r.image && <div className="aspect-video relative overflow-hidden rounded-t-xl"><Image src={r.image} alt={r.title} fill className="object-cover" /></div>}
                    <CardHeader className="pb-2"><CardTitle className="text-base line-clamp-2">{r.title}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-gray-500 line-clamp-2">{r.excerpt}</p></CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-center glass rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 gradient-text">احسب عمرك الآن</h3>
          <p className="text-gray-600 mb-6">استخدم حاسبة العمر المتقدمة لدينا</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/"><Button size="lg">احسب عمرك</Button></Link>
            <Link href="/articles"><Button variant="outline" size="lg">المزيد من المقالات</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}
