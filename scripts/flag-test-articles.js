
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try to find the database file
const possiblePaths = [
  path.join(__dirname, '../database.sqlite'),
  path.join(__dirname, '../data/database.sqlite'),
  path.join(__dirname, '../prisma/dev.db'),
  path.join(__dirname, '../dev.db')
];

let dbPath;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dbPath = p;
    break;
  }
}

if (!dbPath) {
  console.error('Database file not found in common locations.');
  process.exit(1);
}

console.log(`Using database: ${dbPath}`);
const db = new Database(dbPath);

// Check columns
const columns = db.prepare('PRAGMA table_info(articles)').all().map(c => c.name);
const contentCol = columns.includes('content') ? 'content' : (columns.includes('body') ? 'body' : null);

if (!contentCol) {
  console.error('Could not find content or body column in articles table.');
  process.exit(1);
}

console.log(`Content column is: ${contentCol}`);

const articles = db.prepare(`SELECT id, title, slug, ${contentCol} as content, published FROM articles`).all();
console.log(`Total articles in DB: ${articles.length}`);

let shortCount = 0;
const THRESHOLD = 300;

console.log('--- Short Articles (Candidates for Unpublishing) ---');

for (const article of articles) {
  if (!article.content) {
    console.log(`[EMPTY] ID: ${article.id} | Title: ${article.title} (No content)`);
    continue;
  }

  // Strip HTML tags
  const text = article.content.replace(/<[^>]*>/g, ' ');
  // Count words
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount <= THRESHOLD) {
    console.log(`[SHORT] ID: ${article.id} | Words: ${wordCount} | Published: ${article.published} | Title: ${article.title}`);
    shortCount++;
  }
}

// Sort by word count to see the shortest ones
articles.sort((a, b) => {
    const textA = (a.content || '').replace(/<[^>]*>/g, ' ');
    const wordsA = textA.trim().split(/\s+/).filter(w => w.length > 0).length;
    const textB = (b.content || '').replace(/<[^>]*>/g, ' ');
    const wordsB = textB.trim().split(/\s+/).filter(w => w.length > 0).length;
    return wordsA - wordsB;
});

console.log('\n--- Top 10 Shortest Articles ---');
for (let i = 0; i < 10 && i < articles.length; i++) {
    const article = articles[i];
    const text = (article.content || '').replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    console.log(`[${i+1}] ID: ${article.id} | Words: ${words} | Published: ${article.published} | Title: ${article.title}`);
}

console.log('\n--- Checking for "test" or "تجربة" in title ---');
let testTitleCount = 0;
for (const article of articles) {
    if (article.title.toLowerCase().includes('test') || article.title.includes('تجربة')) {
        console.log(`[TITLE MATCH] ID: ${article.id} | Title: ${article.title} | Published: ${article.published}`);
        testTitleCount++;
    }
}
console.log('\n--- Checking for empty meta descriptions ---');
let emptyMetaCount = 0;
for (const article of articles) {
    // Check if meta_description column exists and is empty
    if (article.meta_description === null || article.meta_description === '' || (article.meta_description && article.meta_description.trim() === '')) {
        console.log(`[EMPTY META] ID: ${article.id} | Title: ${article.title}`);
        emptyMetaCount++;
    }
}
console.log('\n--- Checking for duplicate titles ---');
const titleMap = {};
let duplicateCount = 0;
for (const article of articles) {
    if (titleMap[article.title]) {
        console.log(`[DUPLICATE] ID: ${article.id} | Title: ${article.title} (Matches ID: ${titleMap[article.title]})`);
        duplicateCount++;
    } else {
        titleMap[article.title] = article.id;
    }
}
console.log(`Found ${duplicateCount} articles with duplicate titles.`);



