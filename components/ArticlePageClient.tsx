'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Clock,
  Eye,
  User,
  Calendar,
  Tag,
  Share2,
  BookOpen,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';
import SocialShare from '@/components/SocialShare';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  featured_image?: string;
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
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG-u-ca-gregory', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  const featuredImage = article.featured_image || article.image;

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
          <span
            className="inline-block px-4 py-2 rounded-full text-white text-sm mb-4"
            style={{ backgroundColor: article.category_color || '#8B5CF6' }}
          >
            {article.category_name}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <User size={16} />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {formatDate(article.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {formatArabicNumber(article.read_time)} دقائق
            </span>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {formatArabicNumber(article.views)}
            </span>
          </div>
        </header>

        {featuredImage && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="glass rounded-2xl p-6 md:p-10 mb-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none article-content"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-8">
            <SocialShare 
              title={article.title} 
              url={`/articles/${article.slug}`} 
              description={article.excerpt}
              heading="شارك المقال"
            />
          </div>
        </article>

        {article.tags && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={20} />
              <h3 className="font-semibold">الكلمات المفتاحية</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={24} />
              <h2 className="text-2xl font-bold">مقالات ذات صلة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((r) => (
                <Link key={r.id} href={'/articles/' + r.slug}>
                  <Card className="h-full hover:shadow-lg transition-all group">
                    {r.image && (
                      <div className="aspect-video relative overflow-hidden rounded-t-xl">
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base line-clamp-2">
                        {r.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {r.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <motion.div 
          key="cta-v2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-black text-gray-900 dark:text-white shadow-2xl mt-12 mb-8 border-4 border-indigo-100 dark:border-purple-500/50 ring-1 ring-black/5 dark:ring-white/10"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 dark:bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 dark:bg-purple-500/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl animate-pulse delay-700"></div>

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-20 h-20 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg border border-indigo-100 dark:border-purple-500/30"
            >
              ⏳
            </motion.div>
            
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-md leading-tight">
              احسب عمرك وتفاصيل ميلادك الآن
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 leading-relaxed font-medium max-w-lg mx-auto">
              اكتشف تفاصيل دقيقة عن عمرك، برجك، وموعد عيد ميلادك القادم بدقة متناهية مع أدواتنا المتقدمة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link href="/" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[220px] bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500 border-none text-xl py-7 h-auto shadow-xl hover:shadow-indigo-200 dark:hover:shadow-purple-900/50 font-bold rounded-xl transition-all hover:scale-105">
                  احسب عمرك مجاناً
                </Button>
              </Link>
              <Link href="/articles" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:min-w-[220px] border-2 border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:border-purple-500/50 dark:bg-purple-900/20 dark:text-white dark:hover:bg-purple-900/40 dark:hover:text-white dark:hover:border-purple-400/50 text-xl py-7 h-auto backdrop-blur-sm rounded-xl transition-all hover:scale-105">
                  تصفح المقالات
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
