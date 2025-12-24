'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FolderTree,
  RefreshCw,
  Save,
  X,
  FileText,
  Image as ImageIcon,
  Search,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string; // يُستخدم لتخزين رابط الصورة
  parent_id: number | null;
  sort_order: number;
  article_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // بيانات النموذج
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState(''); // رابط صورة التصنيف
  const [parentId, setParentId] = useState<number | null>(null);

  // حالة اختيار الصورة
  const [imageMode, setImageMode] = useState<'url' | 'search' | 'upload'>(
    'url'
  );
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // الألوان المتاحة
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
  ];

  // جلب التصنيفات
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories?includeCount=true');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setColor('#6366f1');
    setIcon('');
    setParentId(null);
    setEditingId(null);
    setShowForm(false);
    setImageUrl('');
    setSearchQuery('');
    setSearchResults([]);
  };

  // فتح نموذج التعديل
  const handleEdit = (category: Category) => {
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setColor(category.color || '#6366f1');
    setIcon(category.icon || '');
    setImageUrl(category.icon || '');
    setParentId(category.parent_id);
    setEditingId(category.id);
    setShowForm(true);
  };

  // البحث عن صور من Pexels
  const handleImageSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/images/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.images || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearchLoading(false);
  };

  // اختيار صورة - استخدام الرابط الأصلي (original) لأنه أقصر
  const selectImage = (url: string) => {
    // تحويل الرابط لصيغة أقصر إذا كان من Pexels
    let shortUrl = url;
    if (url.includes('pexels.com')) {
      // استخراج ID الصورة وإنشاء رابط مختصر
      const match = url.match(/photos\/(\d+)/);
      if (match) {
        shortUrl = `https://images.pexels.com/photos/${match[1]}/pexels-photo-${match[1]}.jpeg?w=400`;
      }
    }
    setIcon(shortUrl);
    setImageUrl(shortUrl);
  };

  // حذف الصورة
  const removeImage = () => {
    setIcon('');
    setImageUrl('');
  };

  // حفظ التصنيف
  const handleSave = async () => {
    if (!name) {
      alert('يرجى إدخال اسم التصنيف');
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          description,
          color,
          icon,
          parent_id: parentId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchCategories();
      } else {
        alert(data.error || data.details || 'فشل في حفظ التصنيف');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  // حذف تصنيف
  const handleDelete = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    if (category.article_count > 0) {
      const reassignTo = prompt(
        `هذا التصنيف يحتوي على ${category.article_count} مقال. أدخل معرف التصنيف الذي تريد نقل المقالات إليه:`
      );
      if (!reassignTo) return;

      const res = await fetch(
        `/api/admin/categories/${id}?reassignTo=${reassignTo}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || 'فشل في حذف التصنيف');
      }
    } else {
      if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || 'فشل في حذف التصنيف');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                <FolderTree className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500 shrink-0" />
                <span className="truncate">إدارة التصنيفات</span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                {categories.length} تصنيف
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            تصنيف جديد
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800 max-h-[95vh] flex flex-col">
              {/* Header - ثابت */}
              <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-gray-800 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingId ? 'تعديل التصنيف' : 'تصنيف جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content - قابل للتمرير */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    الاسم *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسم التصنيف"
                    className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    الرابط (slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="يتم توليده تلقائياً"
                    className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف التصنيف"
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    اللون
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-transform ${
                          color === c
                            ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-gray-400 scale-110'
                            : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* قسم صورة التصنيف */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <ImageIcon className="w-4 h-4 inline ml-1" />
                    صورة التصنيف (اختياري)
                  </label>

                  {/* معاينة الصورة الحالية */}
                  {icon && (
                    <div className="relative mb-3">
                      <img
                        src={icon}
                        alt="صورة التصنيف"
                        className="w-full h-24 object-cover rounded-lg"
                        onError={() => setIcon('')}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* أزرار التبديل */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        imageMode === 'url'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>رابط</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('search')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        imageMode === 'search'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      <span>Pexels</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        imageMode === 'upload'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>رفع</span>
                    </button>
                  </div>

                  {/* إدخال الرابط */}
                  {imageMode === 'url' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setIcon(e.target.value);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 text-sm"
                      />
                    </div>
                  )}

                  {/* البحث عن صور */}
                  {imageMode === 'search' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleImageSearch()
                          }
                          placeholder="ابحث عن صور..."
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleImageSearch}
                          disabled={searchLoading}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          {searchLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* نتائج البحث */}
                      {searchResults.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-auto">
                          {searchResults.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectImage(url)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                icon === url
                                  ? 'border-blue-500'
                                  : 'border-transparent'
                              }`}
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* رفع صورة من الجهاز */}
                  {imageMode === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // التحقق من حجم الملف (2MB كحد أقصى)
                            if (file.size > 2 * 1024 * 1024) {
                              alert('حجم الصورة يجب أن يكون أقل من 2MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setIcon(base64);
                              setImageUrl(base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                      />
                      <p className="text-xs text-gray-500">
                        الحد الأقصى: 2MB - الصيغ المدعومة: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    التصنيف الأب
                  </label>
                  <select
                    value={parentId || ''}
                    onChange={(e) =>
                      setParentId(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white"
                  >
                    <option value="">بدون (تصنيف رئيسي)</option>
                    {categories
                      .filter((c) => c.id !== editingId)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Footer - ثابت */}
              <div className="p-4 sm:p-6 pt-4 border-t border-gray-800 shrink-0">
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                  <button
                    onClick={resetForm}
                    disabled={saving}
                    className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 border border-gray-700 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="mt-2 text-gray-400">جاري التحميل...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <FolderTree className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">لا توجد تصنيفات</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
                إضافة تصنيف
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-800/50 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* عرض الصورة إذا وجدت (رابط أو Base64)، وإلا عرض اللون والأيقونة */}
                    {category.icon &&
                    (category.icon.startsWith('http') ||
                      category.icon.startsWith('data:')) ? (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // في حالة فشل تحميل الصورة، إخفاءها
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <FolderTree
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: category.color }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white text-sm sm:text-base truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        {category.article_count} مقال
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
