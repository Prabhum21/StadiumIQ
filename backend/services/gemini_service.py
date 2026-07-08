"""
Gemini API service for StadiumIQ.
Handles generation, retries, caching, and prompt sanitization.
"""

import asyncio
import json
import logging
import os
import time
from typing import Any

from google import genai
from google.genai import types

from schemas.api_models import (
    AccessibilityResultSchema,
    BriefingResultSchema,
    DefaultResultSchema,
    EmergencyResultSchema,
    OperationsResultSchema,
    SustainabilityResultSchema,
    TransportResultSchema,
)
from services.gemini_prompts import (
    get_decision_prompt_and_fallback,
    get_fan_assistant_prompt_and_fallback,
    get_pa_announcement_prompt_and_fallback,
    get_shift_briefing_prompt_and_fallback,
    get_sustainability_prompt_and_fallback,
)
from utils.sanitize import sanitize_prompt

logger = logging.getLogger("gemini_service")


class GeminiService:
    """Service layer for interacting with Google Gemini API."""

    def __init__(self) -> None:
        """Initialize the GeminiService with default configs and empty cache."""
        self.model_name: str = "gemini-2.5-flash"
        self._client: genai.Client | None = None
        self.max_retries: int = int(os.getenv("GEMINI_MAX_RETRIES", "2"))
        self.base_delay: int = int(os.getenv("GEMINI_BASE_DELAY", "1"))
        self._cache: dict[str, dict[str, Any]] = {}
        self._cache_ttl: int = int(os.getenv("GEMINI_CACHE_TTL", "60"))

    def get_client(self) -> genai.Client:
        """Lazily initialize and return the Gemini client."""
        if not self._client:
            self._client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        return self._client

    def _sanitize(self, obj: Any) -> Any:
        """Recursively sanitizes dicts, lists, and strings to prevent XSS in responses."""
        if isinstance(obj, str):
            return obj.replace("<", "&lt;").replace(">", "&gt;")
        elif isinstance(obj, dict):
            return {k: self._sanitize(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._sanitize(item) for item in obj]
        return obj

    def _get_from_cache(self, cache_key: str) -> Any | None:
        """Fetch an item from the cache if it hasn't expired."""
        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if time.time() - entry["timestamp"] < self._cache_ttl:
                return entry["data"]
            else:
                del self._cache[cache_key]
        return None

    def _set_to_cache(self, cache_key: str, data: Any) -> None:
        """Store an item in the cache."""
        self._cache[cache_key] = {"timestamp": time.time(), "data": data}

    def _check_cache(self, cache_key: str) -> Any | None:
        cached_response = self._get_from_cache(cache_key)
        if cached_response is not None:
            return cached_response
        return None

    def _build_api_config(self, is_json: bool, response_schema: Any = None) -> dict[str, Any]:
        config_kwargs = {"temperature": 0.2} if is_json else {}
        if is_json:
            config_kwargs["response_mime_type"] = "application/json"
            if response_schema:
                config_kwargs["response_schema"] = response_schema
        return config_kwargs

    def _parse_api_response(self, response: Any, is_json: bool) -> Any:
        if is_json:
            data = json.loads(response.text)
            if not isinstance(data, dict):
                raise ValueError("AI Response is not a JSON object")
            result = self._sanitize(data)
        else:
            result = self._sanitize(response.text)
        return result

    async def _generate_with_retry(
        self, prompt: str, is_json: bool, fallback: Any, response_schema: Any = None
    ) -> Any:
        """
        Generate content using Gemini with exponential backoff retries and caching.

        Args:
            prompt: The string prompt.
            is_json: Whether the expected response is JSON.
            fallback: Data to return if all retries fail.
            response_schema: Optional Pydantic model or type to strictly enforce output schema.

        Returns:
            The generated data or the fallback.
        """
        import hashlib

        schema_key = str(response_schema) if response_schema else "none"
        cache_key = f"{is_json}_{schema_key}_{hashlib.sha256(prompt.encode()).hexdigest()}"

        cached_response = self._check_cache(cache_key)
        if cached_response is not None:
            return cached_response

        for attempt in range(self.max_retries + 1):
            try:
                client = self.get_client()
                config_kwargs = self._build_api_config(is_json, response_schema)

                response = await client.aio.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(**config_kwargs) if config_kwargs else None,
                )

                result = self._parse_api_response(response, is_json)

                self._set_to_cache(cache_key, result)
                return result

            except Exception as e:
                logger.error(
                    f"Gemini API Error (Attempt {attempt + 1}/{self.max_retries + 1}): {e}"
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(self.base_delay * (2**attempt))
                else:
                    logger.error("Max retries reached. Returning graceful fallback.")
                    return fallback

    async def get_decision_recommendation(self, context_data: dict[str, Any]) -> dict[str, Any]:
        """
        Uses Gemini to generate structured JSON recommendations based on context.
        """
        mode = context_data.get("mode", "navigation")
        context_str = json.dumps(context_data, indent=2)
        prompt, fallback = get_decision_prompt_and_fallback(mode, context_str)

        schemas = {
            "operations": OperationsResultSchema,
            "emergency": EmergencyResultSchema,
            "accessibility": AccessibilityResultSchema,
            "transport": TransportResultSchema,
        }
        schema = schemas.get(mode, DefaultResultSchema)

        return await self._generate_with_retry(
            prompt, is_json=True, fallback=fallback, response_schema=schema
        )

    async def get_fan_assistant_response(self, query: str, user_profile: dict[str, Any]) -> str:
        """
        Generate a conversational response for a fan query.
        """
        safe_query = sanitize_prompt(query)
        user_profile_str = json.dumps(user_profile)
        prompt, fallback_msg = get_fan_assistant_prompt_and_fallback(safe_query, user_profile_str)
        return await self._generate_with_retry(prompt, is_json=False, fallback=fallback_msg)

    async def get_sustainability_footprint(
        self, travel_mode: str, distance: float
    ) -> dict[str, Any]:
        """
        Calculate sustainability metrics.
        """
        prompt, fallback = get_sustainability_prompt_and_fallback(travel_mode, distance)
        return await self._generate_with_retry(
            prompt, is_json=True, fallback=fallback, response_schema=SustainabilityResultSchema
        )

    async def generate_pa_announcement(self, message: str, languages: list[str]) -> dict[str, str]:
        """
        Translate a PA announcement.
        """
        safe_msg = sanitize_prompt(message)
        prompt, fallback = get_pa_announcement_prompt_and_fallback(safe_msg, languages)
        return await self._generate_with_retry(
            prompt, is_json=True, fallback=fallback, response_schema=dict[str, str]
        )

    async def generate_shift_briefing(self, role: str, location: str) -> dict[str, Any]:
        """
        Generate shift briefing for volunteers.
        """
        prompt, fallback = get_shift_briefing_prompt_and_fallback(role, location)
        return await self._generate_with_retry(
            prompt, is_json=True, fallback=fallback, response_schema=BriefingResultSchema
        )
