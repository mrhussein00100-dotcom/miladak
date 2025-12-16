'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  reading_time: number;
  featured_image?: string;
  image?: string;
}

export default function RandomArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles?limit=6');
      const data = await response.json();
      if (data.success && data.data?.items) {
        // Shuffle and take 6 random articles
        const shuffled = [...data.data.items].sort(() => Math.random() - 0.5);
        setArticles(
          shuffled.slice(0, 6).map(
            (
              a: Article & {
                category_name?: string;
                read_time?: number;
                image?: string;
              }
            ) => ({
              ...a,
              category: a.category_name || 'عام',
              reading_time: a.read_time || a.reading_time || 5,
              image: a.image || a.featured_image || '',
            })
          )
        );
      } else if (data.data) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback static articles
      setArticles([
        {
          id: 1,
          title: 'كيفية حساب العمر بدقة',
          slug: 'how-to-calculate-age',
          excerpt: 'تعلم الطرق المختلفة لحساب العمر بدقة وفهم الفروق الزمنية',
          category: 'حسابات العمر',
          reading_time: 5,
        },
        {
          id: 2,
          title: 'أهمية معرفة عمرك الدقيق',
          slug: 'importance-of-knowing-age',
          excerpt: 'اكتشف لماذا من المهم معرفة عمرك بدقة وتأثيره على حياتك',
          category: 'الصحة والعمر',
          reading_time: 7,
        },
        {
          id: 3,
          title: 'حاسبة العمر والبرج الفلكي',
          slug: 'age-calculator-zodiac',
          excerpt: 'تعرف على برجك الفلكي وخصائصه من خلال تاريخ ميلادك',
          category: 'الأبراج',
          reading_time: 4,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">مقالات مفيدة</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف مقالات متنوعة عن العمر والصحة والحياة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/articles/${article.slug}`}>
                <div className="glass rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden">
                    {article.image || article.featured_image ? (
                      <img
                        src={article.image || article.featured_image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback icon */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        display:
                          article.image || article.featured_image
                            ? 'none'
                            : 'flex',
                      }}
                    >
                      <BookOpen className="w-16 h-16 text-white/50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-medium text-purple-600 dark:text-purple-400">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{article.reading_time} دقائق قراءة</span>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-[-4px] transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            عرض جميع المقالات
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
