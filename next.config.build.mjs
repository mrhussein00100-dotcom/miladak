/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسين البناء
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

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
    unoptimized: false,
  },

  // تحسين الأداء
  compress: true,
  poweredByHeader: false,

  // إعدادات البناء
  output: 'standalone',

  // تجاهل أخطاء قاعدة البيانات أثناء البناء
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // إعدادات البيئة
  env: {
    DATABASE_TYPE: 'sqlite', // استخدام SQLite أثناء البناء
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

    // تحسين حجم الحزم
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },

  // إعدادات إضافية للنشر
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
