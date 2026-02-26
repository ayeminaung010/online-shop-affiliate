'use client';

import { useEffect, useState } from 'react';
import { isMobile, isAndroid, getUA } from 'react-device-detect';

export default function RedirectClient({ affiliateUrl, platform }) {
    const [status, setStatus] = useState('Checking device...');
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        // Check if on mobile and inside TikTok in-app browser
        const ua = getUA.toLowerCase();
        const isTikTok = ua.includes('tiktok') || ua.includes('bytedance');

        if (isMobile && isTikTok) {
            setStatus('Redirecting to app...');

            let deepLink = affiliateUrl;

            try {
                const urlObj = new URL(affiliateUrl);

                if (isAndroid) {
                    // Android Intent URL format for specific packages
                    const urlWithoutScheme = urlObj.host + urlObj.pathname + urlObj.search + urlObj.hash;

                    if (platform === 'Lazada') {
                        deepLink = `intent://${urlWithoutScheme}#Intent;scheme=https;package=com.lazada.android;end;`;
                    } else if (platform === 'Shopee') {
                        // Determine correct package based on domain (Thailand or Malaysia)
                        const packageId = urlObj.hostname.includes('shopee.co.th') ? 'com.shopee.th' : 'com.shopee.my';
                        deepLink = `intent://${urlWithoutScheme}#Intent;scheme=https;package=${packageId};end;`;
                    }
                } else {
                    // iOS: Standard deep link schemes
                    if (platform === 'Lazada' && (urlObj.hostname.includes('lazada.co.th') || urlObj.hostname.includes('lazada.com'))) {
                        deepLink = affiliateUrl.replace(/^https?:\/\//i, 'lazada://');
                    } else if (platform === 'Shopee' && urlObj.hostname.includes('shopee.co.th')) {
                        deepLink = affiliateUrl.replace(/^https?:\/\//i, 'shopeeth://');
                    } else if (platform === 'Shopee') {
                        deepLink = affiliateUrl.replace(/^https?:\/\//i, 'shopeemy://');
                    }
                }
            } catch (e) {
                console.error('Error parsing affiliate URL for deep link:', e);
            }

            // Try opening the deep link
            window.location.href = deepLink;

            // Fallback to overlay after 2 seconds if the app doesn't open
            const fallbackTimer = setTimeout(() => {
                setStatus('Action required');
                setShowOverlay(true);
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
            {/* Main loading state */}
            {!showOverlay && (
                <>
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                    <h1 className="text-xl font-semibold text-foreground mb-2">{status}</h1>
                    <p className="text-muted-foreground text-sm">Please wait while we take you to the deal.</p>
                </>
            )}

            {/* Fallback Overlay for TikTok In-App Browser */}
            {showOverlay && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm pt-20 px-4">
                    <div className="bg-card p-6 rounded-2xl shadow-xl max-w-sm w-full relative animate-in fade-in slide-in-from-top-10 duration-300">
                        {/* Pointing Arrow to top right */}
                        <div className="absolute -top-16 right-4 text-white text-6xl rotate-12 animate-bounce">
                            ↑
                        </div>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-card-foreground">Open in Browser</h2>
                            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                TikTok blocks some links. Please tap the <strong className="text-card-foreground font-semibold">••• menu</strong> in the top right corner and select <strong className="text-card-foreground font-semibold">"Open in Browser"</strong> to continue to the deal.
                            </p>

                            <div className="bg-muted p-4 text-sm rounded-xl text-left text-muted-foreground mb-6 font-medium">
                                <ul className="space-y-3">
                                    <li className="flex gap-3 items-start">
                                        <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                                        <span>Tap the <strong>•••</strong> icon in the top right</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                                        <span>Select <strong>"Open in browser"</strong> or <strong>"Open in Chrome/Safari"</strong></span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => window.location.href = affiliateUrl}
                                className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity active:scale-[0.98]"
                            >
                                I understand (Try web link)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
