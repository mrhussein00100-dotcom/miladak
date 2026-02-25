const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try different possible database paths
const possiblePaths = [
  path.join(__dirname, '..', 'miladak.db'),
  path.join(__dirname, '..', 'miladak_v2.db'),
  path.join(__dirname, '..', 'database.db'),
];

let dbPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dbPath = p;
    break;
  }
}

if (!dbPath) {
  console.log('❌ لم يتم العثور على قاعدة البيانات');
  process.exit(1);
}

console.log(`📁 قاعدة البيانات: ${dbPath}\n`);
const db = new Database(dbPath);

// Get all tables
const tables = db
  .prepare(
    `
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`
  )
  .all();

console.log('📋 الجداول الموجودة في قاعدة البيانات:\n');
tables.forEach((table) => {
  console.log(`   - ${table.name}`);
});

db.close();
