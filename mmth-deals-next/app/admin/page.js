'use client';

import { useState } from 'react';

// Mock Stats Panel for the Executive Dashboard Feel
function StatsPanel() {
  return (
    <div className="admin-stats">
      <div className="stat-card">
        <span className="stat-label">လက်ရှိ Deals အရေအတွက်</span>
        <span className="stat-value">2,845</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Shopee vs Lazada</span>
        <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
          <span className="text-sm font-semibold text-primary">64% / 36%</span>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-label">ယနေ့ ခန့်မှန်းရောင်းချရမှု</span>
        <span className="stat-value text-success" style={{ color: 'var(--success)' }}>+124</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [form, setForm] = useState({
    title: '', platform: 'Shopee', category: 'General', price: 0, oldPrice: 0, imageUrl: '', affiliateUrl: '', priority: 0
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e) {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'ဒေတာဘေ့စ်တွင် အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။ ✅' });
        // Optional: clear form logic here
      } else {
        setStatus({ type: 'error', msg: `သိမ်းဆည်းရာတွင် အမှားအယွင်းရှိပါသည်: ${data.error || 'Unknown error'}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `ကွန်ရက်အမှား: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container">
      <header className="hero flex justify-between items-center" style={{ textAlign: 'left', padding: 'var(--space-6)' }}>
        <div>
          <div className="hero-trust" style={{ marginBottom: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>တာဝန်ရှိသူများသာ</span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Deals ထိန်းချုပ်မှုစနစ်</h1>
        </div>

        <div style={{ width: '250px' }}>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="Admin Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            />
          </div>
        </div>
      </header>

      <StatsPanel />

      <form className="admin-form" onSubmit={save}>
        <div className="form-section">
          <h2 className="form-section-title">ထုတ်ကုန် အချက်အလက်</h2>
          <div className="form-grid">
            <div className="input-group form-col-span-2">
              <label className="input-label">ခေါင်းစဉ် / Deal အမည်</label>
              <input
                className="input-field"
                placeholder="ထုတ်ကုန် အမည်ကို ထည့်ပါ"
                value={form.title}
                onChange={(e) => onChange('title', e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">E-commerce ပလက်ဖောင်း</label>
              <select
                className="input-field"
                value={form.platform}
                onChange={(e) => onChange('platform', e.target.value)}
              >
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">အမျိုးအစား (Category)</label>
              <input
                className="input-field"
                placeholder="ဥပမာ- Electronics, Fashion"
                value={form.category}
                onChange={(e) => onChange('category', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">စျေးနှုန်းနှင့် တန်ဖိုး</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">လက်ရှိ ရောင်းဈေး (฿)</label>
              <input
                className="input-field"
                type="number"
                min="0"
                placeholder="0"
                value={form.price}
                onChange={(e) => onChange('price', Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">မူလစျေးနှုန်း (฿) - ဈေးဟောင်းပြသရန်</label>
              <input
                className="input-field"
                type="number"
                min="0"
                placeholder="0"
                value={form.oldPrice}
                onChange={(e) => onChange('oldPrice', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">ပုံနှင့် ပြင်ပလင့်ခ်များ</h2>
          <div className="form-grid">
            <div className="input-group form-col-span-2">
              <label className="input-label">ထုတ်ကုန်ပုံ (Image URL)</label>
              <input
                className="input-field"
                type="url"
                placeholder="https://images.example.com/item.jpg"
                value={form.imageUrl}
                onChange={(e) => onChange('imageUrl', e.target.value)}
                required
              />
            </div>

            <div className="input-group form-col-span-2">
              <label className="input-label">Affiliate လင့်ခ် (Tracking URL)</label>
              <input
                className="input-field"
                type="url"
                placeholder="https://shope.ee/..."
                value={form.affiliateUrl}
                onChange={(e) => onChange('affiliateUrl', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-6)' }}>
          <div style={{ flex: 1, marginRight: 'var(--space-6)' }}>
            {status.msg && (
              <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {status.msg}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-gradient"
            disabled={isSubmitting}
            style={{ minWidth: '150px' }}
          >
            {isSubmitting ? 'သိမ်းဆည်းနေပါသည်...' : 'Deal တင်မည်'}
          </button>
        </div>
      </form>
    </main>
  );
}
