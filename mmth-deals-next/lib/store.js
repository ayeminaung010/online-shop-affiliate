import { getSupabase } from '@/lib/supabase';

export function isAuthorized(request) {
  const token = request.headers.get('x-admin-token');
  return token && token === process.env.ADMIN_TOKEN;
}

export async function readProducts(filters = {}) {
  const supabase = getSupabase();
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false });

  if (filters.platform) query = query.eq('platform', filters.platform);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice));

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    platform: p.platform,
    category: p.category,
    price: Number(p.price || 0),
    oldPrice: Number(p.old_price || 0),
    imageUrl: p.image_url || '',
    affiliateUrl: p.affiliate_url,
    priority: Number(p.priority || 0),
    active: p.active,
    updatedAt: p.updated_at
  }));
}

export async function createProduct(body) {
  const supabase = getSupabase();
  const row = {
    id: Date.now().toString(36),
    title: body.title,
    platform: body.platform,
    category: body.category || 'General',
    price: Number(body.price || 0),
    old_price: Number(body.oldPrice || 0),
    image_url: body.imageUrl || '',
    affiliate_url: body.affiliateUrl,
    priority: Number(body.priority || 0),
    active: true,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('products').insert(row).select('*').single();
  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    platform: data.platform,
    category: data.category,
    price: Number(data.price || 0),
    oldPrice: Number(data.old_price || 0),
    imageUrl: data.image_url || '',
    affiliateUrl: data.affiliate_url,
    priority: Number(data.priority || 0),
    active: data.active,
    updatedAt: data.updated_at
  };
}

export async function toggleProduct(id) {
  const supabase = getSupabase();
  const { data: existing, error: readErr } = await supabase
    .from('products')
    .select('id, active')
    .eq('id', id)
    .single();
  if (readErr) throw readErr;

  const { data, error } = await supabase
    .from('products')
    .update({ active: !existing.active, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    platform: data.platform,
    category: data.category,
    price: Number(data.price || 0),
    oldPrice: Number(data.old_price || 0),
    imageUrl: data.image_url || '',
    affiliateUrl: data.affiliate_url,
    priority: Number(data.priority || 0),
    active: data.active,
    updatedAt: data.updated_at
  };
}

export async function logClick({ product, source, campaign, ua }) {
  const supabase = getSupabase();
  const row = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    product_id: product.id,
    platform: product.platform,
    source: source || 'direct',
    campaign: campaign || '',
    ua: ua || '',
    ts: new Date().toISOString()
  };

  const { error } = await supabase.from('click_logs').insert(row);
  if (error) throw error;
}

export async function readStats() {
  const supabase = getSupabase();

  const [{ data: products, error: pErr }, { data: clicks, error: cErr }] = await Promise.all([
    supabase.from('products').select('id,title,platform,active'),
    supabase.from('click_logs').select('product_id')
  ]);

  if (pErr) throw pErr;
  if (cErr) throw cErr;

  const byProduct = {};
  for (const c of clicks || []) byProduct[c.product_id] = (byProduct[c.product_id] || 0) + 1;

  const result = (products || []).map((p) => ({
    id: p.id,
    title: p.title,
    platform: p.platform,
    clicks: byProduct[p.id] || 0,
    active: p.active
  })).sort((a, b) => b.clicks - a.clicks);

  return { totalClicks: (clicks || []).length, products: result };
}
