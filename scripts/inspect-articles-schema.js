
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

const tables = ['articles', 'article_categories', 'categories'];

for (const t of tables) {
    const row = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${t}'`).get();
    if (row) {
        console.log(`\n--- Schema for ${t} ---`);
        console.log(row.sql);
    } else {
        console.log(`\n--- Table ${t} not found ---`);
    }
}
