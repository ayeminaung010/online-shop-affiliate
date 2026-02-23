import { isAuthorized, readProducts, readAllProducts, createProduct } from '@/lib/store';
import { CreateProductSchema, validateAffiliateUrl } from '@/lib/validation';

// Cache configuration for public product listings
const CACHE_TTL = 60; // 60 seconds for public product data

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Admin requests (with auth) get full list with pagination
    const isAdmin = searchParams.get('admin') === '1';

    if (isAdmin) {
      const authed = await isAuthorized(request);
      if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

      const result = await readAllProducts({
        status: searchParams.get('status') || 'all',
        q: searchParams.get('q') || '',
        page: Number(searchParams.get('page') || 1),
        pageSize: Number(searchParams.get('pageSize') || 20),
      });
      // No caching for admin data
      return Response.json(result, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // Public requests: only active products with pagination
    const page = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || 20);

    const result = await readProducts({
      platform: searchParams.get('platform') || '',
      category: searchParams.get('category') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      q: searchParams.get('q') || '',
      page,
      pageSize,
    });

    // Return with caching headers for public data
    return Response.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=120`,
      },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return Response.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request) {
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
    const validation = CreateProductSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Validate affiliate URL domain (security: prevent open redirect)
    try {
      validateAffiliateUrl(validation.data.affiliateUrl);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 400 });
    }

    const product = await createProduct(validation.data);
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
