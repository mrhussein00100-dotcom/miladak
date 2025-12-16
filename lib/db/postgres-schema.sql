-- Miladak V2 PostgreSQL Schema
-- للاستخدام مع Vercel Postgres

-- Years and Historical Data
CREATE TABLE IF NOT EXISTS years (
  id SERIAL PRIMARY KEY,
  year INTEGER UNIQUE NOT NULL,
  facts TEXT, -- JSON array
  world_stats TEXT, -- JSON object
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Events
CREATE TABLE IF NOT EXISTS daily_events (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Famous Birthdays
CREATE TABLE IF NOT EXISTS daily_birthdays (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chinese Zodiac
CREATE TABLE IF NOT EXISTS chinese_zodiac (
  id SERIAL PRIMARY KEY,
  year INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT
);

-- Birthstones
CREATE TABLE IF NOT EXISTS birthstones (
  id SERIAL PRIMARY KEY,
  month INTEGER UNIQUE NOT NULL,
  stone_name TEXT NOT NULL,
  stone_name_ar TEXT NOT NULL,
  description TEXT
);

-- Birth Flowers
CREATE TABLE IF NOT EXISTS birth_flowers (
  id SERIAL PRIMARY KEY,
  month INTEGER UNIQUE NOT NULL,
  flower_name TEXT NOT NULL,
  flower_name_ar TEXT NOT NULL,
  description TEXT
);

-- Article Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image TEXT,
  featured_image TEXT,
  author TEXT DEFAULT 'فريق ميلادك',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tool Categories
CREATE TABLE IF NOT EXISTS tool_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category_id INTEGER REFERENCES tool_categories(id),
  href TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tool Keywords
CREATE TABLE IF NOT EXISTS tool_keywords (
  id SERIAL PRIMARY KEY,
  tool_slug TEXT NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (JSON storage)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL, -- JSON
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lucky Colors
CREATE TABLE IF NOT EXISTS lucky_colors (
  id SERIAL PRIMARY KEY,
  month INTEGER UNIQUE NOT NULL,
  color TEXT NOT NULL,
  hex_code TEXT,
  meaning TEXT,
  tips TEXT
);

-- Lucky Numbers
CREATE TABLE IF NOT EXISTS lucky_numbers (
  id SERIAL PRIMARY KEY,
  zodiac_animal TEXT NOT NULL,
  numbers TEXT NOT NULL, -- JSON array
  colors TEXT, -- JSON array
  description TEXT
);

-- Historical Events
CREATE TABLE IF NOT EXISTS historical_events (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  importance INTEGER DEFAULT 1
);

-- Celebrities
CREATE TABLE IF NOT EXISTS celebrities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_year INTEGER,
  profession TEXT,
  nationality TEXT,
  image_url TEXT,
  bio TEXT
);

-- Rewrite History
CREATE TABLE IF NOT EXISTS rewrite_history (
  id SERIAL PRIMARY KEY,
  original_url TEXT,
  original_content TEXT,
  rewritten_content TEXT,
  model_used TEXT,
  quality_score REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto Publish Settings
CREATE TABLE IF NOT EXISTS auto_publish_settings (
  id SERIAL PRIMARY KEY,
  enabled INTEGER DEFAULT 0,
  interval_hours INTEGER DEFAULT 24,
  max_articles_per_day INTEGER DEFAULT 5,
  last_run TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto Publish Logs
CREATE TABLE IF NOT EXISTS auto_publish_logs (
  id SERIAL PRIMARY KEY,
  article_id INTEGER,
  status TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(month, day);
CREATE INDEX IF NOT EXISTS idx_daily_birthdays_date ON daily_birthdays(month, day);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_active ON tools(active);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
CREATE INDEX IF NOT EXISTS idx_chinese_zodiac_year ON chinese_zodiac(year);
CREATE INDEX IF NOT EXISTS idx_tool_keywords_slug ON tool_keywords(tool_slug);
CREATE INDEX IF NOT EXISTS idx_historical_events_date ON historical_events(month, day);
CREATE INDEX IF NOT EXISTS idx_celebrities_birth ON celebrities(birth_month, birth_day);
