/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pexels.com',
      },
    ],
  },

  // تحسين الأداء
  compress: true,
  poweredByHeader: false,

  // إعدادات البناء
  typescript: {
    ignoreBuildErrors: true, // تجاهل أخطاء TypeScript أثناء البناء
  },

  eslint: {
    ignoreDuringBuilds: true, // تجاهل أخطاء ESLint أثناء البناء
  },

  // تحسين الحزم
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // إعدادات إضافية للنشر
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
