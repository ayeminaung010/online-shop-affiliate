import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

export const metadata = {
  title: 'Shopping Myanmar Thai',
  description: 'Thailand ရှိ မြန်မာများအတွက် deals links',
  keywords: ['shopping', 'Thailand', 'Myanmar', 'deals', 'Shopee', 'Lazada'],
  authors: [{ name: 'Shopping Myanmar Thai' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: '#4444ca',
  openGraph: {
    title: 'Shopping Myanmar Thai',
    description: 'Thailand ရှိ မြန်မာများအတွက် deals links',
    type: 'website',
    locale: 'my_MM',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
