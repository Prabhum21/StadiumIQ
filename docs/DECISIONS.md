# Architectural Decision Records (ADRs)

## Purpose
To document the key technical choices made during the development of StadiumIQ, providing context for future maintainers.

## Architecture & Implementation Decisions

### 1. Using FastAPI over Django/Flask
- **Decision**: FastAPI was chosen for the backend.
- **Evidence**: `backend/main.py`, `backend/requirements.txt` (`fastapi`).
- **Tradeoffs**: FastAPI is less opinionated than Django, requiring manual structural setup, but its native `asyncio` support is critical for non-blocking LLM network calls.

### 2. Using Next.js App Router
- **Decision**: Next.js App Router was chosen over pure React (Vite).
- **Evidence**: `frontend/src/app/page.tsx`, `frontend/next.config.ts`.
- **Tradeoffs**: Next.js adds server overhead compared to static SPAs, but provides superior SEO (if needed) and highly optimized initial payload delivery.

### 3. Caching LLM Responses
- **Decision**: Implementing a short-lived (60s) in-memory cache for GenAI requests.
- **Evidence**: `backend/services/gemini_service.py` (`_cache` dictionary).
- **Tradeoffs**: In-memory caching does not scale across multiple containers, but provides zero-dependency instant caching for a prototype.

## Future improvements
Formalize the ADR process using a tool like `adr-tools` to generate timestamped records for every architectural shift.
