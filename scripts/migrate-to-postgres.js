/**
 * سكريبت ترحيل البيانات من SQLite إلى Vercel Postgres
 *
 * الاستخدام:
 * 1. أنشئ قاعدة بيانات Postgres في Vercel Dashboard
 * 2. انسخ متغيرات البيئة إلى .env.local
 * 3. شغل: node scripts/migrate-to-postgres.js
 */

const Database = require('better-sqlite3');
const { sql } = require('@vercel/postgres');
const path = require('path');
const fs = require('fs');

// مسار قاعدة البيانات المحلية
const SQLITE_PATH = path.join(process.cwd(), 'database.sqlite');

// الجداول المراد ترحيلها
const TABLES_TO_MIGRATE = [
  'categories',
  'articles',
  'tool_categories',
  'tools',
  'tool_keywords',
  'admin_users',
  'settings',
  'lucky_colors',
  'lucky_numbers',
  'historical_events',
  'celebrities',
  'chinese_zodiac',
  'birthstones',
  'birth_flowers',
  'daily_events',
  'daily_birthdays',
  'years',
  'rewrite_history',
  'auto_publish_settings',
  'auto_publish_logs',
];

async function createTables() {
  console.log('📊 إنشاء الجداول في Postgres...');

  const schemaPath = path.join(process.cwd(), 'lib/db/postgres-schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // تقسيم الـ schema إلى أوامر منفصلة
  const commands = schema
    .split(';')
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  for (const command of commands) {
    try {
      await sql.query(command);
    } catch (error) {
      // تجاهل أخطاء "already exists"
      if (!error.message.includes('already exists')) {
        console.error('خطأ في إنشاء الجدول:', error.message);
      }
    }
  }

  console.log('✅ تم إنشاء الجداول');
}

async function migrateTable(tableName, sqliteDb) {
  console.log(`📦 ترحيل جدول: ${tableName}...`);

  try {
    // جلب البيانات من SQLite
    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
      console.log(`   ⏭️ الجدول فارغ: ${tableName}`);
      return 0;
    }

    // جلب أسماء الأعمدة
    const columns = Object.keys(rows[0]);

    // إدراج البيانات في Postgres
    let insertedCount = 0;

    for (const row of rows) {
      const values = columns.map((col) => row[col]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const columnsStr = columns.join(', ');

      try {
        await sql.query(
          `INSERT INTO ${tableName} (${columnsStr}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          values
        );
        insertedCount++;
      } catch (error) {
        // تجاهل أخطاء التكرار
        if (
          !error.message.includes('duplicate') &&
          !error.message.includes('unique')
        ) {
          console.error(`   ❌ خطأ في إدراج صف: ${error.message}`);
        }
      }
    }

    console.log(`   ✅ تم ترحيل ${insertedCount}/${rows.length} صف`);
    return insertedCount;
  } catch (error) {
    console.error(`   ❌ خطأ في ترحيل ${tableName}: ${error.message}`);
    return 0;
  }
}

async function migrate() {
  console.log('🚀 بدء ترحيل البيانات من SQLite إلى Postgres...\n');

  // التحقق من وجود قاعدة البيانات المحلية
  if (!fs.existsSync(SQLITE_PATH)) {
    console.error('❌ قاعدة البيانات المحلية غير موجودة:', SQLITE_PATH);
    process.exit(1);
  }

  // التحقق من متغيرات البيئة
  if (!process.env.POSTGRES_URL) {
    console.error('❌ متغير POSTGRES_URL غير موجود');
    console.log('   تأكد من إضافة متغيرات Vercel Postgres إلى .env.local');
    process.exit(1);
  }

  // فتح قاعدة البيانات المحلية
  const sqliteDb = new Database(SQLITE_PATH, { readonly: true });

  try {
    // إنشاء الجداول
    await createTables();

    console.log('\n📊 ترحيل البيانات...\n');

    // ترحيل كل جدول
    let totalMigrated = 0;

    for (const table of TABLES_TO_MIGRATE) {
      // التحقق من وجود الجدول في SQLite
      const tableExists = sqliteDb
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
        .get(table);

      if (tableExists) {
        const count = await migrateTable(table, sqliteDb);
        totalMigrated += count;
      } else {
        console.log(`   ⏭️ الجدول غير موجود في SQLite: ${table}`);
      }
    }

    console.log(`\n✅ اكتمل الترحيل! تم ترحيل ${totalMigrated} صف إجمالاً`);
  } catch (error) {
    console.error('❌ خطأ في الترحيل:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
  }
}

// تشغيل الترحيل
migrate().catch(console.error);
