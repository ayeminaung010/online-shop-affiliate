/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow unsafe-eval in development for webpack hot reload
              `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://*.supabase.co`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://*.shopee.co.th https://*.lazada.co.th https://*.shopee.com https://*.lazada.com https://*.lazcdn.com https://*.slatic.net https://*.susercontent.com https://*.shopee.sg",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.shopee.co.th https://*.lazada.co.th https://*.shopee.com https://*.lazada.com https://*.lazcdn.com https://*.slatic.net https://*.susercontent.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.shopee.co.th',
      },
      {
        protocol: 'https',
        hostname: '**.lazada.co.th',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.co.th',
      },
      {
        protocol: 'https',
        hostname: 'img.lazada.com',
      },
      {
        protocol: 'https',
        hostname: 'img.lazcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.lazcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'down-th.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'down-sg.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'th-live-01.slatic.net',
      },
      {
        protocol: 'https',
        hostname: '**.slatic.net',
      },
      {
        protocol: 'https',
        hostname: '**.susercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
