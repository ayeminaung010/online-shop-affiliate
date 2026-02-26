'use client';

import { useState } from 'react';

export default function CopyButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Since we are rewritten, window.location.href is the original affiliate deep link router
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all border border-gray-700 active:scale-95"
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-green-400">Copied!</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Copy Link</span>
                </>
            )}
        </button>
    );
}
