
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

function auditToolPages() {
  console.log('\n--- Auditing Tool Pages ---');
  const toolsDir = path.join(__dirname, '../app/tools');
  const toolPages = [];
  
  if (fs.existsSync(toolsDir)) {
      function scanDir(dir) {
          const files = fs.readdirSync(dir);
          for (const file of files) {
              const fullPath = path.join(dir, file);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                  scanDir(fullPath);
              } else if (file === 'page.tsx') {
                  toolPages.push(fullPath);
              }
          }
      }
      scanDir(toolsDir);
  } else {
      console.log('Tools directory not found.');
      return;
  }

  for (const pagePath of toolPages) {
      const content = fs.readFileSync(pagePath, 'utf8');
      const relativePath = path.relative(path.join(__dirname, '..'), pagePath);
      
      // Rough estimate of text content length (excluding code imports etc)
      // We look for seoContent or simple text strings
      let textContent = content.replace(/import.*?from.*?;/g, '')
                                 .replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ');
      
      // Basic heuristic to remove non-content strings (like class names)
      // This is very rough, but gives an idea.
      
      const wordCount = textContent.split(' ').length;
      
      // Check for specific SEO content variable or component
      const hasSeoContent = content.includes('const seoContent =') || content.includes('<ToolPageLayout');
      
      console.log(`Tool: ${relativePath}`);
      console.log(`   - Word Count (Approx): ${wordCount}`);
      console.log(`   - Has SEO Content Block: ${hasSeoContent ? '✅' : '❌'}`);
      
      if (wordCount < 1000 && !hasSeoContent) { // Increased threshold for tools because code adds up
           console.log(`   ⚠️ WARNING: Potential Thin Content`);
      }
  }
}

function auditArticles() {
  console.log('\n--- Auditing Articles Quality ---');
  const articles = db.prepare('SELECT id, title, content, published FROM articles WHERE published = 1').all();
  
  let thinContentCount = 0;
  let noImageCount = 0;
  let noHeadersCount = 0;

  for (const article of articles) {
      const content = article.content || '';
      
      // Word count
      const text = content.replace(/<[^>]*>/g, ' ');
      const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      
      // Check for images
      const hasImage = content.includes('<img') || content.includes('src=');
      
      // Check for headers
      const hasHeaders = content.includes('<h2') || content.includes('<h3');
      
      if (wordCount < 500) {
          console.log(`[THIN CONTENT] ID: ${article.id} | Words: ${wordCount} | Title: ${article.title}`);
          thinContentCount++;
      }
      
      if (!hasImage) {
          // console.log(`[NO IMAGE] ID: ${article.id} | Title: ${article.title}`);
          noImageCount++;
      }
      
      if (!hasHeaders) {
          console.log(`[NO HEADERS] ID: ${article.id} | Title: ${article.title}`);
          noHeadersCount++;
      }
  }
  
  console.log(`\nSummary:`);
  console.log(`- Articles < 500 words: ${thinContentCount}`);
  console.log(`- Articles without images in body: ${noImageCount}`);
  console.log(`- Articles without headers (h2/h3): ${noHeadersCount}`);
}

auditToolPages();
auditArticles();
