const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// First check the table structure
const tableInfo = db.prepare(`PRAGMA table_info(tools)`).all();
console.log('Table structure:');
tableInfo.forEach((col) => console.log(`  ${col.name}: ${col.type}`));

console.log('\nAll tools:');
const tools = db.prepare(`SELECT * FROM tools`).all();
tools.forEach((t) => {
  console.log(
    `ID: ${t.id}, name: ${t.name}, title: ${t.title}, href: ${t.href}`
  );
});
