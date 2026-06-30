import { PLAYLISTS, ROADMAPS, type Playlist, type Roadmap } from './db';
import { 
  searchYouTubePlaylists, 
  getPlaylistDetailsBatch, 
  getPlaylistVideos, 
  STATIC_SLUG_MAP 
} from './youtube';

export interface SearchFilters {
  duration?: string;   // 'short' (<40h) | 'medium' (40-65h) | 'long' (>65h)
  language?: string;
  difficulty?: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  searchQuery?: string;
}

export async function searchPlaylists(
  query: string = '',
  filters: SearchFilters = {},
  sort: string = 'best',
  apiKey: string = '',
  env?: any
): Promise<Playlist[]> {
  let results: Playlist[] = [];
  const q = query.trim().toLowerCase();

  if (q) {
    // 1. Fetch matching static templates
    const staticMatches = PLAYLISTS.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.channel.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q))
    );

    // Map static slugs to their YouTube playlist IDs for direct API resolution
    const staticPlaylists: Playlist[] = [];
    if (apiKey && staticMatches.length > 0) {
      const matchIds = staticMatches.map(p => STATIC_SLUG_MAP[p.slug]).filter(Boolean);
      if (matchIds.length > 0) {
        const detailsMap = await getPlaylistDetailsBatch(matchIds, apiKey, env);
        staticMatches.forEach((staticItem, idx) => {
          const ytId = STATIC_SLUG_MAP[staticItem.slug];
          const ytDetails = detailsMap[ytId];
          if (ytDetails) {
            staticPlaylists.push({
              ...staticItem,
              slug: ytId, // Use real YouTube playlist ID as slug
              title: ytDetails.title,
              thumbnail: ytDetails.thumbnail_url,
              videoCount: ytDetails.videoCount,
              durationHours: Math.round(ytDetails.videoCount * 0.4) || 2
            });
          } else {
            // Keep template if API fetch fails, but map slug if possible
            staticPlaylists.push({
              ...staticItem,
              slug: ytId || staticItem.slug
            });
          }
        });
      }
    } else {
      staticPlaylists.push(...staticMatches);
    }

    // 2. Fetch live YouTube Data API playlists
    let ytResults: Playlist[] = [];
    if (apiKey) {
      ytResults = await searchYouTubePlaylists(q, apiKey, env);
    }

    // Combine and deduplicate by slug/playlist_id
    const combined = [...staticPlaylists, ...ytResults];
    const seen = new Set<string>();
    results = combined.filter(p => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });

    if (results.length === 0) {
      console.log('[DEBUG] 0 results found (possibly due to API quota or no match). Falling back to popular static templates.');
      if (apiKey) {
        const staticIds = Object.values(STATIC_SLUG_MAP);
        let detailsMap: Record<string, any> = {};
        try {
          detailsMap = await getPlaylistDetailsBatch(staticIds, apiKey, env);
        } catch (e) {
          console.error('Failed to resolve static templates details on search fallback:', e);
        }
        results = PLAYLISTS.map(p => {
          const ytId = STATIC_SLUG_MAP[p.slug];
          const ytDetails = detailsMap[ytId];
          return {
            ...p,
            slug: ytId || p.slug,
            title: ytDetails?.title || p.title,
            thumbnail: ytDetails?.thumbnail_url || p.thumbnail,
            videoCount: ytDetails?.videoCount || p.videoCount,
            durationHours: ytDetails ? Math.round(ytDetails.videoCount * 0.4) || 2 : p.durationHours,
            isFallback: true
          };
        });
      } else {
        results = PLAYLISTS.map(p => ({ ...p, isFallback: true }));
      }
    }
  } else {
    // Return all static templates resolved to YouTube IDs
    if (apiKey) {
      const staticIds = Object.values(STATIC_SLUG_MAP);
      const detailsMap = await getPlaylistDetailsBatch(staticIds, apiKey, env);
      results = PLAYLISTS.map(p => {
        const ytId = STATIC_SLUG_MAP[p.slug];
        const ytDetails = detailsMap[ytId];
        return {
          ...p,
          slug: ytId || p.slug,
          title: ytDetails?.title || p.title,
          thumbnail: ytDetails?.thumbnail_url || p.thumbnail,
          videoCount: ytDetails?.videoCount || p.videoCount,
          durationHours: ytDetails ? Math.round(ytDetails.videoCount * 0.4) || 2 : p.durationHours
        };
      });
    } else {
      results = [...PLAYLISTS];
    }
  }

  // 3. Apply Filters
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

