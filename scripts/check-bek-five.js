const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check بيك فايف database
const bekFivePath =
  'C:\\web\\secend_stadge\\miladak_v2\\بيك فايف\\database.sqlite';

console.log('Checking بيك فايف database...\n');
console.log(`Path: ${bekFivePath}`);

try {
  if (!fs.existsSync(bekFivePath)) {
    console.log('❌ File does not exist');
    return;
  }

  const db = new Database(bekFivePath);

  // Check if page_keywords table exists
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all();
  console.log(
    'All tables:',
    tables.map((t) => t.name)
  );

  const hasPageKeywords = tables.some((t) => t.name === 'page_keywords');

  if (hasPageKeywords) {
    const count = db
      .prepare('SELECT COUNT(*) as count FROM page_keywords')
      .get();
    console.log(`\n✅ Found page_keywords table with ${count.count} records`);

    if (count.count > 5) {
      console.log('🎯 This looks like the full backup!');

      // Show all records
      const allRecords = db
        .prepare(
          'SELECT id, page_title, LENGTH(keywords) as keyword_length FROM page_keywords ORDER BY id'
        )
        .all();
      console.log('\nAll records:');
      allRecords.forEach((row) => {
        console.log(
          `  ${row.id}. ${row.page_title}: ${row.keyword_length} chars`
        );
      });

      console.log(`\n🔥 FOUND THE FULL BACKUP: ${bekFivePath}\n`);
    }
  } else {
    console.log('❌ No page_keywords table');
  }

  db.close();
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}
