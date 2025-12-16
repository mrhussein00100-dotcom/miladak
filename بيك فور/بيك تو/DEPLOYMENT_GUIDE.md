# دليل النشر - ميلادك v2

## 🚀 نشر على Vercel (الموصى به)

### الخطوات السريعة

1. **رفع المشروع إلى GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **ربط مع Vercel**
- اذهب إلى [vercel.com](https://vercel.com)
- اربط حسابك مع GitHub
- اختر المشروع واضغط "Deploy"

3. **إعداد متغيرات البيئة**
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=ميلادك
DATABASE_URL=./data/miladak.db
```

## 🐳 نشر باستخدام Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## 🗄️ إعداد قاعدة البيانات

```bash
npm run db:init
```

## 🔧 تحسينات الأداء

### تحسين الصور
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

## 🔒 الأمان

### Headers الأمان
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

## ✅ قائمة مراجعة النشر

- [ ] اختبار جميع الأدوات
- [ ] فحص الروابط المكسورة
- [ ] تحسين الصور
- [ ] إعداد Analytics
- [ ] إعداد Sitemap
- [ ] فحص SEO
- [ ] اختبار الأداء
