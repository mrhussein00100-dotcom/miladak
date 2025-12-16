'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { formatArabicNumber } from '@/lib/formatArabic';

export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  color: string;
  articles_count: number;
}

interface SmartCategoriesFilterProps {
  categories: CategoryWithCount[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  totalArticles: number;
}

// دالة لترتيب التصنيفات حسب عدد المقالات واستبعاد الفارغة
export function sortAndFilterCategories(
  categories: CategoryWithCount[]
): CategoryWithCount[] {
  return categories
    .filter((cat) => cat.articles_count > 0)
    .sort((a, b) => b.articles_count - a.articles_count);
}

// دالة لتحديد عدد التصنيفات المرئية حسب حجم الشاشة
export function getVisibleCount(isMobile: boolean): number {
  return isMobile ? 3 : 5;
}

export function SmartCategoriesFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  totalArticles,
}: SmartCategoriesFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // ترتيب وفلترة التصنيفات
  const sortedCategories = useMemo(
    () => sortAndFilterCategories(categories),
    [categories]
  );

  // تحديد عدد التصنيفات المرئية
  const visibleCount = getVisibleCount(isMobile);

  // تقسيم التصنيفات إلى مرئية ومخفية
  const visibleCategories = useMemo(
    () => sortedCategories.slice(0, visibleCount),
    [sortedCategories, visibleCount]
  );
  const overflowCategories = useMemo(
    () => sortedCategories.slice(visibleCount),
    [sortedCategories, visibleCount]
  );

  // التحقق إذا كان التصنيف المحدد في القائمة المخفية
  const selectedInOverflow = useMemo(() => {
    if (!selectedCategory) return null;
    return overflowCategories.find(
      (cat) => cat.id.toString() === selectedCategory
    );
  }, [selectedCategory, overflowCategories]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* زر جميع المقالات */}
      <CategoryChip
        name="جميع المقالات"
        count={totalArticles}
        color="#8B5CF6"
        isSelected={selectedCategory === null}
        onClick={() => onCategorySelect(null)}
      />

      {/* التصنيفات المرئية */}
      {visibleCategories.map((category) => (
        <CategoryChip
          key={category.id}
          name={category.name}
          count={category.articles_count}
          color={category.color}
          isSelected={selectedCategory === category.id.toString()}
          onClick={() => onCategorySelect(category.id.toString())}
        />
      ))}

      {/* إذا كان التصنيف المحدد في القائمة المخفية، نعرضه */}
      {selectedInOverflow && (
        <CategoryChip
          name={selectedInOverflow.name}
          count={selectedInOverflow.articles_count}
          color={selectedInOverflow.color}
          isSelected={true}
          onClick={() => onCategorySelect(selectedInOverflow.id.toString())}
        />
      )}

      {/* زر المزيد مع القائمة المنسدلة */}
      {overflowCategories.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full flex items-center gap-1"
          >
            <span>المزيد</span>
            <span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full text-xs">
              {formatArabicNumber(overflowCategories.length)}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          <AnimatePresence>
            {isDropdownOpen && (
              <OverflowDropdown
                categories={overflowCategories}
                selectedCategory={selectedCategory}
                onSelect={(id) => {
                  onCategorySelect(id);
                  setIsDropdownOpen(false);
                }}
                onClose={() => setIsDropdownOpen(false)}
                isMobile={isMobile}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// مكون CategoryChip
interface CategoryChipProps {
  name: string;
  count: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryChip({
  name,
  count,
  color,
  isSelected,
  onClick,
}: CategoryChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 border
        ${
          isSelected
            ? 'text-white border-transparent shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      style={isSelected ? { backgroundColor: color } : {}}
    >
      <span>{name}</span>
      <span
        className={`
          px-1.5 py-0.5 rounded-full text-xs
          ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}
      >
        {formatArabicNumber(count)}
      </span>
    </motion.button>
  );
}

// مكون OverflowDropdown
interface OverflowDropdownProps {
  categories: CategoryWithCount[];
  selectedCategory: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  isMobile: boolean;
}

function OverflowDropdown({
  categories,
  selectedCategory,
  onSelect,
  onClose,
  isMobile,
}: OverflowDropdownProps) {
  // للموبايل نستخدم bottom sheet، للديسكتوب dropdown عادي
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl z-50 max-h-[70vh] overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg">اختر تصنيفاً</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(70vh-60px)]">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onSelect(category.id.toString())}
                  className={`
                    p-3 rounded-xl text-right transition-all
                    ${
                      selectedCategory === category.id.toString()
                        ? 'ring-2 ring-purple-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id.toString()
                        ? `${category.color}20`
                        : undefined,
                  }}
                >
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatArabicNumber(category.articles_count)} مقال
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // Desktop Dropdown
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <div className="p-2 max-h-64 overflow-y-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id.toString())}
            className={`
              w-full p-2 rounded-lg text-right flex items-center justify-between
              transition-all
              ${
                selectedCategory === category.id.toString()
                  ? 'bg-purple-50 dark:bg-purple-900/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium text-sm">{category.name}</span>
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {formatArabicNumber(category.articles_count)}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default SmartCategoriesFilter;
