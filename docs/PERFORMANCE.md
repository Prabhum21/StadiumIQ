# Performance & Optimization

## Purpose
To detail the strategies employed to guarantee sub-second response times and minimal resource footprint during peak stadium loads.

## Architecture
Performance is addressed at both the UI rendering layer and the Backend execution layer, specifically optimizing the heavy GenAI bottlenecks.

## Implementation
1. **Frontend Optimization**: Heavy components like `StadiumMap` and `AccessibilityAssistant` are dynamically imported (`next/dynamic`) to reduce the initial JavaScript bundle size. React's `useMemo` is used to prevent expensive re-calculations of stadium metrics on every render.
2. **Backend Caching**: The `GeminiService` implements an in-memory caching mechanism with a 60-second TTL. Duplicate requests within this window return the cached response instantly (0ms latency to LLM).

## Evidence
- Code Splitting: `frontend/src/components/dashboard/DashboardContent.tsx` (dynamic imports)
- Render Optimization: `frontend/src/app/page.tsx` (`useMemo` hooks)
- API Caching: `backend/services/gemini_service.py` (`_get_from_cache`, `_set_to_cache`)

## Tradeoffs
Client-side memoization increases memory usage on the user's browser, which might impact older mobile devices in exchange for smoother re-renders.

## Future improvements
Implement Edge caching via a CDN (like Cloudflare or Vercel Edge) for the static `/crowd` endpoint to completely bypass the backend during peak spikes.
