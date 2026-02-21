insert into products (
  id, title, platform, category, price, old_price, image_url, affiliate_url, priority, active
) values (
  'demo-shopee-ricecooker',
  'Mini Rice Cooker 1.2L (Thailand Plug)',
  'Shopee',
  'Kitchen',
  299,
  459,
  'https://images.unsplash.com/photo-1585515656593-5fdb77497b95?q=80&w=1200&auto=format&fit=crop',
  'https://shopee.co.th/',
  100,
  true
)
on conflict (id) do update set
  title = excluded.title,
  platform = excluded.platform,
  category = excluded.category,
  price = excluded.price,
  old_price = excluded.old_price,
  image_url = excluded.image_url,
  affiliate_url = excluded.affiliate_url,
  priority = excluded.priority,
  active = excluded.active,
  updated_at = now();
