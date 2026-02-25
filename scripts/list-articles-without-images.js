const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

console.log('--- Articles without images ---');
const articles = db.prepare("SELECT id, title, content FROM articles WHERE published = 1").all();

let count = 0;
articles.forEach(a => {
    const content = a.content || '';
    if (!content.includes('<img') && !content.includes('src=')) {
        console.log(`[NO IMAGE] ID: ${a.id} | Title: ${a.title}`);
        count++;
    }
});
console.log(`Total: ${count}`);
