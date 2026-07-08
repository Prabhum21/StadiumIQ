# Security at StadiumIQ

Operating at the scale of the World Cup requires zero-trust principles, especially when exposing Generative AI to the public internet.

## 1. Prompt Injection Defense
Generative AI endpoints are highly susceptible to Prompt Injection (e.g., users attempting to bypass system instructions by commanding the AI to act differently).

We implemented a custom defensive layer at `backend/utils/sanitize.py`:
- **Control Character Stripping:** Removes null bytes, vertical tabs, and other non-printable characters often used to break parsers.
- **Regex Heuristics:** Matches common jailbreak patterns (e.g., `ignore previous instructions`, `you are now an admin`, `<system>`).
- **Whitespace Collapsing:** Prevents buffer padding attacks.
- **Hard Truncation:** Caps all user input at 500-1000 characters to prevent context-window exhaustion attacks.

## 2. API Rate Limiting
To prevent Denial of Service (DoS) attacks and avoid exhausting our Gemini API quota:
- We utilize `slowapi` to enforce strict rate limits across all routes.
- **Fan Chat:** 20 requests/minute.
- **Decision Engine (High Compute):** 10 requests/minute.
- **Crowd Metrics:** 30 requests/minute.

## 3. Strict CORS and Security Headers
The FastAPI backend employs strict security middleware to block malicious browser behaviors:
- `CORSMiddleware` strictly limits `allow_origins` to known frontend domains (e.g., `http://localhost:3000` or production Vercel URLs).
- `SecurityHeadersMiddleware` implements:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (Prevent clickjacking)
  - `Content-Security-Policy: default-src 'self'`
  - `Strict-Transport-Security` for forced HTTPS.
- Hard payload limits: Requests larger than 1MB are instantly rejected with `HTTP 413 Payload too large` to prevent memory exhaustion.

## 4. Environment Secrecy
API keys (`GEMINI_API_KEY`) and Firebase Admin credentials are never committed. They are injected at runtime via environment variables (`.env` locally, GitHub Secrets in CI, or Vercel/Render environment panels in production).
