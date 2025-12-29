const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Fix the date-converter href
const result = db
  .prepare(
    `UPDATE tools SET href = '/tools/date-converter' WHERE name = 'date-converter'`
  )
  .run();
console.log('Updated rows:', result.changes);

// Verify the fix
const tool = db
  .prepare(
    `SELECT id, name, title, href FROM tools WHERE name = 'date-converter'`
  )
  .get();
console.log('After fix:', tool);
