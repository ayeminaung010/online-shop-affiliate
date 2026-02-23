import { isAuthorized, readProduct, updateProduct, deleteProduct, updateProductStatus, bulkUpdateStatus } from '@/lib/store';
import { UpdateProductSchema, BulkUpdateSchema, validateAffiliateUrl } from '@/lib/validation';

// Cache TTL for individual product pages
const CACHE_TTL = 120; // 2 minutes for product detail

export async function GET(request, { params }) {
    try {
        const product = await readProduct(params.id);
        return Response.json(product, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=300`,
            },
        });
    } catch (error) {
        const status = String(error?.message || '').toLowerCase().includes('no rows') ? 404 : 500;
        return Response.json({ error: status === 404 ? 'Not found' : error.message }, { status });
    }
}

export async function PUT(request, { params }) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        let body;
        try {
            body = await request.json();
        } catch {
            return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        // Validate input with Zod
        const validation = UpdateProductSchema.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        // Validate affiliate URL if provided
        if (validation.data.affiliateUrl) {
            try {
                validateAffiliateUrl(validation.data.affiliateUrl);
            } catch (err) {
                return Response.json({ error: err.message }, { status: 400 });
            }
        }

        const product = await updateProduct(params.id, validation.data);
        return Response.json(product);
    } catch (error) {
        console.error('PUT /api/products/[id] error:', error);
        return Response.json({ error: error.message || 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        await deleteProduct(params.id);
        return Response.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/products/[id] error:', error);
        return Response.json({ error: error.message || 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        let body;
        try {
            body = await request.json();
        } catch {
            return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        // Bulk status update
        if (body.ids && body.status) {
            const validation = BulkUpdateSchema.safeParse(body);
            if (!validation.success) {
                const errors = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
                return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
            }
            const products = await bulkUpdateStatus(validation.data.ids, validation.data.status);
            return Response.json(products);
        }

        // Single status update
        if (body.status) {
            const validation = UpdateProductSchema.pick({ status: true }).safeParse(body);
            if (!validation.success) {
                return Response.json({ error: 'Invalid status value' }, { status: 400 });
            }
            const product = await updateProductStatus(params.id, validation.data.status);
            return Response.json(product);
        }

        return Response.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        console.error('PATCH /api/products/[id] error:', error);
        return Response.json({ error: error.message || 'Failed to update status' }, { status: 500 });
    }
}
