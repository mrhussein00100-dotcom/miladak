const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try different database paths
const possiblePaths = [
  path.join(process.cwd(), 'database.sqlite'),
  path.join(process.cwd(), 'miladak_v2.sqlite'),
  path.join(process.cwd(), 'miladak.sqlite'),
  path.join(process.cwd(), 'data.sqlite'),
];

console.log('Checking possible database paths...');

for (const dbPath of possiblePaths) {
  console.log(`\nTrying: ${dbPath}`);

  try {
    if (!fs.existsSync(dbPath)) {
      console.log('File does not exist');
      continue;
    }

    const db = new Database(dbPath);

    // Check if table exists
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all();
    console.log(
      'Tables found:',
      tables.map((t) => t.name)
    );

    // Check page_keywords table
    const hasTable = tables.some((t) => t.name === 'page_keywords');
    console.log('page_keywords table exists:', hasTable);

    if (hasTable) {
      const count = db
        .prepare('SELECT COUNT(*) as count FROM page_keywords')
        .get();
      console.log('Records count:', count.count);

      if (count.count > 0) {
        const sample = db.prepare('SELECT * FROM page_keywords LIMIT 3').all();
        console.log('Sample records:', JSON.stringify(sample, null, 2));

        console.log('\n✅ Found the correct database with page_keywords!');
        console.log('Database path:', dbPath);
        break;
      }
    }

    db.close();
  } catch (error) {
    console.log('Error with this path:', error.message);
  }
}
