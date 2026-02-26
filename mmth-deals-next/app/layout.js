import './globals.css';
import { Inter } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';
import Chatbot from '@/components/Chatbot';
import { validateEnv } from '@/lib/env';
import Script from 'next/script';
import PageTracker from '@/components/PageTracker';

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
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-DM83JY8N6M"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DM83JY8N6M');
            `,
          }}
        />
        <SiteHeader />
        <PageTracker />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
