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

      // Check for 404
      if (data.includes('404') || data.includes('غير موجود')) {
        console.log('Page shows 404 or not found');
      } else {
        console.log('Page loaded successfully!');
      }

      // Check for article title
      if (data.includes('ارتباك الانقلاب')) {
        console.log('Article title found!');
      }
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
