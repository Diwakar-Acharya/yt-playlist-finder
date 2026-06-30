import { PLAYLISTS, ROADMAPS, type Playlist, type Roadmap } from './db';
import { scrapeYouTubePlaylists, scrapeLivePlaylistDetails, generateFallbackPlaylists } from './youtube';

export interface SearchFilters {
  duration?: string;   // 'short' (<30h) | 'medium' (30-60h) | 'long' (>60h)
  language?: string;   // 'English' | 'Hindi / English'
  difficulty?: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  searchQuery?: string;
}

export async function searchPlaylists(
  query: string = '',
  filters: SearchFilters = {},
  sort: string = 'best'
): Promise<Playlist[]> {
  let results: Playlist[] = [];

  const q = query.trim().toLowerCase();
  if (q) {
    // 1. Fetch live YouTube playlist search results (scraped dynamically, no keys required)
    const ytResults = await scrapeYouTubePlaylists(q);
    
    // 2. Fetch matching static templates
    const staticResults = PLAYLISTS.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.channel.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q))
    );

    // Combine and deduplicate
    const combined = [...staticResults, ...ytResults];
    const seen = new Set<string>();
    results = combined.filter(p => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
  } else {
    results = [...PLAYLISTS];
  }

  // 3. Filters
  if (filters.difficulty) {
    results = results.filter(p => p.difficulty === filters.difficulty);
  }

  if (filters.language) {
    results = results.filter(p => p.language.includes(filters.language!));
  }

  if (filters.duration) {
    if (filters.duration === 'short') {
      results = results.filter(p => p.durationHours < 40);
    } else if (filters.duration === 'medium') {
      results = results.filter(p => p.durationHours >= 40 && p.durationHours <= 65);
    } else if (filters.duration === 'long') {
      results = results.filter(p => p.durationHours > 65);
    }
  }

  // 4. Sort
  if (sort === 'best') {
    results.sort((a, b) => b.score - a.score);
  } else if (sort === 'fastest') {
    results.sort((a, b) => a.durationHours - b.durationHours);
  } else if (sort === 'complete') {
    results.sort((a, b) => b.topics.length - a.topics.length);
  }

  return results;
}

export async function getPlaylistBySlug(slug: string): Promise<Playlist | undefined> {
  // 1. Check static templates list
  const staticPlaylist = PLAYLISTS.find(p => p.slug === slug);
  if (staticPlaylist) return staticPlaylist;

  // 2. If it is a real YouTube Playlist ID, scrape metadata & video sequence live
  if (slug.startsWith('PL') || slug.length > 15) {
    const liveDetails = await scrapeLivePlaylistDetails(slug);
    if (liveDetails) return liveDetails;
  }

  // 3. Check fallback dynamic-yt-
  if (slug.startsWith('dynamic-yt-')) {
    const parts = slug.split('-');
    const indexStr = parts[parts.length - 1];
    const index = parseInt(indexStr, 10) - 1;
    const queryParts = parts.slice(2, parts.length - 1);
    const query = queryParts.join(' ');

    const generated = generateFallbackPlaylists(query);
    if (generated[index]) {
      return generated[index];
    }
  }

  return undefined;
}

export function getRoadmaps(): Roadmap[] {
  return ROADMAPS;
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find(r => r.id === id);
}

export async function comparePlaylists(slugA: string, slugB: string): Promise<{ playlistA: Playlist; playlistB: Playlist } | undefined> {
  const playlistA = await getPlaylistBySlug(slugA);
  const playlistB = await getPlaylistBySlug(slugB);
  if (playlistA && playlistB) {
    return { playlistA, playlistB };
  }
  return undefined;
}

export function calculateWeightedScore(breakdown: Playlist['scoreBreakdown']): number {
  const score = (
    breakdown.userReviews * 0.35 +
    breakdown.completionRate * 0.25 +
    breakdown.playlistStructure * 0.20 +
    breakdown.recentActivity * 0.10 +
    breakdown.creatorAuthority * 0.10
  );
  return Math.round(score);
}

export function getCustomPathwayRoadmap(playlist: Playlist): {
  prerequisite: { title: string; description: string; slug: string } | null;
  current: { title: string; description: string; slug: string };
  nextStep: { title: string; description: string; slug: string } | null;
} {
  const isBeginner = playlist.difficulty === 'Beginner';
  const isAdvanced = playlist.difficulty === 'Advanced';

  let prerequisite = null;
  let nextStep = null;

  if (!isBeginner) {
    prerequisite = {
      title: 'Python Programming Basics',
      description: 'Understand core variables, loops, decorators, and basic OOP principles.',
      slug: 'corey-schafer-python'
    };
  }

  const current = {
    title: playlist.title,
    description: playlist.description,
    slug: playlist.slug
  };

  if (isBeginner) {
    if (playlist.slug.includes('python')) {
      nextStep = {
        title: 'Machine Learning Deep Dive',
        description: 'Take your Python programming to theoretical AI math and training algorithms.',
        slug: 'andrew-ng-machine-learning'
      };
    } else {
      nextStep = {
        title: 'Algorithms & DSA Interview Prep',
        description: 'Transition from basic syntax to interview-level arrays, loops, and trees.',
        slug: 'striver-dsa-sheet'
      };
    }
  } else if (!isAdvanced) {
    nextStep = {
      title: 'Algorithms and Data Structures Masterclass',
      description: 'Master time and space complexity, dynamic programming, and advanced graphs with Abdul Bari.',
      slug: 'abdul-bari-dsa'
    };
  } else {
    nextStep = {
      title: 'Systems design & scaling frameworks',
      description: 'Examine custom microservices, distributed load balancing, and performance tuning.',
      slug: 'statquest-machine-learning'
    };
  }

  return { prerequisite, current, nextStep };
}
