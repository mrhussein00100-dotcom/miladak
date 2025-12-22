const Database = require('better-sqlite3');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// قراءة متغيرات البيئة يدوياً
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});
process.env.POSTGRES_URL = envVars.POSTGRES_URL;

async function migrateCategories() {
  console.log('=== ترحيل التصنيفات إلى PostgreSQL ===\n');

  // الاتصال بـ SQLite
  const sqlitePath = path.join(__dirname, '..', 'database-main-backup.sqlite');
  const sqlite = new Database(sqlitePath);

  // الاتصال بـ PostgreSQL
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // جلب التصنيفات من SQLite
    const categories = sqlite
      .prepare('SELECT * FROM categories ORDER BY id')
      .all();
    console.log(`وجدت ${categories.length} تصنيف في SQLite\n`);

    // حذف التصنيفات القديمة في PostgreSQL
    console.log('حذف التصنيفات القديمة...');
    await pool.query('DELETE FROM article_categories');

    // إعادة تعيين sequence
    await pool.query('ALTER SEQUENCE article_categories_id_seq RESTART WITH 1');

    // إدراج التصنيفات الجديدة
    console.log('إدراج التصنيفات الجديدة...');
    let inserted = 0;

    for (const cat of categories) {
      try {
        await pool.query(
          `
          INSERT INTO article_categories (id, name, slug, description, color, icon, sort_order, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            description = EXCLUDED.description,
            color = EXCLUDED.color
        `,
          [
            cat.id,
            cat.name,
            cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            cat.description || '',
            cat.color || '#6366f1',
            '',
            cat.id,
            cat.created_at || new Date().toISOString(),
            new Date().toISOString(),
          ]
        );
        inserted++;
        console.log(`  ✓ ${cat.id}: ${cat.name}`);
      } catch (err) {
        console.log(`  ✗ ${cat.id}: ${cat.name} - ${err.message}`);
      }
    }

    // تحديث sequence
    const maxId = Math.max(...categories.map((c) => c.id));
    await pool.query(
      `ALTER SEQUENCE article_categories_id_seq RESTART WITH ${maxId + 1}`
    );

    console.log(`\n✅ تم ترحيل ${inserted} تصنيف بنجاح!`);

    // التحقق
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM article_categories'
    );
    console.log(`\nعدد التصنيفات في PostgreSQL: ${result.rows[0].count}`);
  } catch (error) {
    console.error('خطأ:', error);
  } finally {
    sqlite.close();
    await pool.end();
  }
}

migrateCategories();
