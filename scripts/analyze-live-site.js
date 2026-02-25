
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const BASE_URL = 'https://miladak.com';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;

// Simple HTML tag stripper
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
             .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

// Fetch URL helper
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function analyzeSite() {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  
  try {
    const sitemapXml = await fetchUrl(SITEMAP_URL);
    fs.writeFileSync('temp_sitemap.xml', sitemapXml);
    console.log('Sitemap saved to temp_sitemap.xml');
    
    const urls = [];
    // Extract URLs from sitemap (handling newlines)
    const locRegex = /<loc>([\s\S]*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(sitemapXml)) !== null) {
      urls.push(match[1]);
    }
    
    console.log(`Found ${urls.length} URLs in sitemap.`);
    
    // Filter for articles and tools
    const articles = urls.filter(u => u.includes('/articles/'));
    const tools = urls.filter(u => !u.includes('/articles/') && !u.endsWith('.xml'));
    
    console.log(`- Articles: ${articles.length}`);
    console.log(`- Other Pages (Tools/Static): ${tools.length}`);

    // Check ads.txt
    console.log('\nChecking ads.txt...');
    try {
        const adsTxt = await fetchUrl(`${BASE_URL}/ads.txt`);
        if (adsTxt.includes('pub-')) {
            console.log('  ✅ ads.txt seems valid (contains pub- ID)');
        } else {
            console.log('  ⚠️ ads.txt might be missing publisher ID');
            console.log('  Preview:', adsTxt.substring(0, 100).replace(/\n/g, ' '));
        }
    } catch (e) {
        console.error('  ❌ Failed to fetch ads.txt');
    }

    // Check robots.txt
    console.log('\nChecking robots.txt...');
    try {
        const robotsTxt = await fetchUrl(`${BASE_URL}/robots.txt`);
        if (robotsTxt.includes('Sitemap:')) {
            console.log('  ✅ robots.txt contains Sitemap');
        } else {
            console.log('  ⚠️ robots.txt missing Sitemap link');
        }
    } catch (e) {
        console.error('  ❌ Failed to fetch robots.txt');
    }
    
    // Analyze ALL articles
    console.log(`\nAnalyzing ALL ${articles.length} articles...`);
    const report = [];
    let problematicCount = 0;
    
    for (let i = 0; i < articles.length; i++) {
      const url = articles[i];
      if (i % 10 === 0) process.stdout.write(`.`); // Progress indicator
      
      try {
        const html = await fetchUrl(url);
        
        // Extract content (very rough heuristic for main content)
        const text = stripHtml(html);
        const wordCount = text.split(/\s+/).length;
        
        const issues = [];
        if (wordCount < 300) issues.push('Low word count (<300)');
        else if (wordCount < 600) issues.push('Medium word count (<600)');
        
        if (issues.length > 0) {
            problematicCount++;
            console.log(`\n⚠️ ${url}: ${wordCount} words. Issues: ${issues.join(', ')}`);
            report.push(`URL: ${url}`);
            report.push(`  Word Count: ${wordCount}`);
            report.push(`  Issues: ${issues.join(', ')}`);
            report.push('---');
        }
      } catch (e) {
        report.push(`URL: ${url}`);
        report.push(`  Error: Failed to fetch (${e.message})`);
        report.push('---');
      }
    }
    
    console.log('\n\nAnalysis Complete.');
    console.log(`Found ${problematicCount} problematic articles.`);
    
    fs.writeFileSync('content-audit-report.txt', report.join('\n'));
    console.log('Report saved to content-audit-report.txt');
    
  } catch (error) {
    console.error('Error analyzing site:', error);
  }
}

analyzeSite();
