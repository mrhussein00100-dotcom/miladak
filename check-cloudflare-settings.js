const https = require('https');

async function checkCloudflareSettings(domain) {
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
            console.log(`\n=== فحص إعدادات Cloudflare لـ ${domain} ===`);
            
            // فحص Status Code
            console.log(`Status Code: ${res.statusCode}`);
            
            // فحص CF Headers
            const cfHeaders = {};
            Object.keys(res.headers).forEach(header => {
                if (header.toLowerCase().startsWith('cf-')) {
                    cfHeaders[header] = res.headers[header];
                }
            });
            
            console.log('\n--- Cloudflare Headers ---');
            Object.keys(cfHeaders).forEach(header => {
                console.log(`${header}: ${cfHeaders[header]}`);
            });
            
            // فحص Server Header
            const server = res.headers['server'];
            console.log(`\nServer: ${server}`);
            
            // فحص Cache Status
            const cacheStatus = res.headers['cf-cache-status'];
            console.log(`Cache Status: ${cacheStatus}`);
            
            // فحص Ray ID
            const rayId = res.headers['cf-ray'];
            console.log(`Ray ID: ${rayId}`);
            
            // تحليل النتائج
            console.log('\n=== تحليل الحالة ===');
            
            if (res.statusCode === 200) {
                console.log('✅ الموقع يعمل بشكل طبيعي');
            } else if (res.statusCode >= 500) {
                console.log('⚠️ مشكلة في الخادم الأصلي');
            }
            
            if (server && server.toLowerCase().includes('cloudflare')) {
                console.log('✅ Cloudflare مفعل ويعمل بشفافية');
            }
            
            if (rayId) {
                console.log('✅ الطلبات تمر عبر شبكة Cloudflare');
            }
            
            if (cacheStatus) {
                console.log(`✅ التخزين المؤقت: ${cacheStatus}`);
                if (cacheStatus === 'HIT') {
                    console.log('  📦 المحتوى يُقدم من cache Cloudflare');
                } else if (cacheStatus === 'MISS') {
                    console.log('  🔄 المحتوى يُحمل من الخادم الأصلي');
                } else if (cacheStatus === 'DYNAMIC') {
                    console.log('  ⚡ المحتوى ديناميكي (لا يُخزن مؤقتاً)');
                }
            }
            
            // فحص إضافي للأمان
            const securityHeaders = [
                'cf-cache-status',
                'cf-ray',
                'expect-ct',
                'x-frame-options',
                'x-content-type-options'
            ];
            
            console.log('\n--- فحص الأمان ---');
            securityHeaders.forEach(header => {
                if (res.headers[header]) {
                    console.log(`✅ ${header}: ${res.headers[header]}`);
                }
            });
            
            resolve({
                statusCode: res.statusCode,
                isCloudflare: !!(rayId && server && server.toLowerCase().includes('cloudflare')),
                cacheStatus: cacheStatus,
                rayId: rayId,
                headers: res.headers
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
        console.log('🔍 فحص إعدادات Cloudflare...\n');
        
        const result = await checkCloudflareSettings('miladak.com');
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 النتيجة النهائية');
        console.log('='.repeat(50));
        
        if (result.isCloudflare && result.statusCode === 200) {
            console.log('🎉 Cloudflare يعمل بشكل مثالي!');
            console.log('✨ الموقع متاح للزوار بدون شاشات وسطية');
            console.log('🚀 الأداء محسن عبر CDN');
            console.log('🛡️ الحماية مفعلة تلقائياً');
            
            if (result.cacheStatus) {
                console.log(`📦 حالة التخزين المؤقت: ${result.cacheStatus}`);
            }
            
            console.log(`🆔 Ray ID: ${result.rayId}`);
        } else {
            console.log('⚠️ قد تحتاج لمراجعة الإعدادات');
        }
        
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    }
}

main();