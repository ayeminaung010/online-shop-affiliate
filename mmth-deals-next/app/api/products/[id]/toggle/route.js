import { isAuthorized, toggleProduct } from '@/lib/store';

export async function PATCH(request, { params }) {
  try {
    const authed = await isAuthorized(request);
    if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await toggleProduct(params.id);
    return Response.json(product);
  } catch (error) {
    const status = String(error?.message || '').toLowerCase().includes('no rows') ? 404 : 500;
    return Response.json({ error: status === 404 ? 'Not found' : (error.message || 'Failed to toggle') }, { status });
  }
}
