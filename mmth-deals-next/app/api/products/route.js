import { createProduct, isAuthorized, readProducts } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const products = await readProducts({
      platform: searchParams.get('platform') || '',
      category: searchParams.get('category') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    });
    return Response.json(products);
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, platform, affiliateUrl } = body;
    if (!title || !platform || !affiliateUrl) {
      return Response.json({ error: 'title, platform, affiliateUrl required' }, { status: 400 });
    }

    const product = await createProduct(body);
    return Response.json(product, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
