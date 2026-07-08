# Application Programming Interface (API)

## Purpose
To provide a secure, rate-limited, asynchronous interface for the Next.js frontend to request GenAI calculations and retrieve static stadium metrics.

## Architecture
The API is built on FastAPI, utilizing Pydantic models for strict payload validation and a global rate limiter to prevent abuse.

## Implementation
- **`/chat`**: POST endpoint for Fan Assistant (Limit: 20/min).
- **`/decision`**: POST endpoint for Operations (Limit: 10/min).
- **`/crowd`**: GET endpoint returning structured JSON arrays for zone densities (Limit: 30/min).
- **`/sustainability`**: POST endpoint for carbon footprint calculations.
- **`/announce`**: POST endpoint for multi-language PA translations.
- **`/briefing`**: POST endpoint for volunteer shifts.

## Evidence
- Route definitions: `backend/api/routes.py`
- Payload schemas: `backend/schemas/api_models.py` (referenced in routes)
- Rate Limiting: `backend/api/limiter.py`

## Tradeoffs
Currently, endpoints are unprotected by authentication middleware. While rate limiting prevents mass abuse, lack of JWT/OAuth opens the LLM endpoints to unauthorized public access.

## Future improvements
Implement OAuth2 with JWT tokens in FastAPI and enforce token validation as a `Depends` block on all POST routes.
