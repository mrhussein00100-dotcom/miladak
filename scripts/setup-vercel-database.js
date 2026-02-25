#!/usr/bin/env node

/**
 * إعداد قاعدة البيانات على Vercel
 * يقوم بنسخ البيانات من SQLite المحلي إلى PostgreSQL على Vercel
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('🚀 إعداد قاعدة البيانات على Vercel...\n');

// التحقق من وجود ملف قاعدة البيانات المحلي
const dbPath = path.join(process.cwd(), 'database.sqlite');

if (!fs.existsSync(dbPath)) {
  console.error('❌ ملف قاعدة البيانات غير موجود:', dbPath);
  process.exit(1);
}

try {
  // فتح قاعدة البيانات المحلية
  const db = new Database(dbPath, { readonly: true });

  console.log('✅ تم الاتصال بقاعدة البيانات المحلية');

  // الحصول على قائمة الجداول
  const tables = db
    .prepare(
      `
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `
    )
    .all();

  console.log(`📊 تم العثور على ${tables.length} جدول:`);
  tables.forEach((table) => {
    const count = db
      .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
      .get();
    console.log(`   - ${table.name}: ${count.count} سجل`);
  });

  // إنشاء ملف SQL للتصدير
  const exportPath = path.join(process.cwd(), 'database-export.sql');
  let sqlContent =
    '-- Miladak V2 Database Export\n-- Generated: ' +
    new Date().toISOString() +
    '\n\n';

  // تصدير بيانات كل جدول
  for (const table of tables) {
    console.log(`📤 تصدير جدول ${table.name}...`);

    // الحصول على هيكل الجدول
    const schema = db
      .prepare(`SELECT sql FROM sqlite_master WHERE name = ?`)
      .get(table.name);
    if (schema && schema.sql) {
      // تحويل SQLite SQL إلى PostgreSQL
      let pgSchema = schema.sql
        .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
        .replace(/INTEGER/g, 'INTEGER')
        .replace(/TEXT/g, 'TEXT')
        .replace(/REAL/g, 'DECIMAL')
        .replace(/BLOB/g, 'BYTEA');

      sqlContent += `-- Table: ${table.name}\n`;
      sqlContent += `DROP TABLE IF EXISTS ${table.name} CASCADE;\n`;
      sqlContent += pgSchema + ';\n\n';
    }

    // تصدير البيانات
    const rows = db.prepare(`SELECT * FROM ${table.name}`).all();
    if (rows.length > 0) {
      const columns = Object.keys(rows[0]);
      sqlContent += `-- Data for ${table.name}\n`;

      for (const row of rows) {
        const values = columns
          .map((col) => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            return val;
          })
          .join(', ');

        sqlContent += `INSERT INTO ${table.name} (${columns.join(
          ', '
        )}) VALUES (${values});\n`;
      }
      sqlContent += '\n';
    }
  }

  // حفظ ملف SQL
  fs.writeFileSync(exportPath, sqlContent, 'utf8');
  console.log(`✅ تم تصدير قاعدة البيانات إلى: ${exportPath}`);

  // إغلاق الاتصال
  db.close();

  console.log('\n🎯 الخطوات التالية:');
  console.log('1. ارفع ملف database-export.sql إلى Vercel PostgreSQL');
  console.log('2. قم بتشغيل الملف في قاعدة البيانات');
  console.log('3. تأكد من إعداد متغيرات البيئة في Vercel');
} catch (error) {
  console.error('❌ خطأ في تصدير قاعدة البيانات:', error);
  process.exit(1);
}