export async function getPlaylistBySlug(slug: string, apiKey: string = '', env?: any): Promise<Playlist | undefined> {
  if (!slug) return undefined;

  // Resolve slug if it is mapped to a static playlist
  const ytId = STATIC_SLUG_MAP[slug] || slug;

  // Fetch playlist details via official API
  if (apiKey && (ytId.startsWith('PL') || ytId.length > 10)) {
    const detailsMap = await getPlaylistDetailsBatch([ytId], apiKey, env);
    const details = detailsMap[ytId];
    if (details) {
      const videos = await getPlaylistVideos(ytId, apiKey, env);
      
      // Look up static metadata templates for static playlists to keep reviews & roadmaps
      const staticTemplate = PLAYLISTS.find(p => p.slug === slug || STATIC_SLUG_MAP[p.slug] === ytId);

      const scoreBreakdown = {
        userReviews: staticTemplate?.scoreBreakdown?.userReviews || 95,
        completionRate: staticTemplate?.scoreBreakdown?.completionRate || 82,
        playlistStructure: details.videoCount >= 15 && details.videoCount <= 50 ? 95 : 80,
        recentActivity: 90,
        creatorAuthority: staticTemplate?.scoreBreakdown?.creatorAuthority || 88
      };

      const score = Math.round(
        scoreBreakdown.userReviews * 0.35 +
        scoreBreakdown.completionRate * 0.25 +
        scoreBreakdown.playlistStructure * 0.20 +
        scoreBreakdown.recentActivity * 0.10 +
        scoreBreakdown.creatorAuthority * 0.10
      );

      return {
        slug: ytId,
        title: details.title,
        description: details.description || staticTemplate?.description || `YouTube course playlist from channel "${details.channel}".`,
        channel: details.channel,
        channelSubscriberCount: staticTemplate?.channelSubscriberCount || 'Verified YouTube Creator',
        thumbnail: details.thumbnail_url,
        score,
        scoreBreakdown,
        durationHours: Math.round(details.videoCount * 0.4) || 2,
        videoCount: details.videoCount,
        difficulty: staticTemplate?.difficulty || (details.videoCount > 30 ? 'Intermediate' : 'Beginner'),
        language: staticTemplate?.language || 'English',
        communityRating: staticTemplate?.communityRating || 4.8,
        savedCount: staticTemplate?.savedCount || 240,
        completionPercent: scoreBreakdown.completionRate,
        freshness: 'Updated recently',
        topics: staticTemplate?.topics || ['Syllabus overview', 'Practical tutorials', 'Review and conclusions'],
        missingTopics: staticTemplate?.missingTopics || ['Advanced concepts preview'],
        reviews: staticTemplate?.reviews || [
          { name: 'Self Learner', role: 'Student', rating: 5, comment: 'Excellent structured syllabus.', date: '2026-06-25' }
        ],
        videos,
        alternatives: staticTemplate?.alternatives || [],
        roadmaps: staticTemplate?.roadmaps || ['software-engineer']
      };
    }
  }

  // Fallback to static mock data if API key not present
  return PLAYLISTS.find(p => p.slug === slug);
}

export function getRoadmaps(): Roadmap[] {
  return ROADMAPS;
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find(r => r.id === id);
}

export async function comparePlaylists(slugA: string, slugB: string, apiKey: string = ''): Promise<{ playlistA: Playlist; playlistB: Playlist } | undefined> {
  const playlistA = await getPlaylistBySlug(slugA, apiKey);
  const playlistB = await getPlaylistBySlug(slugB, apiKey);
  if (playlistA && playlistB) {
    return { playlistA, playlistB };
  }
  return undefined;
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
      slug: 'PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU' // Use direct ID
    };
  }

  const current = {
    title: playlist.title,
    description: playlist.description,
    slug: playlist.slug
  };

  if (isBeginner) {
    if (playlist.slug.toLowerCase().includes('python') || playlist.slug === 'PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU') {
      nextStep = {
        title: 'Machine Learning Deep Dive',
        description: 'Take your Python programming to theoretical AI math and training algorithms.',
        slug: 'PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI' // Use direct ID
      };
    } else {
      nextStep = {
        title: 'Algorithms & DSA Interview Prep',
        description: 'Transition from basic syntax to interview-level arrays, loops, and trees.',
        slug: 'PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz' // Use direct ID
      };
    }
  } else if (!isAdvanced) {
    nextStep = {
      title: 'Algorithms and Data Structures Masterclass',
      description: 'Master time and space complexity, dynamic programming, and advanced graphs with Abdul Bari.',
      slug: 'PLIY8eNdw5tW_zX3OCzX7NJ8bL1p6pWfgG' // Use direct ID
    };
  } else {
    nextStep = {
      title: 'Systems design & scaling frameworks',
      description: 'Examine custom microservices, distributed load balancing, and performance tuning.',
      slug: 'PLblh5JKOoLUICTaGLRoHQDuF500JJRTJk' // Use direct ID
    };
  }

  return { prerequisite, current, nextStep };
}
