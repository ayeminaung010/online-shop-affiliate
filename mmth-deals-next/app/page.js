import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n';
import { readProducts, readDealStats, readCategories } from '@/lib/store';
import HomePageClient from '@/components/HomePageClient';
import { ProductSkeleton } from '@/components/Skeleton';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

// Compact Deal Summary Strip (hidden on mobile)
function DealSummary({ stats }) {
  const chips = [
    { emoji: '🛍️', label: 'Deals အားလုံး', value: stats.total },
    { emoji: '💰', label: '฿300 အောက်', value: stats.under300 },
    { emoji: '🟠', label: 'Shopee', value: stats.shopee, color: 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20 dark:bg-[#ee4d2d]/20 dark:text-[#ff8b73]' },
    { emoji: '🔵', label: 'Lazada', value: stats.lazada, color: 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20 dark:bg-[#5c62df]/20 dark:text-[#8a90ff]' },
  ];

  return (
    <section className="hidden sm:flex items-center gap-3 p-3 md:p-4 bg-card border border-border rounded-xl shadow-sm mb-4 max-h-[110px]">
      <h2 className="text-sm font-bold text-foreground whitespace-nowrap mr-1">📊 {t('hero.title')}</h2>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {chips.map((c) => (
          <Badge
            key={c.label}
            variant="outline"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg ${c.color || 'bg-muted text-foreground border-border'}`}
          >
            <span>{c.emoji}</span>
            <span className="text-muted-foreground">{c.label}</span>
            <span className="font-bold">{c.value}</span>
          </Badge>
        ))}
      </div>
    </section>
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
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
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
  const category = sp?.category || '';
  const q = sp?.q || '';
  const page = Number(sp?.page || 1);

  // Fetch data + stats + categories in parallel on the server
  let initialData;
  let stats;
  let categories;
  try {
    [initialData, stats, categories] = await Promise.all([
      readProducts({ platform, maxPrice, category, q, page, pageSize: 20 }),
      readDealStats(),
      readCategories(),
    ]);
  } catch {
    initialData = { products: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    stats = { total: 0, under300: 0, shopee: 0, lazada: 0 };
    categories = [];
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      <DealSummary stats={stats} />

      <Suspense fallback={<ProductGridFallback />}>
        <HomePageClient initialData={initialData} categories={categories} />
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
