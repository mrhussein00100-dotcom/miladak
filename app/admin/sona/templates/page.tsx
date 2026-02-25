'use client';

/**
 * SONA v4 Templates Management Page
 * صفحة إدارة القوالب
 *
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  FolderOpen,
  Search,
  Eye,
  History,
  Copy,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface TemplateCategory {
  name: string;
  type: 'intros' | 'paragraphs' | 'conclusions';
  count: number;
  templates: TemplateItem[];
}

interface TemplateItem {
  id: string;
  name: string;
  preview: string;
  variables: string[];
  lastModified?: string;
}

const TEMPLATE_TYPES = [
  { id: 'intros', name: 'المقدمات', icon: '📝' },
  { id: 'paragraphs', name: 'الفقرات', icon: '📄' },
  { id: 'conclusions', name: 'الخاتمات', icon: '✅' },
];

const CATEGORIES = [
  'general',
  'birthday',
  'zodiac',
  'health',
  'facts',
  'tips',
  'faq',
  'howto',
];

export default function SONATemplatesPage() {
  const [templates, setTemplates] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['intros'])
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null
  );

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    // Simulate loading templates from data files
    const mockTemplates: TemplateCategory[] = [
      {
        name: 'المقدمات العامة',
        type: 'intros',
        count: 15,
        templates: [
          {
            id: 'intro_1',
            name: 'مقدمة ترحيبية',
            preview: 'مرحباً بكم في {site_name}! في هذا المقال...',
            variables: ['site_name', 'topic'],
          },
          {
            id: 'intro_2',
            name: 'مقدمة استفهامية',
            preview: 'هل تبحثون عن معلومات حول {topic}؟...',
            variables: ['topic'],
          },
          {
            id: 'intro_3',
            name: 'مقدمة إحصائية',
            preview: 'وفقاً للإحصائيات، فإن {topic}...',
            variables: ['topic', 'stat'],
          },
        ],
      },
      {
        name: 'مقدمات أعياد الميلاد',
        type: 'intros',
        count: 12,
        templates: [
          {
            id: 'intro_bd_1',
            name: 'تهنئة عيد ميلاد',
            preview: 'كل عام وأنت بخير {name}!...',
            variables: ['name', 'age'],
          },
          {
            id: 'intro_bd_2',
            name: 'احتفال بالعمر',
            preview: 'في عيد ميلادك الـ{age}...',
            variables: ['age', 'name'],
          },
        ],
      },
      {
        name: 'فقرات الحقائق',
        type: 'paragraphs',
        count: 25,
        templates: [
          {
            id: 'para_facts_1',
            name: 'حقائق مثيرة',
            preview: '<h2>حقائق مهمة عن {topic}</h2>...',
            variables: ['topic', 'facts_list'],
          },
          {
            id: 'para_facts_2',
            name: 'معلومات علمية',
            preview: 'من الناحية العلمية، {topic}...',
            variables: ['topic'],
          },
        ],
      },
      {
        name: 'فقرات النصائح',
        type: 'paragraphs',
        count: 20,
        templates: [
          {
            id: 'para_tips_1',
            name: 'نصائح عملية',
            preview: '<h2>نصائح مهمة</h2><ul>{tips_list}</ul>',
            variables: ['tips_list'],
          },
        ],
      },
      {
        name: 'الخاتمات العامة',
        type: 'conclusions',
        count: 10,
        templates: [
          {
            id: 'conc_1',
            name: 'خاتمة تلخيصية',
            preview: 'في الختام، نأمل أن يكون هذا المقال...',
            variables: ['topic'],
          },
          {
            id: 'conc_2',
            name: 'خاتمة تفاعلية',
            preview: 'شاركونا آراءكم حول {topic}...',
            variables: ['topic'],
          },
        ],
      },
    ];
    setTemplates(mockTemplates);
    setLoading(false);
  };

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filteredTemplates = templates.filter((cat) => {
    if (selectedType !== 'all' && cat.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        cat.name.toLowerCase().includes(query) ||
        cat.templates.some(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.preview.toLowerCase().includes(query)
        )
      );
    }
    return true;
  });

  const totalTemplates = templates.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/sona"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                إدارة القوالب
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalTemplates} قالب في {templates.length} فئة
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadTemplates}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في القوالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            الكل
          </button>
          {TEMPLATE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedType === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                لا توجد قوالب مطابقة
              </p>
            </div>
          ) : (
            filteredTemplates.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories.has(category.name) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">
                      {category.count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {category.type}
                  </span>
                </button>
                {expandedCategories.has(category.name) && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {category.templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'bg-purple-50 dark:bg-purple-900/20'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {template.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {template.preview}
                        </p>
                        {template.variables.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.variables.map((v) => (
                              <span
                                key={v}
                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                              >
                                {`{${v}}`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            {selectedTemplate ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    معاينة القالب
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="نسخ"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="السجل"
                    >
                      <History className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      الاسم
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedTemplate.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      المعرف
                    </label>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-300">
                      {selectedTemplate.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      المتغيرات
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTemplate.variables.length > 0 ? (
                        selectedTemplate.variables.map((v) => (
                          <span
                            key={v}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">
                          لا توجد متغيرات
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      المحتوى
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                        {selectedTemplate.preview}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  اختر قالباً لعرض التفاصيل
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
