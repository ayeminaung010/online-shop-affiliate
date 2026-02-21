import { isAuthorized, readProduct, updateProduct, deleteProduct, updateProductStatus, bulkUpdateStatus } from '@/lib/store';

export async function GET(request, { params }) {
    try {
        const product = await readProduct(params.id);
        return Response.json(product);
    } catch (error) {
        const status = String(error?.message || '').toLowerCase().includes('no rows') ? 404 : 500;
        return Response.json({ error: status === 404 ? 'Not found' : error.message }, { status });
    }
}

export async function PUT(request, { params }) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const product = await updateProduct(params.id, body);
        return Response.json(product);
    } catch (error) {
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
        return Response.json({ error: error.message || 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const authed = await isAuthorized(request);
        if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Bulk status update
        if (body.ids && body.status) {
            const products = await bulkUpdateStatus(body.ids, body.status);
            return Response.json(products);
        }

        // Single status update
        if (body.status) {
            const product = await updateProductStatus(params.id, body.status);
            return Response.json(product);
        }

        return Response.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message || 'Failed to update status' }, { status: 500 });
    }
}
