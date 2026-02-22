import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n/my';
import { readProducts } from '@/lib/store';
import HomePageClient from '@/components/HomePageClient';
import { ProductSkeleton } from '@/components/Skeleton';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

// Hero
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-accent rounded-2xl text-white p-6 md:p-8 text-center shadow-md relative overflow-hidden">
      <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-3">
        <ShieldCheck className="w-4 h-4" />
        <span>{t('hero.trust')}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{t('hero.title')}</h1>
      <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto mb-4">{t('hero.subtitle')}</p>
    </section>
  );
}

// Top Deals Banner — Attention Grabbing
function TopDealsBanner() {
  return (
    <div className="relative my-5 rounded-2xl overflow-hidden shadow-lg">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

      <div className="relative flex flex-col md:flex-row items-center gap-4 p-5 md:p-6">
        {/* Floating fire emoji */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl animate-float">
            🔥
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
            Limited Time
          </div>
          <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight mb-1">
            {t('banner.title')}
          </h3>
          <p className="text-white/80 text-sm md:text-base">
            {t('banner.subtitle')}
          </p>
        </div>

        {/* Discount badge */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-yellow-400 text-red-600 flex flex-col items-center justify-center font-extrabold shadow-xl rotate-[-8deg] border-4 border-white/50">
            <span className="text-xs leading-none">UP TO</span>
            <span className="text-2xl leading-none">70%</span>
            <span className="text-xs leading-none">OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Disclaimer Banner
function Disclaimer() {
  return (
    <Card className="p-4 my-5 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-800 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <p className="text-amber-800 dark:text-amber-400 font-medium">{t('disclaimer.price')}</p>
          <p className="text-amber-700 dark:text-amber-500">{t('disclaimer.delivery')}</p>
          <p className="text-amber-700 dark:text-amber-500">{t('disclaimer.reshipping')}</p>
        </div>
      </div>
    </Card>
  );
}

// Loading fallback for Suspense
function ProductGridFallback() {
  return (
    <>
      <div className="flex gap-2 flex-nowrap overflow-x-auto my-5 p-2 bg-card border border-border rounded-xl shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-11 w-24 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="skeleton-shimmer h-12 w-full rounded-lg mb-5" />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </section>
    </>
  );
}

export default async function HomePage({ searchParams }) {
  // Read filters from URL search params (server-side)
  const sp = await searchParams;
  const platform = sp?.platform || '';
  const maxPrice = sp?.maxPrice || '';
  const q = sp?.q || '';
  const page = Number(sp?.page || 1);

  // Fetch data directly on the server — no API round-trip
  let initialData;
  try {
    initialData = await readProducts({ platform, maxPrice, q, page, pageSize: 20 });
  } catch {
    initialData = { products: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      <Hero />
      <TopDealsBanner />

      <Suspense fallback={<ProductGridFallback />}>
        <HomePageClient initialData={initialData} />
      </Suspense>

      <Disclaimer />

      <footer className="mt-6 bg-card border border-border rounded-xl p-5 text-center text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground mb-1">{t('footer.title')}</p>
        <p>{t('footer.affiliate')}</p>
        <p className="text-xs mt-4 opacity-70">{t('app.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </main>
  );
}
