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
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-pink-50/50 dark:from-orange-900/10 dark:via-transparent dark:to-pink-900/10"></div>

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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {articles.length}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                مقالات مختارة خصيصاً لك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchArticles}
              className="group p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 
                       border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500
                       transition-all duration-300 shadow-lg hover:shadow-xl"
              title="تحديث المقالات"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:rotate-180 transition-all duration-500" />
            </button>

            <Link
              href="/articles"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                       text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 
                       transition-all duration-300 font-medium transform hover:scale-105"
            >
              <span>جميع المقالات</span>
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* شبكة المقالات محسّنة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              className="group"
            >
              <Link href={`/articles/${article.slug}`}>
                <div
                  className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden 
                              hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 h-full
                              border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600
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
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/30" />
                      </div>
                    )}

                    {/* تدرج فوق الصورة */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* التصنيف */}
                    {article.category && (
                      <div
                        className="absolute top-4 right-4 px-4 py-1.5 bg-white/95 dark:bg-gray-900/95 
                                    backdrop-blur-sm rounded-full text-xs font-bold text-purple-600 dark:text-purple-400
                                    shadow-lg border border-purple-100 dark:border-purple-800"
                      >
                        {article.category}
                      </div>
                    )}

                    {/* أيقونة القراءة عند hover */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="px-4 py-2 bg-white/95 dark:bg-gray-900/95 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
                        <span>اقرأ المقال</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* محتوى البطاقة */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 
                                 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 
                                 transition-colors leading-relaxed"
                    >
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-5 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}

                    {/* معلومات إضافية */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {article.views !== undefined && (
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
                          <Eye className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{article.views}</span>
                        </div>
                      )}

                      {article.created_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(article.created_at).toLocaleDateString(
                              'ar-SA'
                            )}
                          </span>
                        </div>
                      )}
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
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 
                     text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 
                     transition-all duration-300 font-bold text-lg transform hover:scale-105"
          >
            <span>استكشف المزيد من المقالات</span>
            <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
            اكتشف مئات المقالات المفيدة في مختلف المجالات
          </p>
        </motion.div>
      </div>
    </section>
  );
}
