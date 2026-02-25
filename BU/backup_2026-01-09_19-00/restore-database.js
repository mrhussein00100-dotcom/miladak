/**
 * سكريبت استعادة قاعدة البيانات
 * يقوم باستيراد البيانات من ملفات JSON إلى قاعدة بيانات PostgreSQL
 * 
 * الاستخدام:
 * 1. عدّل CONNECTION_STRING أدناه
 * 2. شغّل: node restore-database.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ⚠️ عدّل هذا السطر بمعلومات قاعدة البيانات الجديدة
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://user:password@host:5432/database';

const pool = new Pool({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function restoreDatabase() {
  const client = await pool.connect();
  const databaseDir = path.join(__dirname, 'database');
  
  try {
    console.log('🔗 جاري الاتصال بقاعدة البيانات...');
    
    // قراءة هيكل الجداول
    const schemaFile = path.join(databaseDir, '_schema.json');
    if (!fs.existsSync(schemaFile)) {
      throw new Error('ملف الهيكل غير موجود: _schema.json');
    }
    
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    
    // تجميع الجداول
    const tables = [...new Set(schema.map(col => col.table_name))];
    console.log(`📋 تم العثور على ${tables.length} جدول للاستعادة`);
    
    // استعادة كل جدول
    for (const table of tables) {
      const tableFile = path.join(databaseDir, `${table}.json`);
      
      if (!fs.existsSync(tableFile)) {
        console.log(`⚠️ ملف ${table}.json غير موجود - تخطي`);
        continue;
      }
      
      const data = JSON.parse(fs.readFileSync(tableFile, 'utf8'));
      
      if (data.length === 0) {
        console.log(`📭 ${table}: فارغ - تخطي`);
        continue;
      }
      
      console.log(`📥 استعادة ${table} (${data.length} سجل)...`);
      
      // الحصول على أسماء الأعمدة
      const columns = Object.keys(data[0]);
      
      // إنشاء استعلام INSERT
      for (const row of data) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = columns.map(c => `"${c}"`).join(', ');
        
        try {
          await client.query(
            `INSERT INTO "${table}" (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values
          );
        } catch (err) {
          // تجاهل أخطاء التكرار
          if (!err.message.includes('duplicate') && !err.message.includes('already exists')) {
            console.log(`   ⚠️ خطأ في ${table}:`, err.message);
          }
        }
      }
      
      console.log(`   ✅ تم استعادة ${table}`);
    }
    
    console.log('\n✅ تمت استعادة قاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// التحقق من وجود CONNECTION_STRING
if (CONNECTION_STRING.includes('user:password')) {
  console.log('⚠️ يرجى تعديل CONNECTION_STRING في الملف أو تعيين DATABASE_URL');
  console.log('مثال: DATABASE_URL="postgres://..." node restore-database.js');
  process.exit(1);
}

restoreDatabase();
