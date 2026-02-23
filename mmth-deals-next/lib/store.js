import { getSupabase } from '@/lib/supabase';

// ─── Auth ───────────────────────────────────────────────

/**
 * Verify admin auth via Supabase JWT from Authorization header.
 * Falls back to legacy x-admin-token for backward compatibility.
 */
export async function isAuthorized(request) {
  // Try Supabase JWT first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) return true;
  }

  // Fallback: legacy token
  const legacyToken = request.headers.get('x-admin-token');
  return legacyToken && legacyToken === process.env.ADMIN_TOKEN;
}

// ─── Product Mapper ─────────────────────────────────────

function mapProduct(p) {
  return {
    id: p.id,
    title: p.title,
    platform: p.platform,
    category: p.category,
    price: Number(p.price || 0),
    oldPrice: Number(p.old_price || 0),
    imageUrl: p.image_url || '',
    affiliateUrl: p.affiliate_url,
    description: p.description || '',
    priority: Number(p.priority || 0),
    status: p.status || 'active',
    lastCheckedAt: p.last_checked_at || null,
    createdBy: p.created_by || '',
    updatedAt: p.updated_at,
  };
}

function toRow(body) {
  const row = {
    title: body.title,
    platform: body.platform,
    category: body.category || 'General',
    price: Number(body.price || 0),
    old_price: Number(body.oldPrice || 0),
    image_url: body.imageUrl || '',
    affiliate_url: body.affiliateUrl,
    description: body.description || '',
    priority: Number(body.priority || 0),
    status: body.status || 'active',
    last_checked_at: body.lastCheckedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (body.createdBy !== undefined) row.created_by = body.createdBy;
  return row;
}

// ─── Public: Read Active Products ───────────────────────

export async function readProducts(filters = {}) {
  const supabase = getSupabase();
  const page = Number(filters.page) || 1;
  const pageSize = Number(filters.pageSize) || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .in('status', ['active', 'need_recheck', 'low_confidence'])
    .order('priority', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (filters.platform) query = query.eq('platform', filters.platform);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice));
  if (filters.q) query = query.ilike('title', `%${filters.q}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: (data || []).map(mapProduct),
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ─── Public: Deal Summary Stats (count-only) ────────────

export async function readDealStats() {
  const supabase = getSupabase();
  const activeStatuses = ['active', 'need_recheck', 'low_confidence'];

  const [totalRes, under300Res, shopeeRes, lazadaRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).in('status', activeStatuses),
    supabase.from('products').select('id', { count: 'exact', head: true }).in('status', activeStatuses).lte('price', 300),
    supabase.from('products').select('id', { count: 'exact', head: true }).in('status', activeStatuses).eq('platform', 'Shopee'),
    supabase.from('products').select('id', { count: 'exact', head: true }).in('status', activeStatuses).eq('platform', 'Lazada'),
  ]);

  return {
    total: totalRes.count || 0,
    under300: under300Res.count || 0,
    shopee: shopeeRes.count || 0,
    lazada: lazadaRes.count || 0,
  };
}

// ─── Admin: Read All Products (paginated + search) ──────

export async function readAllProducts({ status, q, page = 1, pageSize = 20 } = {}) {
  const supabase = getSupabase();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (status && status !== 'all') query = query.eq('status', status);
  if (q) query = query.ilike('title', `%${q}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: (data || []).map(mapProduct),
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ─── Admin: Single Product ──────────────────────────────

export async function readProduct(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return mapProduct(data);
}

// ─── CRUD ───────────────────────────────────────────────

export async function createProduct(body) {
  const supabase = getSupabase();
  const row = {
    id: Date.now().toString(36),
    ...toRow(body),
  };

  const { data, error } = await supabase.from('products').insert(row).select('*').single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id, body) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .update(toRow(body))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id) {
  const supabase = getSupabase();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function updateProductStatus(id, status) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function bulkUpdateStatus(ids, status) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .in('id', ids)
    .select('*');
  if (error) throw error;
  return (data || []).map(mapProduct);
}

// ─── Legacy: Toggle ─────────────────────────────────────

export async function toggleProduct(id) {
  const supabase = getSupabase();
  const { data: existing, error: readErr } = await supabase
    .from('products')
    .select('id, status')
    .eq('id', id)
    .single();
  if (readErr) throw readErr;

  const newStatus = existing.status === 'active' ? 'inactive' : 'active';
  return updateProductStatus(id, newStatus);
}

// ─── Click Logging ──────────────────────────────────────

export async function logClick({ product, source, campaign, ua }) {
  const supabase = getSupabase();
  const row = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    product_id: product.id,
    platform: product.platform,
    source: source || 'direct',
    campaign: campaign || '',
    ua: ua || '',
    ts: new Date().toISOString(),
  };
  const { error } = await supabase.from('click_logs').insert(row);
  if (error) throw error;
}

// ─── Stats ──────────────────────────────────────────────

export async function readStats() {
  const supabase = getSupabase();

  const [{ data: products, error: pErr }, { data: clicks, error: cErr }] = await Promise.all([
    supabase.from('products').select('id,title,platform,status'),
    supabase.from('click_logs').select('product_id'),
  ]);

  if (pErr) throw pErr;
  if (cErr) throw cErr;

  const byProduct = {};
  for (const c of clicks || []) byProduct[c.product_id] = (byProduct[c.product_id] || 0) + 1;

  const allProducts = products || [];
  const result = allProducts
    .map((p) => ({
      id: p.id,
      title: p.title,
      platform: p.platform,
      clicks: byProduct[p.id] || 0,
      status: p.status || 'active',
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks: (clicks || []).length,
    totalProducts: allProducts.length,
    activeProducts: allProducts.filter((p) => (p.status || 'active') === 'active').length,
    needRecheck: allProducts.filter((p) => p.status === 'need_recheck').length,
    products: result,
  };
}
