/**
 * Strict Input Validation and Sanitization Module
 */

export function validateQuery(q: unknown): string {
  if (typeof q !== 'string') return '';
  // Trim and limit query to 100 characters to prevent DOS / API quota exhaustion
  let clean = q.trim().slice(0, 100);
  // Remove < and > to prevent basic HTML tag injection
  clean = clean.replace(/[<>]/g, '');
  return clean;
}

export function validateDifficulty(diff: unknown): 'Beginner' | 'Intermediate' | 'Advanced' | undefined {
  if (diff === 'Beginner' || diff === 'Intermediate' || diff === 'Advanced') {
    return diff;
  }
  return undefined;
}

export function validateDuration(dur: unknown): 'short' | 'medium' | 'long' | undefined {
  if (dur === 'short' || dur === 'medium' || dur === 'long') {
    return dur;
  }
  return undefined;
}

export function validateSort(sort: unknown): 'best' | 'fastest' | 'complete' {
  if (sort === 'best' || sort === 'fastest' || sort === 'complete') {
    return sort;
  }
  return 'best';
}

export function validateSlug(slug: unknown): string | undefined {
  if (typeof slug !== 'string') return undefined;
  const clean = slug.trim();
  // Alphanumeric, dashes, underscores, up to 100 chars
  const regex = /^[a-zA-Z0-9_-]{1,100}$/;
  if (!regex.test(clean)) {
    return undefined;
  }
  return clean;
}

export function validatePlaylistId(id: unknown): string | undefined {
  if (typeof id !== 'string') return undefined;
  const clean = id.trim();
  // YouTube playlist ID typically starts with PL or similar and is alphanumeric, dashes, underscores
  const regex = /^[a-zA-Z0-9_-]{5,100}$/;
  if (!regex.test(clean)) {
    return undefined;
  }
  return clean;
}

export function validateCreator(creator: unknown): string | undefined {
  if (typeof creator !== 'string') return undefined;
  const clean = creator.trim();
  // Safe creator names (alphanumeric, spaces, dots, hyphens, @, up to 100 chars)
  const regex = /^[a-zA-Z0-9\s.@_-]{1,100}$/;
  if (!regex.test(clean)) {
    return undefined;
  }
  return clean;
}

export function validateTopic(topic: unknown): string | undefined {
  if (typeof topic !== 'string') return undefined;
  const clean = topic.trim();
  // Topic path parameters are typically alphanumeric + dashes
  const regex = /^[a-zA-Z0-9_-]{1,100}$/;
  if (!regex.test(clean)) {
    return undefined;
  }
  return clean;
}

/**
 * Escapes standard HTML special characters.
 */
export function escapeHTML(str: unknown): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates a target URL for SSRF prevention.
 * Returns the validated URL string or undefined if invalid or forbidden.
 */
export function validateUrl(urlStr: unknown): string | undefined {
  if (typeof urlStr !== 'string') return undefined;
  
  try {
    const parsed = new URL(urlStr);
    
    // 1. Restrict protocols strictly to HTTP / HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Prevent IP address targets to block SSRF bypasses via local IP ranges
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(hostname)) {
      return undefined;
    }
    if (hostname.includes('[') || hostname.includes(']')) {
      // Block IPv6 notation
      return undefined;
    }

    // 3. Block localhost/loopback aliases
    const forbiddenHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (forbiddenHosts.includes(hostname)) {
      return undefined;
    }

    // 4. Enforce strict allowed domain matching
    const allowedHosts = ['ytimg.com', 'yt3.ggpht.com', 'googleusercontent.com', 'unsplash.com'];
    const isAllowed = allowedHosts.some(allowed => 
      hostname === allowed || hostname.endsWith('.' + allowed)
    );

    if (!isAllowed) {
      return undefined;
    }

    return parsed.toString();
  } catch {
    return undefined;
  }
}
