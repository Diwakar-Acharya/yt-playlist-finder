import type { APIRoute } from 'astro';
import { searchPlaylists } from '../../lib/api';
import { getCloudflareEnv } from '../../lib/youtube';
import { 
  validateQuery, 
  validateDifficulty, 
  validateDuration, 
  validateSort 
} from '../../lib/validation';

export const GET: APIRoute = async ({ request }) => {
  const env = await getCloudflareEnv();
  const apiKey = env?.YOUTUBE_API_KEY || import.meta.env.YOUTUBE_API_KEY || '';

  const url = new URL(request.url);
  const rawQuery = url.searchParams.get('q') || '';
  const rawDifficulty = url.searchParams.get('difficulty') || undefined;
  const rawDuration = url.searchParams.get('duration') || undefined;
  const rawLanguage = url.searchParams.get('language') || undefined;
  const rawSort = url.searchParams.get('sort') || 'best';

  // Strict Validation and Sanitization
  const query = validateQuery(rawQuery);
  const difficulty = validateDifficulty(rawDifficulty);
  const duration = validateDuration(rawDuration);
  const sort = validateSort(rawSort);
  
  // Clean language: limit length and check alphanumeric only
  let language: string | undefined = undefined;
  if (typeof rawLanguage === 'string') {
    const cleanLang = rawLanguage.trim().slice(0, 30);
    if (/^[a-zA-Z\s-]+$/.test(cleanLang)) {
      language = cleanLang;
    }
  }

  const results = await searchPlaylists(query, { difficulty, duration, language }, sort, apiKey, env);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600'
    }
  });
};
