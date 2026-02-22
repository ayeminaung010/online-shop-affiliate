'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { t } from '@/lib/i18n/my';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/Skeleton';

const PAGE_SIZE = 20;

// Filter Bar
function FilterBar({ platform, maxPrice, onFilter }) {
    const isAll = !platform && !maxPrice;
    return (
        <div className="flex gap-2 flex-nowrap overflow-x-auto my-5 p-2 bg-card border border-border rounded-xl shadow-sm scrollbar-hide">
            <Button variant={isAll ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => onFilter({ platform: '', maxPrice: '' })}>
                {t('filter.all')}
            </Button>
            <Button variant={platform === 'Shopee' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => onFilter({ platform: 'Shopee', maxPrice: '' })}>
                {t('filter.shopee')}
            </Button>
            <Button variant={platform === 'Lazada' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => onFilter({ platform: 'Lazada', maxPrice: '' })}>
                {t('filter.lazada')}
            </Button>
            <Button variant={maxPrice === '100' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => onFilter({ platform: '', maxPrice: '100' })}>
                {t('filter.under100')}
            </Button>
            <Button variant={maxPrice === '300' ? 'default' : 'ghost'} className="shrink-0 h-11" onClick={() => onFilter({ platform: '', maxPrice: '300' })}>
                {t('filter.under300')}
            </Button>
        </div>
    );
}

// Build URL search params string
function buildQS({ platform, maxPrice, q, page }) {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (q) params.set('q', q);
    if (page && page > 1) params.set('page', String(page));
    const str = params.toString();
    return str ? `?${str}` : '/';
}

export default function HomePageClient({ initialData }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Read initial state from URL
    const urlPlatform = searchParams.get('platform') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '';
    const urlQ = searchParams.get('q') || '';
    const urlPage = Number(searchParams.get('page') || 1);

    const [data, setData] = useState(initialData);
    const [platform, setPlatform] = useState(urlPlatform);
    const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
    const [searchInput, setSearchInput] = useState(urlQ);
    const [searchQuery, setSearchQuery] = useState(urlQ);
    const [page, setPage] = useState(urlPage);
    const [loading, setLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    // Mark mounted — skip initial fetch since we have server data
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch data when filters change (skip initial since we have SSR data)
    const load = useCallback(async () => {
        if (!hasMounted) return;

        setLoading(true);
        const qs = new URLSearchParams();
        if (platform) qs.set('platform', platform);
        if (maxPrice) qs.set('maxPrice', maxPrice);
        if (searchQuery) qs.set('q', searchQuery);
        qs.set('page', String(page));
        qs.set('pageSize', String(PAGE_SIZE));

        try {
            const res = await fetch('/api/products?' + qs.toString());
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
        setLoading(false);

        // Update URL without navigation
        const newUrl = buildQS({ platform, maxPrice, q: searchQuery, page });
        startTransition(() => {
            router.replace(newUrl, { scroll: false });
        });
    }, [platform, maxPrice, searchQuery, page, hasMounted, router]);

    useEffect(() => {
        load();
    }, [load]);

    const handleFilter = ({ platform: p, maxPrice: mp }) => {
        setPlatform(p);
        setMaxPrice(mp);
        setPage(1);
    };

    const products = data?.products || [];
    const totalPages = data?.totalPages || 0;

    // Pagination link builders
    const prevHref = buildQS({ platform, maxPrice, q: searchQuery, page: Math.max(1, page - 1) });
    const nextHref = buildQS({ platform, maxPrice, q: searchQuery, page: page + 1 });

    return (
        <>
            <FilterBar platform={platform} maxPrice={maxPrice} onFilter={handleFilter} />

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

            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                ) : products.length === 0 ? (
                    <div className="col-span-full py-16 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-muted-foreground font-medium">ထုတ်ကုန် ရှာမတွေ့ပါ</p>
                        <p className="text-muted-foreground text-sm mt-1">Filter ကို ပြောင်းကြည့်ပါ</p>
                    </div>
                ) : (
                    products.map((p) => (
                        <ProductCard key={p.id} p={p} />
                    ))
                )}
            </section>

            {/* Pagination with Link */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    {page <= 1 ? (
                        <Button variant="outline" disabled className="min-h-[44px]">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            {t('products.prev')}
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="min-h-[44px]" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}>
                            <Link href={prevHref} prefetch={false}>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                {t('products.prev')}
                            </Link>
                        </Button>
                    )}
                    <span className="text-sm text-muted-foreground px-4">
                        {t('products.page', { current: page, total: totalPages })}
                    </span>
                    {page >= totalPages ? (
                        <Button variant="outline" disabled className="min-h-[44px]">
                            {t('products.next')}
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="min-h-[44px]" onClick={(e) => { e.preventDefault(); setPage((p) => p + 1); }}>
                            <Link href={nextHref} prefetch={false}>
                                {t('products.next')}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
