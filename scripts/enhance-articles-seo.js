
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

console.log('🚀 Starting SEO Enhancement for Articles...');

// Get all articles
const articles = db.prepare('SELECT id, title, content, excerpt, meta_description, meta_keywords FROM articles').all();

const updateStmt = db.prepare(`
    UPDATE articles 
    SET excerpt = ?, meta_description = ?, meta_keywords = ?
    WHERE id = ?
`);

let updatedCount = 0;

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

function generateKeywords(title, content) {
    const stopWords = ['في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'تم', 'كان', 'ما', 'هو', 'هي', 'التي', 'الذي'];
    const text = (title + ' ' + content).toLowerCase();
    const words = text.split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.includes(w) && !/^\d+$/.test(w))
        .slice(0, 10); // Take top 10 potential keywords
    return [...new Set(words)].join(', ');
}

db.transaction(() => {
    for (const article of articles) {
        let needsUpdate = false;
        let { excerpt, meta_description, meta_keywords, content, title } = article;
        const cleanContent = stripHtml(content);

        // 1. Generate Excerpt if missing
        if (!excerpt || excerpt.trim().length === 0) {
            excerpt = cleanContent.substring(0, 160).trim() + '...';
            needsUpdate = true;
            console.log(`📝 Generated excerpt for article ${article.id}`);
        }

        // 2. Generate Meta Description if missing (use excerpt)
        if (!meta_description || meta_description.trim().length === 0) {
            meta_description = excerpt;
            needsUpdate = true;
            console.log(`🏷️ Generated meta_description for article ${article.id}`);
        }

        // 3. Generate Keywords if missing
        if (!meta_keywords || meta_keywords.trim().length === 0) {
            meta_keywords = generateKeywords(title, cleanContent);
            needsUpdate = true;
            console.log(`🔑 Generated keywords for article ${article.id}`);
        }

        if (needsUpdate) {
            updateStmt.run(excerpt, meta_description, meta_keywords, article.id);
            updatedCount++;
        }
    }
})();

console.log(`\n🎉 Finished! Enhanced SEO for ${updatedCount} articles.`);
