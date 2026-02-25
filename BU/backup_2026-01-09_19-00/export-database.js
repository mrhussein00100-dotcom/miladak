/**
 * سكريبت تصدير قاعدة البيانات من Vercel Postgres
 * يقوم بتصدير جميع الجداول إلى ملفات JSON
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// معلومات الاتصال بقاعدة البيانات
const connectionString = 'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function exportDatabase() {
  const client = await pool.connect();
  const outputDir = path.join(__dirname, 'database');
  
  // إنشاء مجلد للبيانات
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('🔗 متصل بقاعدة البيانات...');
    
    // الحصول على قائمة الجداول
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`📋 تم العثور على ${tables.length} جدول:`, tables);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      tables: {}
    };
    
    // تصدير كل جدول
    for (const table of tables) {
      console.log(`📤 تصدير جدول: ${table}...`);
      
      try {
        const result = await client.query(`SELECT * FROM "${table}"`);
        exportData.tables[table] = {
          count: result.rows.length,
          data: result.rows
        };
        
        // حفظ كل جدول في ملف منفصل
        const tableFile = path.join(outputDir, `${table}.json`);
        fs.writeFileSync(tableFile, JSON.stringify(result.rows, null, 2), 'utf8');
        console.log(`   ✅ ${table}: ${result.rows.length} سجل`);
      } catch (err) {
        console.log(`   ⚠️ خطأ في جدول ${table}:`, err.message);
        exportData.tables[table] = { error: err.message };
      }
    }
    
    // حفظ ملف التصدير الكامل
    const fullExportFile = path.join(outputDir, '_full_export.json');
    fs.writeFileSync(fullExportFile, JSON.stringify(exportData, null, 2), 'utf8');
    
    // تصدير هيكل الجداول (Schema)
    console.log('\n📐 تصدير هيكل الجداول...');
    const schemaResult = await client.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    const schemaFile = path.join(outputDir, '_schema.json');
    fs.writeFileSync(schemaFile, JSON.stringify(schemaResult.rows, null, 2), 'utf8');
    
    console.log('\n✅ تم تصدير قاعدة البيانات بنجاح!');
    console.log(`📁 الملفات محفوظة في: ${outputDir}`);
    
    // إحصائيات
    let totalRecords = 0;
    for (const table of Object.keys(exportData.tables)) {
      if (exportData.tables[table].count) {
        totalRecords += exportData.tables[table].count;
      }
    }
    console.log(`📊 إجمالي السجلات: ${totalRecords}`);
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

exportDatabase();
