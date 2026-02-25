
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

console.log('🧹 Cleaning up local database...');

// 1. Delete duplicate article ID 108 (keep 107)
const duplicateId = 108;
const duplicateRes = db.prepare('DELETE FROM articles WHERE id = ?').run(duplicateId);
if (duplicateRes.changes > 0) {
    console.log(`✅ Deleted duplicate article ID: ${duplicateId}`);
} else {
    console.log(`ℹ️ Duplicate article ID: ${duplicateId} not found.`);
}

// 2. Unpublish short articles (< 400 words)
const THRESHOLD = 400;
const articles = db.prepare('SELECT id, title, content, published FROM articles WHERE published = 1').all();
let unpublishedCount = 0;

const unpublishStmt = db.prepare('UPDATE articles SET published = 0 WHERE id = ?');

for (const article of articles) {
    // Strip HTML tags
    const text = article.content.replace(/<[^>]*>/g, ' ');
    // Split by whitespace
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length < THRESHOLD) {
        console.log(`📉 Unpublishing short article ID: ${article.id} | Words: ${words.length} | Title: ${article.title}`);
        unpublishStmt.run(article.id);
        unpublishedCount++;
    }
}

console.log(`✅ Unpublished ${unpublishedCount} short articles.`);
console.log('🎉 Local cleanup complete!');
