import './globals.css';

export const metadata = {
  title: 'Shopping Myanmar Thai',
  description: 'Thailand ရှိ မြန်မာများအတွက် deals links'
};

export default function RootLayout({ children }) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}
