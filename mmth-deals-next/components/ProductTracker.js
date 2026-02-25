'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ProductTracker({ productId, platform }) {
    const pathname = usePathname();
    const hasTracked = useRef(false);

    useEffect(() => {
        hasTracked.current = false;
    }, [pathname, productId]);

    useEffect(() => {
        if (!productId) return;
        if (hasTracked.current) return;

        const storageKey = `vam_viewed_${productId}`;
        if (localStorage.getItem(storageKey)) return;

        hasTracked.current = true;
        localStorage.setItem(storageKey, 'true'); // Set sync storage immediately

        fetch('/api/log-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                actionType: 'product_view',
                pageUrl: pathname || `/products/${productId}`,
                productId,
                platform,
                source: new URLSearchParams(window.location.search).get('source') || 'direct',
            }),
        }).catch(() => { /* mute tracking errors */ });
    }, [productId, platform, pathname]);

    return null;
}
