const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

const slug =
  'تونس-من-انقلاب-متعثر-إلى-صراع-شعبي-على-السلطة-والمستقبل-الديمقراطي';

console.log('🔍 فحص المقال:', slug);
console.log('');

const article = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image, content, created_at
  FROM articles
  WHERE slug = ?
`
  )
  .get(slug);

if (article) {
  console.log('📄 تفاصيل المقال:');
  console.log('   ID:', article.id);
  console.log('   Title:', article.title);
  console.log('   Image:', article.image || 'NULL');
  console.log('   Featured Image:', article.featured_image || 'NULL');
  console.log(
    '   Content Length:',
    article.content ? article.content.length : 0
  );
  console.log('   Created:', article.created_at);
  console.log('');

  // Check if content has images
  const hasImagesInContent =
    article.content && article.content.includes('<img');
  console.log('   Has images in content:', hasImagesInContent ? 'YES' : 'NO');

  if (hasImagesInContent) {
    const imgMatches = article.content.match(/<img[^>]+src="([^">]+)"/g);
    console.log(
      '   Number of images in content:',
      imgMatches ? imgMatches.length : 0
    );
    if (imgMatches && imgMatches.length > 0) {
      console.log('   First image:', imgMatches[0]);
    }
  }
} else {
  console.log('❌ المقال غير موجود');
}

db.close();
