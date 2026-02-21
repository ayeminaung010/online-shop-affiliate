'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Stats Panel for the Executive Dashboard Feel
function StatsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <Card className="p-5 flex flex-col gap-1 shadow-sm">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">လက်ရှိ Deals အရေအတွက်</span>
        <span className="text-3xl font-extrabold text-foreground">2,845</span>
      </Card>
      <Card className="p-5 flex flex-col gap-1 shadow-sm">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Shopee vs Lazada</span>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-semibold text-primary">64% / 36%</span>
        </div>
      </Card>
      <Card className="p-5 flex flex-col gap-1 shadow-sm">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">ယနေ့ ခန့်မှန်းရောင်းချရမှု</span>
        <span className="text-3xl font-extrabold text-green-600 dark:text-green-500">+124</span>
      </Card>
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
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      <header className="bg-gradient-to-br from-primary to-accent rounded-2xl text-white p-6 shadow-md relative flex flex-col md:flex-row justify-between items-center gap-4 text-left">
        <div className="w-full md:w-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>တာဝန်ရှိသူများသာ</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Deals ထိန်းချုပ်မှုစနစ်</h1>
        </div>

        <div className="w-full md:w-[250px] shrink-0">
          <div className="flex flex-col gap-1.5">
            <Input
              type="password"
              placeholder="Admin Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
            />
          </div>
        </div>
      </header>

      <StatsPanel />

      <Card className="p-6 md:p-8 shadow-sm">
        <form onSubmit={save}>
          <div className="pb-6 mb-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">ထုတ်ကုန် အချက်အလက်</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground">ခေါင်းစဉ် / Deal အမည်</label>
                <Input
                  placeholder="ထုတ်ကုန် အမည်ကို ထည့်ပါ"
                  value={form.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted-foreground">E-commerce ပလက်ဖောင်း</label>
                <Select value={form.platform} onValueChange={(v) => onChange('platform', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="ပလက်ဖောင်းရွေးပါ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shopee">Shopee</SelectItem>
                    <SelectItem value="Lazada">Lazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted-foreground">အမျိုးအစား (Category)</label>
                <Input
                  placeholder="ဥပမာ- Electronics, Fashion"
                  value={form.category}
                  onChange={(e) => onChange('category', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pb-6 mb-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">စျေးနှုန်းနှင့် တန်ဖိုး</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted-foreground">လက်ရှိ ရောင်းဈေး (฿)</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => onChange('price', Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted-foreground">မူလစျေးနှုန်း (฿) - ဈေးဟောင်းပြသရန်</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.oldPrice}
                  onChange={(e) => onChange('oldPrice', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="pb-6 mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4">ပုံနှင့် ပြင်ပလင့်ခ်များ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground">ထုတ်ကုန်ပုံ (Image URL)</label>
                <Input
                  type="url"
                  placeholder="https://images.example.com/item.jpg"
                  value={form.imageUrl}
                  onChange={(e) => onChange('imageUrl', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground">Affiliate လင့်ခ် (Tracking URL)</label>
                <Input
                  type="url"
                  placeholder="https://shope.ee/..."
                  value={form.affiliateUrl}
                  onChange={(e) => onChange('affiliateUrl', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 pt-6 border-t border-border gap-4">
            <div className="w-full sm:flex-1">
              {status.msg && (
                <div className={`px-4 py-3 rounded-md font-medium text-sm flex items-center min-h-[44px] ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                  {status.msg}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[150px] font-semibold bg-gradient-to-br from-primary to-accent hover:opacity-95 shadow-md"
            >
              {isSubmitting ? 'သိမ်းဆည်းနေပါသည်...' : 'Deal တင်မည်'}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
