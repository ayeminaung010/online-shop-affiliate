'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

/**
 * Lightweight combobox for category selection with create-new support.
 * Props:
 *  - value: string (current category)
 *  - onValueChange: (v: string) => void
 *  - categories: string[] (existing categories from DB)
 *  - placeholder?: string
 */
export default function CategoryCombobox({
    value = '',
    onValueChange,
    categories = [],
    placeholder = 'Select or type category…',
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Sync search text when value changes externally
    useEffect(() => {
        setSearch(value);
    }, [value]);

    const filtered = categories.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const exactMatch = categories.some(
        (c) => c.toLowerCase() === search.trim().toLowerCase()
    );

    function select(cat) {
        onValueChange(cat);
        setSearch(cat);
        setOpen(false);
    }

    function handleInputChange(e) {
        const v = e.target.value;
        setSearch(v);
        onValueChange(v);
        if (!open) setOpen(true);
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
        }
        if (e.key === 'Enter' && open) {
            e.preventDefault();
            if (filtered.length > 0) {
                select(filtered[0]);
            } else {
                setOpen(false);
            }
        }
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Input + trigger */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    autoComplete="off"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                        setOpen((o) => !o);
                        inputRef.current?.focus();
                    }}
                    className="absolute right-0 top-0 h-full px-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronsUpDown className="h-4 w-4" />
                </button>
            </div>

            {/* Dropdown */}
            {open && (filtered.length > 0 || (search.trim() && !exactMatch)) && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 max-h-[200px] overflow-y-auto">
                    {filtered.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => select(cat)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Check
                                className={`h-4 w-4 shrink-0 ${value.toLowerCase() === cat.toLowerCase()
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                            />
                            <span>{cat}</span>
                        </button>
                    ))}

                    {/* "Create new" option when typed text doesn't match any existing */}
                    {search.trim() && !exactMatch && (
                        <button
                            type="button"
                            onClick={() => select(search.trim())}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border text-primary font-medium"
                        >
                            <span>+ Create &quot;{search.trim()}&quot;</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
