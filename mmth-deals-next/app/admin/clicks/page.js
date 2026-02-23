'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import {
    ArrowLeft, ChevronLeft, ChevronRight, MousePointerClick,
    Smartphone, Globe, Tag,
} from 'lucide-react';

const PAGE_SIZE = 30;

function parseUA(ua) {
    if (!ua) return 'Unknown';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Other';
}

function formatTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

export default function ClickLogsPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [data, setData] = useState({ logs: [], total: 0, page: 1, totalPages: 0 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/admin/login'); return; }
            setToken(session.access_token);
        });
    }, [router]);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const qs = new URLSearchParams({
                page: String(page), pageSize: String(PAGE_SIZE),
            });
            const res = await fetch('/api/clicks?' + qs.toString(), {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setData(await res.json());
        } catch { /* ignore */ }
        setLoading(false);
    }, [token, page]);

    useEffect(() => { load(); }, [load]);

    // Summary stats
    const todayCount = data.logs.filter((l) => {
        const d = new Date(l.ts);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }).length;

    const sourceCounts = {};
    data.logs.forEach((l) => {
        sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });

    return (
        <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="shrink-0 min-w-[44px] min-h-[44px]">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Click Logs</h1>
                    <p className="text-sm text-muted-foreground">ထုတ်ကုန်လင့်ခ် နှိပ်ခြင်း မှတ်တမ်း</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Card className="p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MousePointerClick className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total</p>
                        <p className="text-xl font-extrabold">{data.total}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <MousePointerClick className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">ဒီနေ့</p>
                        <p className="text-xl font-extrabold text-green-600">{todayCount}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Sources</p>
                        <p className="text-xl font-extrabold text-amber-600">{Object.keys(sourceCounts).length}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <Tag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Page</p>
                        <p className="text-xl font-extrabold text-purple-600">{page}/{data.totalPages || 1}</p>
                    </div>
                </Card>
            </div>

            {/* Logs Table */}
            <Card className="shadow-sm overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid grid-cols-[1fr_100px_100px_80px_180px] gap-2 px-4 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <div>Product</div>
                    <div>Platform</div>
                    <div>Source</div>
                    <div>Device</div>
                    <div>Time</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : data.logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <MousePointerClick className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">Click log မရှိသေးပါ</p>
                        <p className="text-sm text-muted-foreground mt-1">ထုတ်ကုန်လင့်ခ်များကို နှိပ်လိုက်ပါက ဤနေရာတွင် မှတ်တမ်းပေါ်လာပါမည်</p>
                    </div>
                ) : (
                    data.logs.map((log) => (
                        <div key={log.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_80px_180px] gap-2 px-4 py-3 border-b border-border items-center hover:bg-muted/30 transition-colors">
                            {/* Product */}
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-semibold text-sm truncate">{log.productTitle}</span>
                                <span className="text-xs text-muted-foreground md:hidden">
                                    {log.platform} · {log.source} · {parseUA(log.ua)} · {formatTime(log.ts)}
                                </span>
                            </div>

                            {/* Platform */}
                            <div className="hidden md:flex items-center">
                                <Badge variant="outline" className={`text-xs ${log.platform === 'Shopee' ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20' : 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20'}`}>
                                    {log.platform}
                                </Badge>
                            </div>

                            {/* Source */}
                            <div className="hidden md:flex items-center">
                                <Badge variant="outline" className="text-xs">
                                    {log.source}
                                </Badge>
                            </div>

                            {/* Device */}
                            <div className="hidden md:flex items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Smartphone className="w-3 h-3" />
                                    {parseUA(log.ua)}
                                </span>
                            </div>

                            {/* Time */}
                            <div className="hidden md:flex items-center text-xs text-muted-foreground">
                                {formatTime(log.ts)}
                            </div>
                        </div>
                    ))
                )}
            </Card>

            {/* Pagination */}
            {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="min-h-[44px]"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t('products.prev')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {t('products.page', { current: page, total: data.totalPages })}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page >= data.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="min-h-[44px]"
                    >
                        {t('products.next')}
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </main>
    );
}
