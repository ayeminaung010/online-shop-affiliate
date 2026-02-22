import './globals.css';
import { Inter } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';

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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: '#4444ca',
  // TODO: Generate favicon from /brand/vantagemm-logo.jpg (convert to .ico/.png and add icons[] here)
  openGraph: {
    title: 'VantageMM — Thailand Deals Curated for Myanmar',
    description: 'ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် Shopee, Lazada deals များ',
    type: 'website',
    locale: 'my_MM',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <body className={inter.className}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
