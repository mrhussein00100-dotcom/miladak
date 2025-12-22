const https = require('https');

// First get articles list
https
  .get('https://miladak.com/api/articles', (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Raw response:', data.substring(0, 2000));
    });
  })
  .on('error', (e) => console.log('Error:', e.message));
