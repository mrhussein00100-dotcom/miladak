-- Miladak V2 Database Schema

-- Years and Historical Data
CREATE TABLE IF NOT EXISTS years (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER UNIQUE NOT NULL,
  facts TEXT, -- JSON array
  world_stats TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily Events
CREATE TABLE IF NOT EXISTS daily_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Famous Birthdays
CREATE TABLE IF NOT EXISTS daily_birthdays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chinese Zodiac
CREATE TABLE IF NOT EXISTS chinese_zodiac (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT
);

-- Birthstones
CREATE TABLE IF NOT EXISTS birthstones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month INTEGER UNIQUE NOT NULL,
  stone_name TEXT NOT NULL,
  stone_name_ar TEXT NOT NULL,
  description TEXT
);

-- Birth Flowers
CREATE TABLE IF NOT EXISTS birth_flowers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month INTEGER UNIQUE NOT NULL,
  flower_name TEXT NOT NULL,
  flower_name_ar TEXT NOT NULL,
  description TEXT
);

-- Article Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image TEXT,
  author TEXT DEFAULT 'فريق ميلادك',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tool Categories
CREATE TABLE IF NOT EXISTS tool_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category_id INTEGER REFERENCES tool_categories(id),
  href TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (JSON storage)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL, -- JSON
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
