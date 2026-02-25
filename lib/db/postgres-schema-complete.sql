-- Miladak V2 PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- جدول الأدوات
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category_id INTEGER,
  href VARCHAR(500) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول فئات الأدوات
CREATE TABLE IF NOT EXISTS tool_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المقالات
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category_id INTEGER,
  image VARCHAR(500),
  featured_image VARCHAR(500),
  author VARCHAR(255),
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  tags TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  meta_description TEXT,
  meta_keywords TEXT,
  focus_keyword VARCHAR(255),
  og_image VARCHAR(500),
  ai_provider VARCHAR(100),
  publish_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول فئات المقالات
CREATE TABLE IF NOT EXISTS article_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(50),
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين الإداريين
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الكلمات المفتاحية للصفحات
CREATE TABLE IF NOT EXISTS page_keywords (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(100) NOT NULL,
  page_slug VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  keywords TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- الفهارس
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_page_keywords_type_slug ON page_keywords(page_type, page_slug);

-- العلاقات الخارجية
ALTER TABLE tools ADD CONSTRAINT fk_tools_category 
  FOREIGN KEY (category_id) REFERENCES tool_categories(id) ON DELETE SET NULL;

ALTER TABLE articles ADD CONSTRAINT fk_articles_category 
  FOREIGN KEY (category_id) REFERENCES article_categories(id) ON DELETE SET NULL;
