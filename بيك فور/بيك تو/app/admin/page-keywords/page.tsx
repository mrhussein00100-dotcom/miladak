'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  X,
  Save,
  Tag,
  FileText,
  Hash,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PageKeyword {
  id: number;
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string;
  keywords_array: string[];
  keywords_count: number;
  meta_description: string | null;
}

export default function PageKeywordsAdmin() {
  const [keywords, setKeywords] = useState<PageKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    page_title: '',
    keywords: '',
    meta_description: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [addForm, setAddForm] = useState({
    page_type: 'tool',
    page_slug: '',
    page_title: '',
    keywords: '',
    meta_description: '',
  });

  useEffect(() => {
    fetchKeywords();
  }, [filterType]);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const url =
        filterType === 'all'
          ? '/api/admin/page-keywords'
          : `/api/admin/page-keywords?type=${filterType}`;
      const res = await fetch(url);
      const data = await res.json();
      setKeywords(data.data || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      showMessage('error', 'حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (item: PageKeyword) => {
    setEditingId(item.id);
    setExpandedId(item.id);
    setEditForm({
      page_title: item.page_title,
      keywords: item.keywords,
      meta_description: item.meta_description || '',
    });
  };

  const handleSave = async (id: number) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/page-keywords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        setEditingId(null);
        fetchKeywords();
        showMessage('success', 'تم حفظ التغييرات بنجاح');
      } else {
        showMessage('error', data.error || 'حدث خطأ في الحفظ');
      }
    } catch (error) {
      console.error('Error saving:', error);
      showMessage('error', 'حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الكلمات المفتاحية؟')) return;
    try {
      const res = await fetch(`/api/admin/page-keywords/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchKeywords();
        showMessage('success', 'تم الحذف بنجاح');
      } else {
        showMessage('error', 'حدث خطأ في الحذف');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'حدث خطأ في الحذف');
    }
  };

  const handleAdd = async () => {
    if (!addForm.page_slug || !addForm.page_title || !addForm.keywords) {
      showMessage('error', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/page-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setAddForm({
          page_type: 'tool',
          page_slug: '',
          page_title: '',
          keywords: '',
          meta_description: '',
        });
        fetchKeywords();
        showMessage('success', 'تم إضافة الصفحة بنجاح');
      } else {
        showMessage('error', data.error || 'حدث خطأ في الإضافة');
      }
    } catch (error) {
      console.error('Error adding:', error);
      showMessage('error', 'حدث خطأ في الإضافة');
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredKeywords = keywords.filter(
    (k) =>
      k.page_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tool':
        return 'أداة';
      case 'page':
        return 'صفحة';
      case 'article':
        return 'مقال';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'page':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'article':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Message Toast */}
        {message && (
          <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="w-8 h-8 text-purple-600" />
              إدارة الكلمات المفتاحية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة الكلمات المفتاحية لجميع صفحات الموقع
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة صفحة جديدة
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الكلمات المفتاحية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="tool">الأدوات</option>
              <option value="page">الصفحات</option>
              <option value="article">المقالات</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {keywords.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي الصفحات
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {keywords.reduce((acc, k) => acc + k.keywords_count, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي الكلمات
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Hash className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(
                  keywords.reduce((acc, k) => acc + k.keywords_count, 0) /
                    (keywords.length || 1)
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                متوسط الكلمات/صفحة
              </p>
            </div>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500">
              جاري التحميل...
            </div>
          ) : filteredKeywords.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500">
              لا توجد نتائج
            </div>
          ) : (
            filteredKeywords.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        item.page_type
                      )}`}
                    >
                      {getTypeLabel(item.page_type)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.page_title}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {item.page_slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.keywords_count} كلمة
                    </span>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {expandedId === item.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {(expandedId === item.id || editingId === item.id) && (
                  <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                    {editingId === item.id ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            عنوان الصفحة
                          </label>
                          <input
                            type="text"
                            value={editForm.page_title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                page_title: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            الوصف (Meta Description)
                          </label>
                          <textarea
                            value={editForm.meta_description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                meta_description: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            الكلمات المفتاحية (
                            {
                              editForm.keywords
                                .split(',')
                                .filter((k) => k.trim()).length
                            }{' '}
                            كلمة)
                          </label>
                          <textarea
                            value={editForm.keywords}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                keywords: e.target.value,
                              })
                            }
                            rows={8}
                            placeholder="كلمة1, كلمة2, كلمة3..."
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                            dir="rtl"
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => handleSave(item.id)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        {item.meta_description && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              الوصف:
                            </h4>
                            <p className="text-gray-800 dark:text-gray-200">
                              {item.meta_description}
                            </p>
                          </div>
                        )}
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          الكلمات المفتاحية:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.keywords_array
                            .slice(0, 30)
                            .map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          {item.keywords_array.length > 30 && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm">
                              +{item.keywords_array.length - 30} كلمة أخرى
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    إضافة صفحة جديدة
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      نوع الصفحة *
                    </label>
                    <select
                      value={addForm.page_type}
                      onChange={(e) =>
                        setAddForm({ ...addForm, page_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    >
                      <option value="tool">أداة</option>
                      <option value="page">صفحة</option>
                      <option value="article">مقال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={addForm.page_slug}
                      onChange={(e) =>
                        setAddForm({ ...addForm, page_slug: e.target.value })
                      }
                      placeholder="مثال: age-calculator"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    عنوان الصفحة *
                  </label>
                  <input
                    type="text"
                    value={addForm.page_title}
                    onChange={(e) =>
                      setAddForm({ ...addForm, page_title: e.target.value })
                    }
                    placeholder="مثال: حاسبة العمر"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف (Meta Description)
                  </label>
                  <textarea
                    value={addForm.meta_description}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        meta_description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الكلمات المفتاحية * (
                    {addForm.keywords.split(',').filter((k) => k.trim()).length}{' '}
                    كلمة)
                  </label>
                  <textarea
                    value={addForm.keywords}
                    onChange={(e) =>
                      setAddForm({ ...addForm, keywords: e.target.value })
                    }
                    rows={6}
                    placeholder="كلمة1, كلمة2, كلمة3..."
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'جاري الإضافة...' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
