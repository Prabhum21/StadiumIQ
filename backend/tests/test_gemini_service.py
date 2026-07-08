import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from services.gemini_service import GeminiService

@pytest.fixture
def gemini_service():
    with patch('services.gemini_service.genai.Client'):
        service = GeminiService()
        return service

@pytest.mark.asyncio
async def test_get_fan_assistant_response(gemini_service):
    with patch.object(gemini_service, '_generate_with_retry', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "Hello fan"
        response = await gemini_service.get_fan_assistant_response("Where is bathroom?", {"persona": "fan"})
        assert response == "Hello fan"
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_get_decision_recommendation(gemini_service):
    with patch.object(gemini_service, '_generate_with_retry', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"overall_status": "OK"}
        response = await gemini_service.get_decision_recommendation({"mode": "operations"})
        assert response == {"overall_status": "OK"}
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_get_sustainability_footprint(gemini_service):
    with patch.object(gemini_service, '_generate_with_retry', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"footprint_kg": 10.0}
        response = await gemini_service.get_sustainability_footprint("car", 15.0)
        assert response == {"footprint_kg": 10.0}
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_generate_pa_announcement(gemini_service):
    with patch.object(gemini_service, '_generate_with_retry', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"en": "Hello"}
        response = await gemini_service.generate_pa_announcement("Hello", ["en"])
        assert response == {"en": "Hello"}
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_generate_shift_briefing(gemini_service):
    with patch.object(gemini_service, '_generate_with_retry', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"duties": ["Guard"]}
        response = await gemini_service.generate_shift_briefing("Security", "Gate A")
        assert response == {"duties": ["Guard"]}
        mock_gen.assert_called_once()
