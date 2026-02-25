const https = require('https');
const http = require('http');

function checkCloudflareStatus(domain) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: domain,
            port: 443,
            path: '/',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            console.log(`\n=== فحص حالة Cloudflare لـ ${domain} ===`);
            console.log(`Status Code: ${res.statusCode}`);
            console.log('\n--- HTTP Headers ---');
            
            // البحث عن headers خاصة بـ Cloudflare
            const cloudflareHeaders = {};
            const importantHeaders = {};
            
            Object.keys(res.headers).forEach(header => {
                if (header.toLowerCase().includes('cloudflare') || 
                    header.toLowerCase().includes('cf-') ||
                    header.toLowerCase() === 'server') {
                    cloudflareHeaders[header] = res.headers[header];
                }
                
                if (['server', 'x-powered-by', 'cf-ray', 'cf-cache-status', 'cf-edge-cache'].includes(header.toLowerCase())) {
                    importantHeaders[header] = res.headers[header];
                }
            });

            console.log('Cloudflare Headers:');
            if (Object.keys(cloudflareHeaders).length > 0) {
                Object.keys(cloudflareHeaders).forEach(header => {
                    console.log(`  ${header}: ${cloudflareHeaders[header]}`);
                });
            } else {
                console.log('  لم يتم العثور على headers خاصة بـ Cloudflare');
            }

            console.log('\nImportant Headers:');
            Object.keys(importantHeaders).forEach(header => {
                console.log(`  ${header}: ${importantHeaders[header]}`);
            });

            // فحص Server header
            const serverHeader = res.headers['server'];
            if (serverHeader && serverHeader.toLowerCase().includes('cloudflare')) {
                console.log('\n✅ Cloudflare مفعل - تم العثور على Server header');
            }

            // فحص CF-Ray header (مؤشر قوي على Cloudflare)
            const cfRay = res.headers['cf-ray'];
            if (cfRay) {
                console.log(`✅ Cloudflare مفعل - CF-Ray: ${cfRay}`);
            }

            // فحص CF-Cache-Status
            const cfCache = res.headers['cf-cache-status'];
            if (cfCache) {
                console.log(`✅ Cloudflare Cache مفعل - Status: ${cfCache}`);
            }

            resolve({
                isCloudflare: !!(cfRay || (serverHeader && serverHeader.toLowerCase().includes('cloudflare'))),
                headers: res.headers,
                statusCode: res.statusCode
            });
        });

        req.on('error', (err) => {
            console.error('خطأ في الاتصال:', err.message);
            reject(err);
        });

        req.setTimeout(10000, () => {
            console.error('انتهت مهلة الاتصال');
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

// فحص النطاق
async function main() {
    try {
        const result = await checkCloudflareStatus('miladak.com');
        
        console.log('\n=== النتيجة النهائية ===');
        if (result.isCloudflare) {
            console.log('🎉 Cloudflare يعمل بشكل صحيح على موقعك!');
        } else {
            console.log('⚠️  لم يتم اكتشاف Cloudflare بوضوح');
        }
        
    } catch (error) {
        console.error('خطأ:', error.message);
    }
}

main();