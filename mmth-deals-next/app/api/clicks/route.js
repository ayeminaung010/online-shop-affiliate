import { isAuthorized } from '@/lib/store';
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page') || 1);
        const pageSize = Number(searchParams.get('pageSize') || 30);
        const productId = searchParams.get('productId') || '';
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const supabase = getSupabase();

        // Build query
        let query = supabase
            .from('click_logs')
            .select('*, products(title, platform)', { count: 'exact' })
            .neq('action_type', 'page_view') // Exclude slash-route page views
            .order('ts', { ascending: false })
            .range(from, to);

        if (productId) query = query.eq('product_id', productId);

        const { data, error, count } = await query;
        if (error) throw error;

        const logs = (data || []).map((row) => ({
            id: row.id,
            actionType: row.action_type,
            pageUrl: row.page_url,
            productId: row.product_id,
            productTitle: row.products?.title || '—',
            platform: row.products?.platform || row.platform || '—',
            source: row.source,
            campaign: row.campaign,
            ua: row.ua,
            ts: row.ts,
        }));

        return Response.json({
            logs,
            total: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize),
        });
    } catch (error) {
        return Response.json({ error: error.message || 'Failed to load click logs' }, { status: 500 });
    }
}
