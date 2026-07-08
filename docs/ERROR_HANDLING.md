# Centralized Error Handling Strategy

StadiumIQ utilizes a centralized, consistent exception hierarchy on the backend to guarantee API stability.

## Backend Exception Hierarchy

All custom backend exceptions inherit from `StadiumIQException` defined in [exceptions.py](file:///c:/Users/admin/Desktop/StadiumIQ%20AI/backend/utils/exceptions.py). This enforces standard error codes and HTTP statuses.

```
StadiumIQException (Base)
├── ValidationException          - HTTP 422: Input validation or payload errors
├── GeminiAPIException            - HTTP 502: AI service failure or response corruption
├── RateLimitExceededException   - HTTP 429: Traffic spikes beyond limits
├── UnauthorizedException        - HTTP 401: Invalid or missing token credentials
└── NotFoundException            - HTTP 404: Missing resources
```

## JSON Error Response Schema

All errors catchable by FastAPI are formatted into a single, predictable structure. Clients must expect:

```json
{
  "error_code": "AI_ENGINE_ERROR",
  "message": "AI generation request failed due to token limits."
}
```

## Centralized Exception Handlers

FastAPI middleware catches unhandled exceptions globally. This avoids scattering `try/except` blocks across routing logic:

1. **`stadium_iq_exception_handler`**: Catches `StadiumIQException` and maps correct HTTP status codes.
2. **`global_exception_handler`**: Catches all other standard Python exceptions, formats them as `INTERNAL_ERROR` (HTTP 500), and records traceback details using structured JSON logging.
