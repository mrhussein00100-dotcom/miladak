/**
 * سكريبت تشخيص مشكلة حفظ المقالات
 * يختبر تحديث المقال 105 مباشرة على قاعدة البيانات
 */

const { Pool } = require('pg');

async function testArticleUpdate() {
  console.log('🔍 بدء تشخيص مشكلة حفظ المقالات...\n');

  // الاتصال بقاعدة البيانات
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!dbUrl) {
    console.error('❌ لم يتم العثور على DATABASE_URL أو POSTGRES_URL');
    console.log('💡 تأكد من تعيين متغيرات البيئة');
    return;
  }

  console.log('📡 الاتصال بقاعدة البيانات...');

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. جلب المقال الحالي
    console.log('\n📖 جلب المقال 105...');
    const articleResult = await pool.query(
      'SELECT id, title, content, updated_at FROM articles WHERE id = $1',
      [105]
    );

    if (articleResult.rows.length === 0) {
      console.log('❌ المقال 105 غير موجود');
      return;
    }

    const article = articleResult.rows[0];
    console.log('✅ تم جلب المقال:');
    console.log(`   - العنوان: ${article.title}`);
    console.log(`   - طول المحتوى: ${article.content?.length || 0} حرف`);
    console.log(`   - آخر تحديث: ${article.updated_at}`);

    // 2. عد الصور في المحتوى
    const imageCount = (article.content?.match(/<img[^>]*>/gi) || []).length;
    console.log(`   - عدد الصور: ${imageCount}`);

    // 3. اختبار تحديث بسيط
    console.log('\n🔄 اختبار تحديث بسيط...');
    const testContent = article.content + '<!-- test update -->';
    const updateTime = new Date().toISOString();

    const updateResult = await pool.query(
      'UPDATE articles SET content = $1, updated_at = $2 WHERE id = $3 RETURNING id, updated_at',
      [testContent, updateTime, 105]
    );

    if (updateResult.rowCount > 0) {
      console.log('✅ تم التحديث بنجاح!');
      console.log(`   - الصفوف المتأثرة: ${updateResult.rowCount}`);
      console.log(
        `   - وقت التحديث الجديد: ${updateResult.rows[0].updated_at}`
      );
    } else {
      console.log('❌ فشل التحديث - لم تتأثر أي صفوف');
    }

    // 4. التحقق من التحديث
    console.log('\n🔍 التحقق من التحديث...');
    const verifyResult = await pool.query(
      'SELECT content, updated_at FROM articles WHERE id = $1',
      [105]
    );

    if (verifyResult.rows[0].content.includes('<!-- test update -->')) {
      console.log('✅ التحديث محفوظ بشكل صحيح!');
    } else {
      console.log('❌ التحديث لم يُحفظ!');
    }

    // 5. إزالة علامة الاختبار
    console.log('\n🧹 إزالة علامة الاختبار...');
    await pool.query('UPDATE articles SET content = $1 WHERE id = $2', [
      article.content,
      105,
    ]);
    console.log('✅ تم إعادة المحتوى الأصلي');

    // 6. اختبار تحديث مع صورة جديدة
    console.log('\n🖼️ اختبار تحديث مع صورة جديدة...');
    const newImageUrl =
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
    const contentWithNewImage = article.content.replace(
      /<img([^>]*?)src="([^"]*)"([^>]*?)>/i,
      `<img$1src="${newImageUrl}"$3>`
    );

    console.log(`   - طول المحتوى الجديد: ${contentWithNewImage.length} حرف`);

    const imageUpdateResult = await pool.query(
      'UPDATE articles SET content = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      [contentWithNewImage, new Date().toISOString(), 105]
    );

    if (imageUpdateResult.rowCount > 0) {
      console.log('✅ تم تحديث الصورة بنجاح!');

      // التحقق
      const verifyImageResult = await pool.query(
        'SELECT content FROM articles WHERE id = $1',
        [105]
      );
      if (verifyImageResult.rows[0].content.includes(newImageUrl)) {
        console.log('✅ الصورة الجديدة محفوظة بشكل صحيح!');
      } else {
        console.log('❌ الصورة الجديدة لم تُحفظ!');
      }
    } else {
      console.log('❌ فشل تحديث الصورة');
    }

    // 7. إعادة المحتوى الأصلي
    console.log('\n🔄 إعادة المحتوى الأصلي...');
    await pool.query('UPDATE articles SET content = $1 WHERE id = $2', [
      article.content,
      105,
    ]);
    console.log('✅ تم إعادة المحتوى الأصلي');
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    console.error('تفاصيل:', error);
  } finally {
    await pool.end();
    console.log('\n🔌 تم إغلاق الاتصال');
  }
}

testArticleUpdate();
