'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  GripVertical,
  Eye,
  EyeOff,
  Calculator,
  Calendar,
  Clock,
  Baby,
  Heart,
  Scale,
  Flame,
  Zap,
  Search,
  Check,
  X,
} from 'lucide-react';

interface QuickTool {
  id: string;
  href: string;
  label: string;
  icon: string;
  color: string;
  emoji: string;
  isScroll: boolean;
  order: number;
  isActive: boolean;
}

interface AvailableTool {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category_id: number;
}

const AVAILABLE_ICONS = [
  { name: 'Calculator', icon: Calculator },
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'Baby', icon: Baby },
  { name: 'Heart', icon: Heart },
  { name: 'Scale', icon: Scale },
  { name: 'Flame', icon: Flame },
  { name: 'Zap', icon: Zap },
];

const AVAILABLE_COLORS = [
  { name: 'بنفسجي', value: 'from-purple-500 to-indigo-600' },
  { name: 'وردي', value: 'from-pink-500 to-rose-600' },
  { name: 'أخضر', value: 'from-emerald-500 to-teal-600' },
  { name: 'برتقالي', value: 'from-orange-500 to-red-600' },
  { name: 'أزرق', value: 'from-cyan-500 to-blue-600' },
  { name: 'أصفر', value: 'from-yellow-500 to-amber-600' },
];

const AVAILABLE_EMOJIS = [
  '🎂',
  '⏰',
  '⚖️',
  '🔥',
  '👶',
  '❤️',
  '📊',
  '🧮',
  '📅',
  '⚡',
];

export default function QuickToolsAdmin() {
  const [tools, setTools] = useState<QuickTool[]>([]);
  const [availableTools, setAvailableTools] = useState<AvailableTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTool, setEditingTool] = useState<QuickTool | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTools();
    fetchAvailableTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/quick-tools');
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTools = async () => {
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      if (data.success && data.data) {
        // تحويل البيانات للشكل المطلوب
        const formattedTools = data.data.map((tool: any) => ({
          id: tool.id,
          name: tool.title,
          slug: tool.slug,
          description: tool.description || '',
          icon: tool.icon || 'Calculator',
          category_id: tool.category_id,
        }));
        setAvailableTools(formattedTools);
      }
    } catch (error) {
      console.error('Error fetching available tools:', error);
    }
  };

  const saveTool = async (tool: QuickTool) => {
    setSaving(true);
    try {
      const res = await fetch('/api/quick-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTools();
        setShowForm(false);
        setEditingTool(null);
      }
    } catch (error) {
      console.error('Error saving tool:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteTool = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الأداة؟')) return;

    try {
      await fetch(`/api/quick-tools?id=${id}`, { method: 'DELETE' });
      await fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const toggleActive = async (tool: QuickTool) => {
    await saveTool({ ...tool, isActive: !tool.isActive });
  };

  const selectToolFromList = (availableTool: AvailableTool) => {
    const newTool: QuickTool = {
      id: `tool-${availableTool.slug}`,
      href: `/tools/${availableTool.slug}`,
      label: availableTool.name,
      icon: availableTool.icon || 'Calculator',
      color:
        AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)]
          .value,
      emoji:
        AVAILABLE_EMOJIS[Math.floor(Math.random() * AVAILABLE_EMOJIS.length)],
      isScroll: false,
      order: tools.length + 1,
      isActive: true,
    };
    setEditingTool(newTool);
    setShowToolSelector(false);
    setShowForm(true);
  };

  const newCustomTool = (): QuickTool => ({
    id: `tool-${Date.now()}`,
    href: '/tools/',
    label: '',
    icon: 'Calculator',
    color: 'from-purple-500 to-indigo-600',
    emoji: '🧮',
    isScroll: false,
    order: tools.length + 1,
    isActive: true,
  });

  const filteredAvailableTools = availableTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة الأدوات السريعة
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              تحكم في الأدوات التي تظهر في الزر العائم
            </p>
          </div>
          <button
            onClick={() => setShowToolSelector(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة أداة
          </button>
        </div>

        {/* Tools List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {tools.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              لا توجد أدوات. أضف أداة جديدة للبدء.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {tools.map((tool) => {
                const IconComponent =
                  AVAILABLE_ICONS.find((i) => i.name === tool.icon)?.icon ||
                  Calculator;

                return (
                  <div
                    key={tool.id}
                    className={`p-4 flex items-center gap-4 ${
                      !tool.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />

                    <div
                      className={`p-3 rounded-xl bg-gradient-to-l ${tool.color}`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tool.emoji}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {tool.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tool.href}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(tool)}
                        className={`p-2 rounded-lg transition-colors ${
                          tool.isActive
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                        }`}
                        title={tool.isActive ? 'إخفاء' : 'إظهار'}
                      >
                        {tool.isActive ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingTool(tool);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 hover:bg-blue-200 transition-colors"
                        title="تعديل"
                      >
                        <Save className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => deleteTool(tool.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 hover:bg-red-200 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tool Selector Modal - اختيار أداة من القائمة */}
        {showToolSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    اختر أداة لإضافتها
                  </h2>
                  <button
                    onClick={() => setShowToolSelector(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن أداة..."
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Tools Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredAvailableTools.map((tool) => {
                    const isAlreadyAdded = tools.some(
                      (t) => t.href === `/tools/${tool.slug}`
                    );

                    return (
                      <button
                        key={tool.id}
                        onClick={() =>
                          !isAlreadyAdded && selectToolFromList(tool)
                        }
                        disabled={isAlreadyAdded}
                        className={`p-4 rounded-xl border-2 text-right transition-all ${
                          isAlreadyAdded
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Calculator className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {tool.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              /tools/{tool.slug}
                            </div>
                          </div>
                          {isAlreadyAdded && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Check className="w-4 h-4" />
                              مضافة
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredAvailableTools.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد أدوات مطابقة للبحث
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowToolSelector(false);
                    setEditingTool(newCustomTool());
                    setShowForm(true);
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 transition-colors"
                >
                  <Plus className="w-5 h-5 inline-block ml-2" />
                  إضافة أداة مخصصة يدوياً
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Form Modal */}
        {showForm && editingTool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingTool.id.startsWith('tool-') &&
                !tools.find((t) => t.id === editingTool.id)
                  ? 'إضافة أداة جديدة'
                  : 'تعديل الأداة'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اسم الأداة
                  </label>
                  <input
                    type="text"
                    value={editingTool.label}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, label: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="مثال: حاسبة العمر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الرابط
                  </label>
                  <input
                    type="text"
                    value={editingTool.href}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, href: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="/tools/tool-name أو #section-id"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isScroll"
                    checked={editingTool.isScroll}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        isScroll: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="isScroll"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    تمرير لقسم في الصفحة (بدلاً من الانتقال لصفحة أخرى)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الأيقونة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        onClick={() =>
                          setEditingTool({ ...editingTool, icon: name })
                        }
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          editingTool.icon === name
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الإيموجي
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setEditingTool({ ...editingTool, emoji })
                        }
                        className={`p-2 text-xl rounded-lg border-2 transition-colors ${
                          editingTool.emoji === emoji
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اللون
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map(({ name, value }) => (
                      <button
                        key={value}
                        onClick={() =>
                          setEditingTool({ ...editingTool, color: value })
                        }
                        className={`px-3 py-1 rounded-lg text-white text-sm bg-gradient-to-l ${value} ${
                          editingTool.color === value
                            ? 'ring-2 ring-offset-2 ring-purple-500'
                            : ''
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={editingTool.order}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveTool(editingTool)}
                  disabled={saving || !editingTool.label}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTool(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
