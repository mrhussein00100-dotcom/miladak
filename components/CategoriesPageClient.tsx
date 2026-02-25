'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { Button } from './ui/Button';
import { formatArabicNumber } from '@/lib/formatArabic';
import {
  Search,
  Grid,
  List,
  BookOpen,
  Tag,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';

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

interface CategoriesPageClientProps {
  categories: Category[];
}

export function CategoriesPageClient({
  categories,
}: CategoriesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // تنظيف البيانات - التأكد من أن article_count رقم صحيح ومعقول
  const sanitizedCategories = categories.map((cat) => {
    // تحويل article_count إلى رقم (قد يأتي كـ string أو bigint من PostgreSQL)
    let count = 0;
    if (cat.article_count !== null && cat.article_count !== undefined) {
      const parsed = Number(cat.article_count);
      if (!isNaN(parsed) && parsed >= 0 && parsed < 1000000) {
        count = Math.floor(parsed);
      }
    }
    return {
      ...cat,
      article_count: count,
    };
  });

  const filteredCategories = sanitizedCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalArticles = sanitizedCategories.reduce(
    (sum, cat) => sum + cat.article_count,
    0
  );
  const popularCategories = sanitizedCategories.filter(
    (cat) => cat.article_count >= 1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-4xl md:text-5xl ml-2">🏷️</span>
            <span className="gradient-text">تصنيفات المقالات</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            اكتشف مجموعة متنوعة من المقالات المفيدة مقسمة حسب المواضيع
            والاهتمامات
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
              <Tag className="w-5 h-5 text-purple-600" />
              <span className="font-medium">
                {formatArabicNumber(categories.length)} تصنيف
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {formatArabicNumber(totalArticles)} مقال
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                {formatArabicNumber(popularCategories.length)} تصنيف شائع
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث في التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* View Mode */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`group hover:shadow-xl transition-all duration-300 border-0 ${
                  viewMode === 'grid' ? 'h-full' : ''
                }`}
              >
                <CardHeader className={viewMode === 'list' ? 'pb-4' : ''}>
                  <div
                    className={`flex ${
                      viewMode === 'list'
                        ? 'items-center gap-4'
                        : 'flex-col items-center text-center'
                    }`}
                  >
                    <div
                      className={`${
                        viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mb-4'
                      } rounded-2xl overflow-hidden group-hover:scale-110 transition-transform relative`}
                    >
                      {/* عرض الصورة من icon إذا كانت رابط URL أو Base64 */}
                      {category.icon &&
                      (category.icon.startsWith('http') ||
                        category.icon.startsWith('data:')) ? (
                        <Image
                          src={category.icon}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 80px"
                          unoptimized={category.icon.startsWith('data:')}
                        />
                      ) : category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 80px"
                        />
                      ) : category.icon ? (
                        <div
                          className="w-full h-full flex items-center justify-center text-3xl"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon}
                        </div>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {category.description}
                      </CardDescription>
                    </div>
                    {viewMode === 'list' && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BookOpen size={16} />
                          <span>
                            {formatArabicNumber(category.article_count)} مقال
                          </span>
                        </div>
                        <Link href={`/articles?category=${category.slug}`}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                          >
                            تصفح المقالات
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {viewMode === 'grid' && (
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <BookOpen size={16} />
                        <span>
                          {formatArabicNumber(category.article_count)} مقال
                        </span>
                      </div>
                      {category.article_count >= 1 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                          شائع
                        </span>
                      )}
                    </div>

                    <Link href={`/articles?category=${category.slug}`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                        تصفح المقالات
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد تصنيفات</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              لم نجد أي تصنيفات تطابق بحثك
            </p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              مسح البحث
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4">
              <span className="gradient-text">اكتشف المزيد من المحتوى</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              تصفح جميع المقالات أو استخدم أدواتنا المفيدة لحساب العمر والمزيد
              من الخدمات المجانية
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/articles">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <BookOpen className="w-5 h-5 ml-2" />
                  جميع المقالات
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline">
                  🛠️ الأدوات المفيدة
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
