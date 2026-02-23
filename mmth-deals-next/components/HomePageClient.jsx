'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';
import { t } from '@/lib/i18n';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/Skeleton';
import { fetchWithRetry } from '@/lib/fetch';

const PAGE_SIZE = 20;

// ─── Category Chips Bar ───────────────────────────────────
function CategoryBar({ categories, activeCategory, onSelect }) {
    return (
        <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="flex gap-2 flex-nowrap overflow-x-auto py-3 px-1 premium-scroll">
                <button
                    type="button"
                    onClick={() => onSelect('')}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${!activeCategory
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                        }`}
                >
                    {t('filter.all')}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onSelect(cat)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Platform & Price Filter Bar ──────────────────────────
function FilterBar({ platform, maxPrice, onFilter }) {
    const isAll = !platform && !maxPrice;
    return (
        <div className="flex gap-2 flex-nowrap overflow-x-auto p-2 bg-card border border-border rounded-xl shadow-sm scrollbar-hide">
            <Button variant={isAll ? 'default' : 'ghost'} className="shrink-0 h-9 text-xs sm:text-sm" onClick={() => onFilter({ platform: '', maxPrice: '' })}>
                {t('filter.all')}
            </Button>
            <Button variant={platform === 'Shopee' ? 'default' : 'ghost'} className="shrink-0 h-9 text-xs sm:text-sm" onClick={() => onFilter({ platform: 'Shopee', maxPrice: '' })}>
                {t('filter.shopee')}
            </Button>
            <Button variant={platform === 'Lazada' ? 'default' : 'ghost'} className="shrink-0 h-9 text-xs sm:text-sm" onClick={() => onFilter({ platform: 'Lazada', maxPrice: '' })}>
                {t('filter.lazada')}
            </Button>
            <Button variant={maxPrice === '100' ? 'default' : 'ghost'} className="shrink-0 h-9 text-xs sm:text-sm" onClick={() => onFilter({ platform: '', maxPrice: '100' })}>
                {t('filter.under100')}
            </Button>
            <Button variant={maxPrice === '300' ? 'default' : 'ghost'} className="shrink-0 h-9 text-xs sm:text-sm" onClick={() => onFilter({ platform: '', maxPrice: '300' })}>
                {t('filter.under300')}
            </Button>
        </div>
    );
}

// ─── Category Section (grouped view) ──────────────────────
function CategorySection({ category, products, onViewAll }) {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">{category}</h2>
                <button
                    type="button"
                    onClick={() => onViewAll(category)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    View All
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {products.map((p) => (
                    <ProductCard key={p.id} p={p} />
                ))}
            </div>
        </section>
    );
}

// ─── Build URL search params string ───────────────────────
function buildQS({ platform, maxPrice, category, q, page }) {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    if (page && page > 1) params.set('page', String(page));
    const str = params.toString();
    return str ? `?${str}` : '/';
}

export default function HomePageClient({ initialData, categories = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Read initial state from URL
    const urlPlatform = searchParams.get('platform') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlQ = searchParams.get('q') || '';
    const urlPage = Number(searchParams.get('page') || 1);

    const [data, setData] = useState(initialData);
    const [platform, setPlatform] = useState(urlPlatform);
    const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
    const [category, setCategory] = useState(urlCategory);
    const [searchQuery, setSearchQuery] = useState(urlQ);
    const [page, setPage] = useState(urlPage);
    const [loading, setLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    // Mark mounted — skip initial fetch since we have server data
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Sync search query from URL (managed by HeaderSearch)
    useEffect(() => {
        const newQ = searchParams.get('q') || '';
        const newCat = searchParams.get('category') || '';
        if (newQ !== searchQuery) {
            setSearchQuery(newQ);
            setPage(1);
        }
        if (newCat !== category) {
            setCategory(newCat);
            setPage(1);
        }
    }, [searchParams]);

    // Fetch data when filters change (skip initial since we have SSR data)
    const load = useCallback(async () => {
        if (!hasMounted) return;

        setLoading(true);
        const qs = new URLSearchParams();
        if (platform) qs.set('platform', platform);
        if (maxPrice) qs.set('maxPrice', maxPrice);
        if (category) qs.set('category', category);
        if (searchQuery) qs.set('q', searchQuery);
        qs.set('page', String(page));
        qs.set('pageSize', String(PAGE_SIZE));

        try {
            const res = await fetchWithRetry('/api/products?' + qs.toString());
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else if (res.status === 429) {
                // Rate limited, show error
                console.warn('Rate limited, please wait');
            } else {
                console.error('Failed to load products:', res.status);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
        setLoading(false);

        // Update URL without navigation
        const newUrl = buildQS({ platform, maxPrice, category, q: searchQuery, page });
        startTransition(() => {
            router.replace(newUrl, { scroll: false });
        });
    }, [platform, maxPrice, category, searchQuery, page, hasMounted, router]);

    useEffect(() => {
        load();
    }, [load]);

    const handleFilter = ({ platform: p, maxPrice: mp }) => {
        setPlatform(p);
        setMaxPrice(mp);
        setPage(1);
    };

    const handleCategorySelect = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    const products = data?.products || [];
    const totalPages = data?.totalPages || 0;

    // Determine if we should show grouped view
    // Show grouped when: no filters active and on page 1
    const isDefaultView = !platform && !maxPrice && !category && !searchQuery && page === 1;

    // Group products by category for the default view
    const groupedProducts = {};
    if (isDefaultView && products.length > 0) {
        for (const p of products) {
            const cat = p.category || 'Other';
            if (!groupedProducts[cat]) groupedProducts[cat] = [];
            if (groupedProducts[cat].length < 8) {
                groupedProducts[cat].push(p);
            }
        }
    }

    // Pagination link builders
    const prevHref = buildQS({ platform, maxPrice, category, q: searchQuery, page: Math.max(1, page - 1) });
    const nextHref = buildQS({ platform, maxPrice, category, q: searchQuery, page: page + 1 });

    return (
        <>
            {/* Category Chips */}
            <CategoryBar
                categories={categories}
                activeCategory={category}
                onSelect={handleCategorySelect}
            />

            {/* Platform & Price Filters */}
            <FilterBar platform={platform} maxPrice={maxPrice} onFilter={handleFilter} />

            {/* Product Grid / Grouped View */}
            <div className="mt-5">
                {loading ? (
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </section>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-muted-foreground font-medium">{t('products.noResults')}</p>
                        <p className="text-muted-foreground text-sm mt-1">
                            {category ? `No products in "${category}"` : 'Try a different filter'}
                        </p>
                    </div>
                ) : isDefaultView && Object.keys(groupedProducts).length > 1 ? (
                    /* Grouped by category view */
                    Object.entries(groupedProducts).map(([cat, items]) => (
                        <CategorySection
                            key={cat}
                            category={cat}
                            products={items}
                            onViewAll={handleCategorySelect}
                        />
                    ))
                ) : (
                    /* Flat grid view (when filters active) */
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {products.map((p) => (
                            <ProductCard key={p.id} p={p} />
                        ))}
                    </section>
                )}
            </div>

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
