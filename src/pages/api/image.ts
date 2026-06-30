import type { APIRoute } from 'astro';
import { validateUrl } from '../../lib/validation';

export const GET: APIRoute = async ({ request }) => {
  const urlObj = new URL(request.url);
  const targetUrl = urlObj.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  const validatedUrl = validateUrl(targetUrl);
  if (!validatedUrl) {
    return new Response('Forbidden target host or invalid URL', { status: 403 });
  }

  try {
    const res = await fetch(validatedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (!res.ok) {
      return new Response('Error loading image', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable' // 7 days caching
      }
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
};
