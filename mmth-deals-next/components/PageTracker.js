'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
    const pathname = usePathname();
    const hasTracked = useRef(false);

    useEffect(() => {
        hasTracked.current = false;
    }, [pathname]);

    useEffect(() => {
        if (hasTracked.current) return;

        // We only want to track general page views for non-admin, non-product-detail paths 
        // Product detail pages will handle their own 'product_view' tracking
        if (!pathname?.startsWith('/admin') && !pathname?.startsWith('/products/')) {
            const storageKey = 'vam_page_viewed';
            if (localStorage.getItem(storageKey)) return;

            hasTracked.current = true; // Mark tracked before fetching
            localStorage.setItem(storageKey, 'true'); // Set sync storage immediately to stop strict mode race condition

            fetch('/api/log-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionType: 'page_view',
                    pageUrl: pathname || '/',
                    source: new URLSearchParams(window.location.search).get('source') || 'direct',
                }),
            }).catch(() => { /* mute tracking errors */ });
        }
    }, [pathname]);

    return null; // This component does not render anything
}
