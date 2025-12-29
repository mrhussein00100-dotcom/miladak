#!/usr/bin/env node

/**
 * إصلاح مشاكل النشر
 * Fix Deployment Issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 إصلاح مشاكل النشر...\n');

// 1. إصلاح package.json - إضافة سكريبت build:vercel
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts['build:vercel']) {
  packageJson.scripts['build:vercel'] = 'next build';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ تم إضافة سكريبت build:vercel');
}

// 2. إنشاء ملف vercel.json محدث
const vercelConfig = {
  version: 2,
  buildCommand: 'npm run build:vercel',
  outputDirectory: '.next',
  installCommand: 'npm install',
  framework: 'nextjs',
  functions: {
    'app/api/**/*.ts': {
      maxDuration: 30,
    },
  },
  env: {
    DATABASE_TYPE: 'postgresql',
  },
  regions: ['iad1'],
};

fs.writeFileSync(
  path.join(__dirname, 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);
console.log('✅ تم تحديث vercel.json');

// 3. إنشاء ملف next.config.mjs محدث
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3', 'pg']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    return config;
  },
  env: {
    DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgresql',
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['images.pexels.com', 'cdn.pexels.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pexels.com',
      }
    ]
  }
};

export default nextConfig;
`;

fs.writeFileSync(path.join(__dirname, 'next.config.mjs'), nextConfigContent);
console.log('✅ تم تحديث next.config.mjs');

// 4. إنشاء ملف middleware.ts بسيط
const middlewareContent = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // إضافة headers للأمان
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;

fs.writeFileSync(path.join(__dirname, 'middleware.ts'), middlewareContent);
console.log('✅ تم إنشاء middleware.ts');

console.log('\n🎉 تم إصلاح جميع مشاكل النشر!');
console.log('\n📋 الخطوات التالية:');
console.log('1. git add .');
console.log('2. git commit -m "Fix deployment issues"');
console.log('3. git push origin main');
console.log('4. راقب النشر في Vercel Dashboard');
