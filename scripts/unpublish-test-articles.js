
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/database.sqlite');
// Try alternative paths if not found
const possiblePaths = [
  dbPath,
  path.join(__dirname, '../database.sqlite'),
  path.join(__dirname, '../prisma/dev.db'),
  path.join(__dirname, '../dev.db')
];

let db;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    console.log(`Found database at: ${p}`);
    db = new Database(p);
    break;
  }
}

if (!db) {
  console.error('Database not found in common locations');
  process.exit(1);
}

// Check articles table structure to find content column
const tableInfo = db.pragma('table_info(articles)');
const contentCol = tableInfo.find(c => c.name === 'content') ? 'content' : 'body';

if (!contentCol) {
  console.error('Could not find content column in articles table');
  process.exit(1);
}

const THRESHOLD = 300; // words

const articles = db.prepare(`SELECT id, title, ${contentCol} as content, published FROM articles`).all();

console.log(`Total articles: ${articles.length}`);
console.log('-----------------------------------');

let unpublishedCount = 0;
const updateStmt = db.prepare('UPDATE articles SET published = 0 WHERE id = ?');

const transaction = db.transaction((idsToUnpublish) => {
  for (const id of idsToUnpublish) {
    updateStmt.run(id);
  }
});

const idsToUnpublish = [];

articles.forEach(article => {
  if (!article.content) return;
  
  // Remove HTML tags for word count
  const text = article.content.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount < THRESHOLD) {
    if (article.published !== 0) {
      console.log(`[UNPUBLISHING] ID: ${article.id} | Words: ${wordCount} | Title: ${article.title}`);
      idsToUnpublish.push(article.id);
    } else {
      console.log(`[ALREADY UNPUBLISHED] ID: ${article.id} | Words: ${wordCount} | Title: ${article.title}`);
    }
  }
});

if (idsToUnpublish.length > 0) {
  transaction(idsToUnpublish);
  console.log('-----------------------------------');
  console.log(`Successfully unpublished ${idsToUnpublish.length} short articles.`);
} else {
  console.log('-----------------------------------');
  console.log('No new articles needed unpublishing.');
}
