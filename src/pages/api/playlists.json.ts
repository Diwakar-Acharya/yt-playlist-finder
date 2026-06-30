import type { APIRoute } from 'astro';
import { searchPlaylists } from '../../lib/api';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const difficulty = url.searchParams.get('difficulty') || undefined;
  const duration = url.searchParams.get('duration') || undefined;
  const language = url.searchParams.get('language') || undefined;
  const sort = url.searchParams.get('sort') || 'best';

  const results = await searchPlaylists(query, { difficulty, duration, language }, sort);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600'
    }
  });
};
