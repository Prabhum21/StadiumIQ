# AI Pipeline

## Purpose
To outline the integration, configuration, and constraints of the Generative AI engine powering the Fan Assistant and Decision Engine.

## Architecture
The pipeline acts as a middleware between the user's raw input and the Google Gemini LLM, utilizing structured prompt templates and sanitization to ensure safe, contextual, and JSON-compliant outputs.

## Implementation
1. **Input Sanitization**: User inputs are stripped of malicious characters via `utils/sanitize.py`.
2. **Context Assembly**: `services/prompts.py` holds deterministic string templates (e.g., `DECISION_PROMPTS`).
3. **Execution & Retry**: The `GeminiService` class attempts generation up to `max_retries`. If all fail, a deterministic fallback JSON is returned.
4. **Caching**: A 60-second TTL cache prevents redundant LLM calls for identical prompts.

## Evidence
- Core Service: `backend/services/gemini_service.py`
- Fallback & Prompt Definitions: `backend/services/prompts.py`
- Sanitization: `backend/utils/sanitize.py` (referenced in `gemini_service.py`)

## Tradeoffs
The 60-second TTL cache in memory is extremely fast but volatile. In a multi-worker deployment, in-memory cache is not shared, potentially leading to redundant LLM calls across nodes.

## Future improvements
Migrate the in-memory dictionary cache in `GeminiService` to a centralized Redis instance to share cached LLM responses across all backend workers.
