from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from api.routes import gemini_service
from main import app


@pytest.fixture
def mock_gemini():
    with (
        patch.object(
            gemini_service, "get_fan_assistant_response", new_callable=AsyncMock
        ) as mock_fan,
        patch.object(
            gemini_service, "get_decision_recommendation", new_callable=AsyncMock
        ) as mock_dec,
        patch.object(
            gemini_service, "get_sustainability_footprint", new_callable=AsyncMock
        ) as mock_sus,
        patch.object(
            gemini_service, "generate_pa_announcement", new_callable=AsyncMock
        ) as mock_ann,
        patch.object(gemini_service, "generate_shift_briefing", new_callable=AsyncMock) as mock_bri,
    ):
        yield {
            "fan": mock_fan,
            "decision": mock_dec,
            "sustainability": mock_sus,
            "announcement": mock_ann,
            "briefing": mock_bri,
        }


@pytest.mark.asyncio
async def test_chat_endpoint(mock_gemini):
    mock_gemini["fan"].return_value = "Hello"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/chat", json={"message": "Hi", "user_profile": {}})
    assert response.status_code == 200
    assert response.json() == {"response": "Hello"}


@pytest.mark.asyncio
async def test_decision_endpoint(mock_gemini):
    mock_gemini["decision"].return_value = {"status": "ok"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/decision", json={"context_data": {"mode": "operations"}})
    assert response.status_code == 200
    assert response.json() == {"recommendation": {"status": "ok"}}


@pytest.mark.asyncio
async def test_crowd_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/crowd")
    assert response.status_code == 200
    assert "zones" in response.json()


@pytest.mark.asyncio
async def test_sustainability_endpoint(mock_gemini):
    mock_gemini["sustainability"].return_value = {
        "footprint_kg": 5.0,
        "greenest_alternative": "walk",
        "saving_vs_driving": "2kg",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/sustainability", json={"travel_mode": "car", "distance": 10})
    assert response.status_code == 200
    assert response.json() == {
        "footprint_kg": 5.0,
        "greenest_alternative": "walk",
        "saving_vs_driving": "2kg",
    }


@pytest.mark.asyncio
async def test_announce_endpoint(mock_gemini):
    mock_gemini["announcement"].return_value = {"en": "Test"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/announce", json={"message": "Test", "languages": ["en"]})
    assert response.status_code == 200
    assert response.json() == {"en": "Test"}


@pytest.mark.asyncio
async def test_briefing_endpoint(mock_gemini):
    mock_gemini["briefing"].return_value = {
        "duties": [],
        "escalation_path": "call supervisor",
        "welcome_phrase": "hello",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/briefing", json={"role": "guard", "location": "gate a"})
    assert response.status_code == 200
    assert response.json() == {
        "duties": [],
        "escalation_path": "call supervisor",
        "welcome_phrase": "hello",
    }
