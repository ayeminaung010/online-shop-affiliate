import { logClick } from '@/lib/store';

export async function POST(request) {
    try {
        const body = await request.json();
        const { actionType, pageUrl, productId, platform, source } = body;

        // Ensure valid action types to prevent abuse
        if (!['page_view', 'product_view'].includes(actionType)) {
            return Response.json({ error: 'Invalid action type' }, { status: 400 });
        }

        const ua = request.headers.get('user-agent') || 'Unknown';

        // Prepare product stub if this is a product view
        const product = productId ? { id: productId, platform } : null;

        await logClick({
            actionType,
            pageUrl: pageUrl || '/',
            product,
            source: source || 'direct',
            campaign: 'frontend_view',
            ua,
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Failed to log view:', error);
        return Response.json({ error: 'Failed to log view' }, { status: 500 });
    }
}
