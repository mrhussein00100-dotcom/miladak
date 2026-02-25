#!/usr/bin/env node

/**
 * فحص هيكل الجداول
 */

const Database = require('better-sqlite3');
const path = require('path');

function checkTableStructure() {
  console.log('🔍 فحص هيكل الجداول...\n');

  try {
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    const db = new Database(dbPath, { readonly: true });

    // فحص جدول الأدوات
    console.log('📋 هيكل جدول tools:');
    const toolsInfo = db.prepare('PRAGMA table_info(tools)').all();
    toolsInfo.forEach((col) => {
      console.log(
        `   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${
          col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''
        }`
      );
    });

    // فحص جدول المقالات
    console.log('\n📋 هيكل جدول articles:');
    const articlesInfo = db.prepare('PRAGMA table_info(articles)').all();
    articlesInfo.forEach((col) => {
      console.log(
        `   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${
          col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''
        }`
      );
    });

    // فحص جدول فئات الأدوات
    console.log('\n📋 هيكل جدول tool_categories:');
    const categoriesInfo = db
      .prepare('PRAGMA table_info(tool_categories)')
      .all();
    categoriesInfo.forEach((col) => {
      console.log(
        `   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${
          col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''
        }`
      );
    });

    // عرض بعض البيانات
    console.log('\n🔧 عينة من الأدوات:');
    const tools = db.prepare('SELECT * FROM tools LIMIT 3').all();
    tools.forEach((tool) => {
      console.log(
        `   • ID: ${tool.id}, Slug: ${tool.slug}, Title: ${tool.title}`
      );
    });

    db.close();
    console.log('\n✅ تم فحص الهيكل بنجاح');
  } catch (error) {
    console.error('❌ خطأ في فحص الهيكل:', error.message);
    process.exit(1);
  }
}

checkTableStructure();
