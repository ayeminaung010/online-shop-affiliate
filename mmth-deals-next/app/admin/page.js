'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Package, PlusCircle, LogOut, AlertTriangle } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n/my';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setUser(session.user);
      loadStats(session.access_token);
    });
  }, [router]);

  async function loadStats(token) {
    try {
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-accent rounded-2xl text-white p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('auth.admin_only')}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('admin.title')}</h1>
          <p className="text-white/70 text-sm mt-1">{user.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-white/30 text-white hover:bg-white/10 min-h-[44px]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Card className="p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('admin.stats.totalDeals')}</span>
          <span className="text-3xl font-extrabold text-foreground">{stats?.totalProducts ?? '—'}</span>
        </Card>
        <Card className="p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('admin.stats.activeDeals')}</span>
          <span className="text-3xl font-extrabold text-green-600 dark:text-green-500">{stats?.activeProducts ?? '—'}</span>
        </Card>
        <Card className="p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('admin.stats.needRecheck')}</span>
          <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-500">{stats?.needRecheck ?? '—'}</span>
        </Card>
        <Card className="p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('admin.stats.todayEstimate')}</span>
          <span className="text-3xl font-extrabold text-primary">+{stats?.totalClicks ?? 0}</span>
        </Card>
      </div>

      {/* Stale Products Warning */}
      {stats?.products?.some((p) => p.status === 'need_recheck') && (
        <Card className="p-4 mb-6 flex items-center gap-3 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-400">{t('products.staleWarning')}</p>
            <p className="text-sm text-amber-700 dark:text-amber-500">
              {stats.needRecheck} {t('admin.stats.needRecheck')}
            </p>
          </div>
        </Card>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/products">
          <Card className="p-6 flex items-center gap-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer border-border hover:border-primary">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('admin.nav.products')}</h3>
              <p className="text-sm text-muted-foreground">ရှာဖွေခြင်း၊ စစ်ထုတ်ခြင်း၊ ပြင်ဆင်ခြင်း</p>
            </div>
          </Card>
        </Link>

        <Link href="/admin/products/new">
          <Card className="p-6 flex items-center gap-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer border-border hover:border-primary">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <PlusCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('admin.nav.addProduct')}</h3>
              <p className="text-sm text-muted-foreground">Deal အသစ်ထည့်မည်</p>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  );
}
