const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check backup databases for page_keywords table
const backupPaths = [
  'C:\\web\\secend_stadge\\miladak_v2_fixtool\\database.sqlite',
  'C:\\web\\secend_stadge\\miladak_v2 - Copy (11)\\database.sqlite',
  'C:\\web\\secend_stadge\\miladak_v2 - Copy (12)\\database.sqlite',
  'C:\\web\\secend_stadge\\miladak_v2 - Copy (5)\\database.sqlite',
];

console.log('Checking backup databases for page_keywords...\n');

for (const dbPath of backupPaths) {
  console.log(`Checking: ${dbPath}`);

  try {
    if (!fs.existsSync(dbPath)) {
      console.log('❌ File does not exist\n');
      continue;
    }

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

      if (count.count > 5) {
        console.log('🎯 This looks like the full backup!');

        // Show sample data
        const sample = db
          .prepare(
            'SELECT page_title, LENGTH(keywords) as keyword_length FROM page_keywords LIMIT 5'
          )
          .all();
        console.log('Sample data:');
        sample.forEach((row) => {
          console.log(`  - ${row.page_title}: ${row.keyword_length} chars`);
        });

        console.log(`\n🔥 FOUND THE BACKUP: ${dbPath}\n`);
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
