const https = require('https');

// Test with Arabic slug from the API
const slug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';
const url = `https://miladak.com/articles/${encodeURIComponent(slug)}`;

console.log('Testing URL:', url);

https
  .get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response length:', data.length);

      // Check for actual 404 page content
      const has404Page =
        data.includes('الصفحة غير موجودة') && data.includes('text-8xl');
      console.log('Has 404 page:', has404Page);

      // Check for article content
      const hasArticleContent =
        data.includes('ارتباك الانقلاب') && data.includes('المشهد السياسي');
      console.log('Has article content:', hasArticleContent);

      // Check for article page structure
      const hasArticleStructure =
        data.includes('ArticlePageClient') || data.includes('مشاركة المقال');
      console.log('Has article structure:', hasArticleStructure);

      // Show a snippet
      const titleIndex = data.indexOf('ارتباك الانقلاب');
      if (titleIndex > -1) {
        console.log(
          '\nContext around title:',
          data.substring(titleIndex - 50, titleIndex + 100)
        );
      }
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
