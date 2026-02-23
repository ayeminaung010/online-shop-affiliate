/**
 * i18n Module — Locale-aware translation with cookie persistence.
 *
 * Usage:
 *   import { t, getLocale, setLocale } from '@/lib/i18n';
 *
 * The `t()` function reads the current locale from the `locale` cookie.
 * Use `setLocale('en')` or `setLocale('my')` to switch and reload.
 */

import my from './my-strings';
import en from './en';

const dictionaries = { my, en };

/**
 * Get current locale from cookie (works in both server and client).
 * Defaults to 'my' (Myanmar).
 */
export function getLocale() {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
        return match ? match[1] : 'my';
    }
    // Server-side: try to read from Next.js headers (cookies)
    try {
        const { cookies } = require('next/headers');
        const cookieStore = cookies();
        return cookieStore.get('locale')?.value || 'my';
    } catch {
        return 'my';
    }
}

/**
 * Set locale cookie and reload the page.
 */
export function setLocale(locale) {
    document.cookie = `locale=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    window.location.reload();
}

/**
 * Get translated string by key.
 * Supports {variable} interpolation: t('product.buyOn', { platform: 'Shopee' })
 */
export function t(key, vars) {
    const locale = getLocale();
    const dict = dictionaries[locale] || dictionaries.my;
    let str = dict[key] || dictionaries.my[key] || key;
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, String(v));
        });
    }
    return str;
}

export default dictionaries.my;
