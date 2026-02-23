import { getSupabase } from '@/lib/supabase';
import { logClick } from '@/lib/store';
import { ALLOWED_AFFILIATE_DOMAINS } from '@/lib/validation';

/**
 * Validate affiliate URL against allowed domains
 * Prevents open redirect attacks
 */
function isValidAffiliateUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    const domain = parsed.hostname.replace(/^www\./, '');
    
    // Check if domain matches allowed patterns
    return ALLOWED_AFFILIATE_DOMAINS.some(allowed => 
      domain === allowed || domain.endsWith('.' + allowed)
    );
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  try {
    const supabase = getSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .select('id, platform, affiliate_url, status')
      .eq('id', params.id)
      .in('status', ['active', 'need_recheck'])
      .single();

    if (error || !product) {
      return new Response('Link not found', { status: 404 });
    }

    // SECURITY: Validate affiliate URL before redirect (prevent open redirect attack)
    if (!isValidAffiliateUrl(product.affiliate_url)) {
      console.error('Invalid affiliate domain for product:', product.id, product.affiliate_url);
      return new Response('Invalid redirect URL', { status: 400 });
    }

    const url = new URL(request.url);
    await logClick({
      product: { id: product.id, platform: product.platform },
      source: url.searchParams.get('source') || 'direct',
      campaign: url.searchParams.get('campaign') || '',
      ua: request.headers.get('user-agent') || '',
    });

    return Response.redirect(product.affiliate_url, 302);
  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Redirect failed', { status: 500 });
  }
}
