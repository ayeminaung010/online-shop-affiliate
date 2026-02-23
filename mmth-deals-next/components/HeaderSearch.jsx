'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export default function HeaderSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [expanded, setExpanded] = useState(false);
    const inputRef = useRef(null);

    // Hide search on admin pages
    if (pathname.startsWith('/admin')) return null;

    // Sync input with URL changes (e.g. back/forward navigation)
    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    // Debounce: push to URL after typing stops
    useEffect(() => {
        const timer = setTimeout(() => {
            const current = searchParams.get('q') || '';
            if (query === current) return;

            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            params.delete('page'); // reset to page 1

            // Navigate to home if not already there
            const target = pathname === '/' ? '/' : '/';
            const qs = params.toString();
            router.push(qs ? `${target}?${qs}` : target, { scroll: false });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, searchParams, pathname, router]);

    // Auto-focus the input when expanding on mobile
    useEffect(() => {
        if (expanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [expanded]);

    function handleClear() {
        setQuery('');
        setExpanded(false);
    }

    return (
        <>
            {/* Desktop: always-visible full search input */}
            <div className="hidden sm:block relative flex-1 max-w-xs lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    ref={inputRef}
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-8 h-9 text-sm bg-muted/50 border-border"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Mobile: icon button that expands to a full-width input */}
            <div className="sm:hidden">
                {!expanded ? (
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="fixed inset-x-0 top-0 z-[60] bg-card border-b border-border px-3 h-14 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                            ref={inputRef}
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 h-9 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setExpanded(false);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
