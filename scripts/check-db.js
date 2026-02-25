const Database = require('better-sqlite3');
const path = require('path');

// Try both paths
const paths = [
  path.join(process.cwd(), 'database.sqlite'),
  path.join(process.cwd(), './database.sqlite'),
  'database.sqlite',
  './database.sqlite',
];

for (const dbPath of paths) {
  console.log(`\nTrying path: ${dbPath}`);

  try {
    const db = new Database(dbPath);

    // Check if table exists
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all();
    console.log(
      'All tables:',
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

      const sample = db.prepare('SELECT * FROM page_keywords LIMIT 3').all();
      console.log('Sample records:', JSON.stringify(sample, null, 2));

      db.close();
      console.log('✅ Found working database!');
      break;
    }

    db.close();
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}
