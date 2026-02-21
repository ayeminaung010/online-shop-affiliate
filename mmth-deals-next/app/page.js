'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, TrendingUp, Image as ImageIcon, ExternalLink } from 'lucide-react';

// Hero component
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-accent rounded-2xl text-white p-6 md:p-8 text-center shadow-md relative overflow-hidden">
      <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-3">
        <ShieldCheck className="w-4 h-4" />
        <span>စစ်ဆေးပြီးသော Affiliate လင့်ခ်များ</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">MMTH Deals</h1>
      <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto mb-4">
        ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် သီးသန့်ရွေးချယ်ထားသော ထိုင်းထိပ်တန်း e-commerce ပလက်ဖောင်းများမှ အကောင်းဆုံး deals များ။ မြန်ဆန်ပြီး ယုံကြည်စိတ်ချရသော လင့်ခ်များ။
      </p>
    </section>
  );
}

// Top Deals Banner Component
function TopDealsBanner() {
  return (
    <Card className="p-4 my-5 flex items-center gap-3 shadow-sm border-border">
      <div className="bg-[#ee4d2d]/10 text-[#ee4d2d] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
        <TrendingUp className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-lg leading-tight mb-1">ဒီနေ့ရဲ့ အထူးစျေးနှုန်းများ</h3>
        <p className="text-muted-foreground text-sm">အကောင်းဆုံးတန်ဖိုးရရှိစေရန် နှစ်သက်ဖွယ်ရွေးချယ်ထားသော ပရိုမိုးရှင်းများ။</p>
      </div>
    </Card>
  );
}

// Filter Control Panel
function FilterBar({ platform, maxPrice, setPlatform, setMaxPrice }) {
  const isAll = !platform && !maxPrice;
  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto my-5 p-2 bg-card border border-border rounded-xl shadow-sm scrollbar-hide">
      <Button
        variant={isAll ? 'default' : 'ghost'}
        className="shrink-0 h-11"
        onClick={() => { setPlatform(''); setMaxPrice(''); }}
      >
        အားလုံး
      </Button>
      <Button
        variant={platform === 'Shopee' ? 'default' : 'ghost'}
        className="shrink-0 h-11"
        onClick={() => { setPlatform('Shopee'); setMaxPrice(''); }}
      >
        Shopee Deals
      </Button>
      <Button
        variant={platform === 'Lazada' ? 'default' : 'ghost'}
        className="shrink-0 h-11"
        onClick={() => { setPlatform('Lazada'); setMaxPrice(''); }}
      >
        Lazada Deals
      </Button>
      <Button
        variant={maxPrice === '100' ? 'default' : 'ghost'}
        className="shrink-0 h-11"
        onClick={() => { setPlatform(''); setMaxPrice('100'); }}
      >
        ฿100 အောက်
      </Button>
      <Button
        variant={maxPrice === '300' ? 'default' : 'ghost'}
        className="shrink-0 h-11"
        onClick={() => { setPlatform(''); setMaxPrice('300'); }}
      >
        ฿300 အောက်
      </Button>
    </div>
  );
}

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [platform, setPlatform] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  async function load() {
    const qs = new URLSearchParams();
    if (platform) qs.set('platform', platform);
    if (maxPrice) qs.set('maxPrice', maxPrice);
    const res = await fetch('/api/products?' + qs.toString());
    setItems(await res.json());
  }

  useEffect(() => { load(); }, [platform, maxPrice]);

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      <Hero />
      <TopDealsBanner />
      <FilterBar
        platform={platform}
        maxPrice={maxPrice}
        setPlatform={setPlatform}
        setMaxPrice={setMaxPrice}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(Array.isArray(items) ? items : []).map((p) => {
          const isShopee = p.platform === 'Shopee';
          return (
            <Card key={p.id} className="flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-border hover:border-primary">
              {p.imageUrl ? (
                <img className="w-full aspect-square md:aspect-[4/3] object-cover bg-muted border-b border-border" src={p.imageUrl} alt={p.title} loading="lazy" />
              ) : (
                <div className="w-full aspect-square md:aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground border-b border-border">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}

              <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="outline" className={`uppercase tracking-wide font-semibold ${isShopee ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20 dark:bg-[#ee4d2d]/20 dark:text-[#ff8b73]' : 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20 dark:bg-[#5c62df]/20 dark:text-[#8a90ff]'}`}>
                    {p.platform}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    {p.category}
                  </span>
                </div>

                <h2 className="font-semibold text-base leading-snug line-clamp-2 m-0">{p.title}</h2>

                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-xl font-bold text-primary">฿{Number(p.price || 0).toLocaleString()}</span>
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="text-sm text-muted-foreground line-through">฿{Number(p.oldPrice).toLocaleString()}</span>
                  )}
                </div>

                <Button
                  asChild
                  className="w-full mt-2 font-semibold shadow-sm hover:shadow-md transition-all bg-primary"
                >
                  <a
                    href={`/go/${p.id}?source=tiktok-bio`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.platform} တွင်ဝယ်မည်
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <footer className="mt-12 bg-card border border-border rounded-xl p-5 text-center text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground mb-1">ပူးပေါင်းဆောင်ရွက်မှုနှင့် ထုတ်ပြန်ချက်</p>
        <p>ဤပလက်ဖောင်းသည် affiliate deals များကို စုစည်းပေးထားပါသည်။ ဤလင့်ခ်များမှတစ်ဆင့် ဝယ်ယူပါက သင့်အတွက် အပိုကုန်ကျစရိတ်မရှိဘဲ ကျွန်ုပ်တို့ ကော်မရှင်ရရှိနိုင်ပါသည်။ ထိုင်းနိုင်ငံအတွင်းသာ ပို့ဆောင်ပေးပါသည်။ မြန်မာနိုင်ငံသို့ ပြန်လည်ပို့ဆောင်ခြင်း (Reshipping) ဝန်ဆောင်မှုမပါဝင်ပါ။</p>
        <p className="text-xs mt-4 opacity-70">&copy; {new Date().getFullYear()} MMTH Deals. မူပိုင်ခွင့်များအားလုံး ရယူထားသည်။</p>
      </footer>
    </main>
  );
}
