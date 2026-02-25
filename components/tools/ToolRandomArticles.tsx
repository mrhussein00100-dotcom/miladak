'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Clock, Eye, RefreshCw } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  category?: string;
  views?: number;
  created_at?: string;
}

interface ToolRandomArticlesProps {
  toolSlug?: string;
  keywords?: string[];
  count?: number;
  className?: string;
  title?: string;
}

export default function ToolRandomArticles({
  toolSlug,
  keywords = [],
  count = 6,
  className = '',
  title = 'مقالات ذات صلة',
}: ToolRandomArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('limit', count.toString());
      if (toolSlug) params.append('toolSlug', toolSlug);
      if (keywords.length > 0) params.append('keywords', keywords.join(','));

      const response = await fetch(`/api/random-articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error('فشل في جلب المقالات');
      }

      const data = await response.json();
      // دعم كلا الصيغتين من الـ API
      const articlesData = data.data || data.articles || [];
      setArticles(
        articlesData.map((a: Record<string, unknown>) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || '',
          image: a.image || '/images/default-article.jpg',
          category: a.categoryName || a.category || '',
          views: a.views,
          created_at: a.createdAt || a.created_at,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [toolSlug, keywords.join(','), count]);

  if (loading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              {title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || articles.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative py-16 overflow-hidden ${className}`}
      aria-label="مقالات ذات صلة"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10"></div>

      <div className="relative container mx-auto px-4">
        {/* رأس القسم محسّن */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">
                {articles.length}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-muted-foreground mt-1">
                مقالات مختارة خصيصاً لك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchArticles}
              className="group p-3 rounded-xl bg-card hover:bg-primary/5 dark:hover:bg-primary/10 
                       border border-border hover:border-primary/30 transition-all duration-300"
              title="تحديث المقالات"
            >
              <RefreshCw className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <Link 
              href="/articles"
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/5 dark:bg-primary/10 
                       text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* شبكة المقالات محسّنة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group h-full"
            >
              <Link href={`/articles/${article.slug}`}>
                <div
                  className="relative bg-card rounded-3xl overflow-hidden 
                              hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full
                              border border-border hover:border-primary/50
                              transform hover:-translate-y-2"
                >
                  {/* صورة المقال */}
                  <div className="relative w-full h-52 overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary-foreground/30" />
                      </div>
                    )}

                    {/* تدرج فوق الصورة */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* التصنيف */}
                    {article.category && (
                      <div
                        className="absolute top-4 right-4 px-4 py-1.5 bg-background/95 
                                    backdrop-blur-sm rounded-full text-xs font-bold text-primary
                                    shadow-lg border border-primary/20"
                      >
                        {article.category}
                      </div>
                    )}

                    {/* أيقونة القراءة عند hover */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="px-4 py-2 bg-background/95 rounded-full text-sm font-medium text-primary flex items-center gap-2">
                        <span>اقرأ المقال</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* محتوى البطاقة */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold text-card-foreground mb-3 
                                 line-clamp-2 group-hover:text-primary 
                                 transition-colors leading-relaxed"
                    >
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.read_time || '5 دقائق'}</span>
                      </div>
                      <span className="text-xs font-medium text-primary group-hover:underline">
                        أكمل القراءة
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* رابط لجميع المقالات محسّن */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/articles"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary via-secondary to-accent 
                     text-primary-foreground rounded-2xl hover:shadow-2xl hover:shadow-primary/30 
                     transition-all duration-300 font-bold text-lg transform hover:scale-105"
          >
            <span>استكشف المزيد من المقالات</span>
            <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-4 text-muted-foreground text-sm">
            اكتشف مئات المقالات المفيدة في مختلف المجالات
          </p>
        </motion.div>
      </div>
    </section>
  );
}
