import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || 'python tutorial';
  
  // In Cloudflare Workers, env comes from import.meta.env (loaded from wrangler.jsonc vars or .env)
  const apiKey = import.meta.env.YOUTUBE_API_KEY || '';

  const results: Record<string, any> = {
    query,
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.slice(0, 10) + '...' : 'MISSING',
    nodeEnv: import.meta.env.MODE,
  };

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No API key found in import.meta.env', ...results }, null, 2), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Test the YouTube search endpoint directly
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    results.searchStatus = res.status;
    results.searchOk = res.ok;
    results.searchError = data.error || null;
    results.playlistIdsFound = (data.items || []).map((i: any) => i.id?.playlistId).filter(Boolean);
    results.rawItemCount = data.items?.length || 0;
    results.pageInfo = data.pageInfo || null;
  } catch (err: any) {
    results.searchFetchError = err.message;
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
