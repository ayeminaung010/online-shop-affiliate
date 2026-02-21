'use client';

import { useEffect, useState } from 'react';

// Hero component for the business-grade landing section
function Hero() {
  return (
    <section className="hero">
      <div className="hero-trust">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span>စစ်ဆေးပြီးသော Affiliate လင့်ခ်များ</span>
      </div>
      <h1>MMTH Deals</h1>
      <p>ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် သီးသန့်ရွေးချယ်ထားသော ထိုင်းထိပ်တန်း e-commerce ပလက်ဖောင်းများမှ အကောင်းဆုံး deals များ။ မြန်ဆန်ပြီး ယုံကြည်စိတ်ချရသော လင့်ခ်များ။</p>
    </section>
  );
}

// Top Deals Banner Component
function TopDealsBanner() {
  return (
    <div className="top-deals-banner">
      <div className="top-deals-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
      </div>
      <div>
        <h3 className="font-bold" style={{ fontSize: '1.125rem', marginBottom: '4px' }}>ဒီနေ့ရဲ့ အထူးစျေးနှုန်းများ</h3>
        <p className="text-muted text-sm">အကောင်းဆုံးတန်ဖိုးရရှိစေရန် နှစ်သက်ဖွယ်ရွေးချယ်ထားသော ပရိုမိုးရှင်းများ။</p>
      </div>
    </div>
  );
}

// Filter Control Panel
function FilterBar({ platform, maxPrice, setPlatform, setMaxPrice }) {
  const isAll = !platform && !maxPrice;
  return (
    <section className="toolbar">
      <button
        className={`filter ${isAll ? 'active' : ''}`}
        onClick={() => { setPlatform(''); setMaxPrice(''); }}
      >
        အားလုံး
      </button>
      <button
        className={`filter ${platform === 'Shopee' ? 'active' : ''}`}
        onClick={() => { setPlatform('Shopee'); setMaxPrice(''); }}
      >
        Shopee Deals
      </button>
      <button
        className={`filter ${platform === 'Lazada' ? 'active' : ''}`}
        onClick={() => { setPlatform('Lazada'); setMaxPrice(''); }}
      >
        Lazada Deals
      </button>
      <button
        className={`filter ${maxPrice === '100' ? 'active' : ''}`}
        onClick={() => { setPlatform(''); setMaxPrice('100'); }}
      >
        ฿100 အောက်
      </button>
      <button
        className={`filter ${maxPrice === '300' ? 'active' : ''}`}
        onClick={() => { setPlatform(''); setMaxPrice('300'); }}
      >
        ฿300 အောက်
      </button>
    </section>
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
    <main className="container">
      <Hero />
      <TopDealsBanner />
      <FilterBar
        platform={platform}
        maxPrice={maxPrice}
        setPlatform={setPlatform}
        setMaxPrice={setMaxPrice}
      />

      <section className="grid">
        {items.map((p) => {
          const isShopee = p.platform === 'Shopee';
          return (
            <article key={p.id} className="card">
              {p.imageUrl ? (
                <img className="thumb" src={p.imageUrl} alt={p.title} loading="lazy" />
              ) : (
                <div className="thumb flex items-center justify-center text-muted">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}

              <div className="content">
                <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                  <span className={`badge ${isShopee ? 'badge-shopee' : 'badge-lazada'}`}>
                    {p.platform}
                  </span>
                  <span className="text-muted text-xs font-semibold uppercase tracking-wide">
                    {p.category}
                  </span>
                </div>

                <h2 className="card-title">{p.title}</h2>

                <div className="price-block">
                  <span className="price-current">฿{Number(p.price || 0).toLocaleString()}</span>
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="price-old">฿{Number(p.oldPrice).toLocaleString()}</span>
                  )}
                </div>

                <a
                  className="btn btn-primary"
                  href={`/go/${p.id}?source=tiktok-bio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '8px' }}
                >
                  {p.platform} တွင်ဝယ်မည်
                  <svg style={{ marginLeft: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="footer">
        <p className="font-semibold text-text" style={{ marginBottom: '4px' }}>ပူးပေါင်းဆောင်ရွက်မှုနှင့် ထုတ်ပြန်ချက်</p>
        <p>ဤပလက်ဖောင်းသည် affiliate deals များကို စုစည်းပေးထားပါသည်။ ဤလင့်ခ်များမှတစ်ဆင့် ဝယ်ယူပါက သင့်အတွက် အပိုကုန်ကျစရိတ်မရှိဘဲ ကျွန်ုပ်တို့ ကော်မရှင်ရရှိနိုင်ပါသည်။ ထိုင်းနိုင်ငံအတွင်းသာ ပို့ဆောင်ပေးပါသည်။ မြန်မာနိုင်ငံသို့ ပြန်လည်ပို့ဆောင်ခြင်း (Reshipping) ဝန်ဆောင်မှုမပါဝင်ပါ။</p>
        <p className="text-xs" style={{ marginTop: '16px', opacity: 0.7 }}>&copy; {new Date().getFullYear()} MMTH Deals. မူပိုင်ခွင့်များအားလုံး ရယူထားသည်။</p>
      </footer>
    </main>
  );
}
