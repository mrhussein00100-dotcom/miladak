
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());

const dbPath = path.join(process.cwd(), 'database.sqlite');
console.log('Looking for database at:', dbPath);

if (!fs.existsSync(dbPath)) {
    console.error('Database file not found!');
    process.exit(1);
}

try {
  // Use default options (read-write) to avoid issues with WAL mode if checking fails
  const db = new Database(dbPath);

  // Check if articles table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'").get();
  if (!tables) {
      console.error('Articles table not found!');
      process.exit(1);
  }

  const articles = db.prepare('SELECT id, title, slug, content, published FROM articles').all();

  console.log(`Total articles: ${articles.length}`);

  const publishedArticles = articles.filter(a => a.published === 1 || a.published === '1' || a.published === 'true');
  console.log(`Published articles: ${publishedArticles.length}`);

  let shortArticles = 0;
  let emptyArticles = 0;

  publishedArticles.forEach(article => {
      const content = article.content || '';
      // Remove HTML tags for better word count estimation
      const textContent = content.replace(/<[^>]*>/g, ' ');
      const wordCount = textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
      
      if (wordCount < 50) {
          emptyArticles++;
          console.log(`[EMPTY/VERY SHORT] ${article.title} (${article.slug}) - Words: ${wordCount}`);
      } else if (wordCount < 300) {
          shortArticles++;
          console.log(`[SHORT] ${article.title} (${article.slug}) - Words: ${wordCount}`);
      }
  });

  console.log(`Summary:`);
  console.log(`- Empty/Very Short (<50 words): ${emptyArticles}`);
  console.log(`- Short (<300 words): ${shortArticles}`);
  console.log(`- Good length (>=300 words): ${publishedArticles.length - shortArticles - emptyArticles}`);

} catch (error) {
  console.error('Error:', error);
}
