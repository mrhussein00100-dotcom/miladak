const Database = require('better-sqlite3');
const path = require('path');

// Use the same database path as the app
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

console.log('Testing database connection...');

try {
  // Test the query function directly
  const results = query('SELECT * FROM page_keywords LIMIT 3');
  console.log('Direct query results:', JSON.stringify(results, null, 2));

  // Test with formatted results like in the API
  const formattedResults = results.map((row) => ({
    ...row,
    keywords_array: row.keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0),
    keywords_count: row.keywords.split(',').filter((k) => k.trim().length > 0)
      .length,
  }));

  console.log('\nFormatted results (like API):');
  console.log(JSON.stringify(formattedResults, null, 2));
} catch (error) {
  console.error('Error:', error);
}
