'use client';

import { useEffect, useState } from 'react';
import { isMobile, getUA } from 'react-device-detect';

export default function RedirectClient({ affiliateUrl, platform }) {
    const [status, setStatus] = useState('Checking device...');

    useEffect(() => {
        // Check if on mobile and inside TikTok in-app browser
        const ua = getUA.toLowerCase();
        const isTikTok = ua.includes('tiktok') || ua.includes('bytedance');

        if (isMobile && isTikTok) {
            setStatus('Redirecting to app...');

            let deepLink = affiliateUrl;

            try {
                const urlObj = new URL(affiliateUrl);
                // Lazada: convert https:// to lazada://
                if (platform === 'Lazada' && (urlObj.hostname.includes('lazada.co.th') || urlObj.hostname.includes('lazada.com'))) {
                    deepLink = affiliateUrl.replace(/^https?:\/\//i, 'lazada://');
                }
                // Shopee: convert https:// to shopeemy:// (or shopeeth:// based on domain)
                else if (platform === 'Shopee' && urlObj.hostname.includes('shopee.co.th')) {
                    deepLink = affiliateUrl.replace(/^https?:\/\//i, 'shopeeth://');
                } else if (platform === 'Shopee') {
                    deepLink = affiliateUrl.replace(/^https?:\/\//i, 'shopeemy://');
                }
            } catch (e) {
                console.error('Error parsing affiliate URL for deep link:', e);
            }

            // Try opening the deep link
            window.location.href = deepLink;

            // Fallback to standard URL after 2 seconds if the app doesn't open
            const fallbackTimer = setTimeout(() => {
                setStatus('App not found, redirecting to browser...');
                window.location.href = affiliateUrl;
            }, 2000);

            return () => clearTimeout(fallbackTimer);
        } else {
            // Not TikTok or mobile, just redirect normally
            setStatus('Redirecting...');
            window.location.href = affiliateUrl;
        }
    }, [affiliateUrl, platform]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <h1 className="text-xl font-semibold text-foreground mb-2">{status}</h1>
            <p className="text-muted-foreground text-sm">Please wait while we take you to the deal.</p>
        </div>
    );
}
