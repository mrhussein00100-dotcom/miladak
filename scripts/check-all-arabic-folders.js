const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check all Arabic folders for page_keywords
const arabicFolders = [
  'بيك تو',
  'بيك ثري',
  'بيك سيكس',
  'بيك فايف',
  'بيك فور',
  'بيكاب',
  'بيكاب سيفين',
];

console.log('Checking all Arabic folders for page_keywords...\n');

for (const folder of arabicFolders) {
  const dbPath = `C:\\web\\secend_stadge\\miladak_v2\\${folder}\\database.sqlite`;
  console.log(`Checking: ${folder}`);

  try {
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Database file does not exist\n');
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

        console.log(`\n🔥🔥🔥 FOUND THE FULL BACKUP: ${dbPath} 🔥🔥🔥\n`);

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
