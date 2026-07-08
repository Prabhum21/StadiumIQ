"""
Tests for additional endpoint logic and edge cases in StadiumIQ API routing.
"""

from unittest.mock import AsyncMock, patch
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_sustainability_endpoint_success():
    with patch(
        "api.routes.gemini_service.get_sustainability_footprint", new_callable=AsyncMock
    ) as mock_sus:
        mock_sus.return_value = {
            "footprint_kg": 12.5,
            "greenest_alternative": "Metro",
            "saving_vs_driving": "8.2 kg",
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post(
                "/api/sustainability", json={"travel_mode": "Metro", "distance": 15.0}
            )
        assert response.status_code == 200
        data = response.json()
        assert data["footprint_kg"] == 12.5
        assert data["greenest_alternative"] == "Metro"
        assert data["saving_vs_driving"] == "8.2 kg"


@pytest.mark.asyncio
async def test_announce_endpoint_success():
    with patch(
        "api.routes.gemini_service.generate_pa_announcement", new_callable=AsyncMock
    ) as mock_announce:
        mock_announce.return_value = {"en": "Attention please", "es": "Atención por favor"}
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post(
                "/api/announce", json={"message": "Attention please", "languages": ["en", "es"]}
            )
        assert response.status_code == 200
        assert response.json() == {"en": "Attention please", "es": "Atención por favor"}


@pytest.mark.asyncio
async def test_briefing_endpoint_success():
    with patch(
        "api.routes.gemini_service.generate_shift_briefing", new_callable=AsyncMock
    ) as mock_briefing:
        mock_briefing.return_value = {
            "duties": ["Check tickets", "Direct fans"],
            "escalation_path": "Supervisor channel 2",
            "welcome_phrase": "Welcome!",
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/briefing", json={"role": "usher", "location": "Gate A"})
        assert response.status_code == 200
        data = response.json()
        assert "usher" in data["welcome_phrase"] or "Welcome!" in data["welcome_phrase"]


@pytest.mark.asyncio
async def test_capabilities_endpoint_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/capabilities")
    assert response.status_code == 200
    data = response.json()
    assert "capabilities" in data
    assert len(data["capabilities"]) > 0


@pytest.mark.asyncio
async def test_multilingual_assist_endpoint_success():
    with patch(
        "api.routes.gemini_service.get_fan_assistant_response", new_callable=AsyncMock
    ) as mock_assist:
        mock_assist.return_value = "Hola amigo"
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post(
                "/api/multilingual-assist",
                json={
                    "query": "Hello friend",
                    "target_language": "es",
                    "context": "Greeting at the gate",
                },
            )
        assert response.status_code == 200
        assert response.json() == {"response": "Hola amigo", "language": "es"}
