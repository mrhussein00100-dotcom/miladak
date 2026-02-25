'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
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
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTool, setEditingTool] = useState<QuickTool | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    setLoadingAvailable(true);
    setError(null);
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      console.log('API Response:', data); // للتصحيح
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
        console.log('Formatted tools:', formattedTools); // للتصحيح
      } else {
        setError('لم يتم العثور على أدوات');
      }
    } catch (error) {
      console.error('Error fetching available tools:', error);
      setError('فشل في جلب الأدوات المتاحة');
    } finally {
      setLoadingAvailable(false);
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
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 sm:p-6 md:p-8"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للوحة التحكم</span>
            <span className="sm:hidden">رجوع</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              إدارة الأدوات السريعة
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
              تحكم في الأدوات التي تظهر في الزر العائم
            </p>
          </div>
          <button
            onClick={() => setShowToolSelector(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة أداة
          </button>
        </div>

        {/* Tools List */}
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
          {tools.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              لا توجد أدوات. أضف أداة جديدة للبدء.
            </div>
          ) : (
            <div className="divide-y divide-border">
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
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

                    <div
                      className={`p-3 rounded-xl bg-gradient-to-l ${tool.color}`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tool.emoji}</span>
                        <span className="font-bold text-foreground">
                          {tool.label}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {tool.href}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(tool)}
                        className={`p-2 rounded-lg transition-colors ${
                          tool.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
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
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="تعديل"
                      >
                        <Save className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => deleteTool(tool.id)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
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
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    اختر أداة لإضافتها
                  </h2>
                  <button
                    onClick={() => setShowToolSelector(false)}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن أداة..."
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Tools Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingAvailable ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    <span className="mr-3 text-muted-foreground">
                      جاري تحميل الأدوات...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-destructive mb-4">{error}</div>
                    <button
                      onClick={fetchAvailableTools}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : (
                  <>
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
                                ? 'border-border bg-muted opacity-50 cursor-not-allowed'
                                : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Calculator className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-foreground">
                                  {tool.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  /tools/{tool.slug}
                                </div>
                              </div>
                              {isAlreadyAdded && (
                                <div className="flex items-center gap-1 text-success text-sm">
                                  <Check className="w-4 h-4" />
                                  مضافة
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filteredAvailableTools.length === 0 &&
                      availableTools.length > 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          لا توجد أدوات مطابقة للبحث
                        </div>
                      )}

                    {availableTools.length === 0 && !loadingAvailable && (
                      <div className="text-center py-8 text-muted-foreground">
                        لا توجد أدوات متاحة في قاعدة البيانات
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => {
                    setShowToolSelector(false);
                    setEditingTool(newCustomTool());
                    setShowForm(true);
                  }}
                  className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
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
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingTool.id.startsWith('tool-') &&
                !tools.find((t) => t.id === editingTool.id)
                  ? 'إضافة أداة جديدة'
                  : 'تعديل الأداة'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    اسم الأداة
                  </label>
                  <input
                    type="text"
                    value={editingTool.label}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, label: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="مثال: حاسبة العمر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    الرابط
                  </label>
                  <input
                    type="text"
                    value={editingTool.href}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, href: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
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
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="isScroll"
                    className="text-sm text-muted-foreground"
                  >
                    تمرير لقسم في الصفحة (بدلاً من الانتقال لصفحة أخرى)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                            ? 'ring-2 ring-offset-2 ring-primary'
                            : ''
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                    className="w-24 px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveTool(editingTool)}
                  disabled={saving || !editingTool.label}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-2 rounded-lg transition-colors"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTool(null);
                  }}
                  className="px-6 py-2 border border-input rounded-lg hover:bg-muted text-foreground transition-colors"
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
