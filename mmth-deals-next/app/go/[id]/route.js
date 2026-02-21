import { getSupabase } from '@/lib/supabase';
import { logClick } from '@/lib/store';

export async function GET(request, { params }) {
  try {
    const supabase = getSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .select('id, platform, affiliate_url, status')
      .eq('id', params.id)
      .in('status', ['active', 'need_recheck'])
      .single();

    if (error || !product) return new Response('Link not found', { status: 404 });

    const url = new URL(request.url);
    await logClick({
      product: { id: product.id, platform: product.platform },
      source: url.searchParams.get('source') || 'direct',
      campaign: url.searchParams.get('campaign') || '',
      ua: request.headers.get('user-agent') || '',
    });

    return Response.redirect(product.affiliate_url, 302);
  } catch {
    return new Response('Redirect failed', { status: 500 });
  }
}
