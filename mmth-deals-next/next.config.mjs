/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
