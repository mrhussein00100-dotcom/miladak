/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // تعطيل Static Generation أثناء البناء
  output: 'standalone',

  // إعدادات الصور
  images: {
    domains: ['images.pexels.com', 'localhost'],
    unoptimized: false,
  },

  // تجاهل أخطاء TypeScript و ESLint أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // متغيرات البيئة
  env: {
    DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
  },
};

export default nextConfig;
