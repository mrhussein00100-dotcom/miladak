import { sql } from '@vercel/postgres';

async function testArticleEncoding() {
  try {
    console.log('🔍 Testing article encoding...');

    // جلب مقال واحد للاختبار
    const result = await sql`
      SELECT id, title, content, excerpt 
      FROM articles 
      WHERE published = true 
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      console.log('❌ No articles found');
      return;
    }

    const article = result.rows[0];

    console.log('📄 Article found:');
    console.log('ID:', article.id);
    console.log('Title:', article.title);
    console.log('Title length:', article.title.length);
    console.log('Title bytes:', Buffer.from(article.title, 'utf8').length);
    console.log('Content preview:', article.content.substring(0, 100));
    console.log('Content has question marks:', article.content.includes('?'));
    console.log('Content has Arabic:', /[\u0600-\u06FF]/.test(article.content));

    // اختبار الترميز
    console.log('\n🔧 Testing encoding fixes:');

    // طريقة 1: Buffer
    try {
      const bufferFixed = Buffer.from(article.content, 'latin1').toString(
        'utf8'
      );
      console.log('Buffer method preview:', bufferFixed.substring(0, 100));
      console.log(
        'Buffer method has Arabic:',
        /[\u0600-\u06FF]/.test(bufferFixed)
      );
    } catch (e) {
      console.log('Buffer method failed:', e.message);
    }

    // طريقة 2: TextDecoder
    try {
      const decoder = new TextDecoder('utf-8');
      const encoder = new TextEncoder();
      const bytes = encoder.encode(article.content);
      const decoderFixed = decoder.decode(bytes);
      console.log(
        'TextDecoder method preview:',
        decoderFixed.substring(0, 100)
      );
      console.log(
        'TextDecoder method has Arabic:',
        /[\u0600-\u06FF]/.test(decoderFixed)
      );
    } catch (e) {
      console.log('TextDecoder method failed:', e.message);
    }

    // طريقة 3: Direct check
    console.log('Original content encoding check:');
    console.log('Has UTF-8 BOM:', article.content.charCodeAt(0) === 0xfeff);
    console.log(
      'First 10 char codes:',
      Array.from(article.content.substring(0, 10)).map((c) => c.charCodeAt(0))
    );

    // اختبار قاعدة البيانات
    console.log('\n🗄️ Database encoding test:');
    const dbTest = await sql`SELECT 'مرحبا بك في ميلادك' as test_text`;
    console.log('Database Arabic test:', dbTest.rows[0].test_text);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testArticleEncoding();
