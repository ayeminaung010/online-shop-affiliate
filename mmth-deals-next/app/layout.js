import './globals.css';
import { Inter } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';
import Chatbot from '@/components/Chatbot';
import { validateEnv } from '@/lib/env';

// Validate environment variables at startup
validateEnv();

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

export const metadata = {
  title: 'VantageMM — Thailand Deals Curated for Myanmar',
  description: 'ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် Shopee, Lazada deals များ',
  keywords: ['VantageMM', 'shopping', 'Thailand', 'Myanmar', 'deals', 'Shopee', 'Lazada'],
  authors: [{ name: 'VantageMM' }],
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  manifest: '/favicons/site.webmanifest',
  openGraph: {
    title: 'VantageMM — Thailand Deals Curated for Myanmar',
    description: 'ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် Shopee, Lazada deals များ',
    type: 'website',
    locale: 'my_MM',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#4444ca',
};

export default function RootLayout({ children }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SiteHeader />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
