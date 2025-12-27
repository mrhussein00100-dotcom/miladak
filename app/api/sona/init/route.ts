/**
 * SONA v4 Database Initialization API
 * POST /api/sona/init
 *
 * يقوم بإنشاء جداول SONA إذا لم تكن موجودة
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  executePostgresCommand,
  executePostgresQueryOne,
} from '@/lib/db/postgres';

// SQL لإنشاء الجداول
const CREATE_TABLES_SQL = `
-- جدول الإعدادات
CREATE TABLE IF NOT EXISTS sona_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- جدول بصمات المحتوى
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

-- جدول إحصائيات التوليد
CREATE TABLE IF NOT EXISTS sona_generation_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_generations INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    avg_quality_score DECIMAL(5,2),
    avg_generation_time INTEGER,
    category_breakdown JSONB,
    template_usage JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إصدارات القوالب
CREATE TABLE IF NOT EXISTS sona_template_versions (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
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
    duration INTEGER,
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
    hooks JSONB,
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
`;

// SQL للفهارس
const CREATE_INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_sona_hashes_category ON sona_content_hashes(category);
CREATE INDEX IF NOT EXISTS idx_sona_hashes_created ON sona_content_hashes(created_at);
CREATE INDEX IF NOT EXISTS idx_sona_logs_timestamp ON sona_generation_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_sona_logs_category ON sona_generation_logs(category);
CREATE INDEX IF NOT EXISTS idx_sona_logs_success ON sona_generation_logs(success);
CREATE INDEX IF NOT EXISTS idx_sona_versions_template ON sona_template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_sona_stats_date ON sona_generation_stats(date);
`;

// SQL للبيانات الافتراضية
const INSERT_DEFAULTS_SQL = `
INSERT INTO sona_settings (key, value, description) VALUES
    ('articleLength', '"medium"', 'طول المقال الافتراضي'),
    ('wordCountTargets', '{"short": 500, "medium": 1000, "long": 2000, "comprehensive": 3000}', 'أهداف عدد الكلمات'),
    ('keywordDensity', '3', 'كثافة الكلمات المفتاحية'),
    ('minQualityScore', '70', 'الحد الأدنى لدرجة الجودة'),
    ('maxRetries', '3', 'الحد الأقصى للمحاولات'),
    ('diversityLevel', '"high"', 'مستوى التنوع'),
    ('enableSynonymReplacement', 'true', 'تفعيل استبدال المرادفات'),
    ('enableFAQGeneration', 'true', 'تفعيل توليد الأسئلة الشائعة'),
    ('enableTipsGeneration', 'true', 'تفعيل توليد النصائح'),
    ('enableCTAs', 'true', 'تفعيل دعوات العمل')
ON CONFLICT (key) DO NOTHING;

INSERT INTO sona_plugins (name, display_name, version, description, category, enabled) VALUES
    ('birthday', 'أعياد الميلاد', '1.0.0', 'محتوى متخصص في أعياد الميلاد', 'أعياد الميلاد', true),
    ('zodiac', 'الأبراج', '1.0.0', 'محتوى متخصص في الأبراج', 'الأبراج', true),
    ('health', 'الصحة', '1.0.0', 'محتوى متخصص في الصحة', 'الصحة', true),
    ('dates', 'التواريخ', '1.0.0', 'محتوى متخصص في التواريخ', 'التواريخ', true)
ON CONFLICT (name) DO NOTHING;
`;

async function checkTablesExist(): Promise<{
  exists: boolean;
  tables: string[];
}> {
  try {
    const result = await executePostgresQueryOne<{ tables: string }>(
      `SELECT string_agg(table_name, ',') as tables 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name LIKE 'sona_%'`
    );

    const tables = result?.tables ? result.tables.split(',') : [];
    return { exists: tables.length > 0, tables };
  } catch {
    return { exists: false, tables: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من وجود الجداول
    const { exists, tables } = await checkTablesExist();

    if (exists && tables.length >= 6) {
      return NextResponse.json({
        success: true,
        message: 'جداول SONA موجودة بالفعل',
        tables,
        initialized: false,
      });
    }

    // إنشاء الجداول
    const tableStatements = CREATE_TABLES_SQL.split(';').filter((s) =>
      s.trim()
    );
    for (const statement of tableStatements) {
      if (statement.trim()) {
        await executePostgresCommand(statement);
      }
    }

    // إنشاء الفهارس
    const indexStatements = CREATE_INDEXES_SQL.split(';').filter((s) =>
      s.trim()
    );
    for (const statement of indexStatements) {
      if (statement.trim()) {
        try {
          await executePostgresCommand(statement);
        } catch {
          // تجاهل أخطاء الفهارس الموجودة
        }
      }
    }

    // إدراج البيانات الافتراضية
    const insertStatements = INSERT_DEFAULTS_SQL.split(';').filter((s) =>
      s.trim()
    );
    for (const statement of insertStatements) {
      if (statement.trim()) {
        try {
          await executePostgresCommand(statement);
        } catch {
          // تجاهل أخطاء البيانات الموجودة
        }
      }
    }

    // التحقق النهائي
    const finalCheck = await checkTablesExist();

    return NextResponse.json({
      success: true,
      message: 'تم تهيئة جداول SONA بنجاح',
      tables: finalCheck.tables,
      initialized: true,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'فشل في تهيئة جداول SONA',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { exists, tables } = await checkTablesExist();

    return NextResponse.json({
      success: true,
      tablesExist: exists,
      tables,
      requiredTables: [
        'sona_settings',
        'sona_content_hashes',
        'sona_generation_stats',
        'sona_template_versions',
        'sona_generation_logs',
        'sona_plugins',
        'sona_sandbox_sessions',
      ],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      tablesExist: false,
      error: error instanceof Error ? error.message : 'خطأ في الاتصال',
    });
  }
}
