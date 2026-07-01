import type { APIRoute } from 'astro';
import { PLAYLISTS } from '../lib/db';

const TOPICS = ['python', 'machine-learning', 'react', 'upsc', 'javascript', 'dsa', 'system-design', 'devops', 'cybersecurity'];
const CREATORS = ['freeCodeCamp.org', 'Programming-with-Mosh', 'TechWorld-with-Nana', 'The-Net-Ninja'];
const CATEGORIES = ['programming', 'exams', 'science', 'technology'];

export const GET: APIRoute = () => {
  const domain = 'https://youtubeplaylistfinder.com';
  
  const urls = [
    `${domain}/`,
    `${domain}/roadmaps`,
    `${domain}/compare`,
    `${domain}/about`,
    `${domain}/contact`,
    `${domain}/privacy`,
    `${domain}/terms`,
    `${domain}/delete-data`,
    `${domain}/faq`,
    `${domain}/how-it-works`,
    `${domain}/trending`,
    `${domain}/categories`,
    `${domain}/top-playlists`,
    `${domain}/top-rated`,
    `${domain}/new-playlists`,
    `${domain}/beginner-playlists`
  ];

  // Add static playlists
  PLAYLISTS.forEach(p => {
    urls.push(`${domain}/playlist/${p.slug}`);
  });

  // Add programmatic topics
  TOPICS.forEach(topic => {
    urls.push(`${domain}/topic/${topic}`);
    urls.push(`${domain}/topic/${topic}/best-playlist`);
    urls.push(`${domain}/topic/${topic}/beginner`);
    urls.push(`${domain}/topic/${topic}/advanced`);
  });

  // Add category pages
  CATEGORIES.forEach(category => {
    urls.push(`${domain}/categories/${category}`);
  });

  // Add programmatic creators
  CREATORS.forEach(creator => {
    urls.push(`${domain}/creator/${encodeURIComponent(creator)}`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === domain + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
