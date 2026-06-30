import type { APIRoute } from 'astro';
import { getPlaylistDetailsBatch, getCloudflareEnv } from '../../lib/youtube';

export const GET: APIRoute = async (context) => {
  const env = await getCloudflareEnv();
  const apiKey = env?.YOUTUBE_API_KEY || import.meta.env.YOUTUBE_API_KEY || '';

  if (!apiKey) {
    return new Response('Missing API Key', { status: 500 });
  }

  // Authorization check
  const urlObj = new URL(context.request.url);
  const token = urlObj.searchParams.get('token');
  const expectedToken = env?.CRON_TOKEN || import.meta.env.CRON_TOKEN || '';
  
  if (!expectedToken) {
    console.error('[SECURITY ERROR] CRON_TOKEN environment variable is not defined.');
    return new Response('Cron authorization token is not configured on server', { status: 500 });
  }
  
  const authHeader = context.request.headers.get('Authorization');
  const isAuthorized = (token && token === expectedToken) || (authHeader && authHeader === `Bearer ${expectedToken}`);
  
  if (!isAuthorized) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    let playlistIds: string[] = [];

    if (env?.SESSION) {
      const list = await env.SESSION.list({ prefix: 'playlist:' });
      playlistIds = list.keys.map((k: any) => k.name.replace('playlist:', ''));
    } else {
      // Local fallback known IDs
      playlistIds = [
        'PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI',
        'PLblh5JKOoLUICTaGLRoHQDuF500JJRTJk',
        'PLIY8eNdw5tW_zX3OCzX7NJ8bL1p6pWfgG',
        'PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
        'PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
        'PL0o_zxa4K1BXP7TUO7656wg0uF1xYnwgm'
      ];
    }

    if (playlistIds.length === 0) {
      return new Response(JSON.stringify({ success: true, count: 0 }), { status: 200 });
    }

    let refreshedCount = 0;
    // Process in batches of 50 to respect YouTube API batch constraints
    for (let i = 0; i < playlistIds.length; i += 50) {
      const batch = playlistIds.slice(i, i + 50);
      const detailsMap = await getPlaylistDetailsBatch(batch, apiKey);

      for (const id of batch) {
        const details = detailsMap[id];
        if (details && env?.SESSION) {
          const raw = await env.SESSION.get(`playlist:${id}`);
          const existing = raw ? JSON.parse(raw) : {};

          // Update cache with latest title, thumbnail, and mark fresh
          await env.SESSION.put(`playlist:${id}`, JSON.stringify({
            playlist_id: id,
            title: details.title,
            channel_id: details.channelId,
            thumbnail_url: details.thumbnail_url,
            score: existing.score || 85,
            updated_at: Date.now(),
            stale: false
          }));
          refreshedCount++;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, count: refreshedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Background refresh error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
};
export const POST = GET;
