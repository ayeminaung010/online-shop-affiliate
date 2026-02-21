import { createClient } from '@supabase/supabase-js';

let client;

export function getSupabase() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  });

  return client;
}
