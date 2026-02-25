
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

try {
  const row = db.prepare('SELECT count(*) as count FROM articles').get();
  console.log(`Articles count: ${row.count}`);
  
  const sample = db.prepare('SELECT id, title, length(content) as len FROM articles LIMIT 5').all();
  console.log('Sample articles:', sample);
} catch (e) {
  console.error('Error:', e.message);
}
