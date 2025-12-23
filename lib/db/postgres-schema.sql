-- Miladak V2 PostgreSQL Database Schema
-- تاريخ الإنشاء: ديسمبر 2024

-- إنشاء قاعدة البيانات (إذا لم تكن موجودة)
-- CREATE DATABASE miladak_v2;

-- تفعيل الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- جداول الأدوات (Tools)
-- ===========================================

-- جدول فئات الأدوات
CREATE TABLE IF NOT EXISTS tool_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    icon TEXT, -- تم تغييره من VARCHAR(100) لدعم Base64
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأدوات
CREATE TABLE IF NOT EXISTS tools (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon TEXT, -- تم تغييره من VARCHAR(100) لدعم Base64
    category_id INTEGER REFERENCES tool_categories(id) ON DELETE SET NULL,
    href VARCHAR(500) NOT NULL,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- جداول المقالات (Articles)
-- ===========================================

-- جدول فئات المقالات
CREATE TABLE IF NOT EXISTS article_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- HEX color code
    icon TEXT, -- تم تغييره من VARCHAR(100) لدعم Base64 والروابط الطويلة
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المقالات
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category_id INTEGER REFERENCES article_categories(id) ON DELETE SET NULL,
    image VARCHAR(500),
    featured_image VARCHAR(500),
    author VARCHAR(255),
    read_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    tags TEXT, -- JSON array as text
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    meta_description TEXT,
    meta_keywords TEXT,
    focus_keyword VARCHAR(255),
    og_image VARCHAR(500),
    ai_provider VARCHAR(100),
    publish_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- جداول المستخدمين والإدارة
-- ===========================================

-- جدول المستخدمين الإداريين
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor',
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- جداول البيانات الإضافية
-- ===========================================

-- جدول أحجار الميلاد
CREATE TABLE IF NOT EXISTS birthstones (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    stone_name VARCHAR(255) NOT NULL,
    stone_name_ar VARCHAR(255),
    description TEXT,
    properties TEXT,
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول زهور الميلاد
CREATE TABLE IF NOT EXISTS birth_flowers (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    flower_name VARCHAR(255) NOT NULL,
    flower_name_ar VARCHAR(255),
    description TEXT,
    meaning TEXT,
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المشاهير
CREATE TABLE IF NOT EXISTS celebrities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    profession VARCHAR(255),
    profession_ar VARCHAR(255),
    birth_date DATE NOT NULL,
    birth_year INTEGER,
    description TEXT,
    image VARCHAR(500),
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأحداث التاريخية
CREATE TABLE IF NOT EXISTS historical_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    description TEXT,
    event_date DATE NOT NULL,
    event_year INTEGER,
    category VARCHAR(100),
    importance_level INTEGER DEFAULT 1 CHECK (importance_level >= 1 AND importance_level <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- جداول الكلمات المفتاحية وSEO
-- ===========================================

-- جدول الكلمات المفتاحية للصفحات
CREATE TABLE IF NOT EXISTS page_keywords (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(100) NOT NULL, -- 'tool', 'article', 'category', etc.
    page_slug VARCHAR(255) NOT NULL,
    page_title VARCHAR(500),
    keywords TEXT, -- comma-separated keywords
    meta_description TEXT,
    focus_keyword VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_type, page_slug)
);

-- ===========================================
-- جداول الذكاء الاصطناعي
-- ===========================================

-- جدول سجل إعادة الصياغة
CREATE TABLE IF NOT EXISTS rewrite_history (
    id SERIAL PRIMARY KEY,
    original_url VARCHAR(1000),
    original_title VARCHAR(500),
    original_content TEXT,
    rewritten_title VARCHAR(500),
    rewritten_content TEXT,
    ai_provider VARCHAR(100),
    quality_score DECIMAL(3,2),
    processing_time INTEGER, -- milliseconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول قوالب المحتوى
CREATE TABLE IF NOT EXISTS content_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    template_content TEXT NOT NULL,
    variables JSONB, -- template variables
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- الفهارس (Indexes)
-- ===========================================

-- فهارس الأدوات
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
CREATE INDEX IF NOT EXISTS idx_tools_active ON tools(active);

-- فهارس المقالات
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);

-- فهارس البيانات الإضافية
CREATE INDEX IF NOT EXISTS idx_celebrities_birth_date ON celebrities(birth_date);
CREATE INDEX IF NOT EXISTS idx_historical_events_date ON historical_events(event_date);
CREATE INDEX IF NOT EXISTS idx_birthstones_month ON birthstones(month);
CREATE INDEX IF NOT EXISTS idx_birth_flowers_month ON birth_flowers(month);

-- فهارس الكلمات المفتاحية
CREATE INDEX IF NOT EXISTS idx_page_keywords_type_slug ON page_keywords(page_type, page_slug);

-- ===========================================
-- المشغلات (Triggers) لتحديث updated_at
-- ===========================================

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- مشغلات التحديث
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_categories_updated_at BEFORE UPDATE ON tool_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_categories_updated_at BEFORE UPDATE ON article_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_birthstones_updated_at BEFORE UPDATE ON birthstones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_birth_flowers_updated_at BEFORE UPDATE ON birth_flowers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_celebrities_updated_at BEFORE UPDATE ON celebrities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_historical_events_updated_at BEFORE UPDATE ON historical_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_keywords_updated_at BEFORE UPDATE ON page_keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();