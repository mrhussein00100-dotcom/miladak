/**
 * Dynamic Ads.txt Route
 * ملف ads.txt ديناميكي للربح من AdSense
 *
 * يقرأ معرف الناشر من متغيرات البيئة ويولد ملف ads.txt
 * متوافق مع معايير IAB
 */

import { NextResponse } from 'next/server';
import { SEO_CONFIG, ADS_CONFIG } from '@/lib/seo/config';

/**
 * توليد محتوى ads.txt
 * Format: domain, publisher-id, relationship, certification-id
 */
function generateAdsTxtContent(): string {
  const publisherId = SEO_CONFIG.adsensePublisherId;
  const lines: string[] = [];

  // Header comment
  lines.push('# Ads.txt file for ' + SEO_CONFIG.siteName);
  lines.push('# Generated dynamically');
  lines.push('# Last updated: ' + new Date().toISOString());
  lines.push('');

  // Google AdSense entry
  if (publisherId) {
    // Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
    lines.push(
      `${ADS_CONFIG.google.domain}, ${publisherId}, ${ADS_CONFIG.google.relationship}, ${ADS_CONFIG.google.certificationId}`
    );
  } else {
    // Warning comment if no publisher ID is set
    lines.push(
      '# WARNING: ADSENSE_PUBLISHER_ID environment variable is not set'
    );
    lines.push(
      '# Please set ADSENSE_PUBLISHER_ID or NEXT_PUBLIC_ADSENSE_CLIENT in your environment'
    );
    lines.push('# Example: ADSENSE_PUBLISHER_ID=pub-1234567890123456');
  }

  lines.push('');
  lines.push('# End of ads.txt');

  return lines.join('\n');
}

/**
 * GET /ads.txt
 * Returns the ads.txt file content
 */
export async function GET() {
  const content = generateAdsTxtContent();

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      'X-Robots-Tag': 'noindex', // Don't index this file
    },
  });
}
