const https = require('https');

// Test single article page
const slug = 'birth-date-personality-secrets';
const url = `https://miladak.com/articles/${encodeURIComponent(slug)}`;

console.log('Testing URL:', url);

https
  .get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response length:', data.length);

      // Check for error messages
      if (data.includes('error') || data.includes('Error')) {
        const errorMatch = data.match(/error[^<]*/gi);
        if (errorMatch) {
          console.log('Error found:', errorMatch.slice(0, 3));
        }
      }

      // Check for 404
      if (
        data.includes('404') ||
        data.includes('not found') ||
        data.includes('غير موجود')
      ) {
        console.log('Page shows 404 or not found');
      }

      // Check for article title
      if (data.includes('أسرار تاريخ الميلاد')) {
        console.log('Article title found!');
      }

      // Show first 500 chars
      console.log('\nFirst 500 chars:', data.substring(0, 500));
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
