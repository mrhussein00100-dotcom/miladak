const https = require('https');

// Test articles API
https
  .get('https://miladak.com/api/articles', (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log('Success:', json.success);
        console.log('Total:', json.data?.total);
        console.log('Items count:', json.data?.items?.length);
        if (json.data?.items?.length > 0) {
          console.log(
            'First article:',
            json.data.items[0].title,
            '-',
            json.data.items[0].slug
          );
        }
        if (json.error) {
          console.log('Error:', json.error);
        }
      } catch (e) {
        console.log('Parse error:', e.message);
        console.log('Raw:', data.substring(0, 1000));
      }
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
