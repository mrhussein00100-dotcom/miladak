const https = require('https');

// First get articles list
https
  .get('https://miladak.com/api/articles', (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('=== Articles from API ===');
        console.log('Total:', json.data?.total);

        if (json.data?.items?.length > 0) {
          // Test first 3 articles
          json.data.items.slice(0, 3).forEach((article, i) => {
            console.log(`\n${i + 1}. Title: ${article.title}`);
            console.log(`   Slug: ${article.slug}`);
            console.log(`   Published: ${article.published}`);

            // Test this article page
            const testUrl = `https://miladak.com/articles/${encodeURIComponent(
              article.slug
            )}`;
            console.log(`   Testing: ${testUrl}`);

            https.get(testUrl, (pageRes) => {
              let pageData = '';
              pageRes.on('data', (chunk) => (pageData += chunk));
              pageRes.on('end', () => {
                const has404 =
                  pageData.includes('404') || pageData.includes('غير موجود');
                const hasTitle = pageData.includes(
                  article.title.substring(0, 20)
                );
                console.log(
                  `   Status: ${pageRes.statusCode}, Has 404: ${has404}, Has Title: ${hasTitle}`
                );
              });
            });
          });
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
