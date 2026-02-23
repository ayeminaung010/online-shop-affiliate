'use client';

import { getLocale, setLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

const LOCALES = [
    { code: 'my', label: 'မြန်မာ' },
    { code: 'en', label: 'English' },
];

export default function LanguageSwitcher() {
    const current = getLocale();

    return (
        <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select
                value={current}
                onChange={(e) => setLocale(e.target.value)}
                className="appearance-none bg-transparent text-sm font-medium text-foreground cursor-pointer border border-border rounded-md px-2 py-1 pr-6  focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
                aria-label="Select language"
            >
                {LOCALES.map((l) => (
                    <option key={l.code} value={l.code}>
                        {l.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
