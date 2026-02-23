import { getSupabase } from '@/lib/supabase';

/**
 * Health check endpoint for monitoring
 * Returns service status and version info
 */
export async function GET() {
  const startTime = Date.now();
  
  // Check database connectivity
  let dbStatus = 'ok';
  let dbLatency = 0;
  
  try {
    const supabase = getSupabase();
    const dbStart = Date.now();
    
    // Quick query to test connection
    await supabase.from('products').select('id', { count: 'exact', head: true }).limit(1);
    
    dbLatency = Date.now() - dbStart;
    dbStatus = 'ok';
  } catch (error) {
    dbStatus = 'error';
    console.error('Health check DB error:', error);
  }
  
  const totalLatency = Date.now() - startTime;
  
  return Response.json({
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        status: dbStatus,
        latency_ms: dbLatency,
      },
    },
    performance: {
      total_latency_ms: totalLatency,
    },
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
