#!/usr/bin/env node

/**
 * ترحيل ذكي - يقرأ بنية SQLite وينسخها تماماً إلى PostgreSQL
 */

const Database = require('better-sqlite3');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء الترحيل الذكي...\n');

const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');
const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ متغير POSTGRES_URL غير موجود');
  process.exit(1);
}

async function smartMigration() {
  let sqliteDb;
  let pgPool;

  try {
    console.log('📂 الاتصال بـ SQLite...');
    sqliteDb = new Database(SQLITE_PATH, { readonly: true });

    console.log('🐘 الاتصال بـ PostgreSQL...');
    pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pgPool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بقواعد البيانات بنجاح\n');

    // الحصول على قائمة الجداول المهمة
    const importantTables = [
      'tool_categories',
      'tools',
      'categories',
      'articles',
      'admin_users',
      'page_keywords',
      'birthstones',
      'birth_flowers',
      'daily_birthdays',
      'daily_events',
      'lucky_colors',
      'seasons',
      'chinese_zodiac',
    ];

    for (const tableName of importantTables) {
      await migrateTableSmart(sqliteDb, pgPool, tableName);
    }

    console.log('\n🎉 تم الترحيل الذكي بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الترحيل:', error.message);
  } finally {
    if (sqliteDb) sqliteDb.close();
    if (pgPool) await pgPool.end();
  }
}

async function migrateTableSmart(sqliteDb, pgPool, tableName) {
  try {
    console.log(`📋 معالجة جدول ${tableName}...`);

    // التحقق من وجود الجدول
    const tableExists = sqliteDb
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
      .get(tableName);

    if (!tableExists) {
      console.log(`   ⚠️ الجدول ${tableName} غير موجود`);
      return;
    }

    // الحصول على بنية الجدول
    const schema = sqliteDb
      .prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`)
      .get(tableName);

    // الحصول على البيانات
    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
      console.log(`   📊 الجدول ${tableName} فارغ`);
      return;
    }

    // إنشاء الجدول في PostgreSQL بناءً على البيانات الفعلية
    await createTableFromData(pgPool, tableName, rows);

    // نسخ البيانات
    await copyData(pgPool, tableName, rows);

    console.log(`   ✅ تم ترحيل ${rows.length} سجل`);
  } catch (error) {
    console.error(`   ❌ خطأ في ${tableName}:`, error.message);
  }
}

async function createTableFromData(pgPool, tableName, rows) {
  if (rows.length === 0) return;

  // حذف الجدول إذا كان موجوداً
  await pgPool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);

  // تحليل أنواع البيانات من السجل الأول
  const firstRow = rows[0];
  const columns = Object.keys(firstRow).map((col) => {
    const value = firstRow[col];
    let type = 'TEXT';

    if (col === 'id') {
      type = 'SERIAL PRIMARY KEY';
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        type = 'INTEGER';
      } else {
        type = 'DECIMAL';
      }
    } else if (typeof value === 'boolean') {
      type = 'BOOLEAN';
    } else if (
      value &&
      typeof value === 'string' &&
      value.match(/^\d{4}-\d{2}-\d{2}/)
    ) {
      type = 'TIMESTAMP';
    }

    return col === 'id' ? `${col} ${type}` : `${col} ${type}`;
  });

  const createSQL = `CREATE TABLE ${tableName} (${columns.join(', ')})`;

  try {
    await pgPool.query(createSQL);
    console.log(`   🔧 تم إنشاء جدول ${tableName}`);
  } catch (error) {
    console.log(`   ⚠️ خطأ في إنشاء ${tableName}: ${error.message}`);
  }
}

async function copyData(pgPool, tableName, rows) {
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const insertSQL = `INSERT INTO ${tableName} (${columns.join(
    ', '
  )}) VALUES (${placeholders})`;

  let successCount = 0;

  for (const row of rows) {
    try {
      const values = columns.map((col) => row[col]);
      await pgPool.query(insertSQL, values);
      successCount++;
    } catch (error) {
      // تجاهل الأخطاء والمتابعة
    }
  }

  // إعادة تعيين sequence للـ id
  if (columns.includes('id')) {
    try {
      await pgPool.query(`
        SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), 
        COALESCE((SELECT MAX(id) FROM ${tableName}), 1))
      `);
    } catch (error) {
      // تجاهل خطأ sequence
    }
  }
}

// تشغيل الترحيل
smartMigration();
