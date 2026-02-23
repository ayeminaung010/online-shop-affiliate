/**
 * Environment variable validation
 * Run this at app startup to ensure all required env vars are set
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ADMIN_TOKEN',
];

/**
 * Validate that all required environment variables are set
 * Throws an error if any are missing
 */
export function validateEnv() {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    const errorMsg = [
      '❌ Missing required environment variables:',
      ...missing.map(v => `   - ${v}`),
      '',
      'Please check your .env file or Vercel environment settings.',
    ].join('\n');
    
    throw new Error(errorMsg);
  }
  
  // Warn about optional but recommended vars
  const warnings = [];
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Optional environment variables not set:', warnings.join(', '));
  }
  
  return true;
}

/**
 * Validate Supabase URL format
 */
export function validateSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('.supabase.co')) {
      console.warn('⚠️ Supabase URL does not appear to be a valid Supabase project');
      return false;
    }
    return true;
  } catch {
    console.error('❌ Invalid Supabase URL format');
    return false;
  }
}
