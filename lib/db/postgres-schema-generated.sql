-- Miladak V2 PostgreSQL Schema
-- Generated from SQLite database: 2025-12-16T16:43:05.977Z

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: admin_users
DROP TABLE IF EXISTS admin_users CASCADE;
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Table: advertisements
DROP TABLE IF EXISTS advertisements CASCADE;
CREATE TABLE advertisements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  position TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  link TEXT,
  active BOOLEAN DEFAULT 1,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: ai_templates
DROP TABLE IF EXISTS ai_templates CASCADE;
CREATE TABLE ai_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  template_content TEXT NOT NULL,
  variables TEXT DEFAULT '[]',
  min_words INTEGER DEFAULT 500,
  max_words INTEGER DEFAULT 2000,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: articles
DROP TABLE IF EXISTS articles CASCADE;
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER,
  image TEXT,
  author TEXT DEFAULT 'عيد ميلادي',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT 1,
  featured BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  meta_description TEXT,
  meta_keywords TEXT,
  focus_keyword TEXT,
  og_image TEXT,
  ai_provider TEXT,
  publish_date TIMESTAMP,
  featured_image TEXT
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);

-- Table: auto_publish_log
DROP TABLE IF EXISTS auto_publish_log CASCADE;
CREATE TABLE auto_publish_log (
  id SERIAL PRIMARY KEY,
  article_id INTEGER,
  status TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: auto_publish_settings
DROP TABLE IF EXISTS auto_publish_settings CASCADE;
CREATE TABLE auto_publish_settings (
  id SERIAL PRIMARY KEY,
  is_enabled INTEGER DEFAULT 0,
  publish_time TEXT DEFAULT '09:00',
  frequency TEXT DEFAULT 'daily',
  topics TEXT DEFAULT '[]',
  default_category_id INTEGER,
  ai_provider TEXT DEFAULT 'gemini',
  content_length TEXT DEFAULT 'medium',
  last_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: birth_flowers
DROP TABLE IF EXISTS birth_flowers CASCADE;
CREATE TABLE birth_flowers (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  flower_name TEXT NOT NULL,
  flower_name_ar TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_birth_flowers_month ON birth_flowers(month);

-- Table: birthstones
DROP TABLE IF EXISTS birthstones CASCADE;
CREATE TABLE birthstones (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  stone_name TEXT NOT NULL,
  stone_name_ar TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_birthstones_month ON birthstones(month);

-- Table: categories
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image TEXT,
  parent_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  article_count INTEGER DEFAULT 0,
  icon TEXT DEFAULT '',
  updated_at TIMESTAMP
);


-- Table: chinese_zodiac
DROP TABLE IF EXISTS chinese_zodiac CASCADE;
CREATE TABLE chinese_zodiac (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chinese_zodiac_year ON chinese_zodiac(year);

-- Table: contact_messages
DROP TABLE IF EXISTS contact_messages CASCADE;
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT 0,
  replied BOOLEAN DEFAULT 0,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read);

-- Table: daily_birthdays
DROP TABLE IF EXISTS daily_birthdays CASCADE;
CREATE TABLE daily_birthdays (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_birthdays_date ON daily_birthdays(day, month);

-- Table: daily_events
DROP TABLE IF EXISTS daily_events CASCADE;
CREATE TABLE daily_events (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'سياسي',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(day, month);

-- Table: famous_birthdays
DROP TABLE IF EXISTS famous_birthdays CASCADE;
CREATE TABLE famous_birthdays (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_birthdays_year ON famous_birthdays(year_id);

-- Table: image_translations
DROP TABLE IF EXISTS image_translations CASCADE;
CREATE TABLE image_translations (
  id SERIAL PRIMARY KEY,
  arabic_term TEXT NOT NULL,
  english_terms TEXT NOT NULL,
  context TEXT DEFAULT 'general',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: lucky_colors
DROP TABLE IF EXISTS lucky_colors CASCADE;
CREATE TABLE lucky_colors (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  color_name TEXT NOT NULL,
  color_name_ar TEXT NOT NULL,
  hex_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lucky_colors_month ON lucky_colors(month);

-- Table: major_events
DROP TABLE IF EXISTS major_events CASCADE;
CREATE TABLE major_events (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  category TEXT DEFAULT 'سياسي',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_major_events_year ON major_events(year_id);

-- Table: mobile_settings
DROP TABLE IF EXISTS mobile_settings CASCADE;
CREATE TABLE mobile_settings (
  id SERIAL PRIMARY KEY,
  settings TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: page_keywords
DROP TABLE IF EXISTS page_keywords CASCADE;
CREATE TABLE page_keywords (
  id SERIAL PRIMARY KEY,
  page_type TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  page_title TEXT NOT NULL,
  keywords TEXT NOT NULL,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_keywords_type ON page_keywords(page_type);
CREATE INDEX IF NOT EXISTS idx_page_keywords_slug ON page_keywords(page_slug);

-- Table: popular_songs
DROP TABLE IF EXISTS popular_songs CASCADE;
CREATE TABLE popular_songs (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  country TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_songs_year ON popular_songs(year_id);

-- Table: rewrite_history
DROP TABLE IF EXISTS rewrite_history CASCADE;
CREATE TABLE rewrite_history (
  id SERIAL PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_url TEXT,
  original_title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  settings TEXT NOT NULL,
  results TEXT NOT NULL,
  images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rewrite_history_created 
             ON rewrite_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewrite_history_source 
             ON rewrite_history(source_type);

-- Table: seasons
DROP TABLE IF EXISTS seasons CASCADE;
CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  season_name TEXT NOT NULL,
  season_name_ar TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seasons_month ON seasons(month);

-- Table: site_settings
DROP TABLE IF EXISTS site_settings CASCADE;
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: subscribers
DROP TABLE IF EXISTS subscribers CASCADE;
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


-- Table: tool_categories
DROP TABLE IF EXISTS tool_categories CASCADE;
CREATE TABLE tool_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: tools
DROP TABLE IF EXISTS tools CASCADE;
CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  href TEXT NOT NULL,
  icon TEXT NOT NULL,
  keywords TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  is_featured BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: years
DROP TABLE IF EXISTS years CASCADE;
CREATE TABLE years (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  facts TEXT,
  world_stats TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_years_year ON years(year);

