# Security Posture

## Purpose
To document the security layers protecting the application infrastructure, API endpoints, and Generative AI pipeline against external threats.

## Architecture
Security is implemented through environmental isolation, rate-limiting, and payload sanitization (Defense in Depth).

## Implementation
1. **Secrets Management**: API keys are never hardcoded. They are loaded via environment variables using `.env`.
2. **Rate Limiting**: `slowapi` or similar limiter is applied per-endpoint (e.g., `@limiter.limit("20/minute")`).
3. **Prompt Injection Protection**: The `sanitize_prompt` function neutralizes HTML tags. System prompts strictly instruct the LLM to ignore out-of-scope commands.

## Evidence
- Secrets template: `.env.example`
- Rate limiting annotations: `backend/api/routes.py`
- Prompt sanitization logic: `backend/services/gemini_service.py` (`sanitize_prompt` usage)

## Tradeoffs
The current prompt sanitization (`replace("<", "&lt;")`) is basic and protects against XSS, but does not utilize a sophisticated ML-based prompt-injection firewall, relying mostly on the foundational model's built-in safety filters.

## Future improvements
Integrate a dedicated semantic firewall (like Google Cloud Armor or an open-source prompt injection detector) before sending the payload to the LLM.
