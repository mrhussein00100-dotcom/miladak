#!/usr/bin/env node

/**
 * تحليل قاعدة البيانات الحالية وإنشاء schema PostgreSQL
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 تحليل قاعدة البيانات الحالية...\n');

const dbPath = path.join(path.dirname(__dirname), 'database.sqlite');

if (!fs.existsSync(dbPath)) {
  console.error('❌ ملف قاعدة البيانات غير موجود:', dbPath);
  process.exit(1);
}

try {
  const db = new Database(dbPath, { readonly: true });

  // الحصول على قائمة الجداول
  const tables = db
    .prepare(
      `
    SELECT name, sql FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `
    )
    .all();

  console.log(`📊 تم العثور على ${tables.length} جدول:\n`);

  let postgresSchema = `-- Miladak V2 PostgreSQL Schema
-- Generated from SQLite database: ${new Date().toISOString()}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

  // تحليل كل جدول
  for (const table of tables) {
    console.log(`📋 جدول: ${table.name}`);

    // الحصول على معلومات الأعمدة
    const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
    const rowCount = db
      .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
      .get();

    console.log(`   - الأعمدة: ${columns.length}`);
    console.log(`   - السجلات: ${rowCount.count}`);

    // تحويل SQLite إلى PostgreSQL
    postgresSchema += `-- Table: ${table.name}\n`;
    postgresSchema += `DROP TABLE IF EXISTS ${table.name} CASCADE;\n`;
    postgresSchema += `CREATE TABLE ${table.name} (\n`;

    const columnDefs = columns
      .map((col) => {
        let pgType = convertSQLiteTypeToPostgreSQL(col.type);
        let nullable = col.notnull === 0 ? '' : ' NOT NULL';
        let defaultVal = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';

        // معالجة PRIMARY KEY AUTOINCREMENT
        if (col.pk === 1 && col.type === 'INTEGER') {
          pgType = 'SERIAL';
          nullable = ' PRIMARY KEY';
          defaultVal = '';
        }

        return `  ${col.name} ${pgType}${nullable}${defaultVal}`;
      })
      .join(',\n');

    postgresSchema += columnDefs;
    postgresSchema += '\n);\n\n';

    // إضافة الفهارس
    const indexes = db
      .prepare(
        `
      SELECT name, sql FROM sqlite_master 
      WHERE type='index' AND tbl_name=? AND name NOT LIKE 'sqlite_%'
    `
      )
      .all(table.name);

    for (const index of indexes) {
      if (index.sql) {
        let pgIndex = index.sql.replace(
          /CREATE INDEX/g,
          'CREATE INDEX IF NOT EXISTS'
        );
        postgresSchema += `${pgIndex};\n`;
      }
    }

    postgresSchema += '\n';
    console.log('');
  }

  // حفظ schema
  const schemaPath = path.join(
    process.cwd(),
    'lib/db/postgres-schema-generated.sql'
  );
  fs.writeFileSync(schemaPath, postgresSchema, 'utf8');

  console.log(`✅ تم إنشاء PostgreSQL schema: ${schemaPath}`);

  // إنشاء ملف البيانات
  await generateDataExport(db, tables);

  db.close();
} catch (error) {
  console.error('❌ خطأ في تحليل قاعدة البيانات:', error);
  process.exit(1);
}

function convertSQLiteTypeToPostgreSQL(sqliteType) {
  const type = sqliteType.toUpperCase();

  if (type.includes('INTEGER')) return 'INTEGER';
  if (type.includes('TEXT')) return 'TEXT';
  if (type.includes('REAL') || type.includes('FLOAT')) return 'DECIMAL';
  if (type.includes('BLOB')) return 'BYTEA';
  if (type.includes('DATETIME')) return 'TIMESTAMP';
  if (type.includes('DATE')) return 'DATE';
  if (type.includes('TIME')) return 'TIME';
  if (type.includes('BOOLEAN')) return 'BOOLEAN';

  return 'TEXT'; // default
}

async function generateDataExport(db, tables) {
  console.log('📤 تصدير البيانات...\n');

  let dataSQL = `-- Miladak V2 Data Export
-- Generated: ${new Date().toISOString()}

`;

  for (const table of tables) {
    const rows = db.prepare(`SELECT * FROM ${table.name}`).all();

    if (rows.length > 0) {
      console.log(`📋 تصدير ${rows.length} سجل من جدول ${table.name}`);

      dataSQL += `-- Data for ${table.name}\n`;

      const columns = Object.keys(rows[0]);

      for (const row of rows) {
        const values = columns
          .map((col) => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            return val;
          })
          .join(', ');

        dataSQL += `INSERT INTO ${table.name} (${columns.join(
          ', '
        )}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
      }
      dataSQL += '\n';
    }
  }

  const dataPath = path.join(process.cwd(), 'lib/db/postgres-data-export.sql');
  fs.writeFileSync(dataPath, dataSQL, 'utf8');

  console.log(`✅ تم تصدير البيانات: ${dataPath}\n`);
}
