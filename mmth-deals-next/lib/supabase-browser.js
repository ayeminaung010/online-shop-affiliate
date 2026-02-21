import { createClient } from '@supabase/supabase-js';

let browserClient;

/**
 * Browser-side Supabase client (uses anon key, supports auth)
 */
export function getSupabaseBrowser() {
    if (browserClient) return browserClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    browserClient = createClient(url, anonKey);
    return browserClient;
}
