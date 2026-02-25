-- جدول فئات الأدوات
CREATE TABLE IF NOT EXISTS tool_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأدوات
CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  href TEXT NOT NULL,
  icon TEXT NOT NULL,
  keywords TEXT, -- JSON array of keywords for SEO
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  is_featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES tool_categories (id) ON DELETE CASCADE
);

-- إدراج فئات الأدوات الافتراضية
INSERT OR IGNORE INTO tool_categories (name, title, description, icon, color, sort_order) VALUES
('age-calculators', 'حاسبات العمر', 'أدوات متنوعة لحساب العمر بطرق مختلفة', 'Calculator', 'from-blue-500 to-cyan-500', 1),
('date-tools', 'أدوات التواريخ', 'أدوات للتعامل مع التواريخ والتقويمات', 'Calendar', 'from-green-500 to-emerald-500', 2),
('pregnancy-tools', 'أدوات الحمل والولادة', 'أدوات مخصصة للحوامل والأمهات', 'Baby', 'from-pink-500 to-rose-500', 3),
('countdown-tools', 'أدوات العد التنازلي', 'عدادات تنازلية للمناسبات المهمة', 'Timer', 'from-purple-500 to-violet-500', 4),
('statistics-tools', 'أدوات الإحصائيات', 'إحصائيات مثيرة عن حياتك', 'Zap', 'from-orange-500 to-red-500', 5);

-- إدراج الأدوات الافتراضية
INSERT OR IGNORE INTO tools (category_id, name, title, description, href, icon, keywords, sort_order, is_featured) VALUES
-- حاسبات العمر
(1, 'basic-age-calculator', 'حاسبة العمر الأساسية', 'احسب عمرك بالسنوات والشهور والأيام', '/', 'Calculator', '["حاسبة العمر", "عمر", "ميلاد"]', 1, 1),
(1, 'friends-age-calculator', 'حاسبة عمر الأصدقاء', 'احسب أعمار أصدقائك وقارن بينها', '/friends', 'Users', '["أصدقاء", "مقارنة العمر"]', 2, 1),
(1, 'age-in-seconds', 'حاسبة العمر بالثواني', 'احسب عمرك بالثواني والدقائق والساعات', '/tools/age-in-seconds', 'Clock', '["عمر بالثواني", "دقائق", "ساعات"]', 3, 0),
(1, 'relative-age', 'حاسبة العمر النسبي', 'قارن عمرك مع المشاهير والشخصيات', '/tools/relative-age', 'Target', '["مقارنة العمر", "مشاهير"]', 4, 0),

-- أدوات التواريخ
(2, 'date-converter', 'محول التاريخ الهجري والميلادي', 'حول التواريخ بين التقويمين بدقة', '/date-converter', 'Calendar', '["تحويل التاريخ", "هجري", "ميلادي"]', 1, 1),
(2, 'days-between', 'حاسبة الأيام بين تاريخين', 'احسب عدد الأيام والأسابيع بين تاريخين', '/tools/days-between', 'CalendarDays', '["أيام بين تاريخين", "فرق التواريخ"]', 2, 0),
(2, 'day-of-week', 'حاسبة يوم الأسبوع', 'اكتشف يوم الأسبوع لأي تاريخ', '/tools/day-of-week', 'Calendar', '["يوم الأسبوع", "تاريخ"]', 3, 0),
(2, 'holidays', 'حاسبة الأعياد والمناسبات', 'احسب تواريخ الأعياد المتحركة', '/tools/holidays', 'Calendar', '["أعياد", "مناسبات"]', 4, 0),

-- أدوات الحمل والولادة
(3, 'pregnancy-calculator', 'حاسبة موعد الولادة', 'احسبي موعد الولادة المتوقع بدقة', '/pregnancy-calculator', 'Baby', '["حمل", "ولادة", "موعد الولادة"]', 1, 1),
(3, 'child-growth', 'حاسبة نمو الطفل', 'تابعي نمو طفلك حسب العمر', '/tools/child-growth', 'Baby', '["نمو الطفل", "تطور الطفل"]', 2, 0),
(3, 'pregnancy-stages', 'حاسبة مراحل الحمل التفصيلية', 'تطور الجنين أسبوعياً مع النصائح', '/tools/pregnancy-stages', 'Heart', '["مراحل الحمل", "تطور الجنين"]', 3, 0),
(3, 'child-age', 'حاسبة أعمار الأطفال', 'احسبي عمر طفلك بالأشهر والأسابيع', '/tools/child-age', 'Baby', '["عمر الطفل", "أشهر", "أسابيع"]', 4, 0),

-- أدوات العد التنازلي
(4, 'birthday-countdown', 'العد التنازلي لعيد الميلاد', 'كم تبقى على عيد ميلادك القادم', '/tools/birthday-countdown', 'Timer', '["عد تنازلي", "عيد ميلاد"]', 1, 0),
(4, 'event-countdown', 'العد التنازلي للمناسبات', 'عد تنازلي مخصص لأي مناسبة', '/tools/event-countdown', 'Timer', '["عد تنازلي", "مناسبات"]', 2, 0),
(4, 'celebration-planner', 'مخطط الاحتفالات', 'اقتراحات للاحتفال وأفكار الهدايا', '/tools/celebration-planner', 'Target', '["احتفالات", "هدايا"]', 3, 0),

-- أدوات الإحصائيات
(5, 'life-statistics', 'حاسبة الإحصائيات الشخصية', 'كم مرة دق قلبك وكم خطوة مشيت', '/tools/life-statistics', 'Zap', '["إحصائيات", "نبضات القلب"]', 1, 0),
(5, 'generation', 'حاسبة الأجيال', 'اكتشف الجيل الذي تنتمي إليه', '/tools/generation', 'Users', '["أجيال", "جيل"]', 2, 0),
(5, 'timezone', 'حاسبة المناطق الزمنية', 'وقت ولادتك في مناطق زمنية مختلفة', '/tools/timezone', 'Clock', '["مناطق زمنية", "وقت"]', 3, 0);