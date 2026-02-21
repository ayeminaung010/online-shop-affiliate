'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ShieldCheck, TrendingUp, Image as ImageIcon, ExternalLink, AlertTriangle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n/my';

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

// Filter Bar
function FilterBar({ platform, maxPrice, setPlatform, setMaxPrice }) {
  const isAll = !platform && !maxPrice;
  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto my-5 p-2 bg-card border border-border rounded-xl shadow-sm scrollbar-hide">
      <Button variant={isAll ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => { setPlatform(''); setMaxPrice(''); }}>
        {t('filter.all')}
      </Button>
      <Button variant={platform === 'Shopee' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => { setPlatform('Shopee'); setMaxPrice(''); }}>
        {t('filter.shopee')}
      </Button>
      <Button variant={platform === 'Lazada' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => { setPlatform('Lazada'); setMaxPrice(''); }}>
        {t('filter.lazada')}
      </Button>
      <Button variant={maxPrice === '100' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => { setPlatform(''); setMaxPrice('100'); }}>
        {t('filter.under100')}
      </Button>
      <Button variant={maxPrice === '300' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => { setPlatform(''); setMaxPrice('300'); }}>
        {t('filter.under300')}
      </Button>
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

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [platform, setPlatform] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  async function load() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (platform) qs.set('platform', platform);
    if (maxPrice) qs.set('maxPrice', maxPrice);
    const res = await fetch('/api/products?' + qs.toString());
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [platform, maxPrice]);

  // Client-side search filter
  const filtered = searchQuery
    ? (Array.isArray(items) ? items : []).filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : (Array.isArray(items) ? items : []);

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      <Hero />
      <TopDealsBanner />
      <FilterBar platform={platform} maxPrice={maxPrice} setPlatform={setPlatform} setMaxPrice={setMaxPrice} />

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="ထုတ်ကုန်အမည်ဖြင့် ရှာဖွေမည်..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden border-border animate-pulse">
              <div className="w-full aspect-square md:aspect-[4/3] bg-muted" />
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="flex items-baseline gap-2 mt-auto">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-4 w-10 bg-muted rounded" />
                </div>
                <div className="h-10 w-full bg-muted rounded-md mt-2" />
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted-foreground font-medium">ထုတ်ကုန် ရှာမတွေ့ပါ</p>
            <p className="text-muted-foreground text-sm mt-1">Filter ကို ပြောင်းကြည့်ပါ</p>
          </div>
        ) : filtered.map((p) => {
          const isShopee = p.platform === 'Shopee';
          return (
            <Card key={p.id} className="flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-border hover:border-primary">
              <Link href={`/products/${p.id}`} className="cursor-pointer">
                {p.imageUrl ? (
                  <img className="w-full aspect-square md:aspect-[4/3] object-cover bg-muted border-b border-border" src={p.imageUrl} alt={p.title} loading="lazy" />
                ) : (
                  <div className="w-full aspect-square md:aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground border-b border-border">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </Link>

              <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="outline" className={`uppercase tracking-wide font-semibold ${isShopee ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20 dark:bg-[#ee4d2d]/20 dark:text-[#ff8b73]' : 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20 dark:bg-[#5c62df]/20 dark:text-[#8a90ff]'}`}>
                    {p.platform}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {(p.status === 'need_recheck' || p.status === 'low_confidence') && (
                      <StatusBadge status={p.status} />
                    )}
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{p.category}</span>
                  </div>
                </div>

                <Link href={`/products/${p.id}`} className="hover:text-primary transition-colors">
                  <h2 className="font-semibold text-base leading-snug line-clamp-2 m-0">{p.title}</h2>
                </Link>

                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-xl font-bold text-primary">฿{Number(p.price || 0).toLocaleString()}</span>
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="text-sm text-muted-foreground line-through">฿{Number(p.oldPrice).toLocaleString()}</span>
                  )}
                </div>

                <Button asChild className="w-full mt-2 font-semibold shadow-sm hover:shadow-md transition-all bg-primary min-h-[44px]">
                  <a href={`/go/${p.id}?source=tiktok-bio`} target="_blank" rel="noopener noreferrer">
                    {t('product.buyOn', { platform: p.platform })}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Disclaimer />

      <footer className="mt-6 bg-card border border-border rounded-xl p-5 text-center text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground mb-1">{t('footer.title')}</p>
        <p>{t('footer.affiliate')}</p>
        <p className="text-xs mt-4 opacity-70">{t('app.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </main>
  );
}
