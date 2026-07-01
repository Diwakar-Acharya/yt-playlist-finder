# YouTube Data API v3 Quota Extension Justification

This document details the usage patterns, architecture, and quota justification for **youtubeplaylistfinder.com** in support of our YouTube Data API Quota Extension Request.

---

## 1. Purpose of the Website
**youtubeplaylistfinder.com** is a free educational search and discovery portal designed to help self-directed learners, students, and professionals locate high-quality, structured learning courses on YouTube. 
- It filters out disjointed tutorials and entertainment content to rank playlists mathematically based on educational quality indicators: syllabus coverage completeness, recent update checks, user review ratings, and structure suitability.
- It translates unstructured YouTube metadata into highly structured learning checklists (complete with progress checkboxes and study session trackers) entirely in the client browser's local storage.

---

## 2. YouTube Data API Endpoints Utilized
We query the YouTube Data API v3 securely from our serverless backend (Cloudflare Workers) using the following endpoints:

1. **`search.list` (type=playlist / type=video)**
   - *Usage*: Called when a user enters a search query to discover relevant study playlists or fallback tutorial videos on a specific subject (e.g., "Python OOP", "Linear Algebra").
   - *Quota Cost*: **100 units** per call.

2. **`playlists.list` (part=snippet,contentDetails)**
   - *Usage*: Called to validate playlist status and fetch course metadata (titles, descriptions, channel creators, thumbnails, video counts) in batches.
   - *Quota Cost*: **1 unit** per call.

3. **`playlistItems.list` (part=snippet,contentDetails)**
   - *Usage*: Called to retrieve list details of videos inside a selected course to compile the student's study roadmap checklist.
   - *Quota Cost*: **1 unit** per call.

4. **`videos.list` (part=snippet,contentDetails,statistics)**
   - *Usage*: Called to resolve single video details (durations, titles, views) when rendering standalone fallback tutorial checklists.
   - *Quota Cost*: **1 unit** per call.

---

## 3. Quota Extension Justification & Consumption Details
The default daily developer quota is **10,000 units**. Because we query `search.list` to provide dynamic, relevant results for any study topic, our consumption profile is highly front-loaded:

- **1 Search Query** = 100 units (`search.list`) + 1 unit (`playlists.list` batch metadata) = **101 units**.
- **Maximum Searches/Day** = 10,000 / 101 ≈ **99 searches per day** across our entire user base.

With a handful of concurrent users, the default quota is exhausted within minutes, leaving the application unusable and triggering fallback mock data/scrapers. To support our active student community, we request a quota extension to **1,000,000 units/day** (allowing ~10,000 search queries/day).

---

## 4. Why Caching Cannot Fully Eliminate API Requests
While we employ cache layers (Cloudflare KV store) to cache query IDs and playlist details for 24 hours:
1. **Dynamic Long-tail Queries**: Self-directed learners query highly niche and specific educational topics (e.g., "UPSC CSE geography syllabus prep", "PyTorch 2.0 transformer tutorial from scratch"). These long-tail queries result in high cache misses.
2. **Freshness Auditing**: We must query the API to fetch live updates (e.g., if a creator adds new videos to a course, or if a video is deleted). Stale caches would lead to broken checklists and poor student experience.
3. **Validation**: We must dynamically check if playlist IDs still exist on YouTube via `playlists.list` to prevent listing dead links.

---

## 5. Compliance & User Data Privacy Guarantees
We take compliance and privacy seriously:
- **No Credentials Collection**: We never request, collect, or store Google Account credentials or YouTube passwords.
- **Public Data Only**: We access *only* public YouTube data returned by the official API. We do not access, write, or modify private user profiles or playlists.
- **Zero Sale of Data**: We do not sell user data, nor do we share it with third parties. No data is used for advertising.
- **GDPR & CCPA Alignment**: Users can clear all locally stored bookmarked playlists and progress parameters instantly via their browser storage. We provide a `/delete-data` endpoint to request immediate manual log erasure.

We are fully compliant with the **YouTube API Services Terms of Service** and the **Google API Services User Data Policy**.
