-- Run in Supabase SQL editor
-- Base schema

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
  status text not null default 'active',
  last_checked_at timestamptz not null default now(),
  created_by text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists click_logs (
  id text primary key,
  action_type text not null default 'click', -- 'click', 'page_view', 'product_view'
  product_id text references products(id) on delete cascade, -- Nullable for general page views
  page_url text, -- To track the URL/path of the page view
  platform text, -- Nullable as generic web traffic might not have an affiliate platform
  source text not null default 'direct',
  campaign text not null default '',
  ua text not null default '',
  ts timestamptz not null default now()
);

create index if not exists idx_products_active_priority on products(active, priority desc);
create index if not exists idx_products_status on products(status);
create index if not exists idx_click_logs_product_id on click_logs(product_id);
create index if not exists idx_click_logs_ts on click_logs(ts desc);
create index if not exists idx_click_logs_action_ts on click_logs(action_type, ts desc); -- Added for faster daily reporting

-- Performance indexes matching actual query patterns in store.js
create index if not exists idx_products_status_priority on products(status, priority desc);
create index if not exists idx_products_platform on products(platform);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_updated_at on products(updated_at desc);

-- ─────────────────────────────────────────────────────────
-- Migration: Run this if table already exists to add new columns
-- ─────────────────────────────────────────────────────────
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS last_checked_at timestamptz NOT NULL DEFAULT now();
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by text NOT NULL DEFAULT '';
--
-- ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS action_type text NOT NULL DEFAULT 'click';
-- ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS page_url text;
-- ALTER TABLE click_logs ALTER COLUMN product_id DROP NOT NULL;
-- ALTER TABLE click_logs ALTER COLUMN platform DROP NOT NULL;
