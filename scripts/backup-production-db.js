/**
 * سكريبت لأخذ نسخة احتياطية من قاعدة بيانات PostgreSQL المنشورة على Vercel
 *
 * الاستخدام:
 * 1. احصل على POSTGRES_URL من Vercel Dashboard > Storage > Postgres
 * 2. شغل: node scripts/backup-production-db.js "postgres://..."
 *
 * أو يمكنك تصدير البيانات عبر API من الموقع المنشور
 */

const fs = require('fs');
const path = require('path');

// التاريخ للنسخة الاحتياطية
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.join(__dirname, '..', 'backups', `backup-${timestamp}`);

async function backupViaAPI() {
  console.log('🔄 جاري تحميل البيانات من الموقع المنشور...\n');

  const baseUrl = 'https://miladak.com';
  const tables = [
    { name: 'articles', endpoint: '/api/articles?limit=1000' },
    { name: 'categories', endpoint: '/api/categories' },
    { name: 'tools', endpoint: '/api/tools' },
  ];

  // إنشاء مجلد النسخة الاحتياطية
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backup = {
    timestamp: new Date().toISOString(),
    source: baseUrl,
    tables: {},
  };

  for (const table of tables) {
    try {
      console.log(`📥 جاري تحميل ${table.name}...`);
      const response = await fetch(`${baseUrl}${table.endpoint}`);

      if (response.ok) {
        const data = await response.json();
        backup.tables[table.name] = data;
        console.log(
          `   ✅ تم تحميل ${
            Array.isArray(data)
              ? data.length
              : data.articles?.length || data.data?.length || 'N/A'
          } سجل`
        );
      } else {
        console.log(`   ⚠️ فشل تحميل ${table.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ خطأ في ${table.name}: ${error.message}`);
    }
  }

  // حفظ النسخة الاحتياطية
  const backupFile = path.join(backupDir, 'backup.json');
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), 'utf8');

  console.log(`\n✅ تم حفظ النسخة الاحتياطية في: ${backupFile}`);
  return backup;
}

async function backupViaPostgres(connectionString) {
  console.log('🔄 جاري الاتصال بقاعدة بيانات PostgreSQL...\n');

  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    // إنشاء مجلد النسخة الاحتياطية
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backup = {
      timestamp: new Date().toISOString(),
      connectionString: connectionString.replace(/:[^:@]+@/, ':***@'), // إخفاء كلمة المرور
      tables: {},
    };

    // قائمة الجداول للنسخ الاحتياطي
    const tables = [
      'articles',
      'categories',
      'tools',
      'page_keywords',
      'historical_events',
      'celebrities',
      'birthstones_flowers',
      'colors_numbers',
      'admin_users',
      'auto_publish_settings',
      'auto_publish_logs',
      'rewrite_history',
      'sona_settings',
      'sona_templates',
      'sona_analytics',
    ];

    for (const table of tables) {
      try {
        console.log(`📥 جاري تحميل جدول ${table}...`);
        const result = await pool.query(`SELECT * FROM ${table}`);
        backup.tables[table] = result.rows;
        console.log(`   ✅ تم تحميل ${result.rows.length} سجل`);

        // حفظ كل جدول في ملف منفصل
        const tableFile = path.join(backupDir, `${table}.json`);
        fs.writeFileSync(
          tableFile,
          JSON.stringify(result.rows, null, 2),
          'utf8'
        );
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ⏭️ الجدول ${table} غير موجود`);
        } else {
          console.log(`   ⚠️ خطأ في ${table}: ${error.message}`);
        }
      }
    }

    await pool.end();

    // حفظ النسخة الاحتياطية الكاملة
    const backupFile = path.join(backupDir, 'full-backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), 'utf8');

    console.log(`\n✅ تم حفظ النسخة الاحتياطية الكاملة في: ${backupDir}`);

    // إحصائيات
    console.log('\n📊 إحصائيات النسخة الاحتياطية:');
    for (const [table, data] of Object.entries(backup.tables)) {
      console.log(`   ${table}: ${data.length} سجل`);
    }

    return backup;
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    throw error;
  }
}

async function main() {
  const connectionString = process.argv[2];

  if (connectionString && connectionString.startsWith('postgres')) {
    await backupViaPostgres(connectionString);
  } else {
    console.log('💡 لم يتم توفير رابط PostgreSQL، سيتم التحميل عبر API...\n');
    console.log('للنسخ الاحتياطي الكامل، شغل:');
    console.log(
      'node scripts/backup-production-db.js "postgres://user:pass@host:5432/db"\n'
    );
    console.log(
      'يمكنك الحصول على الرابط من: Vercel Dashboard > Storage > Postgres\n'
    );
    console.log('---\n');
    await backupViaAPI();
  }
}

main().catch(console.error);
