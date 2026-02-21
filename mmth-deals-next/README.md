# MMTH Deals Next.js (Supabase Migrated)

Next.js App Router + Supabase backend.

## 1) Setup env
```bash
cd mmth-deals-next
npm install
cp .env.example .env
```

Fill `.env`:
- `ADMIN_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2) Create DB tables in Supabase
Run SQL in order:
1. `supabase/schema.sql`
2. `supabase/seed.sql` (optional demo data)

## 3) Run app
```bash
npm run dev
```

Open:
- Public: http://localhost:3000
- Admin: http://localhost:3000/admin

## API
- `GET /api/products`
- `POST /api/products` (header: `x-admin-token`)
- `PATCH /api/products/:id/toggle` (header: `x-admin-token`)
- `GET /api/stats` (header: `x-admin-token`)
- `GET /go/:id` click log + redirect

## Notes
- Data is now in Supabase (`products`, `click_logs`).
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
