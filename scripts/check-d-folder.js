const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check all database files in the d folder and root
const dbPaths = [
  'C:\\web\\secend_stadge\\miladak_v2\\d\\database.sqlite',
  'C:\\web\\secend_stadge\\miladak_v2\\database-backup.sqlite',
  'C:\\web\\secend_stadge\\miladak_v2\\database-main-backup.sqlite',
];

console.log('Checking database files by size (largest first)...\n');

for (const dbPath of dbPaths) {
  console.log(`Checking: ${dbPath}`);

  try {
    if (!fs.existsSync(dbPath)) {
      console.log('❌ File does not exist\n');
      continue;
    }

    // Check file size
    const stats = fs.statSync(dbPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📁 File size: ${sizeMB} MB`);

    const db = new Database(dbPath);

    // Check if page_keywords table exists
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all();
    const hasPageKeywords = tables.some((t) => t.name === 'page_keywords');

    if (hasPageKeywords) {
      const count = db
        .prepare('SELECT COUNT(*) as count FROM page_keywords')
        .get();
      console.log(`✅ Found page_keywords table with ${count.count} records`);

      if (count.count > 10) {
        console.log('🎯 This looks like the full backup!');

        // Show sample records
        const sample = db
          .prepare(
            'SELECT id, page_title, LENGTH(keywords) as keyword_length FROM page_keywords ORDER BY id LIMIT 10'
          )
          .all();
        console.log('Sample records:');
        sample.forEach((row) => {
          console.log(
            `  ${row.id}. ${row.page_title}: ${row.keyword_length} chars`
          );
        });

        console.log(`\n🔥🔥🔥 FOUND THE FULL BACKUP: ${dbPath} 🔥🔥🔥`);
        console.log(`Size: ${sizeMB} MB, Records: ${count.count}\n`);

        // This is the one we want to restore from
        break;
      }
    } else {
      console.log('❌ No page_keywords table');
    }

    db.close();
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('');
}
