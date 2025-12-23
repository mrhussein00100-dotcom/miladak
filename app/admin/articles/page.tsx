'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category_name: string;
  category_color: string;
  published: number;
  featured: number;
  views: number;
  created_at: string;
  ai_provider?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // جلب المقالات
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '20',
        status,
        ...(search && { search }),
        ...(categoryId && { categoryId: String(categoryId) }),
      });

      const res = await fetch(`/api/admin/articles?${params}`);
      const data = await res.json();

      if (data.success) {
        setArticles(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
    setLoading(false);
  };

  // جلب التصنيفات
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [page, status, categoryId, search]);

  // حذف مقال
  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchArticles();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - متجاوب */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-purple-500 shrink-0" />
                <span className="truncate">إدارة المقالات</span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">{total} مقال</p>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Link
              href="/admin/articles/new?ai=true"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>توليد AI</span>
            </Link>
            <Link
              href="/admin/articles/new"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>مقال جديد</span>
            </Link>
          </div>
        </div>

        {/* Filters - متجاوب */}
        <div className="bg-gray-900 rounded-xl p-3 mb-4 border border-gray-800">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في المقالات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>

            <div className="flex gap-2">
              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm"
              >
                <option value="all">الكل</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryId || ''}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : null)
                }
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm truncate"
              >
                <option value="">التصنيفات</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchArticles}
                className="p-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles - عرض بطاقات للموبايل وجدول للديسكتوب */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500" />
              <p className="mt-2 text-gray-400">جاري التحميل...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">لا توجد مقالات</p>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-500 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
                إضافة مقال
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden divide-y divide-gray-800">
                {articles.map((article) => (
                  <div key={article.id} className="p-3 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm leading-relaxed line-clamp-2">
                          {article.title}
                        </p>
                        {article.ai_provider && (
                          <span className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                            <Sparkles className="w-3 h-3" />
                            {article.ai_provider}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          article.published
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}
                      >
                        {article.published ? 'منشور' : 'مسودة'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${article.category_color}20`,
                          color: article.category_color,
                        }}
                      >
                        {article.category_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()}
                      </span>
                      <span>
                        {new Date(article.created_at).toLocaleDateString(
                          'ar-SA'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        معاينة
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        تعديل
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        العنوان
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        التصنيف
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        الحالة
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        المشاهدات
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        التاريخ
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-medium text-gray-400">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-800/30">
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-white line-clamp-1">
                                {article.title}
                              </p>
                              {article.ai_provider && (
                                <span className="text-xs text-purple-500 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  {article.ai_provider}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{
                              backgroundColor: `${article.category_color}20`,
                              color: article.category_color,
                            }}
                          >
                            {article.category_name}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              article.published
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-yellow-900/30 text-yellow-400'
                            }`}
                          >
                            {article.published ? 'منشور' : 'مسودة'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-gray-400">
                          {article.views.toLocaleString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                          {new Date(article.created_at).toLocaleDateString(
                            'ar-SA'
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/articles/${article.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400"
                              title="معاينة"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/articles/${article.id}`}
                              className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination - متجاوب */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-6 py-3 border-t border-gray-800">
              <p className="text-xs sm:text-sm text-gray-400">
                صفحة {page} من {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 text-xs sm:text-sm"
                >
                  السابق
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 sm:px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 text-xs sm:text-sm"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
