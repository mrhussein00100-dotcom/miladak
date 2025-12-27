-- ===========================================
-- SONA v4 PostgreSQL Database Schema
-- جداول نظام SONA للذكاء الاصطناعي المحلي
-- ===========================================

-- جدول الإعدادات (Runtime Settings)
CREATE TABLE IF NOT EXISTS sona_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- جدول بصمات المحتوى المولد
CREATE TABLE IF NOT EXISTS sona_content_hashes (
    id SERIAL PRIMARY KEY,
    content_hash VARCHAR(64) UNIQUE NOT NULL,
    topic VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    word_count INTEGER NOT NULL,
    quality_score DECIMAL(5,2),
    templates_used JSONB,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إحصائيات التوليد اليومية
CREATE TABLE IF NOT EXISTS sona_generation_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_generations INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    avg_quality_score DECIMAL(5,2),
    avg_generation_time INTEGER, -- milliseconds
    category_breakdown JSONB,
    template_usage JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إصدارات القوالب
CREATE TABLE IF NOT EXISTS sona_template_versions (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'intro', 'paragraph', 'conclusion'
    category VARCHAR(100),
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    variables JSONB,
    change_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    is_archived BOOLEAN DEFAULT FALSE,
    UNIQUE(template_id, version)
);

-- جدول سجلات التوليد
CREATE TABLE IF NOT EXISTS sona_generation_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    topic VARCHAR(500),
    category VARCHAR(100),
    duration INTEGER, -- milliseconds
    quality_score DECIMAL(5,2),
    diversity_score DECIMAL(5,2),
    keyword_density DECIMAL(5,2),
    readability_score DECIMAL(5,2),
    templates_used JSONB,
    word_count INTEGER,
    success BOOLEAN,
    retries INTEGER DEFAULT 0,
    error_message TEXT,
    settings_snapshot JSONB
);

-- جدول الـ Plugins
CREATE TABLE IF NOT EXISTS sona_plugins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    version VARCHAR(20),
    description TEXT,
    category VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    config JSONB,
    hooks JSONB, -- قائمة الـ hooks المدعومة
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول جلسات Sandbox
CREATE TABLE IF NOT EXISTS sona_sandbox_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) UNIQUE NOT NULL,
    settings JSONB,
    templates_override JSONB,
    generated_content JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول تحليلات الأداء
CREATE TABLE IF NOT EXISTS sona_performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'generation', 'quality', 'template_usage'
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_date, metric_type, metric_name)
);

-- ===========================================
-- الفهارس (Indexes)
-- ===========================================

-- فهارس بصمات المحتوى
CREATE INDEX IF NOT EXISTS idx_sona_hashes_category ON sona_content_hashes(category);
CREATE INDEX IF NOT EXISTS idx_sona_hashes_created ON sona_content_hashes(created_at);
CREATE INDEX IF NOT EXISTS idx_sona_hashes_quality ON sona_content_hashes(quality_score);

-- فهارس سجلات التوليد
CREATE INDEX IF NOT EXISTS idx_sona_logs_timestamp ON sona_generation_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_sona_logs_category ON sona_generation_logs(category);
CREATE INDEX IF NOT EXISTS idx_sona_logs_success ON sona_generation_logs(success);
CREATE INDEX IF NOT EXISTS idx_sona_logs_quality ON sona_generation_logs(quality_score);

-- فهارس إصدارات القوالب
CREATE INDEX IF NOT EXISTS idx_sona_versions_template ON sona_template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_sona_versions_type ON sona_template_versions(template_type);
CREATE INDEX IF NOT EXISTS idx_sona_versions_archived ON sona_template_versions(is_archived);

-- فهارس الإحصائيات
CREATE INDEX IF NOT EXISTS idx_sona_stats_date ON sona_generation_stats(date);

-- فهارس الأداء
CREATE INDEX IF NOT EXISTS idx_sona_perf_date ON sona_performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_sona_perf_type ON sona_performance_metrics(metric_type);

-- ===========================================
-- المشغلات (Triggers)
-- ===========================================

-- مشغل تحديث updated_at لجدول الإعدادات
DROP TRIGGER IF EXISTS update_sona_settings_updated_at ON sona_settings;
CREATE TRIGGER update_sona_settings_updated_at 
    BEFORE UPDATE ON sona_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- مشغل تحديث updated_at لجدول الإحصائيات
DROP TRIGGER IF EXISTS update_sona_stats_updated_at ON sona_generation_stats;
CREATE TRIGGER update_sona_stats_updated_at 
    BEFORE UPDATE ON sona_generation_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- مشغل تحديث updated_at لجدول الـ Plugins
DROP TRIGGER IF EXISTS update_sona_plugins_updated_at ON sona_plugins;
CREATE TRIGGER update_sona_plugins_updated_at 
    BEFORE UPDATE ON sona_plugins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- البيانات الافتراضية
-- ===========================================

-- إدراج الإعدادات الافتراضية
INSERT INTO sona_settings (key, value, description) VALUES
    ('articleLength', '"medium"', 'طول المقال الافتراضي'),
    ('wordCountTargets', '{"short": 500, "medium": 1000, "long": 2000, "comprehensive": 3000}', 'أهداف عدد الكلمات'),
    ('keywordDensity', '3', 'كثافة الكلمات المفتاحية (%)'),
    ('minKeywordOccurrences', '3', 'الحد الأدنى لتكرار الكلمة المفتاحية'),
    ('maxKeywordOccurrences', '5', 'الحد الأقصى لتكرار الكلمة المفتاحية'),
    ('minQualityScore', '70', 'الحد الأدنى لدرجة الجودة'),
    ('maxRetries', '3', 'الحد الأقصى لمحاولات إعادة التوليد'),
    ('diversityLevel', '"high"', 'مستوى التنوع'),
    ('templateRotation', 'true', 'تفعيل تدوير القوالب'),
    ('enableSynonymReplacement', 'true', 'تفعيل استبدال المرادفات'),
    ('enableSentenceVariation', 'true', 'تفعيل تنويع الجمل'),
    ('enableFAQGeneration', 'true', 'تفعيل توليد الأسئلة الشائعة'),
    ('enableTipsGeneration', 'true', 'تفعيل توليد النصائح'),
    ('enableCTAs', 'true', 'تفعيل دعوات العمل')
ON CONFLICT (key) DO NOTHING;

-- إدراج الـ Plugins الافتراضية
INSERT INTO sona_plugins (name, display_name, version, description, category, enabled) VALUES
    ('birthday', 'أعياد الميلاد', '1.0.0', 'محتوى متخصص في أعياد الميلاد والاحتفالات', 'أعياد الميلاد', true),
    ('zodiac', 'الأبراج', '1.0.0', 'محتوى متخصص في الأبراج والفلك', 'الأبراج', true),
    ('health', 'الصحة', '1.0.0', 'محتوى متخصص في الصحة والعافية', 'الصحة', true),
    ('dates', 'التواريخ', '1.0.0', 'محتوى متخصص في التواريخ والتقويم', 'التواريخ', true)
ON CONFLICT (name) DO NOTHING;
