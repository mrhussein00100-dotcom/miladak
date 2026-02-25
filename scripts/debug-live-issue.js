const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('🔍 تشخيص مباشر للمشكلة\n');

// Test the exact same logic as the page
const slug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';

console.log('1️⃣ فحص الـ slug المستخدم:');
console.log(`   Original: ${slug}`);
console.log(`   Decoded: ${decodeURIComponent(slug)}\n`);

// Get article exactly like the page does
const article = db
  .prepare(
    `
  SELECT a.*, c.name as category_name, c.color as category_color
  FROM articles a
  LEFT JOIN categories c ON a.category_id = c.id
  WHERE a.slug = ? AND a.published = 1
`
  )
  .get(slug);

console.log('2️⃣ نتيجة الاستعلام:');
if (article) {
  console.log('   ✅ المقال موجود');
  console.log(`   ID: ${article.id}`);
  console.log(`   Title: ${article.title}`);
  console.log(`   Featured Image: ${article.featured_image || 'لا يوجد'}`);
  console.log(`   Image: ${article.image || 'لا يوجد'}`);
  console.log(`   Published: ${article.published}`);
} else {
  console.log('   ❌ المقال غير موجود');
}

console.log('\n3️⃣ فحص getImageSrc logic:');
if (article) {
  // Simulate getImageSrc function
  const imagePath = article.featured_image || article.image;
  console.log(`   Priority check: featured_image = ${article.featured_image}`);
  console.log(`   Fallback check: image = ${article.image}`);
  console.log(`   Final result: ${imagePath || 'لا يوجد'}`);

  if (imagePath) {
    const isExternal =
      imagePath.startsWith('http://') || imagePath.startsWith('https://');
    const isValidLocal = imagePath.startsWith('/');

    console.log(`   Is external: ${isExternal}`);
    console.log(`   Is valid local: ${isValidLocal}`);
    console.log(`   Should display: ${isExternal || isValidLocal}`);
  }
}

console.log('\n4️⃣ فحص جميع المقالات المنشورة مع صور:');
const articlesWithImages = db
  .prepare(
    `
  SELECT id, title, slug, featured_image, image, published
  FROM articles 
  WHERE published = 1 AND (featured_image IS NOT NULL OR image IS NOT NULL)
  ORDER BY id DESC
  LIMIT 5
`
  )
  .all();

articlesWithImages.forEach((art) => {
  console.log(`   📄 ${art.id}: ${art.title.substring(0, 30)}...`);
  console.log(`      Featured: ${art.featured_image || 'لا يوجد'}`);
  console.log(`      Image: ${art.image || 'لا يوجد'}`);
  console.log(`      Published: ${art.published}`);
});

db.close();
