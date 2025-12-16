'use client';

/**
 * مكون سجل عمليات إعادة الصياغة
 */

import { useState, useEffect } from 'react';
import type { RewriteHistoryRecord } from '@/types/rewriter';

interface RewriteHistoryProps {
  onRestore: (record: RewriteHistoryRecord) => void;
}

export default function RewriteHistory({ onRestore }: RewriteHistoryProps) {
  const [records, setRecords] = useState<RewriteHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'text' | 'url'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchHistory();
  }, [filter, page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(filter !== 'all' && { sourceType: filter }),
      });

      const response = await fetch(`/api/admin/ai/rewrite-history?${params}`);
      const data = await response.json();

      if (data.success) {
        setRecords(data.records);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل؟')) return;

    try {
      const response = await fetch(`/api/admin/ai/rewrite-history/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecords(records.filter((r) => r.id !== id));
        setTotal(total - 1);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* الفلاتر */}
      <div className="flex gap-2">
        {(['all', 'text', 'url'] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }
            `}
          >
            {f === 'all' ? 'الكل' : f === 'text' ? 'من النص' : 'من الرابط'}
          </button>
        ))}
      </div>

      {/* قائمة السجلات */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">جاري التحميل...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl">📭</span>
          <p className="mt-2">لا توجد سجلات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {record.sourceType === 'text' ? '📝' : '🔗'}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {record.originalTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatDate(record.createdAt)}</span>
                    <span>{record.results.length} نتيجة</span>
                    <span>
                      {record.settings.models
                        .map((m) =>
                          m === 'gemini'
                            ? '🌟'
                            : m === 'groq'
                            ? '⚡'
                            : m === 'cohere'
                            ? '🔮'
                            : m === 'huggingface'
                            ? '🤗'
                            : '🏠'
                        )
                        .join(' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRestore(record)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    استعادة
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* التصفح */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
          >
            السابق
          </button>
          <span className="px-3 py-1 text-gray-600 dark:text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
