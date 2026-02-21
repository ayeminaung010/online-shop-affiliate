-- Run in Supabase SQL editor

create table if not exists products (
  id text primary key,
  title text not null,
  platform text not null,
  category text not null default 'General',
  price numeric not null default 0,
  old_price numeric not null default 0,
  image_url text not null default '',
  affiliate_url text not null,
  priority integer not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists click_logs (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  platform text not null,
  source text not null default 'direct',
  campaign text not null default '',
  ua text not null default '',
  ts timestamptz not null default now()
);

create index if not exists idx_products_active_priority on products(active, priority desc);
create index if not exists idx_click_logs_product_id on click_logs(product_id);
create index if not exists idx_click_logs_ts on click_logs(ts desc);
