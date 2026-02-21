import { isAuthorized, readStats } from '@/lib/store';

export async function GET(request) {
  try {
    if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const stats = await readStats();
    return Response.json(stats);
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to load stats' }, { status: 500 });
  }
}
