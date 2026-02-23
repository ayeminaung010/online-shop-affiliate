import { createClient } from '@supabase/supabase-js';

let client;

/**
 * Custom fetch with timeout to prevent hanging queries
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getSupabase() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
    // Add custom fetch with 10-second timeout
    fetch: (input, init) => fetchWithTimeout(input, init, 10000),
  });

  return client;
}
