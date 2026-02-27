'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import HeaderSearch from '@/components/HeaderSearch';

export default function SiteHeader() {
    const pathname = usePathname();

    if (pathname === '/open-in-browser') {
        return null;
    }

    return (
        <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="w-full max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center gap-2 sm:gap-3">
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <Image
                        src="/brand/vantagemm-logo.jpg"
                        alt="VantageMM Logo"
                        width={44}
                        height={44}
                        className="rounded-lg shadow-sm w-8 h-8 sm:w-11 sm:h-11 object-cover"
                        priority
                    />
                    <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            VantageMM
                        </span>
                        <span className="hidden sm:block text-[11px] text-muted-foreground leading-tight -mt-0.5">
                            Thailand Deals Curated for Myanmar
                        </span>
                    </div>
                </Link>
                <div className="flex-1" />
                <Suspense fallback={null}>
                    <HeaderSearch />
                </Suspense>
                <LanguageSwitcher />
            </div>
        </header>
    );
}
