import { getSupabase } from '@/lib/supabase';
import { logClick } from '@/lib/store';
import { validateAffiliateUrl } from '@/lib/validation';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

// Load the client component dynamically, disabling SSR to avoid hydration mismatch
// with react-device-detect which relies on the window object.
const RedirectClient = dynamic(() => import('./RedirectClient'), { ssr: false });

export default async function GoPage({ params, searchParams }) {
    const supabase = getSupabase();
    const { data: product, error } = await supabase
        .from('products')
        .select('id, platform, affiliate_url, status')
        .eq('id', params.id)
        .in('status', ['active', 'need_recheck'])
        .single();

    if (error || !product) {
        notFound();
    }

    // SECURITY: Validate affiliate URL before redirect (prevent open redirect attack)
    try {
        validateAffiliateUrl(product.affiliate_url);
    } catch (err) {
        console.error('Invalid affiliate domain for product:', product.id, product.affiliate_url);
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <h1 className="text-xl font-bold text-red-500 mb-2">Invalid Redirect</h1>
                <p className="text-muted-foreground">{err.message}</p>
            </div>
        );
    }

    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const source = searchParams.source || 'direct';
    const campaign = searchParams.campaign || '';

    // Log the click asynchronously (fire and forget)
    logClick({
        product: { id: product.id, platform: product.platform },
        source: source,
        campaign: campaign,
        ua: userAgent,
    }).catch(err => console.error('Error logging click:', err));

    return (
        <RedirectClient
            affiliateUrl={product.affiliate_url}
            platform={product.platform}
        />
    );
}
