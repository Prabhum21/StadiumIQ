# Security and Trust Architecture

StadiumIQ maintains strict defensive measures at both infrastructure and code levels to protect operations data and AI engines.

## 1. Prompt Injection Defenses
A robust sanitization utility (`backend/utils/sanitize.py`) inspects all free-text fields. It applies regex-based analysis to neutralize override patterns:
- Checks for jailbreak phrases (e.g. `"ignore previous instructions"`, `"disregard all guidelines"`).
- Sanitizes system command overlays (e.g. `"you are now an admin"`).
- Replaces threat markers with `[filtered]` tags.

---

## 2. Telemetry and Payload Protections
- **Payload Limits**: `SecurityHeadersMiddleware` verifies request `content-length` headers. Any payload exceeding `1 MB` is rejected with `HTTP 413 Payload Too Large` to prevent denial-of-service attempts.
- **XSS and Script Filtering**: The Gemini Service recursively translates `<` and `>` tags to entity codes (`&lt;` and `&gt;`) inside all AI outputs prior to caching or sending responses.

---

## 3. HTTP Security Headers
The server injects strict security policy headers in all responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy: default-src 'self'`
- `Referrer-Policy: no-referrer`

---

## 4. Static Application Security Testing (SAST)
- **Bandit SAST**: The CI pipeline executes `bandit` code scans on every pull request to analyze Python vulnerabilities, catching hardcoded secrets, unsafe deserializers, or shell execution hazards.
- **Npm Audit**: Frontend package graphs are scanned for supply-chain risks.
