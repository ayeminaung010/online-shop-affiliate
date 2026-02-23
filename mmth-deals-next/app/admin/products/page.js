'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { ALL_STATUSES, isStale } from '@/lib/types';
import { t } from '@/lib/i18n';
import {
    Search, PlusCircle, ChevronLeft, ChevronRight, ArrowLeft,
    Trash2, Pencil, XCircle, Image as ImageIcon, AlertTriangle,
} from 'lucide-react';

const PAGE_SIZE = 10;

export default function ProductsPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [data, setData] = useState({ products: [], total: 0, page: 1, totalPages: 0 });
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Auth check
    useEffect(() => {
        const supabase = getSupabaseBrowser();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/admin/login'); return; }
            setToken(session.access_token);
        });
    }, [router]);

    // Load products
    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const qs = new URLSearchParams({
                admin: '1', status: statusFilter, q: search,
                page: String(page), pageSize: String(PAGE_SIZE),
            });
            const res = await fetch('/api/products?' + qs.toString(), {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch { /* ignore */ }
        setLoading(false);
    }, [token, statusFilter, search, page]);

    useEffect(() => { load(); }, [load]);

    // Debounced search
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Bulk action
    async function bulkAction(status) {
        if (selected.size === 0) return;
        try {
            await fetch('/api/products/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ids: [...selected], status }),
            });
        } catch { /* ignore */ }
        // Also try individual updates as fallback
        for (const id of selected) {
            try {
                await fetch(`/api/products/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ status }),
                });
            } catch { /* ignore */ }
        }
        setSelected(new Set());
        load();
    }

    async function quickMarkInactive(id) {
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'inactive' }),
            });
            load();
        } catch { /* ignore */ }
    }

    async function handleDelete(id) {
        if (!confirm(t('action.confirm_delete'))) return;
        try {
            await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            load();
        } catch { /* ignore */ }
    }

    function toggleSelect(id) {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleAll() {
        if (selected.size === data.products.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(data.products.map((p) => p.id)));
        }
    }

    function formatTime(ts) {
        if (!ts) return '—';
        const d = new Date(ts);
        return d.toLocaleDateString('my-MM', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    const statusTabs = [
        { key: 'all', label: t('filter.all') },
        { key: 'active', label: t('status.active') },
        { key: 'need_recheck', label: t('status.need_recheck') },
        { key: 'inactive', label: t('status.inactive') },
        { key: 'low_confidence', label: t('status.low_confidence') },
    ];

    return (
        <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="shrink-0 min-w-[44px] min-h-[44px]">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-foreground">{t('products.title')}</h1>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-gradient-to-br from-primary to-accent font-semibold shadow-md min-h-[44px]">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {t('admin.nav.addProduct')}
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder={t('products.search')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 h-12"
                />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-nowrap overflow-x-auto mb-4 p-1 bg-card border border-border rounded-xl shadow-sm">
                {statusTabs.map((tab) => (
                    <Button
                        key={tab.key}
                        variant={statusFilter === tab.key ? 'default' : 'ghost'}
                        className="shrink-0 min-h-[44px]"
                        onClick={() => { setStatusFilter(tab.key); setPage(1); setSelected(new Set()); }}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Bulk Actions Bar */}
            {selected.size > 0 && (
                <Card className="p-3 mb-4 flex flex-wrap items-center gap-2 border-primary/30 bg-primary/5 shadow-sm">
                    <span className="text-sm font-semibold text-foreground mr-2">
                        {t('products.selected', { count: selected.size })}
                    </span>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300 min-h-[36px]" onClick={() => bulkAction('active')}>
                        {t('bulk.markActive')}
                    </Button>
                    <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 min-h-[36px]" onClick={() => bulkAction('need_recheck')}>
                        {t('bulk.markRecheck')}
                    </Button>
                    <Button size="sm" variant="outline" className="text-gray-700 border-gray-300 min-h-[36px]" onClick={() => bulkAction('inactive')}>
                        {t('bulk.markInactive')}
                    </Button>
                </Card>
            )}

            {/* Product List */}
            <Card className="shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[40px_60px_1fr_100px_90px_120px_120px_100px_120px] gap-2 px-4 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={selected.size === data.products.length && data.products.length > 0}
                            onChange={toggleAll}
                            className="w-4 h-4 cursor-pointer"
                        />
                    </div>
                    <div></div>
                    <div>Title</div>
                    <div>Platform</div>
                    <div>Price</div>
                    <div>{t('products.lastChecked')}</div>
                    <div>{t('products.lastUpdated')}</div>
                    <div>Created By</div>
                    <div>Actions</div>
                </div>

                {/* Rows */}
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : data.products.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">{t('products.noResults')}</div>
                ) : (
                    data.products.map((p) => (
                        <div key={p.id} className={`grid grid-cols-1 md:grid-cols-[40px_60px_1fr_100px_90px_120px_120px_100px_120px] gap-2 px-4 py-3 border-b border-border items-center hover:bg-muted/30 transition-colors ${isStale(p.lastCheckedAt) ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            {/* Checkbox */}
                            <div className="hidden md:flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={selected.has(p.id)}
                                    onChange={() => toggleSelect(p.id)}
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </div>

                            {/* Image */}
                            <div className="hidden md:flex items-center">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover bg-muted" />
                                ) : (
                                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Title + Status + Mobile Info */}
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {/* Mobile checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selected.has(p.id)}
                                        onChange={() => toggleSelect(p.id)}
                                        className="w-4 h-4 cursor-pointer md:hidden shrink-0"
                                    />
                                    <span className="font-semibold text-sm truncate">{p.title}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <StatusBadge status={p.status} />
                                    {isStale(p.lastCheckedAt) && (
                                        <span className="text-xs text-amber-600 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> 24h+
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Platform */}
                            <div className="hidden md:flex items-center">
                                <Badge variant="outline" className="text-xs">{p.platform}</Badge>
                            </div>

                            {/* Price */}
                            <div className="hidden md:flex items-center">
                                <span className="text-sm font-bold text-primary">฿{Number(p.price).toLocaleString()}</span>
                            </div>

                            {/* Last Checked */}
                            <div className="hidden md:flex items-center text-xs text-muted-foreground">
                                {formatTime(p.lastCheckedAt)}
                            </div>

                            {/* Last Updated */}
                            <div className="hidden md:flex items-center text-xs text-muted-foreground">
                                {formatTime(p.updatedAt)}
                            </div>

                            {/* Created By */}
                            <div className="hidden md:flex items-center text-xs text-muted-foreground truncate" title={p.createdBy}>
                                {p.createdBy ? p.createdBy.split('@')[0] : '—'}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 mt-2 md:mt-0">
                                <Link href={`/admin/products/${p.id}/edit`}>
                                    <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px]" title={t('action.edit')}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px] text-gray-500 hover:text-gray-700" title={t('action.markInactive')} onClick={() => quickMarkInactive(p.id)}>
                                    <XCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="min-w-[36px] min-h-[36px] text-destructive hover:text-destructive" title={t('action.delete')} onClick={() => handleDelete(p.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
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
