import pytest
import asyncio
import json
from unittest.mock import patch, MagicMock, AsyncMock
from services.gemini_service import GeminiService

class MockResponse:
    def __init__(self, text):
        self.text = text

@pytest.fixture
def service():
    s = GeminiService()
    s.base_delay = 0.01  # speed up tests
    return s

@pytest.mark.asyncio
async def test_gemini_fallback(service):
    with patch.object(service, 'get_client') as mock_client:
        mock_client.return_value.aio.models.generate_content = AsyncMock(side_effect=Exception("API failure"))
        response = await service.get_decision_recommendation(context_data={"mode": "operations"})
        assert isinstance(response, dict)
        assert response.get("risk_score") == 100

@pytest.mark.asyncio
async def test_gemini_chat_fallback(service):
    with patch.object(service, 'get_client') as mock_client:
        mock_client.return_value.aio.models.generate_content = AsyncMock(side_effect=Exception("API failure"))
        response = await service.get_fan_assistant_response(query="Help", user_profile={})
        assert "connection issues" in response

@pytest.mark.asyncio
async def test_retry_logic_success_on_third_try(service):
    with patch.object(service, 'get_client') as mock_client:
        mock_generate = AsyncMock(side_effect=[
            Exception("Fail 1"),
            Exception("Fail 2"),
            MockResponse('{"status": "ok"}')
        ])
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        response = await service.get_decision_recommendation(context_data={"mode": "test"})
        assert response == {"status": "ok"}
        assert mock_generate.call_count == 3

@pytest.mark.asyncio
async def test_invalid_json(service):
    with patch.object(service, 'get_client') as mock_client:
        # First returns invalid json, then valid
        mock_generate = AsyncMock(side_effect=[
            MockResponse('Not JSON'),
            MockResponse('{"status": "fixed"}')
        ])
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        response = await service.get_decision_recommendation(context_data={"mode": "test"})
        assert response == {"status": "fixed"}

@pytest.mark.asyncio
async def test_malformed_json_not_dict(service):
    with patch.object(service, 'get_client') as mock_client:
        # First returns json list instead of dict, then valid
        mock_generate = AsyncMock(side_effect=[
            MockResponse('["not", "a", "dict"]'),
            MockResponse('{"status": "fixed"}')
        ])
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        response = await service.get_decision_recommendation(context_data={"mode": "test"})
        assert response == {"status": "fixed"}

@pytest.mark.asyncio
async def test_sanitization(service):
    with patch.object(service, 'get_client') as mock_client:
        mock_generate = AsyncMock(return_value=MockResponse('{"html": "<script>alert(1)</script>", "nested": {"tag": "<br>"}}'))
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        response = await service.get_decision_recommendation(context_data={"mode": "test"})
        assert response["html"] == "&lt;script&gt;alert(1)&lt;/script&gt;"
        assert response["nested"]["tag"] == "&lt;br&gt;"

@pytest.mark.asyncio
async def test_sanitization_non_json(service):
    with patch.object(service, 'get_client') as mock_client:
        mock_generate = AsyncMock(return_value=MockResponse('<script>alert(1)</script>'))
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        response = await service.get_fan_assistant_response(query="test", user_profile={})
        assert response == "&lt;script&gt;alert(1)&lt;/script&gt;"

@pytest.mark.asyncio
async def test_prompt_generation_all_modes(service):
    modes = ["operations", "emergency", "accessibility", "transport", "other"]
    
    with patch.object(service, 'get_client') as mock_client:
        mock_generate = AsyncMock(return_value=MockResponse('{"status": "ok"}'))
        mock_client.return_value.aio.models.generate_content = mock_generate
        
        for mode in modes:
            await service.get_decision_recommendation(context_data={"mode": mode})
            assert mock_generate.call_count >= 1
            mock_generate.reset_mock()
