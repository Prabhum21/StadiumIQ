# Deployment and Production Setup

StadiumIQ is fully containerized and optimized for high-throughput cloud environments.

## 1. Local Containerized Run (Docker Compose)
To run both services (frontend + backend) in orchestration:

```bash
docker-compose up --build
```

---

## 2. Manual Services Deployment

### Backend (FastAPI on Cloud Run / App Engine)
1. **Docker Container**:
   Build the backend container using `backend/Dockerfile`:
   ```bash
   docker build -t gcr.io/stadiumiq-2026/backend:latest ./backend
   ```
2. **Environment Variables**:
   Ensure the following production variables are set:
   - `GEMINI_API_KEY`: API access token.
   - `CORS_ORIGINS`: Allowed origins list (e.g. `https://stadiumiq.com`).
   - `GEMINI_CACHE_TTL`: Default cached output TTL (60s).
   - `GEMINI_MAX_RETRIES`: Retry limit for Gemini (default 2).

### Frontend (Next.js on Vercel / Cloud Run)
1. **Build Step**:
   ```bash
   npm run build
   ```
2. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Backend service URL.
   - Firebase client SDK configuration variables.
